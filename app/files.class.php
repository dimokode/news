<?

class files{

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
		
		return $ans;
	}


}

?>