;(function(){

const dic = {
'item_qty': 'Количество'
};

function dict(){}

function get(str){
    return (dic[str] !== undefined) ? dic[str] : false;
}

dict.get = get;
window.dict = dict;

})();