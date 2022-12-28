function toggleElement(elSelector, elTrigger){
    //console.log(elTrigger);
   // let elContent = elTrigger.innerHTML;
 //   console.log(elContent);
    if($(elSelector).css('display') == 'none'){
        $(elSelector).css('display', 'block');
        elTrigger.innerHTML = "-";
    }else{
        $(elSelector).css('display', 'none');
        elTrigger.innerHTML = "+";
    }
}