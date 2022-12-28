;(function(){
    //form generator
    function fg(){}
    
    let rule = '';
    
    function generate(obj){
        //console.log(obj);
        //console.log(fg.rule);
        //console.log(JSON.stringify(obj));
        //let visible = obj['visible'];
        /*
        if(obj['visible'] !== undefined && obj['visible'][fg.rule] === undefined){
            return '';
        }
        */
        let temp = document.createElement('div');
        let elDiv = document.createElement('div');
    
        try {
            //elDiv.setAttribute('data-name', obj['attributes']['name']); 
            elDiv.setAttribute('div-name', obj['attributes']['name']);
        }catch(err){
            console.log('Error was catched:');
            console.log(obj);
        }
    
        if(obj['props'] !== undefined){
            for(let propName in obj['props']){
                elDiv.setAttribute(propName, obj['props'][propName]);
            }
        }
    
        
        let element = obj['element'];
        
        let el = document.createElement(element);
        //console.log(el);
        if(obj['attributes']['type'] == 'date'){
           // console.log(obj);
        }
        if(obj['attributes']['type'] == 'date' && obj['attributes']['value'] !== undefined && obj['attributes']['value'] != ''){
            obj['attributes']['value'] = obj['attributes']['value'].replace(/^(\d{2}).(\d{2}).(\d{4})$/, '$3-$2-$1');
        }
    
        if(obj['attributes']['type'] == 'checkbox' && (obj['attributes']['value'] === true || obj['attributes']['value'] === 1)){
            //obj['attributes']['checked'] = obj['attributes']['value'];
            obj['attributes']['checked'] = true;
            //obj['attributes']['value'] = null;
            //console.log(JSON.stringify(obj));
        }

        //DB attributes
        if(obj['db'] !== undefined){
            el.setAttribute( 'db', JSON.stringify(obj['db']) );
            /*
            for(let attr in obj['db']){
                el.setAttribute( attr, obj['db'][attr] );
            }
            */   
        }
    
        if(element == 'textarea' || element == 'button'){
            //console.log('TEXTAREA');
            //console.log(obj);
            el.innerHTML = (obj['attributes']['value']!==undefined) ? obj['attributes']['value'] : '';
            delete obj['attributes']['value'];
        }
    
        for(let attr in obj['attributes']){
            //console.log(attr + '=>' + obj['attributes'][attr]);
            el.setAttribute( attr, obj['attributes'][attr] );
        }
    
        if(obj['dependency'] !== undefined){
            el.setAttribute('dependency-field', obj['dependency']['field']);
            el.setAttribute('dependency-value', obj['dependency']['value']);
        }
    
        if(obj['options'] !== undefined){
            for(let optionNr in obj['options']){
                let elOption = document.createElement('option');
                for(let oAttr in obj['options'][optionNr]){
                    //console.log(oAttr + '=>' + obj['options'][optionNr][oAttr]);
                    if(oAttr == 'attributes'){
                        for(let dataAttr in obj['options'][optionNr]['attributes']){
                            elOption.setAttribute(dataAttr, obj['options'][optionNr]['attributes'][dataAttr]);
                        }
                    }else{
                        elOption[oAttr] = obj['options'][optionNr][oAttr];
                    }
                    
                    
                }
    
                el.append(elOption);
            }
        }
    
        //elDiv.append(generateLabel(obj['label']));
        /*
        let labelText = dict.get(obj['attributes']['name']);
        if(!labelText){
            labelText = obj['attributes']['name'];
        }
        elLabel = generateLabel(labelText);
        */
       
        //elLabel = generateLabel(obj['attributes']['name']);
        if(obj['attributes'] !== undefined){
            elLabel = generateLabel(obj['label']);    
        }else{
            elLabel = generateLabel(obj['attributes']['name']);
        }
        
    
        /*
        let linkEl = document.createElement('a');
        linkEl.setAttribute('href', 'javascript:void(0);');
        linkEl.innerHTML = "copy";
        elLabel.after(linkEl);
        */
        if(obj['attributes']['type'] == 'hidden'){
            elDiv.classList.add('hidden');
            //elLabel = generateLabel(obj['attributes']['id'], true);
        }
    //    elDiv.append(generateLabel(obj['attributes']['id']));
        elDiv.append(elLabel);
        elDiv.append(el);
        temp.append(elDiv);
        let html = temp.innerHTML;
        //console.log(html);
        //document.getElementById('container').append(elDiv);
        return html;
    
    }
    
    
    function generateLabel(labelText, hidden = false){
        if(labelText !== undefined){
            let elLabel = document.createElement('label');
            elLabel.textContent = labelText;
            if(hidden) elLabel.classList.add('hidden');
            //elDiv.append(elLabel);
            return elLabel;
        }
        return '';
    }
    
    function test(){
        alert('TESSSSSTSTSTTSTSTSTSTSTSTST');
    }

/*
    function generateSimpleForm(obj, type = 'html'){
        let html = '';
        const arrForm = getSimpleFormArray(obj);
        console.log(arrForm);
        if(type == 'html'){
            arrForm.forEach( item => {
                html+= item.outerHTML;
            });
            return html;
        }

    }

    function getSimpleFormArray(obj){
        const {fields, submit} = obj;
        const arrForm = [];
        for(let field in fields){
            //console.log(field);
            arrForm.push(generateInput(field, fields[field]));
        }
        return arrForm;
    }


    function generateInput(name, value){
        const label = document.createElement('label');
        label.setAttribute('for', name);
        label.innerHTML = name;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.name = name;
        input.setAttribute('value', value);
        input.setAttribute('size', (value.length == 0) ? 2 : value.length);

        const div = document.createElement('div');
        div.append(label);
        div.append(input);
        return div;

    }
*/

    fg.generate = generate;
    fg.rule = rule;
    fg.test = test;
    //fg.generateSimpleForm = generateSimpleForm;
    window.fg = fg;
    })();