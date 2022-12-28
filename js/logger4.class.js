class Logger4 {

    constructor(ident, loggerElement){
        this.loggerElement = loggerElement
        this.ident = 'logger_'+cyrb53(ident);
        const div = document.createElement('div');
        div.id = this.ident;
        div.classList.add('logger_element');
        this.loggerElement.append(div);//prepend
    }

    log(str, ident = null, type = 'success'){
        if(ident == null){
            //const ident = 'lid_'+Date.now()+'_'+Math.floor(Math.random()*100);
            const ident = 'lid_'+Date.now()+'_'+cyrb53(str);
            const el = document.querySelector('#'+this.ident);
            const div = document.createElement('div');
            div.id = ident;
            div.innerHTML = str;
            el.appendChild(div);
            return ident;
        }else{
            let msgClass = '';
            if(type == 'success'){
                msgClass = 'w3-pale-green margin';
            }else{
                msgClass = 'w3-pale-red margin';
            }
            document.getElementById(ident).innerHTML+= '<span class="'+msgClass+'">' + str + '</span>';
            return;
        }
    }

    replace(str, ident){
        if(ident !== undefined){
            document.getElementById(ident).innerHTML = str;
            return;
        }
    }


    error(str, ident = null){
        if(ident == null){
            //const ident = 'lid_'+Date.now()+'_'+Math.floor(Math.random()*100);
            const ident = 'lid_'+Date.now()+'_'+cyrb53(str);
            const el = document.querySelector('#'+this.ident);
            const div = document.createElement('div');
            div.id = ident;
            div.innerHTML = str;
            div.classList.add('w3-red');
            el.appendChild(div);
            return ident;
        }else{
            document.getElementById(ident).innerHTML+= '<span class="w3-red">' + str + '</span>';
            return;
        }
    }



}