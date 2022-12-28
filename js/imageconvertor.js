;(function(){

function imageconvertor(){}

function getImage(){
    const obj = {
        controller : 'Images',
        action : 'convertImageFromBlob',
        foldername : '11111',
        filename : 'img_0.jpg'
    }

    common.sendAjax(obj).then(function(json){
        if(json['success']){
            alert('ok');
        }else{
            alert('error');
        }
    });


}

imageconvertor.getImage = getImage;
window.imageconvertor = imageconvertor;
})();