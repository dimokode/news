class Popup{
    constructor(id = Date.now()){
        this.id = 'popup_'+id;
        let html = 
`
<button class="w3-button" style="float:right;" onclick="Popup.hide(this);">X</button>
<popup-content></popup-content>
`
        let popup = document.createElement('popup');
        popup.id = this.id;
        popup.classList.add('popup');
        popup.insertAdjacentHTML('beforeend', html);
        document.body.append(popup);
    }

    getPopupId() {
        return this.id;
    }

    static hide(el){
        el.parentElement.remove();
    }

    addContent(html, insertTag = undefined){
        if(insertTag == undefined){
            document.querySelector(`popup#${this.id}>popup-content`).insertAdjacentHTML('beforeend', html);
        }else{
            document.querySelector(`popup#${this.id}>popup-content ${insertTag}`).innerHTML = html;
        }
    }

    getPopupElement(){
        return document.querySelector('popup#'+this.id);
    }


}