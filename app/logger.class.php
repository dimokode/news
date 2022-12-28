<?
class Logger{

    static public function saveContentToFile($params){
        $params = json_decode($params, true);
        $taskId = $params['taskId'];
        $subTaskId = $params['subTaskId'];
        $content = $params['content'];

        $path_to_folder = LOGS_DIR."/".$taskId."/"; 
        if(!file_exists($path_to_folder)){
            mkdir($path_to_folder);
        }
        $path_to_file =  $path_to_folder.$subTaskId.".txt";
        return fs::saveContentToFile($path_to_file, $content);
    }


}

?>