<?
class Parser {


    static public function getContentByURL_old($params){
        $ans['success'] = false;
        $params = json_decode($params, true);
        $url = $params['url'];

        try {
            $cont = @file_get_contents($url);
            if(!$cont){
                throw new Exception("Error by getting content from URL");
            }
        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }
        
        if($cont){
            $ans['success'] = true;
            $ans['url'] = $url;
            $ans['content'] = $cont;
        }
        return $ans;
    }


    static public function getContentByURL($params){
        $ans['success'] = false;
        $params = json_decode($params, true);
        $url = $params['url'];

        return Network::getPageByUrl($url);
        /*
        if($response['success']){
            $ans['success'] = true;
            $ans['url'] = $url;
            $ans['content'] = $response['html'];
        }else{
            $ans['error'] = $response['curl_error'];
        }
        */
        //return $ans;
    }



    static public function getContentFromFile($params){
        $ans['success'] = false;
        $params = json_decode($params, true);
        $foldername = $params['foldername'];
        $filename = $params['filename'];

        $path_to_file = DATA_DIR."/".$foldername."/".$filename;
        return fs::getContentFromFile($path_to_file);
    }


    static public function saveContentToFile($params){
        try{
            $ans['success'] = false;
            $params = json_decode($params, true);
            $foldername = $params['foldername'];
            $filename = $params['filename'];
            if(!isset($params['content'])){
                throw new Exception('Content in undefined');
            }else{
                $content = $params['content'];
            }
            

            $path_to_folder = DATA_DIR."/".$foldername."/"; 
            
            if(!file_exists($path_to_folder)){
                mkdir($path_to_folder);
            }

            $path_to_file =  $path_to_folder.$filename;


            fs::saveContentToFile($path_to_file, $content);
            $ans = [
                'success' => true,
                'msg' => 'File was successfully saved',
            ];
        }catch(Exception $e){
            $error = $e->getFile()." : ".$e->getLine()." : ".$e->getMessage();
            $ans = [
                'error' => $error
            ];
        }
        
        /*
        if(file_put_contents($path_to_file, $content)){
			$ans['success'] = true;
			$ans['msg'] = 'File was successfully saved';
		}else{
			$ans['success'] = false;
			$ans['error'] = 'Error by saving the file';	
		}
        */
		return $ans;
    }



    static public function saveFileByURL($params){
        $ans['success'] = false;
        $params = json_decode($params, true);
        $foldername = $params['foldername'];
        $filename = $params['filename'];
        $url = $params['url'];
        $path_to_folder = DATA_DIR."/".$foldername."/";
        if(!file_exists($path_to_folder)){
            mkdir($path_to_folder);
        }
        $path_to_file =  $path_to_folder.$filename;

        try{
            $content = file_get_contents($url);
            if(!$content){
                throw new Exception("Can't get file by url : $url");
            }else{
                if(file_put_contents($path_to_file, $content)){
                    $ans['success'] = true;
                    //$ans['msg'] = 'File was successfully saved';
                }else{
                    throw new Exception("Error by saving the file");	
                }
            }
        }catch(Exception $e){
            $ans['success'] = false;
            $ans['error'] = $e->getMessage();
            errlog($ans['error']);
        }

        return $ans;
    }

    static public function getFoldersListInFolder(){
        $path_to_folder = DATA_DIR;
        return fs::getFolderListInFolder($path_to_folder);
    }

    static public function getFilesInFolder($params){
        $ans['success'] = false;
        $params = json_decode($params, true);
        $foldername = $params['foldername'];
        $options = isset($params['options']) ? $params['options'] : [];
        $path_to_folder = DATA_DIR."/".$foldername."/";
        //return fs::getFilesInFolder($path_to_folder, ['fileExtension' => 'txt']);
        return fs::getFilesInFolder($path_to_folder, $options);
    }

}

?>