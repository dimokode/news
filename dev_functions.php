<?php

/* 
version 0.2
 wrlog - write log in /logdata.txt
 */



function errlog($data){
    $arr = debug_backtrace();
    $filename = "error_log.txt";
    if(gettype($data) == 'string' || gettype($data) == 'boolean'){
        strlog($data, $arr, $filename);
    }else{
        arrlog($data, $arr, $filename);
    }
}

function wrlog($data, $filename = "log.txt"){
    $arr = debug_backtrace();
    //arrlog($arr, $arr, 'debug.txt');
    //$filename = "log.txt";
    if(gettype($data) == 'string' || gettype($data) == 'boolean'){
        strlog($data, $arr, $filename);
    }else{
        arrlog($data, $arr, $filename);
    }
}

function strlog($data = '', $arr, $filename){
    $str_to_file = '';
    $file = $_SERVER["DOCUMENT_ROOT"]."/".$filename;
    $fh = fopen($file, "a+") or die("File ($file) does not exist!");
    //if($data == 'cls'){
        //$str_to_file = '';
        //ftruncate($fh, 0);//remove file content
        //$str_to_file = date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: Empty string \n\n";
    //}else{
        $str_to_file.= date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: ".$data."\n\n";
    //}
    //$str_to_file.=serialize($arr);

    fwrite($fh, $str_to_file);
    fclose($fh);
}

function arrlog($arrData = [], $arr, $filename){

    $data = print_r($arrData, true);

    $str_to_file = '';
    $file = $_SERVER["DOCUMENT_ROOT"]."/".$filename;
    $fh = fopen($file, "a+") or die("File ($file) does not exist!");
    if($data == 'cls'){
        //$str_to_file = '';
        ftruncate($fh, 0);//remove file content
        //$str_to_file = date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: Empty string \n\n";
    }else{
        $str_to_file.= date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: ".$data."\n\n";
    }
    //$str_to_file.=serialize($arr);

    fwrite($fh, $str_to_file);
    fclose($fh);
}



function out($data){

    $arr = debug_backtrace();
    $str = "";
    //$str.= date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: ".$data."\n\n";
    $str.= "[".basename($arr[0]['file']).":".$arr[0]['line']."]: ".$data."\n\n";
    echo $str;
}


function clearLog($filename = null){
    if($filename == null){
        $filename = "log.txt";
    }else{
        $filename = $filename;
    }
    $arr = debug_backtrace();

    $str_to_file = '';
    $file = $_SERVER["DOCUMENT_ROOT"]."/".$filename;
    $fh = fopen($file, "a+") or die("File ($file) does not exist!");

    ftruncate($fh, 0);//remove file content
    $str_to_file = date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: Log was cleared \n\n";

    fwrite($fh, $str_to_file);
    fclose($fh);
}





