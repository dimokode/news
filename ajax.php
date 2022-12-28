<?
require_once('config.php');

$json = file_get_contents('php://input');
$arrData = json_decode($json, true);
//wrlog(print_r($arrData, true));

//wrlog();
$controller = new $arrData['controller'];
$action = $arrData['action'];
//wrlog('Controller:' . $controller);
//wrlog('Action:' . $action);

$jsonData = json_encode($arrData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$ans = call_user_func_array( array($controller, $action), array($jsonData) );
//wrlog($ans);
//wrlog(print_r($ans, true), 'files.txt');


$out = json_encode($ans, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
//wrlog(json_last_error_msg());
//wrlog($out);
//wrlog('out:' . $out, 'files.txt');
//wrlog(json_last_error_msg(), 'files.txt');
$fp = fopen('php://output', 'w');
fwrite($fp, $out); //User will see Hello World!
fclose($fp);
?>