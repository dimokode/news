;(function(){

function globo(){}

const gstor = {};

function set(name, value){
    gstor[name] = value;
}

function get(name){
    return gstor[name];
}

globo.set = set;
globo.get = get;

window.globo = globo;
})();