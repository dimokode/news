<?

class Testlab {

    public function getContentFileList(){
        return fs::getFilesInFolder(TESTLAB_DIR);
    }



    public function saveConfigFile($params){

        try{
            $params = json_decode($params, true);
            $filename = $params['filename'];
            $data = (string) $params['data'];
    
            //$path_to_task_file = PATH_TO_CONFIG."/tasks.txt";
            $path_to_file = TESTLAB_DIR."/".$filename;
            $ans['success'] = fs::saveContentToFile($path_to_file, $data);
            //$ans['content'] = $path_to_task_file;
            
        }catch(Exception $e){
            $ans['success'] = false;
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }


    static public function getContentFromFile($params){
        $params = json_decode($params, true);
        $filename = $params['filename'];

        $path_to_file = TESTLAB_DIR."/".$filename;
        return fs::getContentFromFile($path_to_file);
    }

}

?>