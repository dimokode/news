<?

class Logs{
    public function getLogsFileList(){
        return fs::getFilesInFolder(LOGS_DIR, ['fileExtension' => 'log']);
    }

    static public function saveLog($params){
        $params = json_decode($params, true);
        $filename = $params['filename'];
        $content = $params['data'];
        $path_to_file = LOGS_DIR."/".$filename;
        return fs::saveContentToFile($path_to_file, $content);
    }

    public function getLog($params){
        $params = json_decode($params, true);
        $filename = $params['filename'];
        $path_to_file = LOGS_DIR."/$filename";
        return fs::getContentFromFile($path_to_file); 
    }

    public function deleteLog($params){
        $params = json_decode($params, true);
        $filename = $params['filename'];
        $path_to_file = LOGS_DIR."/$filename";
        return fs::deleteFile($path_to_file);
    }
}

?>