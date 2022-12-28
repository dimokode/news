;(function(){

function pages(){}


function show(pageName){

    template.loadTemplateByName(pageName).then(async function(html){
        //console.log(html);
        
        $('#content').html(html);
        /*
        obj = {
            s_limit : $('#s_limit').val(),
        }
        let modelsHTML = await models.showModels(obj);
        
        $('#models').html(modelsHTML);
        */
        models.showModels(0);
    });
}

pages.show = show;
window.pages = pages;

})();