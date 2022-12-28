<?

class Document {
	//template_path
	//work_dir_path

	public function openZip( $tmpFileName ){
		$path_to_file = $_SERVER['DOCUMENT_ROOT'].$this->template_path.$tmpFileName;
		$path_work_dir = $_SERVER['DOCUMENT_ROOT'].$this->work_dir_path;
		//echo  'path_to_file:'.$path_to_file."<br>";
		//echo  'path_work_dir:'.$path_work_dir."<br>";
		if(file_exists($path_to_file)) {
			$zip = new ZipArchive;
			$res = $zip->open($path_to_file);
			if($res === true){
				$zip->extractTo($path_work_dir);
				//$zip->extractTo('work');
				$zip->close();
				$ans['success'] = true;
				
			}else{
				$ans['success'] = false;
				$ans['error'] = '['.__FUNCTION__.'] Trouble by unpacking the file';
				//echo 'failed. code: '.$res;
			}
			return $ans;
		}
	}



	public function isFolderExist($path_to_folder){
		if(!file_exists($path_to_folder)){
			
		}
	}

	public function createDocx( $docxFileName ) {
		//$path_to_docx = $_SERVER['DOCUMENT_ROOT'].$this->download_path.'/'.$docxFileName;
		$path_work_dir = $_SERVER['DOCUMENT_ROOT'].$this->work_dir_path;
		//echo 'path_to_docx:'. $path_to_docx;
		//http://qaru.site/questions/66066/compressarchive-folder-using-php-script
		$dirlist = new RecursiveDirectoryIterator($path_work_dir);
		$filelist = new RecursiveIteratorIterator($dirlist);

// instantate object
		$zip = new ZipArchive();

		// create and open the archive 
		if ($zip->open($docxFileName, ZipArchive::CREATE) !== TRUE) {
		    die ("Could not open archive");
		}else{
			echo 'ok<br>';
			foreach ($filelist as $key=>$value) {
	    		echo 'real:'.realpath($key) .'=>'. $key . '<br>';
	    		$zip->addFile(realpath($key), $key) or die ("ERROR: Could not add file: $key");
			}

			$zip->close();
		}
		/*
		$zip = new ZipArchive;
		$res = $zip->open($path_to_docx, ZipArchive::CREATE);
		if($res === true) {

		}else{
			echo 'failed. code: '.$res;
			
		}
		*/
	}



	public function getDocumentsInFolder($path_to_folder = null){
		$path =  $_SERVER['DOCUMENT_ROOT'].$this->download_dir_path.$path_to_folder;
		if(file_exists($path)){
			//$arrFiles = scandir($path);
			$arrFiles = Array();
			if ($handle = opendir($path)) {
			    while (false !== ($file = readdir($handle))) { 
			        if ($file != "." && $file != "..") { 
			            array_push($arrFiles, $file);
			        } 
			    }
			    closedir($handle); 
			}

			return $arrFiles;			
		}else{
			Errors::addError("Folder isn't exist");
			return false;
		}

		//echo "path:" . $path;
	}


public function createZip($filename){
	$path_to_destination_folder =  $_SERVER['DOCUMENT_ROOT'].$this->destinationFolder;
	$path_to_source_folder =  $_SERVER['DOCUMENT_ROOT'].$this->sourceFolder;
	
	//wrlog();
	//wrlog($path_to_destination_folder);
	//wrlog($path_to_source_folder);
	//wrlog($filename);

	if(!file_exists($path_to_destination_folder)){
		mkdir($path_to_destination_folder, 0777, true);
	}
	$result = self::zip($path_to_source_folder, $path_to_destination_folder.$filename);
	if($result['success']){
		$ans['success'] = true;
	}else{
		$ans = $result;
	}
	return $ans;
}


public function zip($source, $destination)
{
	//wrlog($destination);
	//$_SERVER['DOCUMENT_ROOT'].$source;
	//$source = $_SERVER['DOCUMENT_ROOT'].$source."/";
	//$destination =  $_SERVER['DOCUMENT_ROOT'].$destination;
	//return self::returnError('extension zip is missing');

	if(!extension_loaded('zip')){
		return self::returnError('extension zip is missing');
	}

	if(!file_exists($source)){
		return self::returnError('Source folder not found');
	}

    //if (!extension_loaded('zip') || !file_exists($source)) {
    //    return false;
    //}

    $zip = new ZipArchive();
    if (!$zip->open($destination, ZIPARCHIVE::CREATE)) {
    	//Errors::addError('Destination file not found');
        return self::returnError('Destination file not found');
        //return 'destination is wrong';
    }
 
    $source = str_replace('\\', DIRECTORY_SEPARATOR, realpath($source));
    $source = str_replace('/', DIRECTORY_SEPARATOR, $source);

    if (is_dir($source) === true) {
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source),
            RecursiveIteratorIterator::SELF_FIRST);
 
