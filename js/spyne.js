;(function(){

    function spyne(){}

    function sendRequest(){
        /*
        network.getHttpCode('http://127.0.0.1:7999').then(response => {
            console.log(response)
        })
        */
        network.getJson("http://127.0.0.1:7999/").then(response => {
            console.log(response)
        })
    }

    spyne.sendRequest = sendRequest
    window.spyne = spyne

})();