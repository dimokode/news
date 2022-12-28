<?
require_once("../config.php");
$path_to_file = ROOT_DIR."/db/test.txt";
echo $path_to_file."<br>";


$f = fopen($path_to_file, "a+");
fwrite($f, date("Y-m-d H:i:s")."\n");
fclose($f);
echo "ok";
?>