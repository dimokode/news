;(function(){

function jobs(){}

function show(){
    template.loadTemplateByName('jobs.html').then( async html => {
        
        $('content').html(html);

        const htmlTasks = await buildTaskSelectionBlock();

        //console.log(htmlTasks);
        $('tasks').html(htmlTasks);
        
    });
}




async function buildTaskSelectionBlock(){
    const arrTasks = await tasks.getTasks();
    let html = '';
    console.log(arrTasks);

    if(arrTasks.length > 0){
        //console.log(files);
        html = template.generateList({
            tpl : `
            <div class="w3-padding-small">
                <input type="checkbox" name="cb" value="{%filename%}">
                <button class="w3-button w3-grey" onclick="jobs.loadTaskConfig('{%filename%}');">Select</button>
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


async function loadTaskConfig(filename){
    //console.log(filename);
    const objTask = await tasks.getTaskByFilename(filename);
    //console.log('objTask', objTask);
    const formId = 'task_'+cyrb53(filename);
    console.log('formId', formId);
    const objForm = {
        fields : objTask,
        submit : {
            formId: formId,
            label: 'Start Job',
            class: 'w3-button w3-green',
            onclick : `jobber.startJob('${formId}')`
        }
    }
    const sf = new SimpleForm(objForm);
    const html = sf.generateSimpleForm();
    //console.log(html);
    const popup = new Popup();
    popup.addContent(html);
    //$('taskConfig').html(html);
}


async function test(){
    console.log('test');
    const job = new Job({
        containerSelector : 'job-progress',
        jobFile : 'bonga.txt'
    });

    const arrJobUrls = await jobs.getUrlArrayFromJobFile();
    console.log('arrUrls', arrJobUrls);
}

async function startJob(){
        let arrTasks = []

        const popup = new Popup();
        popup.addContent('<job-progress></job-progress><job-tasks></job-tasks>')

        const job = new Job({
                containerSelector : 'job-progress',
                jobFile : 'bonga.txt'
            })
            jobs.start()
            jobs.tagContent('jobStartTimestamp', Date.now())

            let arrJobUrls = await jobs.getUrlArrayFromJobFile();
            //console.log('arrUrls', arrJobUrls);

            let result = await jobs.initJob(arrJobUrls.length)
            for(let url of arrJobUrls){
                arrTasks.push(addTask(url))
            }

            console.log('arrTasks', arrTasks)
            let arrTasksPromses = []
            for(let task of arrTasks){
                arrTasksPromses.push( await doTask(task, job).then(()=>{
                    jobs.updateProgress();
                }))
            }

            //console.log('arrTasksPromses', arrTasksPromses)
            Promise.all(arrTasksPromses).then(()=>{
                //console.log('arrTasks', jobs.getTasks())
                jobs.tagContent('jobStatus', 'Done')
                jobs.tagContent('jobDuration', jobs.end())
                jobs.tagContent('jobEndTimestamp', Date.now())

                //console.log('all promises are done!')
                const jobResults = jobs.getJobResults();
                jobs.objJobResults['job'] = jobResults;
                //console.log('jobResult', jobResult);
                console.log('objJobResults', jobs.objJobResults)
                jobs.saveJobResultsObject()
            })
            return
            

        tasks.getTask('bonga.txt').then( content => {
            if(content){

                const arrFileLines = content.split('\n')

                jobs.tagContent('taskQty', arrFileLines.length)
                jobs.progressBar().initMaxValue(arrFileLines.length)

                for(let url of arrFileLines){
                    arrTasks.push(addTask(url))
                }
            }else{
                console.log(response.error)
            }
        }).then(()=>{
            //===============
            console.log('arrTasks', arrTasks)
            
            for(let task of arrTasks){
                console.log('task', task)
                console.log('el', task.el)
                console.log('previousSibling', task.el.previousSibling)
            }
            
            
            
            jobs.start()
            jobs.tagContent('jobStatus', 'Processing')
            jobs.tagContent('jobStartTimestamp', Date.now())
            arrTasks = arrTasks.map((task)=>{
                jobs.addTask(task)
                return doTask(task, job)
            })

            Promise.all(arrTasks).then(()=>{
                console.log('arrTasks', jobs.getTasks())
                jobs.tagContent('jobStatus', 'Done')
                jobs.tagContent('jobDuration', jobs.end())
                jobs.tagContent('jobEndTimestamp', Date.now())

                //console.log('all promises are done!')
                const jobResults = jobs.getJobResults();
                jobs.objJobResults['job'] = jobResults;
                //console.log('jobResult', jobResult);
                console.log('objJobResults', jobs.objJobResults)
                jobs.saveJobResultsObject()
            })
            //console.log('arrTasks', arrTasks)
        })

}


function showLogs(){
    const obj = {
        controller : 'Tasks',
        action : 'getLogs'
    }

    common.sendAjax(obj).then( response => {
        console.log(response)
        if(response.success){

            let tab = new Tableto({
                structure : {
                    foldername : {
                        header : {
                            label : 'Job',
                            attributes : {
                                unique : true,
                            }
                        },
                        body : {
                            attributes : {
                                onclick : `jobs.showJobResults('{%foldername%}')`,
                                class : 'td clickable-cell',
                                name : 'foldername',
                            },
    
                        }
                    },
                    timestamp : {
                        header : {
                            label : 'DateTime',
                            attributes : {
                            }
                        },
                        body : {
                            attributes : {
                                class : 'td',
                                //name : 'foldername',
                                type : 'datetime'
                            },
                            
                        }
                    }

                },
                config : {
                    tag : 'div'
                },
                data : response.arrList.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1)
            })
            //console.log(tab.generateTable());
            //document.querySelector('job-logs').innerHTML = tab.generateTable();
            document.querySelector('job-content').innerHTML = tab.generateTable();

        }else{
            console.log(response.error)
        }
    })
}


function addTask(url){
    const objTask = {
            url : url,
            containerSelector : 'job-tasks',
    }

    const task = new Task(objTask)
    return task

}

function doTask(task, job){
    task.start()
    const logger = new Logger4(task.taskId, task.getLoggerElement())
    //let objTaskResults = {}
    return new Promise((resolve, reject) => {
        let timerIdent = setInterval(()=>{
            //const logger = new Logger4(task.taskId, task.getLoggerElement())
            let ident = logger.log('hello')

            logger.log('ok', ident)

            logger.log('some new shit!')
            logger.log('Fuck the script')
            task.initProgress(task.url.length)
            //console.log(task.tagContent('newModelCount'))
            
            task.tagContent('newModelCount', 4)
            task.tagContent('taskDuration', task.end())
            task.updateProgress()
            //jobs.updateProgress();
            let taskResults = task.getTaskResults();
            //objTaskResults[task.taskId] = taskResults;
            jobs.objJobResults['tasks'][task.taskId] = taskResults;
            console.log('taskResults', taskResults);
            task.saveTaskResults(jobs.jobId);

        
        }, 100)

        setTimeout(()=>{
            clearInterval(timerIdent)
            resolve()
        }, 3000)
    })
}




function showJobResults2(jobId){
        const obj = {
            controller : 'Tasks',
            action : 'loadJobResultsObject',
            jobId : jobId,
        }
        common.sendAjax(obj).then( response => {
            console.log(response)
            if(response.success){
                const objJobResults = JSON.parse(response.content)
                console.log('objJobResults', objJobResults)
                const htmlJob = generateJobResults(jobId, objJobResults)

                let htmlTasks = ''
                for(let taskId in objJobResults.tasks){
                    htmlTasks += generateTaskResults(jobId, taskId, objJobResults.tasks[taskId])
                }
                const popup = new Popup();
                popup.addContent('<job-progress></job-progress><job-tasks></job-tasks>')
                popup.addContent(htmlJob, 'job-progress')
                popup.addContent(htmlTasks, 'job-tasks')
                
            }else{
                console.log(response.error)
            }
        })
}

function showJobResults(jobId){
    return new Promise((resolve, reject) => {

        let arrPromises = []
        let objResults = {}
        let htmlTasks = ''
        let htmlJob = ''




        let tasksPromise = new Promise((resolve, reject) => {
            let arrTasksPromises = []
            common.sendAjax({
                controller : 'Tasks',
                action : 'loadJobResultsObject',
                jobId : jobId
            }).then( response => {
                console.log(response)
                if(response.success){
                    const objJobResults = JSON.parse(response.content)
                    objResults.objJobResults = objJobResults
                    //console.log('objJobResults', objJobResults)
                    //const htmlJob = generateJobResults(jobId, objJobResults)

                    //let htmlTasks = ''
                    objResults['tasks'] = {}

                    for(let taskId in objJobResults.tasks){
                        //htmlTasks += generateTaskResults(jobId, taskId, objJobResults.tasks[taskId])
                        let taskResults =  common.sendAjax({
                            controller : 'Tasks',
                            action : 'loadTaskFile',
                            jobId : jobId,
                            taskId : taskId,
                            type : 'txt'
                        }).then( response => {
                            if(response.success){
                                objResults['tasks'][taskId] = response.content
                                //htmlTasks+= response.content
                            }else{
                                console.log(response.error)
                            }
                        })
                        arrTasksPromises.push(taskResults)
                    }//for

                    Promise.all(arrTasksPromises).then(() => {
                        resolve()
                    })
                    
                }else{
                    console.log(response.error)
                }
        })


        })
        

        arrPromises.push(tasksPromise)


        

        let jobResults =  common.sendAjax({
            controller : 'Tasks',
            action : 'loadJobLog',
            jobId : jobId
        }).then( response => {
            if(response.success){
                objResults.jobLog = response.content

            }else{
                console.log(response.error)
            }
        })
        arrPromises.push(jobResults)


        Promise.all(arrPromises).then(response => {
            //console.log(response)
            //console.log('objresults', objResults)

            for(let taskId in objResults['tasks']){
                //console.log(taskId)
                //console.log(objResults['tasks'][taskId])
                htmlTasks+= `<input type="button" class="w3-button w3-grey" shown="false" onclick="jobs.showTaskLog(this, '${jobId}', '${taskId}')" value="Load">`
                htmlTasks+= objResults.tasks[taskId]
            }

            //htmlJob = `<input type="button" class="w3-button w3-grey" onclick="jobs.showJobLog('${jobId}')" value="Load">`
            htmlJob = objResults['jobLog']

            //console.log(htmlTasks)
            const popup = new Popup();
            popup.addContent('<job-progress></job-progress><job-tasks></job-tasks>')
            popup.addContent(htmlJob, 'job-progress')
            popup.addContent(htmlTasks, 'job-tasks')
            resolve()
        })
    })
}


/*
function generateTaskResults(jobId, taskId, objTask){
    let tpl = 
`
<input type="button" class="w3-button w3-grey" onclick="jobs.showTaskLog('${jobId}', '${taskId}')" value="Load">
<task class="task" id="${taskId}">
    <url></url>
    <br>
    <taskData>
    <taskStatus></taskStatus>
    <br>
Models: <currentModelNr></currentModelNr>/<modelCount></modelCount>
New: <newModelCount></newModelCount>
Duration: <taskDuration></taskDuration>
    </taskData>
    <logger>
    
    </logger>
</task>
`
    const objTpl = {
        tpl : tpl,
        tags : objTask
    }
    return template.generateByTemplate(objTpl, 'tags')
}


function generateJobResults(jobId, objJobResults){
    let tpl = `
<job id="${jobId}">
    <h2>${jobId}</h2>
    <currentJobProgress></currentJobProgress> / <taskQty></taskQty>
    <br>
    Job status: <jobStatus></jobStatus>
    <br>
    Duration: <jobDuration></jobDuration>
    Start: <jobStartTimestamp></jobStartTimestamp>
    End: <jobEndTimestamp></jobEndTimestamp>
    <logger>
        <input type="button" class="w3-button w3-grey" onclick="jobs.showJobLog('${jobId}')" value="Load">
    </logger>
</job>
    `
    const objTpl = {
        tpl : tpl,
        tags : objJobResults.job
    }
    return template.generateByTemplate(objTpl, 'tags')
}
*/

function showJobLog(jobId){    
    common.sendAjax({
        controller : 'Tasks',
        action : 'loadJobLog',
        jobId : jobId,
    }).then( response => {
        //console.log(response)
        if(response.success){
            document.querySelector('job#'+jobId).outerHTML = response.content
        }else{
            console.log(response.error)
        }
    })
}

function showTaskLog(btn, jobId, taskId){
    //console.log(btn)
    const shown = btn.getAttribute('shown')
    console.log(typeof shown, shown)

    if(shown == 'true'){
        btn.setAttribute('shown', false)
        //loggerElement.classList.add('hidden')
        document.querySelector('task#'+taskId+'>logger').innerHTML = ''
        return
    }

    common.sendAjax({
        controller : 'Tasks',
        action : 'loadTaskFile',
        jobId : jobId,
        taskId : taskId,
        type: 'log'
    }).then( response => {
        //console.log(response)
        if(response.success){
            document.querySelector('task#'+taskId+'>logger').innerHTML = response.content
            btn.setAttribute('shown', true)
            //loggerElement.classList.remove('hidden')
        }else{
            console.log(response.error)
        }
    })
}

function showHideTaskLog(btn, taskId){
    const shown = btn.getAttribute('shown')
    const loggerElement = document.querySelector('task#'+taskId+'>logger')

    if(shown == 'true'){
        btn.setAttribute('shown', false)
        loggerElement.classList.add('hidden')
    }else{
        btn.setAttribute('shown', true)
        loggerElement.classList.remove('hidden')
    }
}


jobs.addTask = addTask;
jobs.startJob = startJob;
jobs.showLogs = showLogs;
jobs.showTaskLog = showTaskLog;
jobs.showJobLog = showJobLog;
jobs.showHideTaskLog = showHideTaskLog;
jobs.showJobResults = showJobResults;

jobs.loadTaskConfig = loadTaskConfig;
//jobs.getTask = getTask
jobs.show = show;
jobs.test = test;
window.jobs = jobs;
})();