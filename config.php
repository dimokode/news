<?
//session_start();
error_reporting(-1);
//error_reporting(E_ALL);
define("DOMAINNAME", "http://news.loc");


define("ROOT_DIR", dirname (__FILE__));
define("TPL_DIR", ROOT_DIR.'/tpl');
define("LOGS_DIR", ROOT_DIR.'/logs');
define("DATA_DIR", ROOT_DIR.'/data');
define("TESTLAB_DIR", ROOT_DIR.'/testlab');
define("TASKS_DIR", ROOT_DIR.'/tasks');
define("MODELS_DIR_URL", '/models');
define("PATH_TO_DB", ROOT_DIR.'/db');
define("PATH_TO_CONFIG", ROOT_DIR.'/config');
//define("FORMS_DIR", ROOT_DIR.'/forms');
define("PATH_TO_SQLITE_FILE", ROOT_DIR.'/db/news.sqlite');
//define("PATH_TO_SQLITE_FILE", ROOT_DIR.'/db/test.sqlite');
define("SITE_URL", "http://".$_SERVER['HTTP_HOST']);


include_once('dev_functions.php');
include_once(ROOT_DIR.'/app/functions.php');


spl_autoload_register(function ($classname) {
	try{
		if(include_once(ROOT_DIR."/app/".strtolower($classname) . ".class.php")){
			//wrlog(ROOT_DIR."/app/".strtolower($classname) . ".class.php was successfully included");
			//echo "Class with filename:".strtolower($classname) . ".class.php was registered<br>";
		}
		
	}catch(Exception $e){
		echo $e->getMessage();
	}
    //throw new Exception("Невозможно загрузить $classname.");
});

//создаем объект БД
DB::getInstance(PATH_TO_SQLITE_FILE);
//echo TPL_DIR;
Template::setTemplateFolder(TPL_DIR);

?>