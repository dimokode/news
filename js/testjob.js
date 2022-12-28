;(function(){

function testjob(){}


async function startJob(){
    console.log('start job')
    let arrTasks = []

    const popup = new Popup();
    popup.addContent('<job-progress></job-progress><job-tasks></job-tasks>')

    const job = new Job({
            containerSelector : 'job-progress',
            jobFile : 'test.txt'
    })

        job.start()
        job.tagContent('jobStartTimestamp', Date.now())

        const arrJobUrls = await job.getUrlArrayFromJobFile()
        console.log('arrUrls', arrJobUrls);

        let result = await job.initJob(arrJobUrls.length)
        for(let url of arrJobUrls){
            console.log('url', url)
            arrTasks.push( new Task({
                    url : cleanUrl(url),
                    containerSelector : 'job-tasks',
                })
            )
        }

        let arrTasksPromses = []
        for(let task of arrTasks){
            task.tagContent('taskStatus', 'In process!')
            let taskResult = await doTask(task, job)
            arrTasksPromses.push(taskResult)
            if(taskResult){
                task.tagContent('taskStatus', 'Done!')
            }
        }

        //console.log('arrTasksPromses', arrTasksPromses)
        Promise.all(arrTasksPromses).then(()=>{
            //console.log('arrTasks', job.getTasks())
            job.tagContent('jobStatus', 'Done')
            job.tagContent('jobDuration', job.end())
            job.tagContent('jobEndTimestamp', Date.now())

            //console.log('all promises are done!')
            const jobResults = job.getJobResults();
            job.objJobResults['job'] = jobResults;
            //console.log('jobResult', jobResult);
            console.log('objJobResults', job.objJobResults)
            job.saveJobResultsObject()
        })

        console.log('arrTasks', arrTasks)
        return
        
}

function doTask(task, job){
    task.start()
    
    return new Promise((resolve, reject)=>{
        //const identLink = logger.log(`Get content from ${task.url}`)
        return test2.getURLonPage(task.url).then( (arrUrls) => {
            
            //logger.log('ok', identLink)
            const subtaskQty = arrUrls.length
            task.initTask(subtaskQty)
            
            arrPromises = []
            for(let i=0; i<subtaskQty; i++){
                let href = arrUrls[i]
                const logger = new Logger4(href, task.getLoggerElement())
                
                const ident = logger.log(href)
                const promise = network.getHttpCode(href).then((response)=>{
                    logger.log(response['http_code'], ident)
                    task.updateProgress()
                })
                arrPromises.push(promise)

            }
            
            Promise.all(arrPromises).then(()=>{
                let taskResults = task.getTaskResults();
                
                task.tagContent('taskDuration', task.end())
                task.tagContent('taskStatus', 'Done!')
                task.saveTaskResults(job.jobId);
                
                job.updateProgress();
                job.objJobResults['tasks'][task.taskId] = taskResults;
                resolve(true)
            })
        })
    })
}




const controller = new AbortController();
const signal = controller.signal;




localStorage.setItem('stopTimer', false)

async function testTimer(){
    console.log('test timer')
    //console.log('promi', wait(1))
    let ww = wait(3)
    ww.cancel()
    console.log('signal', signal)
    wait(10, signal, ()=>{
        
        let t = 10
        let tt = setInterval(()=>{
            if(localStorage.getItem('stopTimer') == 'true'){
                console.log('stop timer')
                clearInterval(tt)
                
            }
            console.log('timer:' + t--)
        }, 1000)

        setTimeout(()=>{
            console.log('settimeout 13000')
            clearInterval(tt)
        }, 13000)




    }).then(()=>{
        console.log('Time is over!')
    })

    
    console.log('end')
}

function stopTimer(){
    controller.abort()
    /*
    localStorage.setItem('stopTimer', true)
    console.log('stopTimer', localStorage.getItem('stopTimer'))
    */
}


testjob.startJob = startJob
testjob.doTask = doTask
testjob.testTimer = testTimer
testjob.stopTimer = stopTimer
window.testjob = testjob

})();