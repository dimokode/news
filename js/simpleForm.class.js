class SimpleForm {

    constructor({fields, submit}, type = 'html'){
        this.fields = fields;
        this.submit = submit;
        this.type = type;
    }

    generateSimpleForm(){
        let html = '';
        const arrForm = this.getSimpleFormArray(this.obj);
        console.log(arrForm);
        const submit = this.generateSubmit();
        if(this.type == 'html'){
            arrForm.forEach( item => {
                html+= item.outerHTML;
            });
            return `<form id="${this.submit['formId']}" onsubmit="return false;">${html}${submit.outerHTML}</form>`;
        }

    }

    generateSubmit(){
        const button = document.createElement('button');
        button.className = this.submit['class'];
        button.innerHTML = this.submit['label'];
        button.setAttribute('onclick', this.submit['onclick']);

        const div = document.createElement('div');
        div.append(button);
        return div;
    }

    getSimpleFormArray(){
        //const {fields, submit} = obj;
        const arrForm = [];
        for(let field in this.fields){
            //console.log(field);
            arrForm.push(this.generateInput(field, this.fields[field]));
        }
        return arrForm;
    }


    generateInput(name, value){
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

    static getFormData(formId){
        const form = document.querySelector('form#'+formId);
        const objFormData = {}
        form.querySelectorAll('input, select').forEach( input => {
            //console.log(input);
            objFormData[input.getAttribute('name')] = input.value;
        })
        return objFormData;
    }
}