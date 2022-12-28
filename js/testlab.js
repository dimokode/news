;(function(){

function testlab(){}


async function show(){
    template.loadTemplateByName('testlab.html').then( async html => {
        
        $('content').html(html);
        $('files').html(await _buildContentFileList());
         
    });
}



function saveConfigFile(fileBasename, obj = {}){
    //console.log(filename);
    const filename = fileBasename+'.json';
    /*
    const fileExt = getFileExtension(filename);
    if(fileExt == ''){
        filename+='.json';
    }else{
        filename = filename.replace('.'+fileExt, '.json');
    }
    */
    
    if(isObjectEmpty(obj)){
        obj = {
            url: '',
            fileBasename,
            parserFilename : ''
        }
    }

    return common.sendAjax({
        controller: 'testlab',
        action: 'saveConfigFile',
        filename,
        data: JSON.stringify(obj, null, 4)
    }).then( response => {
        console.log(response);
        note('success', 'File was successfully saved!');
        return response;
    });
}


function btnSaveConfigFile(filename, formId, popupId){
     
    const formData = SimpleForm.getFormData(formId);
    //console.log(filename, 'formData', formData);

    saveConfigFile(filename, formData).then( response => {
        if(response){
            document.querySelector('popup#'+popupId).remove();
        }
    })

}

async function editConfigFile(fileBasename){

    const popup = new Popup();

    const objTask = JSON.parse(await _getContentFromFile(fileBasename+'.json'));
    //const objTask = JSON.parse(await tasks.getTaskFromFile(fileBasename+'.json'));
    //console.log('objTask', objTask);
    const formId = 'task_'+cyrb53(fileBasename);
    console.log('formId', formId);
    const objForm = {
        fields : objTask,
        submit : {
            formId: formId,
            label: 'Save',
            class: 'w3-button w3-green',
            onclick : `testlab.btnSaveConfigFile('${fileBasename}', '${formId}', '${popup.id}')`
        }
    }
    const sf = new SimpleForm(objForm);
    const html = sf.generateSimpleForm();

   
    popup.addContent(html);
    //console.log(html);
    //$('taskConfig').html(html);

}


async function getContent(fileBasename){
    const objTask = JSON.parse(await _getContentFromFile(fileBasename+'.json'));
    console.log(objTask);
    getContentByUrl(objTask.url);

}


function _getContentFromFile(filename){
        const obj = {
            controller: 'testlab',
            action: 'getContentFromFile',
            filename: filename
        }
    
        return common.sendAjax(obj).then(function(json){
            if(json['success']){     
                return json['content'];
            }else{
                //console.log(json['error']);
                note('error', json.error);
                return false;
            }
        });
}



async function _buildContentFileList(){
    const arrFiles = await _getContentFileList();
    console.log('arrFiles', arrFiles);

    const objFiles = {}
    arrFiles.forEach(fileObj => {
        //console.log(fileObj.filename);
        console.log(fileObj['filename'].split('.')[0]);
        const fileBasename = fileObj['filename'].split('.')[0];
        if(!objFiles[fileBasename]){
            objFiles[fileBasename] = new Set();
        }
        objFiles[fileBasename].add(fileObj['extension']);
        //objFiles[fileObj['filename'].split('.')[0]].push(fileObj['extension']);
    });


    //console.log(objFiles, objFiles.length());
    
    let html = '';

    if(!isObjectEmpty(objFiles)){
        for(let fileBasename in objFiles){
            console.log(fileBasename);
            html+= `
            <div class="w3-padding-small">
                <input type="checkbox" name="cb" value="${fileBasename}">
                `;
            if(!objFiles[fileBasename].has('json')){
                html+= `
                    <button class="w3-button w3-grey" onclick="testlab.saveConfigFile('${fileBasename}');">Init</button>
                `;
            }

            html+= `
                <button class="w3-button w3-grey" onclick="testlab.editConfigFile('${fileBasename}');">Edit</button>
            `;

            if(objFiles[fileBasename].has('html')){
                html+=`
                    <button class="w3-button w3-grey" onclick="testlab.getContent('${fileBasename}')">Get Content</button>
                    <button class="w3-button w3-grey" onclick="openLink('/testlab/${fileBasename}.html');">Open</button>
                    <button class="w3-button w3-grey" onclick="testlab.openEditor('${fileBasename}.html');">Open Editor</button>
                    <button class="w3-button w3-blue" onclick="testlab.testParser('${fileBasename}');">Test</button>
                `;
            }
            html+= `
                ${fileBasename}
            </div>
            `
        }
    }else{
        html = 'Empty';
    }





/*
    if(arrFiles.length > 0){
        //console.log(files);
        html = template.generateList({
            tpl : `
            <div class="w3-padding-small">
                <input type="checkbox" name="cb" value="{%filename%}">
                <button class="w3-button w3-grey" onclick="testlab.saveConfigFile('{%filename%}');">Init</button>
                <button class="w3-button w3-grey" onclick="testlab.editConfigFile('{%filename%}');">Edit</button>
                <button class="w3-button w3-grey" onclick="openLink('/data/testlab/{%filename%}');">Open</button>
                {%filename%}
            </div>
            `,
            data : arrFiles
        });
    }else{
        html = 'Empty';
    }
*/
    //console.log(html);

    return html;
}


function openEditor(filename){
    console.log(filename);

}









async function testParser(fileBasename){
    try{
        const objTask = JSON.parse(await _getContentFromFile(fileBasename+'.json'));
        console.log(objTask.parserFilename);
        if(objTask.parserFilename == ''){
            throw new Error('Parser filename is undefined in config file');
        }
        //const parser2 = new(await import('/parsers/'+objTask.parserFilename+'?'+Date.now())).default();
        const parserClass = (await import('/parsers/'+objTask.parserFilename+'?'+Date.now())).default;
        
        const popup = new Popup();
        popup.addContent(`<h1>${fileBasename}</h1>`);
        popup.addContent(`<div id="logger"></div>`);

        const logger = new Logger4('testParser', document.querySelector('#logger'));
        popup.addContent('<job-progress></job-progress><job-tasks></job-tasks>');

        const job = new Job({
                containerSelector : 'job-progress',
        });

        job.tagContent('jobStatus', 'In process...');
        job.start();
        job.tagContent('jobStartTimestamp', Date.now());

        job.initJob(1);

        const arrTasks = [];
        arrTasks.push( new Task({
            url : fileBasename+'.html',
            containerSelector : 'job-tasks',
            prependHtml : `<input type="button" class="w3-button w3-grey" shown="true" onclick="job.showHideTaskLog(this, '{%taskId%}')" value="Show/Hide">`
            })
        );


        //TASKS PROCESSING
        let arrTasksPromses = [];
        let jobSuccess = true;
        for(let task of arrTasks){
            
            //let taskResult = doTask(task, job, parserClass);

                const response = await doTask(task, job, parserClass)
                
                .then(taskResult => {
                    console.log('taskResult', taskResult);  
                    return taskResult;
                }).catch( err => {
                    console.log(typeof err);
                    console.error('doTask catch', err);
                    //Promise.reject();
                    //reject();
                    //throw new Error('aaa');
                    return false;
                });

                console.log('response', response);

                if(!response){
                    jobSuccess = false;
                    break;
                }

            //console.log('for');
            //console.log('taskResult', taskResult);
               
            
        }

        if(!jobSuccess){
            job.tagContent('jobStatus', 'Job has been stopped...');
        }else{
            job.tagContent('jobStatus', 'Done!')
            job.tagContent('jobendtimestamp', Date.now())
            job.tagContent('jobDuration', job.end())

        }


        //console.log('arrTasksPromses', arrTasksPromses);await

        //JOB END
        /*
        Promise.all(arrTasksPromses).then(()=> {
            console.log('Promise all');
            job.tagContent('jobStatus', 'Done!')
            job.tagContent('jobendtimestamp', Date.now())
            job.tagContent('jobDuration', job.end())

            const jobResults = job.getJobResults();
            job.objJobResults['job'] = jobResults;
            //console.log('jobResult', jobResult);
            console.log('objJobResults', job.objJobResults)
        })
        .catch(err => {
            console.log('Promise all error', err);
            job.tagContent('jobStatus', 'Job has been stopped...');
        });
        */
        
    }catch(error){
        //task.tagContent('taskStatus', 'Task has been stopped with an error: '+ error);
        console.log('Catch', 'Job error!!!', error.message);
        //job.tagContent('jobStatus', 'Job has been stopped...');
        //console.log(job);
        //note('error', error);
        //console.log(error);
    }
}





function doTask(task, job, parserClass){
    console.log('doTask');
    task.tagContent('taskStatus', 'Task is running...');
    task.start()
    const jl = new Logger4(job.jobId + '_'+task.taskId, job.getLoggerElement())

    return new Promise((resolve, reject)=>{
        let ident = jl.log(`Getting content from ${task.url}`);

        //return parser.getContentByURL(task.url).then( async cont => {
        return _getContentFromFile(task.url).then( async cont => {
            jl.log('ok', ident);

            
            
            //SITE RELEVANT PARSER START (DINAMICALLY IMPORTED)
            //parserFunc(cont, task, job, resolve);
            const parser2 = new parserClass(cont);
            //SITE RELEVANT PARSER END



            const itemsCount = parser2.init();

            task.initProgress(itemsCount);
            //init task progressbar in job section
            job.progressBar('pbTask').initMaxValue(itemsCount);
            job.progressBar('pbTask').update(0);


            //task
            parser2.do(
                ( objItem ) => {
                    //callback function
                    const objPatterns = testlab.getPatterns();            

                    let strLog = '';
                    let testErrorFlag;
                    for(let prop in objItem){
                        if(prop == 'date'){
                            //objItem.date = timestampToDatetime(objItem.date);
                        }

                        const value = objItem[prop];
                        const testResult = objPatterns[prop].test(value);
                        if(!testResult){
                            testErrorFlag = true;
                        }
                        //let value = (!objItem[prop] || objItem[prop] == false) ? `<span class="w3-text-red">${objItem[prop]}</span>` : `${objItem[prop]}`;
                        const spanClass = (testResult) ? 'w3-light-grey' : 'w3-red';
                        strLog+= `<span class="${spanClass}"><b>${prop}</b> : ${value} <br></span>`;
                    }

                    const logger = new Logger4(objItem.title+Date.now(), task.getLoggerElement());
                    logger.log(`${strLog}`);

                    task.updateProgress();
                    job.progressBar('pbTask').update(task.progressBar().getCurrentValue());

                    return testErrorFlag;

                }
            )
            .then((endTaskResponse) => {
                console.log('endTaskResponse', endTaskResponse);
                task.tagContent('taskStatus', 'Done');
                job.updateProgress();
                resolve(endTaskResponse);
            })
            .catch( err => {
                note('warning', err, 5000);
                console.log(err);
                reject(err);
            });
            


        });
    });
}








async function getContentByUrl(url){
    try{
        if(!url){
            throw new Error('Url is undefined');
        }

        console.log(url);

        const cont = await parser.getContentByURL(url);
        console.log(cont);
        const filename = generateFilenameFromURL(url)+'.html';
        console.log(filename);

        parser.saveContentToFile({
            foldername: 'testlab',
            filename,
            content : cont
        }).then( response => {
            console.log(response);
        });


    }catch(error){
        note('error', error.message);
        console.log(error);
        return;
    }
}




//----------------------
function _getContentFileList(){
    return common.sendAjax({
        controller : 'testlab',
        action : 'getContentFileList'
    }).then( response => {
        console.log(response);
        if(response.success){
            return response.arrFiles;
        }
        note('error', response.error);
    });
}


function getPatterns(){
    return {
        title: /.+/i,
        url: /\w\//i,
        source: /.+/i,
        date: /^\d+$/i,
        short_text: /.+/i
    }
}

testlab.getContentByUrl = getContentByUrl;
//testlab.editFileConfig = editFileConfig;
testlab.saveConfigFile = saveConfigFile;
testlab.editConfigFile = editConfigFile;
testlab.btnSaveConfigFile = btnSaveConfigFile;
testlab.openEditor = openEditor;
testlab.testParser = testParser;
testlab.show = show;
testlab.getPatterns = getPatterns;
testlab.getContent = getContent;
window.testlab = testlab;
})();