<?
class Utils{
    static public function getDBs(){
        return fs::getFilesInFolder(PATH_TO_DB, ['fileExtension' => 'sqlite']);
    }


    static public function getTablesFromDb($params){
        $params = json_decode($params, true);
        $filename = $params['filename'];

        $db = new DB2(PATH_TO_DB."/".$filename);
        $sth = $db->query("SELECT * FROM sqlite_master where type='table'");
        $tables = $db->fetchAll($sth);
        return $tables;
    }



    static public function mergeDBs_temp($params){
        header("Content-Type: text/event-stream");
        set_time_limit(0);
        $params = json_decode($params, true);
        $data = $params['data'];
        $db_source_filename = $data['db_source'];
        $db_target_filename = $data['db_target'];
        $tables = $data['tables'];

        $db_source = new db2(PATH_TO_DB."/".$db_source_filename);
        $db_target = new db2(PATH_TO_DB."/".$db_target_filename);

        $results = [];

        foreach($tables as $table){
            /*
            $sql = "SELECT count(*) as c FROM '$table'";
            //wrlog($sql);
            
            $sth_s = $db_source->query($sql);
            $c_s = $db_source->fetchFirst($sth_s);
            wrlog($c_s['c']);

            $sth_t = $db_target->query($sql);
            $c_t = $db_target->fetchFirst($sth_t);
            wrlog($c_t['c']);
            */
            $sql = "SELECT * FROM '$table' LIMIT 0,10";
            $sth_s = $db_source->query($sql);
            $rows = $db_source->fetchAll($sth_s);
            //wrlog($rows);
            $sql_insert = self::prepareSQL($table, $rows[0]);
            wrlog($sql_insert);
            foreach($rows as $row){
                $data = [];
                foreach($row as $key => $value){
                    $data[':'.$key] = $value;
                }
                //wrlog($data);
                array_push($results, $db_target->insertData($sql_insert, $data));
            }
            //wrlog($sth_insert);
        }

        return [
            $db_source,
            $db_target,
            $tables,
            $results
        ];
    }



    static public function mergeDBs($params){

        try{
            //header("Content-Type: text/event-stream");
            //set_time_limit(0);
            $params = json_decode($params, true);
            $dbData = $params['dbData'];
            $db_source_filename = $dbData['db_source'];
            $db_target_filename = $dbData['db_target'];
            $tableName = $params['tableName'];
            $itemsPosition = $params['itemsPosition'];
            $step = $params['step'];

            $db_source = new db2(PATH_TO_DB."/".$db_source_filename);
            $db_target = new db2(PATH_TO_DB."/".$db_target_filename);



            $results = [];
            $added = 0;
            $rejected = 0;

            $sql = "SELECT * FROM '$tableName' LIMIT $itemsPosition,$step";
            $sth_s = $db_source->query($sql);
            $rows = $db_source->fetchAll($sth_s);
            //wrlog($rows);
            $sql_insert = self::prepareSQL($tableName, $rows[0]);
            //wrlog($sql_insert);
            foreach($rows as $row){
                $data = [];
                foreach($row as $key => $value){
                    $data[':'.$key] = $value;
                }
                //wrlog($data);
                //array_push($results, $db_target->insertData($sql_insert, $data));
                if($db_target->insertData($sql_insert, $data) == 0){
                    $rejected++;
                }else{
                    $added++;
                }
            }


            return [
                "success" => true,
                "results" => [
                    'added' => $added,
                    'rejected' => $rejected
                ]
            ];
        }catch(Exception $e){
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }


    }


    function getCountEntries($params){
        $params = json_decode($params, true);
        $dbName = $params['dbName'];
        $tableName = $params['tableName'];

        $db = new db2(PATH_TO_DB."/".$dbName);
        $sql = "SELECT count(*) as c FROM '$tableName'";
        //wrlog($sql);
        
        $sth = $db->query($sql);
        $result = $db->fetchFirst($sth);
        return $result['c'];
    }


    static function prepareSQL($table, $row){
        //wrlog($data);
        //$row = $data[0];
        //INSERT OR IGNORE INTO news() VALUES('')
        $sql_into = "";
        $sql_values = "";
        //$sql_arr = [];
        foreach($row as $key => $value){
            $sql_into.="$key,";
            $sql_values.=":$key,";
            //$sql_arr[':'.$key] = $value;
        }
        $sql_into = substr($sql_into, 0, -1);
        $sql_values = substr($sql_values, 0, -1);
        $sql = "INSERT OR IGNORE INTO $table($sql_into) VALUES($sql_values)";
        //$sth = DB::prepareSQL($sql);
        return $sql;
    }



}

?>