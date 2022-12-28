<?
class fs {
    static function getArrayFromFile($path_to_file, $key = ""){
        $ans['success'] = false;
    
        if(file_exists($path_to_file)){
            $arrTemp = include($path_to_file);
            if($arrTemp !== false ){
                if($key != ""){
                    $arr = isset($arrTemp[$key]) ? $arrTemp[$key] : false;
                }else{
                    $arr = $arrTemp;
                }
                $ans['success'] = true;
                $ans['array'] = $arr;
            }else{
                $ans['error'] = 'Error by getting content from data file';
            }
        }else{
            $ans['error'] = "Data file doesn't exist";
        }
        return $ans;
    }

    static function getFolderListInFolder($path_to_folder){
        $ans = [];
        $arrList = [];
        
        if(file_exists($path_to_folder)){
            //wrlog("Folder $path exists");
            if ($handle = opendir($path_to_folder)) {
                while (false !== ($file = readdir($handle))) { 
                    if ($file != "." && $file != ".." && !is_file($path_to_folder."/".$file)) {
                        $fileInfo = new SplFileInfo($path_to_folder."/".$file);
                        //arrlog($fileInfo, 'fileInfo.txt');
                        $arrFile = [
                            'foldername' => $file,
                            'timestamp' => $fileInfo->getCTime()
                        ];
                        //array_push($arrList, $file);
                        array_push($arrList, $arrFile);
                    }
                }
                closedir($handle);
            }
        
            $ans['success'] = true;
            $ans['arrList'] = $arrList;
        }else{
            $ans['success'] = false;
            $ans['error'] = "Folder $path_to_folder doesn't exist";
        }
        //arrlog($ans, 'fs.txt');
        return $ans;
    }

    static function getFilesInFolder($path_to_folder, $options = []){
            $ans = [];
            $arrFiles = [];
            $arrFile = [];
            if(file_exists($path_to_folder)){
                //wrlog("Folder $path exists");
                if ($handle = opendir($path_to_folder)) {
                    while (false !== ($file = readdir($handle))) { 
                        if ($file != "." && $file != ".." && is_file($path_to_folder."/".$file)) {
                            $fileInfo = new SplFileInfo($path_to_folder."/".$file);
                            $arrFile = [];
                            if(isset($options['fileExtension'])){
                                if($fileInfo->getExtension() == $options['fileExtension']){
                                    //array_push($arrFiles, $file);
                                    $arrFile['filename'] = $file;
                                    $arrFile['extension'] = $fileInfo->getExtension();
                                    $arrFile['timestamp'] = $fileInfo->getCTime();
                                    $arrFile['size'] = $fileInfo->getSize();
                                    array_push($arrFiles, $arrFile);
                                }
                            }else{
                                //array_push($arrFiles, $file);
                                $arrFile['filename'] = $file;
                                $arrFile['extension'] = $fileInfo->getExtension();
                                $arrFile['timestamp'] = $fileInfo->getCTime();
                                $arrFile['size'] = $fileInfo->getSize();
                                array_push($arrFiles, $arrFile);
                            }
                            //$arrFile['timestamp'] = $fileInfo->getMTime();
                            
                            //array_push($arrFiles, mb_convert_encoding($fileInfo->getBasename('.php'), 'ASCII'));//remove extension
                            
                        }
                    }
                    closedir($handle);
                }
            
                $ans['success'] = true;
                $ans['arrFiles'] = $arrFiles;
            }else{
                //wrlog("Folder $path doesn't  exist");
                $ans['success'] = false;
                $ans['error'] = "Folder $path_to_folder doesn't exist";
                //$ans['success'] = true;
                //$ans['files'] = $arrFiles;
            }
            //wrlog(print_r($arrFiles, true), 'files.txt');
      return $ans;
    }




    static function saveContentToFile($path_to_file, $content) : bool{

        try{
            return file_put_contents($path_to_file, $content);
            //return true;
        }catch(Exception $error){
            errlog($error->getMessage());
            throw $error;
        }

    }


    static function getContentFromFile($path_to_file){
        $ans['success'] = false;
        if(!file_exists($path_to_file)){
            $ans['error'] = "File $path_to_file doesn't exist";
            return $ans;
        }
        $content = file_get_contents($path_to_file);
		if($content){
			$ans['success'] = true;
			$ans['content'] = $content;
		}else{
			
			$ans['error'] = "Error by reading the file $path_to_file";
		}
		return $ans;
    }



    
    static function createFolder($path_to_folder){
        try{
            $result = mkdir($path_to_folder);
            if($result){
                $ans['success'] = true;
            }
        }catch(Exception $e){
            $ans['success'] = false;
            $ans['error'] = $e->getMessage();
        }
        return $ans;
    }

    static public function getContentByURL($url){
		
		try {
			$cont = @file_get_contents($url);
			if($cont === false){
				throw new Exception("Error by getting content from URL");
			}else{
				$ans['success'] = true;
				$ans['url'] = $url;
				$ans['content'] = $cont;
			}
		}catch(Exception $e){
			$ans['success'] = false;
			$ans['error'] = $e->getMessage();
		}
		//arrlog($ans, 'ans.txt');
		return $ans;
	}

    /**
     * Handle component attribute changed event
     *
     * @param url {String} - the name of the element attribute that changed
     * @param path_to_folder {String} - the previous value of the attribute
     * @param filename {String} - thenew value of the attribute
    */
    static public function saveImageFromURL($url, $path_to_folder, $filename){
        $ans['success'] = false;

        if(!file_exists($path_to_folder)){
            mkdir($path_to_folder);
        }

        try{
            $content = @file_get_contents($url);
            if($content === false){
                $error = error_get_last();
                throw new Exception("Error by getting content from URL : ".$error['message']);
            }
        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
            return $ans;
        }


        $path_to_file =  $path_to_folder."/".$filename;
        if(file_put_contents($path_to_file, $content)){
			$ans['success'] = true;
			$ans['msg'] = 'File was successfully saved';
		}else{
			//$ans['success'] = false;
			$ans['error'] = 'Error by saving the file';	
		}
		return $ans;
    }

    static public function deleteFile($path_to_file){
        $ans['success'] = false;
        try{
            if(unlink($path_to_file)){
                $ans['success'] = true;
            }
        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }
        return $ans;
    }

}


?>