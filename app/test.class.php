<?

class test{

    static public function getForm(){


        $config_file = PATH_TO_CONFIG."/"."test-main.php";
        $arrConfig = self::parseConfigFile($config_file);


        if($arrConfig){
            $ans['success'] = true;
            $ans['data'] = $arrConfig;
        }else{
            $ans['success'] = false;
            $ans['error'] = 'Error by reading the file';
        }

        
        //$ans['msg'] = 'Hello from BE!';
        return $ans;
    }


    public function parseConfigFile($filename){

        $arr = include_once($filename);
/*
        foreach($arr as $fieldName=>$fieldData){
            if($fieldData['element'] == 'fieldset'){

            }
        }
*/


        if($arr){
            $arr = self::importData($arr);
            return $arr;
        }else{
            return false;
        }
    } 


    static public function importData($arrData){
        wrlog('cls');
        wrlog('importData');
        wrlog(print_r($arrData, true));
        $flag = false;
        foreach($arrData as $sectionName => $arrSection){//

            foreach($arrData as $fieldName => $arrFieldProps){
                if(isset($arrFieldProps['element']) && $arrFieldProps['element'] == 'fieldset'){
                    $flag = true;
                    $tpl_filepath = self::checkFileExistence(PATH_TO_CONFIG."/".$arrFieldProps['import']);
                    if($tpl_filepath !== false){
                        $tempArray = fs::getArrayFromFile($tpl_filepath)['array'];
                        //wrlog(print_r($tempArray, true));
                        if(isset($tempArray['data'])){
                            $tempArray = $tempArray['data'];
                        }
                        $newArray = [];
                        if(isset($arrFieldProps['prefix'])){
                            $keyPrefix = $arrFieldProps['prefix'];
                            foreach($tempArray as $key=>$value){
                                $newArray[$keyPrefix.$key] = $value;
                                $newArray[$keyPrefix.$key]['attributes']['id'] = $keyPrefix.$newArray[$keyPrefix.$key]['attributes']['id'];
                                $newArray[$keyPrefix.$key]['attributes']['name'] = $keyPrefix.$newArray[$keyPrefix.$key]['attributes']['name'];
                            }
                            //$arrTemplates[$fieldName] = $newArray;
                            $arrData[$fieldName] = $newArray;
                        }else{
                            //$arrTemplates[$fieldName] = $tempArray;
                            $arrData[$fieldName] = $tempArray;
                        }
                        unset($arrData[$sectionName][$fieldName]);
                        //$arrData[$fieldName]['select'] = true;
                        //unset($arrData[$sectionName][$fieldName]);
                    }
                }
            }
        }//
        if($flag){
            $arrData = self::importData($arrData);
        }
        return $arrData;
    }


    static public function checkFileExistence($filepath){
        if(file_exists($filepath)){
            return $filepath;
        }elseif(file_exists($filepath.".php")){
          wrlog($filepath);
            return $filepath.".php";
        }else{
            return false;
        }
  }

    static public function testSocket(){
        /*
        $xportlist = stream_get_transports();
        return $xportlist;
        */
        /*
        file_get_contents('http://irkutskles.ru');
        return $http_response_header;
        */
        /*
        try{
            $r = file_get_contents("http://irkutskles.ru");
            if($r !== false){
                return $r;
            }
        }catch(Exception $e){
            return $e-getMessage();
        }
        */
        if (false === ($data = @file_get_contents("http://irkutskles22.ru"))) {
            //можно бросить exception и тд
            $error = error_get_last();
            //arrlog($error, 'errorrr.txt');
            return $error;
      } else {
            return $data;
      }
        
    }


}

?>