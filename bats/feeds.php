<?

//sleep(20);
$dir = dirname(__DIR__, 1);
require_once($dir."/config.php");
header( 'Content-type: text/html; charset=utf-8' );
//require_once('../config.php');
echo  '<link rel="stylesheet" href="/css/w3.css">';

/*
date_default_timezone_set('Europe/London');

$url = "https://www.newsbtc.com/feed";

$feed = new Feeds($url);
//$feed->storeFeedToFile();
$rss = $feed->getRssObject(true);
$arrData = Feeds::parseFeed($rss);
Feeds::showData($arrData);
//Feeds::putDataInDB($arrData);
*/

$result = cfeeds::getConfig();

//[{"date":1669888061933,"url":"https://beincrypto.com/news/feed/","news":{"true":0,"false":12},"success":true}]
$jobLog = [];

if($result['success']){
    //echo $result['content'];
    $arrFeeds = explode("\n", $result['content']);
    //print_r($arrFeeds);

    for($i=0; $i<sizeof($arrFeeds); $i++){
        set_time_limit(20);

        $url = $arrFeeds[$i];
        $taskLog = [
            "date" => time()*1000,
            "url" => $url
        ];
        echo "#$i : ".Date("H:i:s")." => ".$url."<br>";
        $filename = generateFilenameFromURL($url, "xml");
        //echo "<br>";
        //echo "<br>";

        $parseResult = parseFeed($url, $filename);
        if($parseResult['success']){
            //$testErrorFlag = logFeed($parseResult['arrItems'])."<br>";
            extract(logFeed($parseResult['arrItems']));// [$testErrorFlag, $htmlLog]

            //print($testErrorFlag);
            if($testErrorFlag){
                echo $htmlLog;
            }
            //echo "testErrorFlag:".$testErrorFlag."<br>";
            if($testErrorFlag == 0){
                $resultPutDataInDB = Feeds::putDataInDB($parseResult['arrItems']);
                //print_r($resultPutDataInDB);
                echo "Added: ".$resultPutDataInDB['true']." / Rejected: ".$resultPutDataInDB['false']."<br>";

                $taskLog['news'] = $resultPutDataInDB;
                $taskLog['success'] = true;
            }
        }else{
            $taskLog['error'] = $parseResult['error'];
            $taskLog['success'] = false;
            echo "ERROR: ".$parseResult['error']."<br>";
        }
        echo "<hr>";
        //print_r($parseResult);
        //echo "<hr>";
        array_push($jobLog, $taskLog);
        flush();
        //ob_flush();
        
    }//for
    
    $jobLog = json_encode($jobLog, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $params = json_encode(["filename"=> "job_".(time()*1000).".log", "data"=>$jobLog], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    //wrlog($params);
    $ans = logs::saveLog($params);
    print_r($ans);

}else{
    echo $result['error'];
}



function logFeed($arrItems){
    $patterns = [
        "title" => "/.+/i",
        "url" => "/\w\//i",
        "source" => "/.+/i",
        "date" => "/^\d+$/i",
    ];

    $testErrorFlag = 0;
    $htmlLog = "";

    foreach($arrItems as $i=>$item){
        //print_r($item);
        //echo "<br>";
        //echo "<br>";
        
        foreach($item as $k => $v){
            $class = "w3-light-grey";
            
            if(isset($patterns[$k])){
                //echo $patterns[$k]."<br>";
                if(preg_match($patterns[$k], $v)){
                    $class = "w3-pale-green";
                }else{
                    $testErrorFlag = 1;
                    $class = "w3-pale-red";
                }
            }
            $htmlLog.= "<div><span class=\"$class\">$k</span>: $v</div>";
        }
        $htmlLog.= "<hr>";
        
    }
    //echo "testErrorFlag:".$testErrorFlag;
    //echo "<br>";
    //return $testErrorFlag;
    return [
        "testErrorFlag" => $testErrorFlag,
        "htmlLog" => $htmlLog,
    ];
}



function parseFeed($url, $filename){
    try{

        $feed = new Feeds($url, DATA_DIR, $filename);
        $feed->storeFeedToFile();
        $rss = $feed->getRssObject();// true - from file
        //wrlog($rss);
        //$rss = $feed->getRssObject();
        $arrItems = Feeds::parseFeed($rss);
        
        $ans = [
            'success' => true,
            'arrItems' => $arrItems
        ];

        //wrlog($ans);
        return $ans;
    }catch(Exception $e){
        //wrlog($e);
        
        $ans = [
            'success' => false,
            'error' => $e->getMessage()
        ];

        //wrlog($ans);
        return $ans;
    }
}


function generateFilenameFromURL($url, $ext = ''){
/*
    let filename = (url.indexOf('?') !== -1) ? url.split('?').shift() : url;
    
    filename = filename.replace(/((http|https):\/\/)/i, '').replace(/[.\/]/gi, '_');
    let fileext = (ext != '') ? `.${ext}` : '';
    return filename + fileext;
*/
    $filename = (strpos($url, "?")) ? explode("?", $url)[0] : $url;
    $filename = preg_replace("/((http|https):\/\/)/i", '', $filename);
    $filename = preg_replace("/[.\/]/i", '_', $filename);
    $fileext = ($ext != "") ? ".$ext" : "";
    return $filename . $fileext;

  }



?>