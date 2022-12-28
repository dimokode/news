<?

class Router {
    var $html = '';

    public function __construct() {
        $routesPath = ROOT_DIR.'/routes.php';
        $this->routes = include($routesPath);
    }


    private function getURI(){
        if (!empty($_SERVER['REQUEST_URI'])){
            return trim($_SERVER['REQUEST_URI'], '/');
        }
    }

    public function run(){
        //echo "<br>Router controller is running...<br>";

    	$uri = $this->getURI();
//        echo 'uri:' . $uri . '<br>';

        	foreach ($this->routes as $uriPattern => $path){
                $ns = '';
        		if(preg_match("~^$uriPattern$~", $uri)){
        			$internalPath = preg_replace("~^$uriPattern~", $path, $uri);
                    //echo "INTERNAL PATH:".$internalPath."<br>";;
        			$segments = explode('/', $internalPath);
                    
                    $ns = '';
                    if($segments[0] == 'admin'){
                        array_shift($segments);
                        //$ns = 'ADMIN/';
                        $ns = 'admin';
                    }
                    if($ns != ''){
        			     $controllerName = $ns.ucfirst(array_shift($segments).'Controller');
                    }else{
                        $controllerName = array_shift($segments).'Controller';
                    }
                    //if($ns == 'ADMIN/'){
                    //    include_once(ROOT_DIR."/app/admin/".strtolower($controllerName) . ".class.php");
                    //}
        			$actionName = 'action'.ucfirst(array_shift($segments));
                    //echo 'controllerName:' . $controllerName . '<br>';
                    //echo 'actionName:' . $actionName . '<br>';
        			$parameters = $segments;
                    //echo "params:";
                    //print_r($parameters);
                    //echo "<br>";
                    //echo "ControllerName:" . $controllerName."<br>";
                    //echo "actionName:" . $actionName."<br>";
        			
                    $controllerObject = new $controllerName;
        			$this->html = call_user_func_array(array($controllerObject, $actionName), $parameters);

                    return $this->html;
        		}
        	}
        //}
    }


}

?>