<?
class Template{
	protected static $instance;
	protected static $folderName;
	protected static $filePath;
	protected static $parameters = [];


	protected $source;
	protected $innerContent;
	protected $innerContentBuffer;
	protected $outerContent;
	protected static $assigns = [];
	protected static $status = [];
	//public $tpl_folder;


/*
	public static function getInstance(){
		if(self::$instance === null){
			self::$instance = new self;
		}
		return self::$instance;
	}


	public static function initialize($fileName){
		self::$assigns = [];
		self::$instance = new static();
		self::$filePath = self::$folderName.$fileName;
		if(!is_file(self::$filePath))
        {
            throw new \Exception('Template file not found: ' . self::$filePath);
        }

        self::$instance->source = file_get_contents(self::$filePath);
		//self::$instance = new static();
		//self::$instance->tpl_folder = $this->tpl_folder;
		//echo 'tpl_folder = '.self::$instance->tpl_folder;
	}
*/
	public static function loadTplFromFile($fileName){
		self::$instance = new static();
		self::$filePath = self::$folderName.$fileName;
		if(!is_file(self::$filePath))
        {
            throw new \Exception('Template file not found: ' . self::$filePath);
        }

        self::$instance->source = file_get_contents(self::$filePath);
        $template = self::getContentBetweenTags('[INNERCONTENT]', self::$instance->source);
		self::$instance->innerContent = self::zoneAccessFilter($template['inner']);
		//self::$instance->innerContent = self::ifFilter(self::$instance->innerContent);
		self::$instance->outerContent = self::zoneAccessFilter($template['outer']);
		//self::$instance->outerContent = self::ifFilter(self::$instance->outerContent);
        //wrlog(print_r($template, true));
        return new static;
	}

	public static function loadRawTplFromFile($fileName){
		//$ans['success'] = false;
		try{
			self::$instance = new static();
			self::$filePath = self::$folderName.$fileName;
			if(!is_file(self::$filePath))
			{
				throw new \Exception('Template file not found: ' . self::$filePath);
			}
			$cont =  file_get_contents(self::$filePath);
			if(!$cont){
				throw new \Exception('Error by getting content: ' . self::$filePath);
			}
			//$ans['success'] = true;
			//$ans['content'] = $cont;
			return $cont;
		}catch(Exception $e){
			//$ans['error'] = $e->getMessage();
			throw $e;
		}

		//return $ans;
	}



	static private function zoneAccessFilter($cont){
		$userrole = isset($_SESSION['userrole']) ? $_SESSION['userrole'] : '';
		$cont = preg_replace("#\[$userrole\](.*?)\[\/$userrole\]#is", "$1", $cont);
		
		//wrlog($cont);
		if(!isset(self::$status['status'])){
			self::$status['status'] = "";
		}
		//wrlog(self::$status['status']);
		

		//$cont = preg_replace("#\[status=save\](.*?)\[\/status\]#is", "$1", $cont);
		preg_match_all("#\[status=(.*?)\]#is", $cont, $s);
		//wrlog(print_r($s, true));
		//
		
		if(sizeof($s[1]) > 0){
			//wrlog(print_r($s, true));
			//wrlog(self::$status['status']);
			for($i=0; $i<sizeof($s[1]); $i++){
				//if($s[1][$i] == '' || $s[1][$i] == self::$status['status']){
				if(self::$status['status'] == '' || $s[1][$i] == self::$status['status']){
				//if($s[1][$i] == '' || $s[1][$i] == 'save'){
					//wrlog(self::$status['status']);
					$cont = preg_replace("#\[status=".$s[1][$i]."\](.*?)\[\/status\]#is", "$1", $cont);
				}else{
					$cont = preg_replace("#\[status=".$s[1][$i]."\](.*?)\[\/status\]#is", "", $cont);
				}
			}
		}
		

		preg_match_all("#\[\/hp:(.*?)\]#is", $cont, $m);
		if(sizeof($m)>0){
			for($i=0; $i<sizeof($m[1]); $i++){
				$mark = $m[1][$i];
				$fRule = explode(":", $mark);
				//$result = user::$fRule[0]($fRule[1]);
				//wrlog($fRule[0] . " => " . $fRule[1]);
				$result = call_user_func_array( array('user', $fRule[0]), array($fRule[1]) );
				
				wrlog("RESULT:".$result);
				if($result == true){
					$cont = str_replace("[hp:".$mark."]", "", $cont);
					$cont = str_replace("[/hp:".$mark."]", "", $cont);
				}else{
					$cont = preg_replace("#\[hp:$mark\](.*?)\[\/hp:$mark\]#is", "", $cont);
				}
			}
		}
		
		//wrlog(print_r($m, true));

		//wrlog($cont);

		preg_match_all("#\[\/(.*?)\]#is", $cont, $m);
		for($i=0; $i<sizeof($m[1]); $i++){
			$mark = $m[1][$i];
			$cont = preg_replace("#\[$mark\](.*?)\[\/$mark\]#is", "", $cont);
		}

		return $cont;
	}