        foreach ($files as $file) {
            $file = str_replace('\\', DIRECTORY_SEPARATOR, $file);
            $file = str_replace('/', DIRECTORY_SEPARATOR, $file);
 
            if ($file == '.' || $file == '..' || empty($file) || $file == DIRECTORY_SEPARATOR) {
                continue;
            }
            // Ignore "." and ".." folders
            if (in_array(substr($file, strrpos($file, DIRECTORY_SEPARATOR) + 1), array('.', '..'))) {
                continue;
            }
 
            $file = realpath($file);
            $file = str_replace('\\', DIRECTORY_SEPARATOR, $file);
            $file = str_replace('/', DIRECTORY_SEPARATOR, $file);
 
            if (is_dir($file) === true) {
                $d = str_replace($source . DIRECTORY_SEPARATOR, '', $file);
                if (empty($d)) {
                    continue;
                }
                $zip->addEmptyDir($d);
            } elseif (is_file($file) === true) {
                $zip->addFromString(str_replace($source . DIRECTORY_SEPARATOR, '', $file),
                    file_get_contents($file));
            } else {
                // do nothing
            }
        }
    }elseif (is_file($source) === true) {
        $zip->addFromString(basename($source), file_get_contents($source));
    }
 
	$result = $zip->close();
	if($result){
		$ans['success'] = true;
		//$ans['text'] = 'File was successfully ziped';
	}else{
		$ans['success'] = false;
		$ans['error'] = 'Error occured by zipping the file';
	}
	return $ans;
}


public function returnError($errorText){
	$ans['success'] = false;
	$ans['error'] = $errorText;
	return $ans;
}

public function openFile ( $filename) {
	$path_to_word_file = $_SERVER['DOCUMENT_ROOT'].$this->work_dir_path.'/'.$filename;
	//echo "path_to_word_file:" . $path_to_word_file . "<br>";

	if(file_exists($path_to_word_file)){
    	$fcont = file_get_contents( $path_to_word_file );
    	//$fcont = iconv("utf-8","windows-1251",$fcont);
    	return $fcont;
    }else{
    	echo 'error';
    	return false;
    }
}



public function savefile( $filename, $fcont ) {
	$path_to_word_file = $_SERVER['DOCUMENT_ROOT'].$this->work_dir_path.'/'.$filename;
  if(file_exists($path_to_word_file)){

    if (file_put_contents($path_to_word_file, $fcont) ){
      //echo 'File was successfully saved';
      return true;
    }else{
      //echo 'Error by saving of file';
      return false;
    }
  }else{
    //echo 'File doesn`t exist';
    return false;
  }
}



public function clearDirectory(){
	$dir = $_SERVER['DOCUMENT_ROOT'].$this->work_dir_path.'/';
	$di = new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS);
	$ri = new RecursiveIteratorIterator($di, RecursiveIteratorIterator::CHILD_FIRST);
	foreach( $ri as $file ){
		//echo "$file<br>";
		$file->isDir() ? rmdir($file) : unlink($file);
	}
}

public function clearDirectory2(){
	$path_to_work_dir = $_SERVER['DOCUMENT_ROOT'].$this->work_dir_path.'/';
	if(file_exists($path_to_work_dir)){
		foreach( glob($path_to_work_dir.'*') as $file){
			echo "$file<br>";
		}
	}
}


public function printContent($cont) {
$html = <<<HTML
	<textarea rows=20 cols=150>
	{$cont}
	</textarea>
HTML;
echo $html;

}


