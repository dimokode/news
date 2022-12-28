<?

class DB2{

	function u_strtolower($string){
		return mb_strtolower($string, 'UTF-8');
	}

    function __construct($path_to_db){
        try{
			$this->pdo = new \PDO("sqlite:" . $path_to_db);
			$this->pdo->sqliteCreateFunction('u_lower', 'u_strtolower', 1);//register function for case insensitive search
			$this->pdo->exec('PRAGMA journal_mode = wal;');
            return $this;
		}catch(\PDOException $e){
            throw $e;
		}
    }


    function query($sql) {
		try{
			$sth = $this->pdo->query($sql);
			if(!$sth){
				throw new Exception($this->pdo->errorInfo()[2]);
			}
		}catch(Exception $e){
            throw $e;
		}

		return $sth;
	}


    function fetchAll($sth){
		return $sth->fetchAll(\PDO::FETCH_ASSOC);
	}

    public function fetchFirst($sth){
		return $sth->fetchAll(\PDO::FETCH_ASSOC)[0];
	}


    function insertData($sql, $data){
		try{

            $sth = $this->pdo->prepare($sql);
			if(!$sth){
				//errlog($obj->pdo->errorInfo());
				//errlog($$obj->pdo->errorInfo());
				throw new Exception($this->pdo->errorInfo()[2]);
			}

			$r = $sth->execute($data);
            //wrlog($r);
			if(!$r){
				//errlog($sth->errorInfo());
				throw new Exception($sth->errorInfo()[2]);
			}
			
			return $this->pdo->lastInsertId();

		}catch(Exception $e){
			errlog($e->getMessage());
			throw $e;
		}	
    }

}

?>