	static private function getContentBetweenTags($innerContentTag, $content){
		if(strpos($content, $innerContentTag)){
			$start = explode($innerContentTag, $content);
			$arr['outer'] = $start[0].'{%innerContent%}'.$start[2];
			$arr['inner'] = $start[1];
		}else{
			$arr['outer'] = $content;
			$arr['inner'] = '';
		}
		return $arr;
	}

	static private function ifFilter($cont){
		//wrlog($cont);
		if(strpos($cont, "[endif]") !== false){
			preg_match_all("#\[if (.*?) == (.*?)\](.*?)\[else\](.*?)\[endif\]#is", $cont, $m);
			//wrlog();
			//wrlog(print_r($m, true));
			if($m[1][0] == $m[2][0]){
				$cont = preg_replace("#\[if (.*?) == (.*?)\](.*?)\[else\](.*?)\[endif\]#is", "$3", $cont);
			}else{
				$cont = preg_replace("#\[if (.*?) == (.*?)\](.*?)\[else\](.*?)\[endif\]#is", "$4", $cont);
			}
			//$cont = self::ifFilter($cont);
		}
		
		return $cont;
		//return str_replace('if', 'IFFFF', $cont);
		
	}

	static public function generate($contentType = 'outer'){
		//wrlog('cls');
		//$tmp = self::getTemplate();
		if($contentType == 'outer'){

			foreach (self::$assigns as $key => $value) {
				self::$instance->outerContent = str_replace('{%'.$key.'%}', $value, self::$instance->outerContent);
				//wrlog($key . "=>" . $value);
			}
			self::$instance->outerContent = self::ifFilter(self::$instance->outerContent);

			if(self::$instance->innerContentBuffer!=''){
				self::$instance->outerContent = str_replace('{%innerContent%}', self::$instance->innerContentBuffer, self::$instance->outerContent);
			}else{
				self::$instance->outerContent = str_replace('{%innerContent%}', '', self::$instance->outerContent);
			}
			//remove unused tags
	    	self::$instance->outerContent = preg_replace("#\{%(.+?)%\}#is", "", self::$instance->outerContent);
 		
    	}elseif($contentType == 'inner'){
    		$tmpInnerContent = self::$instance->innerContent;
			foreach (self::$assigns as $key => $value) {
				//self::$instance->source = str_replace('{%'.$key.'%}', $value, self::$instance->source);

				$tmpInnerContent = str_replace('{%'.$key.'%}', $value, $tmpInnerContent);
			}
			self::$instance->innerContentBuffer.= $tmpInnerContent;
    	}

		return self::$instance->outerContent;
	}


	public static function setTemplateFolder($folderName){
		$folderName = $folderName."/";
		if(file_exists($folderName)){
			self::$folderName = $folderName;
		}else{
			throw new \Exception('Template directory doesn\'t exist');
		}

	}

	static public function assign($name, $value){
		self::$assigns[$name] = $value;
		return new static;
	}

	static public function setStatus($name, $value){
		//wrlog('setStatus');
		//wrlog($name);
		//wrlog($value);
		self::$status[$name] = $value;
		return new static;
	}

	public function printTag($name){
		echo 'TAG:'.self::$assigns[$name];
	}

	public function test($str){
		echo "###################### " .$str. " #######################";
		echo self::$folderName;
		//echo self::$parameters['tpl_folder'];
		//echo "FolderNAme:".self::$folderName;
		//echo '#'.substr(self::$folderName, -1, 1).'#';
	}

}
?>