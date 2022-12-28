<?

class documents{

	public function generateDoc($params){
		wrlog();
		$params = json_decode($params, true);
  		//wrlog(print_r($params, true));
		$arrFormData = $params['formData'];
		$docType = $params['docType'];//name of docx template file
		/** formData contains field values and data for validation */
		$formData = dbf::getOnlyValuesFromDataArray($arrFormData);
  		$customer  = $formData['customer_id'];
  		$reklama = $formData['claim_id'];
  		
  		//$docFileName = $docType."_".$reklama."_".$formData['claim_nr']."_".$formData['claim_date'].".docx";
  		//$docFilename = $docType."_".$formData['outgoing_letter_number']."_".$formData['claim_nr']."_".$formData['claim_date'].".docx";
  		$docFilename = $docType."_".$formData['claim_nr']."_".$formData['claim_date'].".docx";

		$doc = new Document();
		$doc->template_path = '/template/';
		$doc->work_dir_path = '/work/';
		$doc->download_dir_path = '/download/';

		$doc->clearDirectory();//clear work folder
		
		$result = $doc->openZip($docType . '.docx');
		if($result['success'] === false){
			$ans['success'] = false;
			$ans['error'] = $result['error'];
			return $ans;
		}
	
		$fcont = $doc->openFile('/word/document.xml');
		//wrlog($fcont);

		$rcont = $doc->replaceTags($fcont, $formData);
		//wrlog(print_r($rcont ,true));
		//wrlog($rcont);
		//wrlog(print_r($arrTags, true));

		//$rcont = $doc->replaceTags($fcont, $arrTags);
		$doc->savefile('/word/document.xml', $rcont);
		//$result = $doc->createArchive($customer.'/'.$reklama.'/'.$docType.'.docx');
		//$result = $doc->createArchive($customer.'/'.$reklama.'/'.$docFileName);
		$doc->sourceFolder = '/work/';
		$doc->destinationFolder = '/download/'.$customer.'/'.$reklama.'/';
		$result = $doc->createZip($docFilename);

		if($result['success']){
			$ans['success'] = true;
			$ans['text'] = "The document was successfully generated";
		}else{
			$ans['success'] = false;
			//$ans['error'] = __CLASS__." / ". __FUNCTION__." # An error occures by generating DOCX";			
			$ans['error'] = __CLASS__." / ". __FUNCTION__." # ".$result['error'];			
		}


  		//$ans['result'] = "generate";
  		return $ans;

	}

	function assembyDoc($params){
		$params = json_decode($params, true);
		$sourceFolder = $params['sourceFolder'];
		$destinationFolder = $params['destinationFolder'];
		$filename = $params['filename'];

		$doc = new Document();
		$doc->sourceFolder = $sourceFolder;
		$doc->destinationFolder = $destinationFolder;
		$result = $doc->createZip($filename);

		if($result == true){
			$ans['success'] = true;
			$ans['text'] = "The DOC was successfully generated";
		}else{
			$ans['success'] = false;
			$ans['text'] = "An error occures by creating DOC";
			$ans['error'] = $result;
		}
		return $ans;
	}

	function extractDoc($params){
		/*
		'folder' : 'test/',
        'filename' : 'test.docx',
        'folderTo' : 'test/out/'
		*/
		$params = json_decode($params, true);
		$folder = $params['folder'];
		$filename = $params['filename'];
		$folderTo = $params['folderTo'];

		$doc = new Document();
		$doc->template_path = $folder;
		$doc->work_dir_path = $folderTo;
		//$doc->download_dir_path = '/download/';

		$doc->clearDirectory();//clear work folder
		
		$doc->openZip($filename);
	
		$fcont = $doc->openFile('/word/document.xml');
/*
		preg_match_all('#<w:tbl>(.*?)</w:tbl>#', $fcont, $m);
		preg_match_all('#<(.*?)>(.*?)</(.*?)>#', $m[0][0], $mm);
		wrlog();
		wrlog(print_r($m[0][0], true));
		wrlog(print_r($mm, true));
*/
		if($fcont !== false){
			$ans['success'] = true;
			$ans['fcont'] = $fcont;
		}else{
			$ans['success'] = false;
			$ans['error'] = 'Some trouble occure be opening the file';
		}
		
		return $ans;

	}


	static public function getDocumentTemplate($params){
		$params = json_decode($params, true);
		$docType = $params['docType'];


		$ans['success'] = false;
		$ans['data'] = 'Here is ' . $docType;

		return $ans;
	}

}

?>