public function replaceTags($cont, $arrTags){
	wrlog();
	//wrlog(print_r($arrTags, true));
	$findTags = [];
	/** ************************************************************ */
	// [reklama_test?1=Тест пройден|0=Тест провален]
	unset($m);
	preg_match_all("|\[(.*)\]|U", $cont, $m);
	//wrlog(print_r($m, true));
	foreach($m[0] as $k=>$text_to_replace){
		//wrlog($k."=>".$v);
		$tag_with_options = preg_replace("|\<(.*)\>|U", "", $text_to_replace);
		preg_match_all("|\[(.*)\?(.*)\]|U", $tag_with_options, $mm);
		//foreach($mm[0] as $kk=>){
			//wrlog(print_r($mm, true));
			$tag = $mm[1][0];
			$options = $mm[2][0];
			$arrOptions = explode("|", $options);
			foreach($arrOptions as $optIndex=>$option){
				$arrOptionTmp = explode("=", $option);
				$arrOption[$arrOptionTmp[0]] = $arrOptionTmp[1];
			}

			//wrlog(print_r($arrOption, true));
			//wrlog($arrTags[$tag]);

			if(isset($arrTags[$tag])){
				$tag_value = $arrTags[$tag];//male
				if($arrTags[$tag] === true){
					$tag_value = 1;
				}elseif($arrTags[$tag] === false){
					$tag_value = 0;
				}
				$tagValue = $arrOption[$tag_value];
			}else{
				//$tag_value = 0;
				$tagValue = "";
			}
			//wrlog($tag_value);
			//wrlog('tag_value:' . $arrTags[$tag] . " => " .$tag_value);
			//wrlog('tag_value2:' . $arrOption[$tag_value] );

			$tagContent = $text_to_replace;
			//$tagValue = $arrOption[$tag_value];
			$cont = str_replace($tagContent, $tagValue, $cont);
			//$findTags[$tag][1] = "А это бомба";
		//}
	}

	//#groupitem={item_mlfb} ({item_snr})#
	/*
	unset($m);
	preg_match_all("|\#(.*)\=(.*)\#|U", $cont, $m);
	for($i=0; $i<sizeof($m[0]); $i++){
		$groupRawContent = strip_tags($m[0][$i]);//it cleans up fucking word tags
		preg_match_all("|\#(.*)\=(.*)\#|U", $groupRawContent, $mm);
		//wrlog(print_r($mm, true));
		$groupName = $mm[1][0];
		$groupContent = strip_tags($mm[2][0]);
		$findTags[$groupName][0] = $m[0][$i];
		$findTags[$groupName][1] = $arrTags[$groupName];
		$findTags[$groupName][2] = $groupContent;
		$cont = str_replace( $findTags[$groupName][0], "", $cont);
		//wrlog("groupRawContent:" . $groupRawContent);
	}
	*/
	/** ************************************************************ */
	//#group=item|where=(item.item_repair=0)|text=@item.item_mlfb@|#
	//#group=item|where=(item_repair=0)|text=item_mlfb (item_snr)|#
	preg_match_all("|\#(.*)\#|U", $cont, $groups);
	//wrlog(print_r($groups, true));
	for($groupNr=0; $groupNr<sizeof($groups[1]); $groupNr++){
		$groupContent = strip_tags($groups[1][$groupNr]);
		//wrlog($groupContent);
		if(strpos($groupContent, "where=") !== false){
			preg_match("|group=(.*)\|where=\((.*)\)\|text=(.*)\||", $groupContent, $groupParts);
			wrlog(print_r($groupParts, true));
			$groupName = $groupParts[1];
			$where = $groupParts[2];
			preg_match("|(.*)=(.*)|", $where, $whereParts);
			wrlog(print_r($whereParts, true));
			$whereField = $whereParts[1];
			$whereValue = $whereParts[2];
			$text = $groupParts[3];
			$groupText = "";
			$arrGroupText = [];
			preg_match_all("|@(.*)@|U", $text, $tags);
			wrlog(print_r($tags, true));
			for($i=0; $i<sizeof($arrTags[$groupName]); $i++){
				//$groupText.=$arrTags[$groupName][$i][]
				$patterns = [];
				$replacements = [];
				if($arrTags[$groupName][$i][$whereField] == $whereValue){
					for($t=0; $t<sizeof($tags[1]); $t++){
						$patterns[$t] = "/@".$tags[1][$t]."@/";
						$replacements[$t] = $arrTags[$groupName][$i][$tags[1][$t]];
					}
					wrlog(print_r($patterns, true));
					wrlog(print_r($replacements, true));
					$arrGroupText[] = preg_replace($patterns, $replacements, $text);
				}
				//$groupText.=preg_replace($patterns, $replacements, $text);
				

			}
			$groupText = implode(", ", $arrGroupText);
			wrlog($groupText);
		}else{
			preg_match("|group=(.*)\|text=(.*)\||", $groupContent, $groupParts);
			wrlog(print_r($groupParts, true));
			$groupText = "hallo";
		}
		$groupGeneratedContent = $groupText;
		$cont = str_replace($groups[0][$groupNr], $groupGeneratedContent, $cont);
	}

	# table start
	//unset($m);
	//preg_match_all("|<w:tr(.*)</w:tr>|U", $cont, $table);
	preg_match_all("|<w:tbl>(.*)</w:tbl>|U", $cont, $tables);
	//wrlog(print_r($tables, true));
		
	if(sizeof($tables[0])>0){
		//wrlog('table(s) was found');

		for($t=0; $t<sizeof($tables[0]); $t++){
			$tableContent = $tables[0][$t];
			preg_match_all("|<w:tr(.*)</w:tr>|U", $tableContent, $table);

			//$tableContent = $table[0][1];
			//$tableRowContent = [];
			for($tr=0; $tr<sizeof($table[0]); $tr++){
				$rowContent = $table[0][$tr];
				unset($row);
				preg_match_all("|\@(.*)\.(.*)\@|U", $rowContent, $row);
				if(sizeof($row[0])>0){
					//wrlog('Row with tag @@ was found');
					//wrlog(print_r($row, true));
					$groupName = strip_tags($row[1][0]);
					//wrlog($groupName);
					$tableRowContent = [];
					for($i=0; $i<sizeof($arrTags[$groupName]); $i++){
						$tableRowContent[$i] = $rowContent;
						foreach($row[0] as $k=>$v){
							$groupItem = strip_tags($row[2][$k]);
							//wrlog($tag);
							$tagContent = $row[0][$k];
							$tagValue = isset($arrTags[$groupName][$i][$groupItem]) ? $arrTags[$groupName][$i][$groupItem] : "";
							$tableRowContent[$i] = str_replace($tagContent, $tagValue, $tableRowContent[$i]);
						}
					}
					$tableRowContent = implode('', $tableRowContent);
					//wrlog($tableRowContent);
					$tableContent = str_replace($rowContent, $tableRowContent, $tableContent);

				}
			}
			$cont = str_replace($tables[0][$t], $tableContent, $cont);
		}//tables for
	}//tables >0
	

	# table end
	
	/** ************************************************************ */
	//{reklama_comment}
	unset($m);
	preg_match_all("|\{(.*)\}|U", $cont, $m);
	//wrlog(print_r($m, true));
	foreach($m[0] as $k=>$v){
		//$m[0][$k] = strip_tags($m[0][$k]);
		$tag = strip_tags($m[1][$k]);
		//wrlog($tag);
		//$findTags[$tag][0] = $m[0][$k];
		$tagContent = $m[0][$k];

		
		//$findTags[$tag][1] = isset($arrTags[$tag]) ? $arrTags[$tag] : "";
		$tagValue = isset($arrTags[$tag]) ? $arrTags[$tag] : "";
		if(preg_match("/^\d{4}-\d{2}-\d{2}$/", $tagValue) == 1){
			$tagValue = preg_replace("/^(\d{4})-(\d{2})-(\d{2})$/", "$3.$2.$1", $tagValue);
		}
		$cont = str_replace($tagContent, $tagValue, $cont);
	}

	//print_r($m);
	//return $findTags;
	return $cont;
}





