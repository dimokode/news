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
            job.tagContent('jobStartTimestamp', Date.now())

            tasks.getTask('test.txt').then( async content => {

                if(content){
                    //document.querySelector('job-content').innerHTML = response.content;
                    const arrFileLines = content.split('\r\n').filter((item)=>{
                        return item != ''
                    })
                    console.log('arrFileLines', arrFileLines)

                    job.initProgress(arrFileLines.length)

                    for(let i=0; i<arrFileLines.length; i++){
                        arrTasks.push(addTask(arrFileLines[i]))
                    }

                    for(let i=0; i<arrTasks.length; i++){
                        const task = arrTasks[i]
                        console.log('task', task)
                        
                        task.start()
                        let taskResult = await doTask(task)
                        console.log('taskResult', taskResult)
                        if(taskResult){
                            console.log('task is done')
                            job.updateProgress()
                        }
                    }
                    job.tagContent('jobEndTimestamp', Date.now())
                    job.tagContent('jobDuration', job.end())
                    job.tagContent('jobStatus', 'Job is done!')
                    //return arrTasks
                    /*
                    Promise.all(arrTasks).then(()=>{
                        job.tagContent('jobResult', 'Job is Done!')
                        job.tagContent('jobDuration', job.end())
                    })
                    */
                
                }else{
                    console.log(response.error)
                }

            })


    })
}

function doTask(task){
    return new Promise((resolve, reject)=>{
        return getURLonPage(task.data.url).then( (arrUrls) => {
            task.initProgress(arrUrls.length)
            //console.log('arrUrls', arrUrls)
            arrPromises = []
            for(let i=0; i<arrUrls.length; i++){
                let href = arrUrls[i]

                const logger = new Logger4(href, task.getLoggerElement())
                const ident = logger.log(href)
                const promise = network.getHttpCode(href).then((response)=>{
                    
                    //console.log(response)
                    logger.log(response['http_code'], ident)
                    
                    //task.progressBar().update(i+1)
                    task.updateProgress()
                    //task.tagContent('newModelCount', 1)
                    
                })
                arrPromises.push(promise)

            }
            
            Promise.all(arrPromises).then(()=>{
                task.tagContent('taskDuration', task.end())
                resolve(true)
            })

        })
    })
}

function addTask(url){
    //await wait(1)
    //const arrUrls =  await getURLonPage(url)
    const taskId = `task_`+cyrb53(url)
    const objTask = {
            taskId : taskId,
            containerSelector : 'job-tasks',
            data : {
                url : url,
                currentModelNr : 0,
                modelCount : 0,
                newModelCount : 0,
                taskDuration : 0,
                progressBar : new Progressbar("pb_"+taskId, 0, 0),
                //arrUrls : arrUrls
            }
    }
    const task = new Task(objTask)
    return task
}


function getURLonPage(url){
    return parser.getContentByURL(url).then( cont => {
        return test.filterUrls(parser.getBlocksBySelector(cont, 'a', 'href'), url);

    })
}

test2.start = start
test2.getURLonPage = getURLonPage
window.test2 = test2

})();