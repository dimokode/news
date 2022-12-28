;(function(){

function network(){}

function getHttpCode(url){
    const obj = {
        controller : 'Network',
        action : 'getServerResponseCode',
        url : url
    }

    return common.sendAjax(obj).then( response => {
        //console.log(response)
        return response
    })
}

function getPageContent(url){
    const obj = {
        controller : 'Network',
        action : 'getPageContent',
        url : url
    }

    return common.sendAjax(obj).then( response => {
        //console.log(response)
        return response
    })
}

function getJson(url){
    const obj = {
        controller : 'Network',
        action : 'getJson',
        url : url
    }

    return common.sendAjax(obj).then( response => {
        //console.log(response)
        return response
    })
}

network.getHttpCode = getHttpCode;
network.getJson = getJson;
network.getPageContent = getPageContent;
window.network = network;


})();