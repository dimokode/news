<?
class News{


    public function getNews($params){
        $ans['success'] = false;
        try{
            $params = json_decode($params, true);
            $searchParams = $params['searchParams'];
            //$s_start = (isset($searchParams['s_start'])) ? $searchParams['s_start'] : 0;
            $s_page = (isset($searchParams['s_page'])) ? $searchParams['s_page'] : 1;
            $s_limit = (isset($searchParams['s_limit'])) ? $searchParams['s_limit'] : 50;
            $s_keywords = (isset($searchParams['s_keywords'])) ? $searchParams['s_keywords'] : '';
            $s_source = (isset($searchParams['s_source'])) ? $searchParams['s_source'] : '';
            $s_date_start = (isset($searchParams['s_date_start'])) ? $searchParams['s_date_start'] : '';
            $s_date_end = (isset($searchParams['s_date_end'])) ? $searchParams['s_date_end'] : '';
            $s_fields = (isset($searchParams['s_fields'])) ? $searchParams['s_fields'] : '*';

            $s_start = ($s_page-1)*$s_limit;
            
            //arrLog($searchParams, 'models.txt');
            $sql_where = "";
            $arrSqlWhere = [];
            if($s_keywords != ''){
                //$sql_where = "WHERE title LIKE '%".$s_keywords."%' OR short_text LIKE '%".$s_keywords."%'";
                array_push($arrSqlWhere, '(u_lower(title) LIKE "%'.mb_strtolower($s_keywords).'%" OR u_lower(short_text) LIKE "%'.mb_strtolower($s_keywords).'%")');
            }

            if($s_source != ''){
                //$sql_where = "WHERE title LIKE '%".$s_keywords."%' OR short_text LIKE '%".$s_keywords."%'";
                array_push($arrSqlWhere, '(u_lower(source) LIKE "%'.mb_strtolower($s_source).'%")');
            }

            if($s_date_start != ""){
                array_push($arrSqlWhere, '(date>="'.$s_date_start.'")');
            }

            if($s_date_end != ""){
                array_push($arrSqlWhere, '(date<="'.$s_date_end.'")');
            }

            if(sizeof($arrSqlWhere)>0){
                $sql_where = "WHERE ".implode(" AND ", $arrSqlWhere);
            }
            
            #this query has been used for two models bert and tf_idf
            //$sql = "SELECT n.*, t.negative AS t_negative, t.neutral AS t_neutral, t.positive AS t_positive, b.* FROM news AS n INNER JOIN tf_idf AS t ON n.url=t.url INNER JOIN bert AS b ON n.url=b.url $sql_where ORDER BY date DESC LIMIT $s_start, $s_limit";
            # !WARNING this query returns only news with sentiment
            //$sql = "SELECT $s_fields FROM news AS n INNER JOIN tf_idf AS t ON n.url=t.url $sql_where ORDER BY date DESC LIMIT $s_start, $s_limit";
            $sql = "SELECT $s_fields FROM news $sql_where ORDER BY date DESC LIMIT $s_start, $s_limit";
            //wrlog($sql);
            $sth = DB::query($sql);
            $news = DB::fetchAll($sth);
            
            $ans['success'] = true;
            $ans['s_limit'] = $s_limit;
            //$ans['count'] = self::getCount("SELECT COUNT(*) as count FROM news AS n INNER JOIN tf_idf AS t ON n.url=t.url $sql_where");
            $ans['count'] = self::getCount("SELECT COUNT(*) as count FROM news $sql_where");
            $ans['news'] = $news;

        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }




	private function getCount($sql){
		$r = DB::query($sql);
		return DB::fetch($r)['count'];
	}


    static public function insertSingleNewsInDB($params){

        try{
            $params = json_decode($params, true);
            $data = $params['data'];
            $ans['success'] = false;
    
            $sql_into = '';
            $sql_values = '';
            $sql_arr = [];
    
            foreach($data as $key=>$value){
                $sql_into.="$key,";
                $sql_values.=":$key,";
                //$sql_values.="'$key',";
                $sql_arr[':'.$key] = $value;
            }
            $sql_into = substr($sql_into, 0, -1);
            $sql_values = substr($sql_values, 0, -1);
    
            //$sql = "INSERT INTO models(chathost, timestamp) VALUES(:chathost, :timestamp)";
            $sql = "INSERT OR IGNORE INTO news($sql_into) VALUES($sql_values)";
            $lastInsertedId = DB::insertPDO($sql, $sql_arr);
    
            $ans['sql'] = $sql;
            if($lastInsertedId){
                $ans['success'] = true;
                $ans['lastInsertedId'] = $lastInsertedId;
                
            }else{
                $ans['error'] = "DB error by insterting news in DB";
            }
            
        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }
        //wrlog($ans);
        return $ans;
    }

    
    public function deleteSingleNewsById($params){

        try{
            $params = json_decode($params, true);
            $id = $params['id'];
            $ans['success'] = false;

            $sql = "DELETE FROM news WHERE url='".$id."'";
            $r = DB::exec($sql);
            //if($r){
                $ans['success'] = true;
                $ans['id'] = $id;
                $ans['affected_rows'] = $r;
            //}

        }catch(Exception $e){
            $ans['success'] = false;
            //$ans['error'] = "Error by deleting news form DB";
            $ans['error'] = $e->getMessage();
        }

        return $ans;

    }

/* 

 */
    
}



?>