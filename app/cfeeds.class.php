<?
//controller feeds
class cfeeds{

    function parseFeed($params){
        try{
            $params = json_decode($params, true);
            $url = $params['url'];
            $fromFile = ($params['fromFile']) ? $params['fromFile'] : false;
            $filename = ($params['filename']) ? $params['filename'] : "";
    
            $feed = new Feeds($url, DATA_DIR, $filename);
            $feed->storeFeedToFile();
            //$rss = $feed->getRssObject($fromFile);
            $rss = $feed->getRssObject();
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


    static function getConfig(){
        $path_to_file = PATH_TO_CONFIG."/feeds.txt";
        return fs::getContentFromFile($path_to_file);
    }
}
?>