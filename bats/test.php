<?
$dir = dirname(__DIR__, 1);
require_once($dir."/config.php");

echo $dir."<br>";
$path_to_file = $dir."/db/test.txt";
echo $path_to_file."<br>";


$f = fopen($path_to_file, "a+");
fwrite($f, DATA_DIR);
fwrite($f, date("Y-m-d H:i:s")."\n");
fclose($f);
echo "ok";
?>