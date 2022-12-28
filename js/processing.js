;(function(){

function processing(){}

/*
function proc1(){
    console.log('proce1')
    common.sendAjax({
        controller : 'parser',
        action : 'getContentFromFile',
        foldername : '!temp',
        filename : 'chatHTML@00themaster.txt'
    }).then(response => {
        //console.log(response)
        if(response.success){
            let cont = response.content
            //console.log(cont)
            let contObj = parser.convertHTMLToObject(cont)
            //console.log(contObj)
            let htmlObj = parser.clearHTML(contObj)
            console.log(htmlObj)
            let html = parser.convertObjectToHTML(htmlObj)
            //console.log(html)
            //console.log(html.length)

            
            parser.saveContentToFile({
                foldername : '!temp',
                filename : 'aaa.txt',
                content : html
            }).then(response => {
                console.log(response)
            })
            
        }else{
            console.log(response.error)
        }
    })
}
*/


function proc1(){
    console.log('proce1')
    common.sendAjax({
        controller : 'parser',
        action : 'getContentFromFile',
        foldername : '!temp',
        filename : 'profileHTML@00themaster.txt'
    }).then(response => {
        //console.log(response)
        if(response.success){
            let cont = response.content
            //console.log(cont)
            let contObj = parser.convertHTMLToObject(cont)
            console.log(contObj)
            let htmlObj = clearProfileHTML(contObj)
            console.log(htmlObj)
            let html = parser.convertObjectToHTML(htmlObj)
            console.log(html)
            console.log(html.length)

            
            parser.saveContentToFile({
                foldername : '!temp',
                filename : 'aaa.txt',
                content : html
            }).then(response => {
                console.log(response)
            })
            
        }else{
            console.log(response.error)
        }
    })
}


function proc2(contentType){
    common.sendAjax({
        controller : 'parser',
        action : 'getFoldersListInFolder',
    }).then(async response => {
        //console.log(response)
        if(response.success){
            let arrFolderList = response.arrList;
            let al = arrFolderList.length;
            //let al = 1;
            console.log(arrFolderList)
            const pb = new Progressbar('pb', 0, al);
            document.querySelector('pb').innerHTML = pb.getProgressBar();
            //pb.updateProgress(33);
            for(let i=0; i<al; i++){
                pb.updateProgress(i+1)
                //console.log(arrFolderList[i]);
                const foldername = arrFolderList[i]['foldername'];
                const arrFiles = await parser.getFilesInFolder(foldername);
                if(arrFiles){
                    //console.log(arrFiles);
                    arrFiles.forEach(async fileObj=>{
                        const filename = fileObj.filename;
                        
                        //if(filename.indexOf('chatHTML')!=-1){
                        if(filename.indexOf(contentType)!=-1){
                            //console.log(filename);
                            const funcName = contentType+'Minimizer';
                            //console.log('funcName', funcName)
                            //console.log(window.processing[funcName])
                            
                            const response = await window.processing[funcName](foldername, filename);
                            //console.log(response)
                            console.log(foldername, filename, response)

                        }
                    })
                }


            }
        }else{
            console.log(response.error)
        }
    })
}


function chatHTMLMinimizer(foldername, filename){
    return common.sendAjax({
        controller : 'parser',
        action : 'getContentFromFile',
        foldername : foldername,
        filename : filename
    }).then(response => {
        //console.log(response)
        if(response.success){
            let cont = response.content
            //console.log(cont)
            let contObj = parser.convertHTMLToObject(cont)
            //console.log(contObj)
            let htmlObj = clearChatHTML(contObj)
            //console.log(htmlObj)
            let html = parser.convertObjectToHTML(htmlObj)
            //console.log(html)
            //console.log(html.length)

            
            return parser.saveContentToFile({
                foldername : foldername,
                filename : filename,
                content : html
            }).then(response => {
                //console.log(response)
                return response
            })
            
        }else{
            console.log(response.error)
            return false
        }
    })

}


function profileHTMLMinimizer(foldername, filename){
    return common.sendAjax({
        controller : 'parser',
        action : 'getContentFromFile',
        foldername : foldername,
        filename : filename
    }).then(response => {
        //console.log(response)
        if(response.success){
            let cont = response.content
            let oldLength = cont.length
            cont = cont.replaceAll(/<!--(.*?)-->/gm, '')
            let newLength = cont.length
            //console.log(cont)
            let contObj = parser.convertHTMLToObject(cont)
            //console.log(contObj)
            let htmlObj = clearProfileHTML(contObj)
            if(!htmlObj && oldLength==newLength){
                return "File wasn't changed!"
            }
            
            if(!htmlObj){
                htmlObj = contObj
            }

            //console.log(htmlObj)
            let html = parser.convertObjectToHTML(htmlObj)
            //console.log(html)
            //console.log(html.length)

            
            return parser.saveContentToFile({
                foldername : foldername,
                filename : filename,
                content : html
            }).then(response => {
                //console.log(response)
                return response
            })
            
        }else{
            console.log(response.error)
            return false
        }
    })

}


function clearChatHTML(contObj){
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


function clearProfileHTML(contObj){
    contObj = contObj.querySelector('.main_wrapper>.wrapper')
    if(contObj == null) return
    //console.log(contObj)
    //let headHTML = $(contObj).find('head')
    //contObj.querySelector('head').remove()
    contObj.querySelectorAll('svg,script,style').forEach(item=>{
        item.remove()
    })


    //console.log(svg)
    //console.log(contObj)
    return contObj
}

processing.proc1 = proc1;
processing.proc2 = proc2;
processing.clearProfileHTML = clearProfileHTML;
processing.clearChatHTML = clearChatHTML;
processing.chatHTMLMinimizer = chatHTMLMinimizer;
processing.profileHTMLMinimizer = profileHTMLMinimizer;
window.processing = processing;

})();