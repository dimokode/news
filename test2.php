<?
require_once("config.php");

try{
    $path_to_file = ROOT_DIR."/aaa.txt";
    echo 'PHP_SAPI = ';
    print_r(PHP_SAPI);
    echo "<br>";
    echo $path_to_file."<br>";
    $result = file_put_contents($path_to_file, "");
    echo "RESULT:".$result;
}catch(Exception $e){
    echo $e->getMessage();
}



?>