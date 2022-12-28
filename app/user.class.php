<?
class user {

    function login($params){
        $params = json_decode($params, true);
		$username = $params['username'];
        $password = $params['password'];
        
        $path_to_file =  PATH_TO_DB.'/users/'.$username.'.php';
        $response = fs::getArrayFromFile($path_to_file);
        $ans['success'] = false;
        if($response['success']){
            if( is_array($response['array']) ){
                $arrUserData = $response['array']['data'];
                if($arrUserData['username'] == $username && $arrUserData['password'] == $password){
                    foreach($arrUserData as $cookieName => $cookieValue){
                        $_SESSION[$cookieName] = $cookieValue;
                    }
                    $ans['success'] = true;
                    $ans['data'] = [];
                    $ans['data']['user_id'] = $arrUserData['user_id'];
                    $ans['data']['userrole'] = $arrUserData['userrole'];
                    $ans['data']['customer_id'] = $arrUserData['customer_id'];
                    $ans['data']['userrole'] = $arrUserData['userrole'];
                }else{
                    $ans['error'] = "Login or password are wrong";
                }
            }else{
                $ans['error'] = "DB is corrupted";
            }
        }else{
            $ans['error'] = $response['error'];
        }
        //wrlog();
        //wrlog(print_r($userData, true));
        return $ans;
    }

    static function hasPermission($rule){
        //wrlog($rule);
        if($_SESSION['userrole'] == 'admin'){
            return true;
        }else{
            //wrlog(print_r(fs::getArrayFromFile(PATH_TO_CONFIG.'/permissions.php', $_SESSION['userrole']), true));
            $result = fs::getArrayFromFile(PATH_TO_CONFIG.'/permissions.php', $_SESSION['userrole']);
            //wrlog(print_r($result, true));
            if(!$result){
               // wrlog('false');
                return false;
            }
            //if(isset($permission['array'][$rule])){
            //    return
            //}
            return isset($result['array'][$rule]) ? $result['array'][$rule] : false;
            //return fs::getArrayFromFile(PATH_TO_CONFIG.'/permissions.php', $_SESSION['userrole'])['array'][$rule];
            /*
            if(fs::getArrayFromFile(PATH_TO_CONFIG.'/permissions.php', $_SESSION['userrole'])['array'][$rule]){
                return true;
            }else{
                return isset(fs::getArrayFromFile(PATH_TO_CONFIG.'/permissions.php', $_SESSION['userrole'])['array']['permission'][$rule]) ? fs::getArrayFromFile(PATH_TO_CONFIG.'/permissions.php', $_SESSION['userrole'])['array'][$rule] : "No permission";
            }
            */
            //return true;
        }
    }


    function getMessage($msgType, $msgId){
        if(isset($msgType) && isset($msgId)){
            $result = fs::getArrayFromFile(PATH_TO_CONFIG.'/messages.php', $msgType);
            if($result['success']){
                return $result['array'][$msgId];
            }else{
                return false;
            }
        }
        
    }

    static function userExists($userId){
        $sql = "SELECT * FROM users WHERE user_id='$userId'";
        $sth = DB::query($sql);
        $r = DB::fetch($sth);
        return $r;
        
    }

    static public function getUserById($params){
        $params = json_decode($params, true);
        $user_id = $params['user_id'];

        $args = [
            'type' => 'user',
            'action' => 'update',
            //'customer' => $r[0]['customer_id'],
            'dataFile' => [
                "user" => "users/".$user_id,
            ],
            'configFile' => 'user-profile.php'
        ];

        $args = json_encode($args, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        //$ans = Files::loadDataFile3($args);
        $ans = Files::loadDataFile($args);

        //$ans['success'] = true;
        //$ans['msg'] = 'Claim Id = ' . $claim_id;
        return $ans;
    }

    static public function addNewUser(){
        //$params = json_decode($params, true);

        $args = [
            'type' => 'user',
            'action' => 'add',
            //'customer' => $r[0]['customer_id'],
            /*
            'dataFile' => [
                "user" => "users/".$user_id,
            ],
            */
            'configFile' => 'user-profile.php'
        ];

        $args = json_encode($args, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        //$ans = Files::loadDataFile3($args);
        $ans = Files::loadDataFile($args);

        //$ans['success'] = true;
        //$ans['msg'] = 'Claim Id = ' . $claim_id;
        return $ans;
    }

}

?>