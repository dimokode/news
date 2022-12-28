;(function(){

function parser(){}

function getContentByURL(url){
    const obj = {
        controller: 'Parser',
        action: 'getContentByURL',
        url: url
    }

    return common.sendAjax(obj).then(function(json){
        if(json['success']){     
            return json['content'];
        }else{
            //console.log(json['error']);
            note('error', json['error']);
            return false;
        }
    });
}


function getContentFromFile(filename, foldername = 'source'){
    const obj = {
        controller: 'Parser',
        action: 'getContentFromFile',
        foldername,
        filename: filename
    }

    return common.sendAjax(obj).then(function(json){
        if(json['success']){     
            return json['content'];
        }else{
            //console.log(json['error']);
            note('warning', json['error']);
            return false;
        }
    });
}


function saveContentToFile(obj){
    //logger.log('Save content to file: ' + obj['filename']);
    obj['controller'] = 'Parser';
    obj['action'] = 'saveContentToFile';

    return common.sendAjax(obj).then(function(json){
        //console.log(json);
        if(json['success']){
            note('success', json.msg);
            return true;
        }else{
            note('error', json.error);
            return false;
        }
    });

}

/*
async function saveFileByURL(obj){
    //logger.log('Save file from URL: ' + obj['url']);
    if(await parser.isFileExist(obj.foldername, obj.filename)){
        return {
            success : true,
            msg : `File ${obj.filename} already exist and will be not saved!`
        }
    }

    obj['controller'] = 'Parser';
    obj['action'] = 'saveFileByURL';

    return common.sendAjax(obj).then(function(response){
        return response
    });
}
*/


function saveFileByURL(obj){
    return new Promise((resolve, reject) => {
        return parser.isFileExist(obj.foldername, obj.filename).then( response => {
            if(response){
                resolve({
                    success : true,
                    msg : `File ${obj.filename} already exist and will be not saved!`
                })
            }else{
                obj['controller'] = 'Parser';
                obj['action'] = 'saveFileByURL';
            
                return common.sendAjax(obj).then(function(response){
                    resolve(response)
                });
            }
        })
    })
}


function getBlockContentBySelector(cont, selector){
    //console.log($(cont).find(selector));
    return $(cont).find(selector);
}


function getBlocksContentBySelector(cont, selector, outerHTML = false){
    //console.log('cont', cont);
    //console.log('selector', selector);
    let arr = [];
    $(cont).find(selector).each(function(){
        if(outerHTML){
            arr.push($(this)[0].outerHTML);
        }else{
            arr.push($(this).html());
        }
        
    });
    return arr;
}

function getBlocksBySelector(cont, selector, attr = null){
    let arr = [];
    $(cont).find(selector).each(function(){
        if(attr != null){
            arr.push($(this)[0].getAttribute(attr));    
        }else{
            arr.push($(this)[0]);
        }
        
    });
    return arr;
}

function convertHTMLToObject(html){
    //return new DOMParser().parseFromString(html, "text/html").documentElement;
    return new DOMParser().parseFromString(html, "text/html").querySelector('html');
}

function convertObjectToHTML(domObj){
    return domObj.outerHTML;
    //console.log(domObj)
    //return
    let tmp = document.createElement('div');
    tmp.appendChild(domObj);
    return tmp.innerHTML;
}

function isFileExist(chathost, filename){
    const obj = {
        controller : 'Models',
        action : 'isFileExist',
        folder : chathost,
        filename : filename
    }

    return common.sendAjax(obj).then(function(json){
        if(json['success']){
            return json['isFileExist'];
        }else{
            console.log(json['error']);
            return false;
        }
    });
}

function clearHTML(contObj){
    contObj = contObj.querySelector('#profile-part')
    //let headHTML = $(contObj).find('head')
    //contObj.querySelector('head').remove()
    contObj.querySelectorAll('svg,script').forEach(item=>{
        item.remove()
    })
    //console.log(svg)
    //console.log(contObj)
    return contObj
}

function getFilesInFolder(foldername){
    return common.sendAjax({
        controller : 'parser',
        action : 'getFilesInFolder',
        foldername : foldername,
        options : {
            'fileExtension' : 'txt',
        }
    }).then(response => {
        if(response.success){
            return response.arrFiles
        }else{
            console.log(response.error)
            return false
        }
    })
}


parser.getContentByURL = getContentByURL;
parser.getContentFromFile = getContentFromFile;
parser.isFileExist = isFileExist;
parser.saveContentToFile = saveContentToFile;
parser.saveFileByURL = saveFileByURL;
parser.getBlockContentBySelector = getBlockContentBySelector;
parser.getBlocksBySelector = getBlocksBySelector;
parser.getBlocksContentBySelector = getBlocksContentBySelector;
parser.convertHTMLToObject = convertHTMLToObject;
parser.convertObjectToHTML = convertObjectToHTML;
parser.clearHTML = clearHTML;
parser.getFilesInFolder = getFilesInFolder;
window.parser = parser;

})();