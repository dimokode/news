;(function(){

function tasks(){}

function show(){
    console.log('show');
    template.loadTemplateByName('tasks.html').then( async html => {
        $('content').html(html);
        const htmlTasks = await _buildTaskSelectionBlock();
        $('tasks').html(htmlTasks);
    })
}


async function _buildTaskSelectionBlock(){
    const arrTasks = await tasks.getTasks();
    let html = '';
    console.log(arrTasks);

    if(arrTasks.length > 0){
        //console.log(files);
        html = template.generateList({
            tpl : `
            <div class="w3-padding-small">
                <input type="checkbox" name="cb" value="{%filename%}">
                <button class="w3-button w3-grey" onclick="tasks.openTaskConfig('{%filename%}');">Edit</button>
                <button class="w3-button w3-grey" onclick="tasks.testTask('{%filename%}');">Test</button>
                <button class="w3-button w3-green" onclick="tasks.doTask('{%filename%}');">Do</button>
                {%filename%}
            </div>
            `,
            data : arrTasks
        });
    }else{
        html = 'Empty';
    }
    return html;
}




function getTasks(){
    return common.sendAjax({
        controller : 'tasks',
        action : 'getTaskFileList'
    }).then( response => {
        if(response.success){
            return response.arrFiles;
        }
        note('error', response.error);
    });
}



async function openTaskConfig(filename){
    try{
        const objTask = await getTaskByFilename(filename);
    
        const id = cyrb53(filename);
        const formId = 'form_'+ id;
        //console.log('formId', formId);
        const objForm = {
            fields : objTask,
            submit : {
                formId: formId,
                label: 'Save',
                class: 'w3-button w3-green',
                onclick : `tasks.saveTask('${formId}', '${filename}')`
            }
        }
        const sf = new SimpleForm(objForm);
        const html = sf.generateSimpleForm();
        //console.log(html);
        const popup = new Popup(id);
        popup.addContent(html);
    
    }catch(e){
        note('error', e.message);
        console.log(e);
    }

}



async function doTask(filename){
    console.log('testTask');
    const objTaskConfigData = await getTaskByFilename(filename);
    console.log('objTaskConfigData', objTaskConfigData);
    jobber.doJob(objTaskConfigData, false).then( response => {
        console.log(response);
    });   
}


async function testTask(filename){
    console.log('testTask');
    const objTaskConfigData = await getTaskByFilename(filename);
    jobber.doJob(objTaskConfigData).then( response => {
        console.log(response);
    });   
}



function getTaskByFilename(filename){
    if(filename === undefined) throw new Error("No task filename was selected")
    const obj = {
        controller : 'tasks',
        action : 'getTaskByFilename',
        filename : filename //task filename
    }

    return common.sendAjax(obj).then( response => {
        //return response
        
        //console.log(response.content)
        if(response.success){
            return JSON.parse(response.content);
        }else{
            //console.log(response.error)
            throw new Error(response.error);
        }
    })
}





function getTaskConfig(taskId){
    if(taskId === undefined) throw new Error("No taskId was selected")
    const obj = {
        controller : 'tasks',
        action : 'getTaskByFilename',
        taskId : taskId //task filename
    }

    return common.sendAjax(obj).then( response => {
        //return response
        
        //console.log(response.content)
        if(response.success){
            return response.content
        }else{
            //console.log(response.error)
            throw new Error(response.error)
            return false
        }
    })
}





function openTask(taskId){
    console.log('taskId', taskId)
    const promiseGetTask = new Promise((resolve, reject)=>{
        tasks.getTask(taskId).then((taskContent)=>{
            if(!taskContent){
                reject()
            }else{
                //console.log('resolve')
                resolve(taskContent)
            }
        })

    
    })

    promiseGetTask.then((response)=>{
        const taskContent = response
        import('/config/forms/form.js?'+Date.now()).then( (module) => {
            let formObj = module.obj,
                html = '';
    
            for(let el in formObj){
                html+= fg.generate(formObj[el]);
            }  
            html = `<form onsubmit="return false;">${html}</form>`;
    
            popup.createPopup('popup');
            const promiseTemplate = template.loadRawTemplateByName('popup.html').then((htmlPopupTemplate) => {
                popup.insertHTMLTemplate('popup', htmlPopupTemplate);
                //console.log('formHtml', html)
                popup.insertHTMLByTag('popup', 'content', html);
                return true;
            });

            promiseTemplate.then((response)=>{
                console.log('response', response)
            })
        })
    }).catch((e) => {
        //console.log(e)
    })

}



function saveTask(formId, filename){
    const formData = SimpleForm.getFormData(formId);
    console.log('formData', formData);
    
    if(saveTaskToFile(filename, formData)){
        document.querySelector('popup#popup_' + cyrb53(filename)).remove();
    }

}


function saveTaskToFile(filename, objData = {}){
    //console.log(filename);
    //const filename = fileBasename+'.json';

    
    if(isObjectEmpty(objData)){
        objData = {
            url: '',
            fileBasename,
            parserFilename : ''
        }
    }

    return  common.sendAjax({
                controller: 'tasks',
                action: 'saveTaskConfigToFile',
                filename,
                data: JSON.stringify(objData, null, 4)
            }).then( response => {
                console.log(response);
                if(response.success){
                    note('success', 'File was successfully saved!');
                    return true;
                }else{
                    note('error', response.error);
                    return;
                }
                
            });
}


function getTaskFromFile(filename){
    const obj = {
        controller: 'tasks',
        action: 'getTask',
        filename: filename
    }

    return common.sendAjax(obj).then(function(response){
        if(response['success']){     
            return response['content'];
        }else{
            //console.log(json['error']);
            note('error', response.error);
            return false;
        }
    });
}



//tasks.showTasks = showTasks;
tasks.saveTask = saveTask;
tasks.getTaskByFilename = getTaskByFilename;
tasks.getTaskConfig = getTaskConfig;
tasks.getTasks = getTasks;
tasks.openTask = openTask;
tasks.getTaskFromFile = getTaskFromFile;
tasks.openTaskConfig = openTaskConfig;
tasks.saveTaskToFile = saveTaskToFile;
tasks.testTask = testTask;
tasks.doTask = doTask;
tasks.show = show;
window.tasks = tasks;

})();