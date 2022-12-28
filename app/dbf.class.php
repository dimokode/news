<?
class dbf {

/** USERS ************************************************************* */
public function login($params){
    $params = json_decode($params, true);
    //wrlog(print_r($params, true));
    $user_id = isset($params['username']) ? $params['username'] : '';
    $password = isset($params['password']) ? $params['password'] : '';
    $ans['success'] = false;

    if( $user_id != '' && $password != ''){
        $data = [
            ':user_id' => $user_id,
            ':password' => $password,
        ];
        $sql = 'SELECT * FROM users WHERE user_id=:user_id AND password=:password';
        $sth = DB::queryPDO($sql, $data);
        wrlog($sth);
        //$row = $sth->fetchAll(\PDO::FETCH_ASSOC);
        $arrResult = DB::fetchAll($sth);
        wrlog(print_r($arrResult, true));
        if(count($arrResult) == 1){
            $row = $arrResult[0];
            //wrlog(print_r($row, true));
            $ans['success'] = true;
            $ans['data'] = [];
            $ans['data']['user_id'] = $row['user_id'];
            $_SESSION['user_id'] = $row['user_id'];
            $ans['data']['userrole'] = $row['userrole'];
            $_SESSION['userrole'] = $row['userrole'];

            $path_to_file =  PATH_TO_DB.'/users/'.$user_id.'.php';
            $response = fs::getArrayFromFile($path_to_file);
            if($response['success']){
                if( is_array($response['array']) ){
                    $arrUserData = $response['array']['data'];
                    $customer_id = $arrUserData['customer_id'];
                }
            }

            $ans['data']['customer_id'] = isset($customer_id) ? $customer_id : '';
            $_SESSION['customer_id'] = $ans['data']['customer_id'];
            //$ans['data']['customer'] = '';
        }else{
            $ans['error'] = 'Username or password is wrong';
        }
        
        //print_r($row);
    }else{
        $ans['error'] = "Check username or/and password once more";
    }
    return $ans;

}


public function getUsers(){
    $sql = 'SELECT user_id FROM users';
    $sth = DB::query($sql);
    $rows = DB::fetchAll($sth);
    //$arrUsers = [];
    if($rows !== false){
        /*
        for($i=0; $i<sizeof($rows); $i++){
            //array_push($arrUsernames, $rows[$i]['username']);
            $arrUsers[$rows[$i]['user_id']] = $rows[$i]['user_id'];
        }
        */
        $ans['success'] = true;
        $ans['data'] = $rows;
    }else{
        $ans['success'] = false;
        $ans['error'] = 'errrr';
    }
    
    return $ans;
}

public function updateUser($params){
    $db = $GLOBALS['db'];
    $rule = 'updateUser';
    $arrFormData = $params['formData'];
    /** formData contains field values and data for validation */
    $formData = self::getOnlyValuesFromDataArray($arrFormData);
    $user_id = $formData['user_id'];
    
    if(!user::hasPermission('updateUser')){
        $ans['success'] = false;
        $ans['error'] = "No permission";
        return $ans;
    }

    $path = PATH_TO_CONFIG."/user-profile.php";
    $dbrules = fs::getArrayFromFile($path, "db")['array'];
    $dbdata = DB::prepareArray($dbrules[$rule]['data'], $formData);

    $sql = $dbrules[$rule]['sql'];
    wrlog($sql);
    wrlog(print_r($dbdata, true));
    $r = DB::queryPDO($sql, $dbdata);
    //wrlog(print_r($r, true));
    if($r){
        wrlog('Success!');
        $path_to_file = files::checkFileExistence(PATH_TO_DB."/".$db['user']."/".$user_id);
        wrlog($path_to_file);
        if($path_to_file !== false){
            $arrData = [
                //'status' => $arrStatus,
                'data' => $formData,
            ];
            $ans = files::writeArrayInFile($path_to_file, $arrData);
        }else{
            $ans['success'] = false;
            $ans['error'] = "Data file doesn't exist";
        }
    }else{
        $ans['success'] = false;
        $ans['error'] = "DB error";
    }

    return $ans;
}

public function addUser($params){
    $db = $GLOBALS['db'];
    $rule = 'addUser';
    $arrFormData = $params['formData'];
    /** formData contains field values and data for validation */
    $formData = self::getOnlyValuesFromDataArray($arrFormData);
    $user_id = $formData['user_id'];
    
    if(!user::hasPermission('addUser')){
        $ans['success'] = false;
        $ans['error'] = "No permission";
        return $ans;
    }

    if(user::userExists($user_id)){
        $ans['success'] = false;
        $ans['error'] = "User $user_id already exists in DB";
        return $ans;
    }

    $path = PATH_TO_CONFIG."/user-profile.php";
    $dbrules = fs::getArrayFromFile($path, "db")['array'];
    $dbdata = DB::prepareArray($dbrules[$rule]['data'], $formData);

    $sql = $dbrules[$rule]['sql'];
    $lastInsert = DB::insertPDO($sql, $dbdata);
    if($lastInsert){
        wrlog('Success!');
        $path_to_file = PATH_TO_DB."/".$db['user']."/".$user_id.".php";
        wrlog($path_to_file);

        $arrData = [
            //'status' => $arrStatus,
            'data' => $formData,
        ];
        $ans = files::writeArrayInFile($path_to_file, $arrData);

    }else{
        $ans['success'] = false;
        $ans['error'] = "DB error";
    }

    return $ans;
}

/** COMMON ************************************************************ */
public function saveForm($params){
    $params = json_decode($params, true);
    //arrLog($params);
    $type = $params['formAction']['type'];
    //$customerId = $params['formAction']['customerId'];
    $action = $params['formAction']['action'];
    //wrlog('type:'.$type);
    //wrlog('action:'.$action);
    //$formData = $params['formData'];
    //$arrStatus = $params['status'];
    $rule = $action.ucfirst($type);

    /*
    $permission = false;
    $rule = $action.ucfirst($type);
    if($_SESSION['userrole'] == 'admin'){
        $permission = true;
    }else{
        //wrlog('');
        //wrlog(print_r(fs::getArrayFromFile(PATH_TO_CONFIG.'/permissions.php', $_SESSION['userrole']), true));
        //$permission = fs::getArrayFromFile(PATH_TO_CONFIG.'/permissions.php', $_SESSION['userrole'])['array'][$rule];
        $permission = user::hasPermission($rule);
        //wrlog(print_r($permission));
    }


    //$permission = false;
    if($permission === true){
        $ans = self::$rule($params);
        //$ans['success'] = true;
        //$ans['rule'] = $rule;
        //$ans['permission'] = $permission;
    }else{
        $ans['success'] = false;
        $ans['error'] = "You don't have permission";
    }
    return $ans;
    */
    return self::$rule($params);
    //return false;
}


public function getDataSet($params){
    $ans['success'] = false;
    $params = json_decode($params, true);
    //arrLog($params);
    $dataType = $params['dataType'];
    $customer_id = $params['customer_id'];
    //$customerId = $params['formAction']['customerId'];
    $fieldSet = $params['fieldSet'];

    //$path = PATH_TO_DB."customers/".$customer_id;
    $path  = files::checkFileExistence(PATH_TO_DB."/customers/".$customer_id);
    if(!$path){
        $ans['error'] = "Data file doesn't exist";
        return $ans;
    }

    //$data = files::textArr(fs::getArrayFromFile($path, "data")['array']);
    $data = fs::getArrayFromFile($path, "data");
    if(!$data['success']){
        $ans['error'] = $data['error'];
        return $ans;
    }else{
        $data = files::textArr($data['array']);
    }


    $arr = [];
    foreach($fieldSet as $fieldName){
        $arr[$fieldName] = $data[$fieldName];
    }
    $ans['success'] = true;
    //$ans['customer_id'] = $customer_id;
    $ans['data'] = $arr;
       
    return $ans;
}

static public function getOnlyValuesFromDataArray($formData){
    $arrForm = [];
    foreach($formData as $elName => $elData){
        if(!isset($elData['index'])){
            $arrForm[$elName] = [];
            for($i=0; $i<sizeof($elData); $i++){

                $arrForm[$elName][$i] = self::getOnlyValuesFromDataArray($elData[$i]);
            }
        }else{
            $arrForm[$elName] = $elData['value'];
        }
    }
    return $arrForm;
}


}
?>