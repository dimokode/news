<?

//date_default_timezone_set('Europe/London');

class Feeds{

    const SAVE_CONTENT = false;
    const CONTENT_FROM_FILE = false;


    function __construct($url = "", $dataDir = "", $filename = ""){
        try{
            $this->url = $url;
            //$this->dataDir = $dataDir;
            //$this->filename = $filename;
            if($dataDir!="" && $filename !=""){
                $this->path_to_file = $dataDir."/".$filename;
            }
            
        }catch(Exception $e){
            throw $e;
        }

    }

    function storeFeedToFile($replace = true){

        try{
            //$cont = @file_get_contents($this->url);
            $cont = Network::getPageContent($this->url);
            //wrlog($cont);
            /*
            if(!$cont){
                throw new Exception("Failed to open stream");
            }
            */

            if($replace){
                file_put_contents($this->path_to_file, $cont);
            }else{
                if(!file_exists($this->path_to_file)){
                    file_put_contents($this->path_to_file, $cont);
                }
            }
        }catch(Exception $e){
            //throw $e->getMessage();
            //wrlog($e);
            throw $e;
        } 
        
    }


    function getRssObject($from_file = true){
        try{
            if($from_file){
                
                $source = $this->path_to_file;
                if(!file_exists($source)){
                    throw new Exception("File $source doesn't exist.<br>Check if the method storeFeedToFile is using before.");
                }
                //wrlog($source);
            }else{
                $source = $this->url;
            }


            //wrlog($from_file);
            //wrlog($source);
            $rss = @simplexml_load_file($source);
            if($rss == false || $rss === false){
                throw new Exception("Wrong rss format");
            }
            return $rss;

        }catch(Exception $e){
            //wrlog($e);
            throw $e;
        }

    }


    static function parseFeed($rss){
        //wrlog($rss);
        try{
            $channel = $rss->channel;
            //wrlog($channel);
            //wrlog($channel->count());
            if(!$channel->count()){
                throw new Exception("RSS feed has unusual format");
            }

            $language = (string) $channel->language;
            $link = (string) $channel->link;
            
            $arrResult = [];
            
            $newsItem = [
                'url' => '',
                'title' => '',
                'short_text' => '',
                'date' => '',
                'language' => $language,
                'source' => $link,
                'category' => 'crypto',
                'tags' => ''
            ];
            
            $props = [
                'title' => 'title',
                'pubDate' => 'date',
                'link' => 'url',
                'category' => 'tags',
                'description' => 'short_text'
            ];
            
            foreach($rss->channel->item as $item){
                $arrItem = $newsItem;
                
                foreach($props as $prop=>$propTo){
                    //rawOutput($prop." -> ".$propTo);
                    $value = '';
                    if($prop == 'category'){
                        $arr = [];
                        foreach($item->$prop as $category){
                            //rawOutput($str);
                            //print_r($arr);
                            array_push($arr, $category);
                        }
                        $value = implode(',', $arr);
                        //rawOutput($value);
                    }else if($prop == 'pubDate'){
                        //rawOutput($item->$prop);
                        $value = strtotime($item->$prop)*1000;
                        //rawOutput($ts);
                        #$dt = Date('d.m.Y H:i:s', $ts);
                        //$date = new DateTimeImmutable();
                        //$dt = $date->setTimestamp($ts);
                        //rawOutput($dt->format('U = Y-m-d H:i:s'));
                    }else if($prop == 'description'){
                        $value = trim(strip_tags($item->$prop));
                        if(mb_strlen($value) > 255){
                            $value = mb_substr($value, 0, 254);
                        }
                    }else{
                        //rawOutput(strip_tags($item->$prop));
                        $value = strip_tags($item->$prop);
                    }
                    $arrItem[$propTo] = trim($value);
                }
                array_push($arrResult, $arrItem);
            }
            //wrlog($arrResult);
            $arrResult = mb_convert_encoding($arrResult, "UTF-8", "auto");
            //wrlog($arrResult);
            return $arrResult;

        }catch(Exception $e){
            throw $e;
        }
    }


    static function putDataInDB($arrData){
        try{
            $result = [
                'true' => 0,
                'false' => 0
            ];
            for($i=0; $i<sizeof($arrData); $i++){
        
                $params = json_encode(['data'=>$arrData[$i]], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                //array_push(news::insertSingleNewsInDB($params));
                $ans = news::insertSingleNewsInDB($params);
                //print_r($ans);
                //array_push($result, $ans["success"]);
                if($ans["success"]){
                    $result['true']++;
                }else{
                    $result['false']++;
                }
            
                //print_r($arrResult[$i]);
                /*
                foreach($arrResult[$i] as $k=>$v){
                    echo "$k => $v <br>";
                }
                */
                //echo "<hr>";
            }
            print_r($result);
            return $result;
        }catch(Exception $e){
            throw $e;
        }

    }


    static function showData($arrData){
        for($i=0; $i<sizeof($arrData); $i++){
            print_r($arrData[$i]);
        
            //print_r($arrResult[$i]);
            /*
            foreach($arrResult[$i] as $k=>$v){
                echo "$k => $v <br>";
            }
            */
            echo "<hr>";
        }
    }



/*
    static function getConfig(){
        $path_to_file = PATH_TO_CONFIG."/feeds.txt";
        return fs::getContentFromFile($path_to_file);
    }
*/

    static function saveConfig($params){
        try{
            $params = json_decode($params, true);
            $content = $params['content'];
            $path_to_file = PATH_TO_CONFIG."/feeds.txt";

            if(fs::saveContentToFile($path_to_file, $content)){
                return [
                    'success' => true
                ];
            }

        }catch(Exception $e){
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }

    }

    static public function rawOutput($str){
        //$str = htmlspecialchars($str);
        echo $str."<br><br>";
    }
}
?>