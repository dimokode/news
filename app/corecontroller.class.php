<?

class CoreController {

	public function actionMain() {
		
//		if($_COOKIE['userrole'] == 'customer'){
//			$fn = "main-customer.html";
//		}else{
			$fn = "main.html";
		//}
		Template::loadTplFromFile($fn);
		return Template::generate();
	}

}

?>