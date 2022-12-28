<?

class tpl{
	public function loadTemplateByName($params){
  		$params = json_decode($params, true);
  		//wrlog(print_r($params, true));
  		$tplName = $params['tplName'];
		$arrTags = $params['arrTags'];
		$options = isset($params['options']) ? $params['options'] : null;
		//wrlog('status:' . $status);
  		//wrlog(print_r($arrTags, true));
	
  		Template::loadTplFromFile($tplName);
  		if(is_array($arrTags)){	
			if(sizeof($arrTags)>0){
				foreach($arrTags as $k=>$v){
					Template::assign($k, $v);
				}
			}
		}
		//wrlog('status:' . $status);
		
		$ans['tplName'] = $tplName;
		$ans['html'] = Template::generate();
		//wrlog($ans['html']);
		return $ans['html'];
	}


	public function loadRawTemplateByName($params){
		$params = json_decode($params, true);
		$tplName = $params['tplName'];
		$tplHTML = Template::loadRawTplFromFile($tplName);
		if($tplHTML){
			return $tplHTML;
		}else{
			return false;
		}	
  	}

	  public function loadRawTemplateFromFile($params){
		try{
			$params = json_decode($params, true);
			$tplName = $params['tplName'];
			return [
				'success' => true,
				'html' => Template::loadRawTplFromFile($tplName)
			];
		}catch(Exception $e){
			return [
				'success' => false,
				'error' => $e->getMessage()
			];
		}
	
  	}
}

?>