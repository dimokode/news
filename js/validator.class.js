class Validator{

    constructor(str){
        this.str = str;
    }

    isLength(min=0,max=null){
        //console.log(this.str);
        console.log('isLength');
        console.log('min:' + min + ' , max:' + max);
        if(max == null){
            if(this.str.length != min){
                return `The string length should be ${min}`;
            }

        }else{
            if(this.str.length<min || this.str.length>max){
                return `The string length should be within ${min} to ${max}`;
            }
        }
        return true;
        //return this.str.length + min + max;
    }

    isNumber(){

    }

    isInteger(){
        console.log('isInteger');
        if(Number.isInteger(this.str*1) === false){
            return `The type of string should be integer`;
        }
        return true;
    }

    isEmail(){
        console.log('isEmail');
        const result = /^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/i.test(this.str);
        if(result){
            return true;
        }else{
            return `Формат e-Mail указан неверно`;
        }
    }

    isNotEmpty(){
        console.log('isNotEmpty');
        if(this.str.length>0){
            return true;
        }else{
            return 'This field is required';
        }
    }

    isSelected(){
        console.log('isSelected: ' + this.str);
        if(this.str != 'null'){
            return true;
        }else{
            return 'Select from list';
        }
    }
}