/*
public function findTags($cont, $arrTags){
	$findTags = [];
	//[reklama_test?1=Тест пройден|0=Тест провален]
	unset($m);
	preg_match_all("|\[(.*)\]|U", $cont, $m);
	//wrlog(print_r($m, true));
	foreach($m[0] as $k=>$text_to_replace){
		//wrlog($k."=>".$v);
		$tag_with_options = preg_replace("|\<(.*)\>|U", "", $text_to_replace);
		preg_match_all("|\[(.*)\?(.*)\]|U", $tag_with_options, $mm);
		//foreach($mm[0] as $kk=>){
			//wrlog(print_r($mm, true));
			$tag = $mm[1][0];
			$options = $mm[2][0];
			$arrOptions = explode("|", $options);
			foreach($arrOptions as $optIndex=>$option){
				$arrOptionTmp = explode("=", $option);
				$arrOption[$arrOptionTmp[0]] = $arrOptionTmp[1];
			}

			//wrlog(print_r($arrOption, true));

			if(isset($arrTags[$tag])){
				$tag_value = $arrTags[$tag];
				if($arrTags[$tag] == true){
					$tag_value = 1;
				}elseif($arrTags[$tag] == false){
					$tag_value = 0;
				}
			}else{
				$tag_value = 0;
			}

			//wrlog('tag_value:' . $arrTags[$tag] . " => " .$tag_value);
			//wrlog('tag_value2:' . $arrOption[$tag_value] );

			$findTags[$tag][0] = $text_to_replace;
			$findTags[$tag][1] = $arrOption[$tag_value];

			//$findTags[$tag][1] = "А это бомба";
		//}
	}
	//#groupitem={defect_item_mlfb} ({defect_item_serial})#
	unset($m);
	preg_match_all("|\#(.*)\=(.*)\#|U", $cont, $m);
	for($i=0; $i<sizeof($m[0]); $i++){
		$groupRawContent = strip_tags($m[0][$i]);//it cleans up fucking word tags
		preg_match_all("|\#(.*)\=(.*)\#|U", $groupRawContent, $mm);
		//wrlog(print_r($mm, true));
		$groupName = $mm[1][0];
		$groupContent = strip_tags($mm[2][0]);
		$findTags[$groupName][0] = $m[0][$i];
		$findTags[$groupName][1] = $arrTags[$groupName];
		$findTags[$groupName][2] = $groupContent;
		$cont = str_replace( $findTags[$groupName][0], "", $cont);
		//wrlog("groupRawContent:" . $groupRawContent);
	}

	//{reklama_comment}
	unset($m);
	preg_match_all("|\{(.*)\}|U", $cont, $m);
	//wrlog(print_r($m, true));
	foreach($m[0] as $k=>$v){
		//$m[0][$k] = strip_tags($m[0][$k]);
		$tag = strip_tags($m[1][$k]);
		//wrlog($tag);
		$findTags[$tag][0] = $m[0][$k];
		$findTags[$tag][1] = isset($arrTags[$tag]) ? $arrTags[$tag] : "";

	}

	//print_r($m);
	return $findTags;

}


public function replaceTags($cont, $arrTags) {
	foreach($arrTags as $tag=>$value){
		if(is_array($arrTags[$tag][1])){
			$groupContent = "";
			$template = $arrTags[$tag][2];
			unset($arrTmpItem);
			foreach($arrTags[$tag][1] as $groupKey => $groupArray){
				$tmpItem = $template;
				foreach($groupArray as $groupItemKey => $groupItemValue){
					$tmpItem = str_replace("{".$groupItemKey."}", $groupItemValue, $tmpItem);
				}
				$arrTmpItem[] = $tmpItem;
				//$groupContent.=$tmpItem;
			}
			$groupContent = implode(", ", $arrTmpItem);
			$cont = str_replace( $arrTags[$tag][0], $groupContent, $cont);	
		}else{
			//$cont = preg_replace("|\{(.*)".$tag."(.*)\}|U", $value, $cont);
			$cont = str_replace( $arrTags[$tag][0], $arrTags[$tag][1], $cont);
		}
	}

	return $cont;
}
*/
}

?>