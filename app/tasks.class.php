<?

class Tasks {

/*

    public function saveTask($params){
        $params = json_decode($params, true);
        $taskId = $params['taskId'];
        $content = $params['content'];

        //$path_to_task_file = PATH_TO_CONFIG."/tasks.txt";
        $path_to_task_file = TASKS_DIR."/$taskId";
        $ans = fs::saveContentToFile($path_to_task_file, $content);
        //$ans['content'] = $path_to_task_file;
        return $ans;
    }
*/


    public function saveTaskConfigToFile($params){
        try{
            $params = json_decode($params, true);
            $filename = $params['filename'];
            $data = $params['data'];
    
            //$path_to_task_file = PATH_TO_CONFIG."/tasks.txt";
            $path_to_task_file = TASKS_DIR."/$filename";
            return [
                'success' => fs::saveContentToFile($path_to_task_file, $data)
            ];

        }catch(Exception $e){
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }

    }



    public function getTaskByFilename($params){
        $params = json_decode($params, true);
        $filename = $params['filename'];
        

        $path_to_task_file = TASKS_DIR."/$filename";
        $ans = fs::getContentFromFile($path_to_task_file);
        //$ans['content'] = $path_to_task_file;
        return $ans;
    }




    public function getTaskFileList(){
        return fs::getFilesInFolder(TASKS_DIR, ['fileExtension' => 'json']);
    }

    public function initJob($params){
        $params = json_decode($params, true);
        $jobId = $params['jobId'];
        $path_to_job_folder = LOGS_DIR."/$jobId";
        return fs::createFolder($path_to_job_folder);  
    }


    public function saveJobResults($params){
        $params = json_decode($params, true);
        $jobId = $params['jobId'];
        $jobResult = $params['jobResult'];

        if(!file_exists(LOGS_DIR."/$jobId")){
            if(!fs::createFolder(LOGS_DIR."/$jobId")['success']){
                $ans['success'] = false;
                $ans['error'] = "Can't create folder ".LOGS_DIR."/$jobId";
                return $ans;
            }
        }

        $path_to_file = LOGS_DIR."/$jobId/$jobId.log";
        return fs::saveContentToFile($path_to_file, $jobResult);
    }


    public function saveTaskResults($params){
        $params = json_decode($params, true);
        $jobId = $params['jobId'];
        $taskId = $params['taskId'];
        $taskResult = $params['taskResult'];

        if(!file_exists(LOGS_DIR."/$jobId")){
            if(!fs::createFolder(LOGS_DIR."/$jobId")['success']){
                $ans['success'] = false;
                $ans['error'] = "Can't create folder ".LOGS_DIR."/$jobId";
                return $ans;
            }
        }

        $path_to_task_file = LOGS_DIR."/$jobId/$taskId.log";
        return fs::saveContentToFile($path_to_task_file, $taskResult);
    }




    public function saveJobResultsObject($params){
        $params = json_decode($params, true);
        $jobId = $params['jobId'];
        $content = $params['serializedObject'];
        $path_to_file = LOGS_DIR."/$jobId/objResults.txt";

        if(!file_exists(LOGS_DIR."/$jobId")){
            if(!fs::createFolder(LOGS_DIR."/$jobId")['success']){
                $ans['success'] = false;
                $ans['error'] = "Can't create folder ".LOGS_DIR."/$jobId";
                return $ans;
            }
        }


        return fs::saveContentToFile($path_to_file, $content);
    }


    public function getLogs(){
        return fs::getFolderListInFolder(LOGS_DIR."/");
    }



    public function loadJobResultsObject($params){
        $params = json_decode($params, true);
        $jobId = $params['jobId'];
        $path_to_file = LOGS_DIR."/$jobId/objResults.txt";
        return fs::getContentFromFile($path_to_file);
    }



    public function loadJobLog($params){
        $params = json_decode($params, true);
        $jobId = $params['jobId'];

        $path_to_file = LOGS_DIR."/$jobId/$jobId.log";
        return fs::getContentFromFile($path_to_file);
    }


    public function loadTaskFile($params){
        $params = json_decode($params, true);
        $jobId = $params['jobId'];
        $taskId = $params['taskId'];
        $type = $params['type'];

        $path_to_file = LOGS_DIR."/$jobId/${taskId}.$type";
        return fs::getContentFromFile($path_to_file);
    }

    public function loadTaskLog($params){
        $params = json_decode($params, true);
        $jobId = $params['jobId'];
        $taskId = $params['taskId'];

        $path_to_file = LOGS_DIR."/$jobId/${taskId}.log";
        return fs::getContentFromFile($path_to_file);
    }

    public function saveContentToFile($params){
        $params = json_decode($params, true);
        $foldername = $params['foldername'];
        $filename = $params['filename'];
        $content = $params['content'];

        if(!file_exists(LOGS_DIR."/$foldername")){
            if(!fs::createFolder(LOGS_DIR."/$foldername")['success']){
                $ans['success'] = false;
                $ans['error'] = "Can't create folder ".LOGS_DIR."/$foldername";
                return $ans;
            }
        }

        $path_to_file = LOGS_DIR."/$foldername/$filename";
        return fs::saveContentToFile($path_to_file, $content);
    }

    public function getJobResults($params){
        $params = json_decode($params, true);
        $jobId = $params['jobId'];
    }

}
?>