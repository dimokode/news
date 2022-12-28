;(function(){

function test2(){}


function start(){
    console.log('start')

    template.loadTemplateByName('job.html').then((html) => {
        $('content').html(html);

        let arrTasks = []

        const job = new Job({
                containerSelector : 'job-progress',
                fields : {
                    currentJobProgress : 0,
                    taskQty : 0,
                    progressBar : new Progressbar("pb_job", 0, 0)
                }
            })
            job.start()

            tasks.getTask('test.txt').then( content => {

                if(content){
                    //document.querySelector('job-content').innerHTML = response.content;
                    const arrFileLines = content.split('\r\n').filter((item)=>{
                        return item != ''
                    })
                    console.log('arrFileLines', arrFileLines)
                    job.tagContent('taskQty', arrFileLines.length)
                    job.progressBar().initMaxValue(arrFileLines.length)

                    /*
                    arrFileLines.forEach(url => {
                        arrTasks.push(addTask(url))
                    });
                    */
                    for(let i=0; i<arrFileLines.length; i++){


                        arrTasks.push(addTask(arrFileLines[i]).then((task)=>{
                            console.log('task added')
                            console.log(task)
                            return doTask(task).then(()=>{
                                job.updateProgress()
                                /*
                                job.tagContent('currentJobProgress', i+1)
                                job.progressBar().update(job.tagContent('currentJobProgress'))
                                */
                            })
                            //const loggerElement = task.getLoggerElement()
                            //console.log(task.taskAction)
                            /*
                            return task.taskAction.do(loggerElement).then(()=>{
                                job.tagContent('currentJobProgress', i+1)
                                job.progressBar().update(job.tagContent('currentJobProgress'))
                            })
                            */
                            //console.log('task', task)
                            /*
                            return doTask(task).then(()=>{
                                job.tagContent('currentJobProgress', i+1)
                                job.progressBar().update(job.tagContent('currentJobProgress'))
                            })
                            */
                        }))
                    }
                    //return arrTasks
                    Promise.all(arrTasks).then(()=>{
                        job.tagContent('jobResult', 'Job is Done!')
                        job.tagContent('jobDuration', job.end())
                    })
                
                }else{
                    console.log(response.error)
                }

            })


    })
}

function doTask(task){


    return new Promise((resolve, reject)=>{
        let taskStart = task.start()
        task.tagContent('taskstart', taskStart)
        console.log(task)
        const arrPromises = []
        //arrUrls.forEach((href) => {
            const arrUrls = task.data.arrUrls
            const loggerElement = task.getLoggerElement()
        for(let i=0; i<arrUrls.length; i++){
            let href = arrUrls[i]

            const logger = new Logger4(href, loggerElement)
            const ident = logger.log(href)
            const promise = network.getHttpCode(href).then((response)=>{
                
                //console.log(response)
                logger.log(response['http_code'], ident)
                
                //task.progressBar().update(i+1)
                task.updateProgress()
                task.tagContent('newModelCount', 1)
                
            })
            arrPromises.push(promise)

        }
        //});

        Promise.all(arrPromises).then(()=>{
            console.log('Task is done!')
            task.tagContent('taskDuration', task.end())
            resolve()
        })
    })
}

async function addTask(url){
    //await wait(1)
    const arrUrls =  await getURLonPage(url)
    const taskId = `task_`+cyrb53(url)
    const objTask = {
            taskId : taskId,
            containerSelector : 'job-tasks',
            data : {
                url : url,
                currentModelNr : 0,
                modelCount : arrUrls.length,
                newModelCount : 0,
                taskDuration : 0,
                progressBar : new Progressbar("pb_"+taskId, 0, arrUrls.length),
                arrUrls : arrUrls
            }
    }
    const task = new Task(objTask)
/*
    for(let i=0; i<arrUrls.lenth; i++){
        checkUrl(arrUrls[i])
    }
    const logger = new Logger4(url, task.getLoggerElement())

    logger.log('aaaa')
    logger.log('bbbb')
*/
    return task
}


function getURLonPage(url){
    return parser.getContentByURL(url).then( cont => {
        return test.filterUrls(parser.getBlocksBySelector(cont, 'a', 'href'), url);

    })
}

test2.start = start
window.test2 = test2

})();