;(function(){

function spider(){}

async function startJob(){
    console.log('startJob')
    let arrTasks = []

    const popup = new Popup();
    popup.addContent('<job-progress></job-progress><job-tasks></job-tasks>')

    const job = new Job({
            containerSelector : 'job-progress',
            jobFile : 'investing_local.txt'
            //jobFile : 'test.txt'
    })

    job.tagContent('jobStatus', 'In process...')
    job.start()
    job.tagContent('jobStartTimestamp', Date.now())

    const arrJobUrls = await job.getUrlArrayFromJobFile()
    //console.log('arrJobUrls', arrJobUrls);

    job.initJob(arrJobUrls.length)

    for(let url of arrJobUrls){
        //add task
        arrTasks.push( new Task({
                url : cleanUrl(url),
                containerSelector : 'job-tasks',
                prependHtml : `<input type="button" class="w3-button w3-grey" shown="true" onclick="job.showHideTaskLog(this, '{%taskId%}')" value="Show/Hide">`
            })
        );
    }

    console.log('arrTasks', arrTasks)

    let arrTasksPromses = []
    for(let task of arrTasks){
        console.log('task', task);
        task.tagContent('taskStatus', 'Task is running...');
        let taskResult = await doTask(task, job)
        arrTasksPromses.push(taskResult)
    }

    console.log('arrTasksPromses', arrTasksPromses);

    Promise.all(arrTasksPromses).then(()=> {
        job.tagContent('jobStatus', 'Done!')
        job.tagContent('jobendtimestamp', Date.now())
        job.tagContent('jobDuration', job.end())


        const jobResults = job.getJobResults();
        job.objJobResults['job'] = jobResults;
        //console.log('jobResult', jobResult);
        console.log('objJobResults', job.objJobResults)
        /*
        job.saveJobResultsObject()
        job.saveJobResults().then(response => {
            console.log(response)
        })
        */
    });
}






function doTask(task, job){
    console.log('doTask');
    task.start()
    const jl = new Logger4(job.jobId+'_'+task.taskId, job.getLoggerElement())

    return new Promise((resolve, reject)=>{
        let ident = jl.log(`Getting content from ${task.url}`);
        //return parser.getContentByURL(task.url).then( async cont => {
        return parser.getContentFromFile(task.url).then( async cont => {
            jl.log('ok', ident);
/*
            parser.saveContentToFile({
                foldername: 'source',
                filename: 'investing.com.txt',
                content : cont
            });
*/
            
            //SITE RELEVANT PARSER START
            const newsBlock = parser.getBlockContentBySelector(cont, 'div.largeTitle');
            //console.log(newsBlock);

            let arrModelBlocks = parser.getBlocksContentBySelector(newsBlock, 'article>div.textDiv');
            console.log('arrModelBlocks', arrModelBlocks);

            let itemsCount = arrModelBlocks.length;
            let newItemsCount = 0;

            task.initProgress(itemsCount);
            //init task progressbar in job section
            job.progressBar('pbTask').initMaxValue(itemsCount);
            job.progressBar('pbTask').update(0);

            
            let arrPromises = [];
            
            for(let i=0; i<itemsCount; i++){
                const modelPromise = await new Promise((resolve, reject)=>{
                    let arrModelPromises = [];
    
                    let modelBlockHTML = arrModelBlocks[i];
                    let modelBlockObj = parser.convertHTMLToObject(modelBlockHTML);
                    let title = $(modelBlockObj).find('a').html();
                    let url = $(modelBlockObj).find('a').attr('href');
                    let date = $(modelBlockObj).find('span.date').html();
                    const arrDate = date.match(/(.*?)(\d{2}).(\d{2}).(\d{4})/i);
                    //console.log(arrDate);
                    const timestamp = dateToTimestamp({year: arrDate[4], month: arrDate[3], day: arrDate[2]});
                    //console.log(timestamp);
                    
                    const logger = new Logger4(title+Date.now(), task.getLoggerElement())
                    logger.log(`${title} : ${url} : ${timestamp}`);


                    //console.log('title', title)
                    //console.log('image', image)
                    Promise.all(arrModelPromises).then(()=>{
                        task.updateProgress()
                        resolve()
                    })

                })
                arrPromises.push(modelPromise)

            }//for
            

            Promise.all(arrPromises).then(()=>{
                job.updateProgress()
                resolve()
            });

            //SITE RELEVANT PARSER END




        });
    });
}



function saveImage(url){
    return common.sendAjax({

        controller : 'Spider',
        action : 'saveImageByURL',
        url : url,
        foldername : '/spider/',
        filename : getFilenameFromUrl(url)

    }).then( response => {
        console.log(response)
    })
}

spider.startJob = startJob;
spider.doTask = doTask;
spider.saveImage = saveImage;
window.spider = spider;

})();