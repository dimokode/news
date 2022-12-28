class Tableto {
 
    constructor(obj = {}){

        //console.log(obj);
        
        if(isObjectEmpty(obj)){
            console.log('constructor is empty');
            return;
        }
        //this.objStructure = obj.structure;//obj
        this.uniqueFieldId = false;
        this.objData = obj.data;//array of objects
        this.objConfig = (obj.config !== undefined) ? obj.config : {};
        let objHeader = {},
            objBody = {};

        for(let id in obj.structure){
            objHeader[id] = obj.structure[id]['header'];
            if(obj.structure[id]['header'].attributes !== undefined && obj.structure[id]['header'].attributes.unique !== undefined){
                if(!this.uniqueFieldId){
                    this.uniqueFieldId = id
                }else{
                    //console.log('[WARNING] Check table structure! There are more than one unique field!')
                    throw new Error('[WARNING] Check table structure! There are more than one unique field!')
                }
            }
            objBody[id] = (obj.structure[id]['body'] !== undefined) ? obj.structure[id]['body'] : {};
        }

        if(!this.uniqueFieldId){
            throw new Error('[WARNING] Check table structure! There are no unique field found!')
        }

        this.objHeader = objHeader;
        this.objBody = objBody;
        
        this.tag = (this.objConfig['tag'] !== undefined) ? this.objConfig['tag'] : 'div';
            
        //console.log(this.objHeader);
        //console.log(this.objBody);
    }

    generateTable(){
        return `<div class="table">`+this.generateHeader()+this.generateBody()+`</div>`;
        //return `<div class="table">`+this.generateHeader()+`</div>`;
        
    }

    generateHeader(){
        let html = '';
        this.rowTemplate = ``;
        let uniqueElId = '';

        for(let elId in this.objHeader){
            let htmlAttributes = '';
            let htmlAttributesBody = '';
            if(this.objHeader[elId]['attributes'] !== undefined){
                for(let attr in this.objHeader[elId]['attributes']){
                    htmlAttributes+= attr + `="${this.objHeader[elId]['attributes'][attr]}"`;
                    //if(this.objHeader[elId]['attributes']['unique'] !== undefined){
                    //    uniqueElId = elId;
                    //}
                }
            }
            if(this.objBody[elId]['attributes'] !== undefined){
                for(let attr in this.objBody[elId]['attributes']){
                    htmlAttributesBody+= attr + `="${this.objBody[elId]['attributes'][attr]}"`;

                }
            }
            this.rowTemplate+=`<${this.tag} name="${elId}" ${htmlAttributesBody}>{%${elId}%}</${this.tag}>`;
            //<div class="td" type="checkbox"><input type="checkbox" name="cb_{%${trUniqueId}%}"></div>
            //console.log(tableColumn);
            html+=`<div class="th" name="th-${elId}" ${htmlAttributes}>${this.objHeader[elId]['label']}</div>`;
        }
        this.rowTemplate = `<div class="td" type="checkbox"><input type="checkbox" name="cb_{%${this.uniqueFieldId}%}"></div>` + this.rowTemplate;
        this.rowTemplate = `<div class="tr" name="tr_{%${this.uniqueFieldId}%}">${this.rowTemplate}</div>`;
        
        let template = document.createElement('template');
        template.id = "template_row";
        template.innerHTML = this.rowTemplate;
        document.body.append(template);

        //adding checkbox cell
        html = `<div class="th"><input type="checkbox" onchange="Tableto.checkAll(this)"></div>` + html;
        return `<div class="tr">${html}</div>`;
    }



    generateBody(){
        //console.log(this.rowTemplate);
        console.log('objBody', this.objBody);
        console.log('objData', this.objData);
        console.log('objHeader', this.objHeader)
        //return 'body';
        let html = '';
        for(let objRow of this.objData){
            //console.log(tableColumn);
            
            let htmlTd = '',
                htmlTr = this.rowTemplate,
                trUniqueId = '';
 
            //console.log('htmlTr', htmlTr)
            htmlTr = htmlTr.replace(/(\{%(.*?)%\})/gi, (match, p1, elId) => {
                //console.log('elId', elId)
                if(this.objBody[elId].attributes !== undefined){
                    if(this.objBody[elId].attributes.type !== undefined) {
                        if(this.objBody[elId].attributes.type == 'boolean'){
                            return this.convertBooleanToText(objRow[elId])
                        }else if(this.objBody[elId].attributes.type == 'datetime'){
                            return timestampConverter(objRow[elId])
                        }else{
                            return objRow[elId];
                        }
                    }else{
                        return objRow[elId];
                    }
                }else{
                    return objRow[elId];
                }

            });
            html+=htmlTr;
        }

        return html;
    }

    convertBooleanToText(str){
        if(str == 'true' || str == '1'){
            return "on";
        }else{
            return "off";
        }
    }

    updateRow(rowId, formData){
        console.log(formData);
        let tableRow = document.querySelector('.tr[name=tr_'+rowId+']');
        //tableRow.classList.add('selected-row');
        for(let elId in formData){
            if(tableRow.querySelector('[name='+elId+']') !== null){
                console.log(tableRow.querySelector('[name='+elId+']').getAttribute('type'));
                if(tableRow.querySelector('[name='+elId+']').getAttribute('type') !== null && tableRow.querySelector('[name='+elId+']').getAttribute('type') == 'boolean'){
                    tableRow.querySelector('[name='+elId+']').innerHTML = this.convertBooleanToText(formData[elId]['value']);
                }else{
                    tableRow.querySelector('[name='+elId+']').innerHTML = formData[elId]['value'];
                }
                
            }
        }
    }

//static methods
static checkAll(cbEl) {
    console.log(cbEl.checked);

    //let checkboxes  = document.querySelectorAll('div[type="checkbox"]>input[type="checkbox"]');
    //console.log(checkboxes);
    //return
    document.querySelectorAll('div[type="checkbox"]>input[type="checkbox"]').forEach((el) => {
        if(cbEl.checked){
            //el.setAttribute('checked', 'checked');
            el.checked = true;
        }else{
            //el.removeAttribute('checked');
            //el.setAttribute('checked', false);
            el.checked = false;
        }
        
    });
}


}