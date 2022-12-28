;(function(){

function popup(){}

function createPopup(popupId){
    let div = document.createElement('div');
    div.id = popupId;
    div.classList.add('popup');
    //div.innerHTML = "Here is POPUP!";
    document.body.append(div);
}

function insertHTMLTemplate(popupId, htmlTemplate){
    document.querySelector('#'+popupId).innerHTML = htmlTemplate;
}

function hide(){
    event.target.parentElement.remove();
}

function close(){
    document.querySelector('#popup').remove();
}

function insertHTMLByTag(popupId, tag, htmlContent){
    let popupElement = document.querySelector('#'+popupId);
    popupContent = popupElement.innerHTML;
    console.log('popupContent', popupContent)
    popupContent = popupContent.replace('{%'+tag+'%}', htmlContent);
    console.log('popupContent', popupContent)
    popupElement.innerHTML = popupContent;
}

popup.createPopup = createPopup;
popup.insertHTMLByTag = insertHTMLByTag;
popup.hide = hide;
popup.close = close;
popup.insertHTMLTemplate = insertHTMLTemplate;
window.popup = popup;

})();