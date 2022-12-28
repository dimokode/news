<?

require_once("config.php");
//print_r($_SERVER['REQUEST_URI']);
$uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];


if($request_method == "GET"){
    $uri_parts = parse_url($uri);
    //print_r($uri_parts);
    parse_str($uri_parts["query"], $params);
    //print_r($params);
    
    /*
    $api_params = [];
    
    if(isset($params['keyword'])){
        $api_params["s_keyword"] = $params["keyword"];
    }
    
    if(isset($params['fields'])){
        $api_params["s_fields"] = $params["fields"];
    }
    */
    
    $api_params = $params;
    
    $news = new News();
    $arrParams = [
        "searchParams" => $api_params
        
    ];
    
    
    //print_r($arrParams);
    
    
    $jsonData = json_encode($arrParams, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $response = $news->getNews($jsonData);
    
    //print_r($response);
    //header('Content-Type: application/json; charset=utf-8');
    //$response = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
}else{

    $json = file_get_contents('php://input');
    $arrData = json_decode($json, true);

    //print_r($arrData);

    $response = [
        "success" => true,
        "request_method" => $request_method,
        "ans" => $arrData
    ];
}




$jsonResponse = json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

file_put_contents('php://output', $jsonResponse);

?>