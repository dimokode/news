<?
require_once('config.php');

$json = file_get_contents('php://input');
$arrData = json_decode($json, true);

$controller = new $arrData['controller'];
$action = $arrData['action'];


$jsonData = json_encode($arrData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$ans = call_user_func_array( array($controller, $action), array($jsonData) );


$out = json_encode($ans, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$fp = fopen('php://output', 'w');
fwrite($fp, $out);
fclose($fp);
?>