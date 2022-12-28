;(function(){

function models(){}

function show(){

    template.loadTemplateByName('models.html').then(async function(html){
        $('content').html(html);
        models.showModels(0);
    });
}




function isModelExist(chathost){
    const obj = {
        controller : 'Models',
        action : 'isModelExist',
        chathost : chathost
    }

    return common.sendAjax(obj).then(function(json){
        //console.log(json);
        if(json['success']){
            //return json['result'];
            return {
                isModelExist : json.result,
                data : json.data
            };
        }else{
            console.log(json['error']);
            return false;
        }
    })
}

function putModelInDB(chathost, data){
    const obj = {
        controller : 'Models',
        action : 'putModelInDB',
        chathost : chathost,
        data : data
    }

    return common.sendAjax(obj).then(function(json){
        console.log(json)
        if(json['success']){
            //console.log(json['lastInsertedId']);
            return true;
        }else{
            console.log(json['error']);
            return false;
        }
    })
}

function updateModelInDB(chathost, data){
    const obj = {
        controller : 'Models',
        action : 'updateModelInDB',
        chathost : chathost,
        data : data
    }

    return common.sendAjax(obj).then(function(json){
        if(json['success']){
            console.log(json)
            return true;
        }else{
            console.log(json['error']);
            return false;
        }
    })
}


async function showModels(start_position = 0){
    //start_position = $('#s_position').val();
    obj = {
        s_start : start_position,
        s_limit : $('#s_limit').val(),
        s_modelname : $('#s_modelname').val(),
    }
    let modelsHTML = await models.getModelsHtml(obj);
    $('#s_position').val(Number(obj.s_limit) + Number(obj.s_start));
    $('#models').html(modelsHTML);
}




function showModelsNext(){
    let start_position = $('#s_position').val();
    models.showModels(start_position);
}




async function getModelsHtml(sObj){
    let modelsArr = await getModels(sObj);
    let modelsHTML = '';
    if(modelsArr){
        //console.log(modelsArr);
        for(const model of modelsArr){
            //console.log(model.chathost);
            let modelThumbsObj = await getModelThumbs(model.chathost);
            console.log(modelThumbsObj);
            //continue

            let modelObj = {
                chathost : model.chathost,
                modelThumbs : modelThumbsObj['arrFiles'],
                path_to_model_folder : modelThumbsObj['path_to_model_folder'],
            }

            //console.log(modelObj);
            modelsHTML+= await models.generateModelPanel(modelObj);

        };
        return modelsHTML;
    }else{
        alert('showModels error');
    }
}

function getModels(sObj){
    console.log(sObj)
    const obj = {
        controller : 'Models',
        action : 'getModels',
        searchParams : sObj
    }

   return  common.sendAjax(obj).then(function(json){
        //console.log(json);
        if(json['success']){
            return json['models'];
        }else{
            return false;
        }
    });
}

function getModelThumbs(chathost){
    const obj = {
        controller : 'Models',
        action : 'getModelThumbs',
        chathost : chathost
    }

    return common.sendAjax(obj).then(function(json){
        //console.log(json);
        if(json){
            return json;
        }else{
            return false;
        }

    });
}


function generateModelPanel(modelObj){
    let modelCard = template.loadRawTemplateByName('modelCard.html');
    let modelThumb = template.loadRawTemplateByName('modelThumb.html');
    return Promise.all([modelCard, modelThumb]).then(async results => {
        //console.log(results[0]);
        const obj = {
            tpl : results[0],
            tags : {
                chathost : modelObj.chathost,
                thumbs : generateThumbs(results[1], modelObj),
            }
        }

        return template.generateByTemplate(obj);
    });
}

function generateThumbs(htmlTpl, modelObj){
    //console.log(modelThumbs);
    console.log(modelObj)
    let thumbsHTML = '';
    let modelThumbs = modelObj.modelThumbs;
    let path_to_model_folder = modelObj.path_to_model_folder;
    modelThumbs.sort((a, b) => {
        return a.timestamp - b.timestamp
    })
    //console.log(path_to_model_folder);
    for(let thumbImage of modelThumbs){
        //console.log(thumbImage);
        const obj = {
            tpl : htmlTpl,
            tags : {
                path_to_thumb : path_to_model_folder + "/" + thumbImage['filename'],
                thumb_url : path_to_model_folder + "/" + thumbImage['filename'],
                thumb_date : timestampConverter(thumbImage['timestamp']),
            }
        }

        thumbsHTML+=template.generateByTemplate(obj);
    }
    //return "Here will be thumb";
    return thumbsHTML;
}

models.show = show;
models.isModelExist = isModelExist;
models.putModelInDB = putModelInDB;
models.showModels = showModels;
models.getModels = getModels;
models.getModelThumbs = getModelThumbs;
models.generateModelPanel = generateModelPanel;
models.getModelsHtml = getModelsHtml;
models.showModelsNext = showModelsNext;
models.updateModelInDB = updateModelInDB;
window.models = models;

})();