;(function(){

function init(){}

function getConfig(filename){
    //alert('init');
let obj = {
    'controller' : 'files',
    'action' : 'getArrayFromFile',
    //'filename' : 'config/config.php'
    'filename' : 'config/' + filename,
}


return new Promise(function(resolve){
    common.sendAjax(obj).then(function(json){
        if(json['success']){
            return resolve(json['data']);
        }else{
            alert(json['error']);
            return false;
        }
        
    });
});


}

//init.config = config;
init.getConfig = getConfig;
window.init = init;

})();