;(function(){

function robot(){
    //const pbGlobal = new Progressbar('pbGlobal')
    //logger_info.log(pbGlobal.getProgressBar())
    //const pbTask = new Progressbar('pbTask', 0, 72)
    //pbTask.updateProgress(36)
    //return
    //let cont = await parser.getContentByURL('https://rt.bongacams.com/all-models', logger_info);
    //let cont = await parser.getContentByURL('https://rt.bongacams.com/all-models?page=11', logger_info);
    //let cont = await parser.getContentByURL('https://rt.bongacams.com/%D1%84%D0%B5%D1%82%D0%B8%D1%88');
    //let cont = await parser.getContentByURL('https://rt.bongacams.com/new-models', logger_info);
    //let cont = await parser.getContentByURL('https://rt.bongacams.com');
    //https://mobile-edge65.bcvcdn.com/stream_CleopatraTemp.jpg?t=1641730720
    //https://urlscan.io/domain/net-226-23-conversasro.com
    //https://eais.rkn.gov.ru/
    //net-226-23-conversasro
    //netstat -b 10
}


async function startJob(){
    console.log('startJob')
    let arrTasks = []

    const popup = new Popup();
    popup.addContent('<job-progress></job-progress><job-tasks></job-tasks>')

    const job = new Job({
            containerSelector : 'job-progress',
            jobFile : 'bonga.txt'
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
        )
    }

    //console.log('arrTasks', arrTasks)

    let arrTasksPromses = []
    for(let task of arrTasks){
        task.tagContent('taskStatus', 'Task is running...')
        let taskResult = await doTask(task, job)
/*
        //pause
        job.tagContent('jobStatus', '5s pause')
        await wait(5, ()=>{
            let timer = 4
            const tt = setInterval(()=>{
                job.tagContent('jobStatus', `${timer--}s pause`)
            }, 1000)

            setTimeout(()=>{
                clearInterval(tt)
            }, 5000)
        })
        //pause end
*/        
        arrTasksPromses.push(taskResult)

    }

    Promise.all(arrTasksPromses).then(()=> {
        job.tagContent('jobStatus', 'Done!')
        job.tagContent('jobendtimestamp', Date.now())
        job.tagContent('jobDuration', job.end())


        const jobResults = job.getJobResults();
        job.objJobResults['job'] = jobResults;
        //console.log('jobResult', jobResult);
        console.log('objJobResults', job.objJobResults)
        job.saveJobResultsObject()
        job.saveJobResults().then(response => {
            console.log(response)
        })
    })
}




function doTask(task, job){
    //console.log('task', task)
    task.start()
    const jl = new Logger4(job.jobId+'_'+task.taskId, job.getLoggerElement())
    
    return new Promise((resolve, reject)=>{
        let ident = jl.log(`<a href="#${task.taskId}">Go</a> Getting content from ${task.url}`)
        return parser.getContentByURL(task.url).then( async cont => {

            if(!cont){
                console.log('Пизда!');
                return;
            }

            jl.log('ok', ident)
            //console.log(cont)
            let arrModelBlocks = parser.getBlocksContentBySelector(cont, 'div.ls_thumb:not(.__empty)');
            //console.log(arrModelBlocks[0]);
            let modelsCount = arrModelBlocks.length;
            let newModelsCount = 0;

            task.initProgress(modelsCount)
            //init task progressbar in job section
            job.progressBar('pbTask').initMaxValue(modelsCount)
            job.progressBar('pbTask').update(0)
            

/*

            logger = new Logger4('aaa', task.getLoggerElement())

            jobLogger.log('Starting task '+task.taskId)
            logger.log('some shit!')

            let taskResults = task.getTaskResults(); 
            task.saveTaskResults(job.jobId);
            
            job.updateProgress();
            job.objJobResults['tasks'][task.taskId] = taskResults;

            //job.initProgress('pbTask', '45')
            job.progressBar('pbTask').initMaxValue(33)
            job.progressBar('pbTask').update(20)
          
            job.updateProgress()
            resolve()
            return
*/  


            let arrPromises = [];
            for(let i=0; i<modelsCount; i++){
            //for(let i=0; i<1; i++){
                
                const modelPromise = await new Promise((resolve, reject)=>{
                    let arrModelPromises = [];
    
                    let modelBlockHTML = arrModelBlocks[i];
                    let modelBlockObj = parser.convertHTMLToObject(modelBlockHTML);
                    let modelUrlNode = $(modelBlockObj).find('a.lst_wrp');
                    let modelName = $(modelUrlNode).data('name');
                    let chathost = $(modelUrlNode).data('chathost');
                    let thumbImageUrl = 'http:'+$(modelBlockObj).find('img').attr('src');
                    let profileURL = 'https://rf.bongacams.com/profile/'+chathost;
                    let chatUrl = 'https://rf.bongacams.com/'+chathost;

                    const logger = new Logger4(chatUrl+Date.now(), task.getLoggerElement())
                    logger.log(chatUrl)

                    //save thumb
                    const objSaveThumb = {
                        foldername: chathost,
                        filename: getFilenameFromUrl(thumbImageUrl),
                        url: thumbImageUrl,
                    }
                    const ident = logger.log('Saving thumb...')
                    const promiseSaveThumb = parser.saveFileByURL(objSaveThumb).then( response => {
                        //console.log(response)
                        if(response.success){
                            logger.replace(`<img src="/models/${objSaveThumb.foldername}/${objSaveThumb.filename}" width="120">`, ident)
                            if(response.msg){
                                logger.log(response.msg)
                            }
                        }else{
                            console.log(response.error);
                            console.log('modelBlockHTML', modelBlockHTML);
                            logger.error(response.error, ident)
                        }
                    })

                    arrModelPromises.push(promiseSaveThumb);
                    //save thumb end

                    //DB
                    const dbPromise = new Promise((resolve, reject)=>{
                        //check if the model exist in DB
                        models.isModelExist(chathost).then(function(response){
                            let data = response.data
                            let className = '';
                            if(chathost!=modelName){
                                className = 'w3-pale-red';
                            }
                
                
                            if(response.isModelExist){
                                let arrDisplayNames = (data.display_names) ? data.display_names.split(';') : []
                                //console.log(arrDisplayNames)
                                let flag = false;
                                if(!arrDisplayNames.includes(modelName)){
                                    arrDisplayNames.push(modelName)
                                    flag = true;
                                }
                                if(!arrDisplayNames.includes(chathost)){
                                    arrDisplayNames.push(chathost)
                                    flag = true;
                                }
                    
                                if(flag){
                                    let strDisplayNames = arrDisplayNames.join(';')
                                    console.log(strDisplayNames)
                    
                                    models.updateModelInDB(chathost, {
                                        'display_names': strDisplayNames
                                    }).then( response2 => {
                                        console.log(response2)
                                        resolve()
                                    })
                                }else{
                                    //console.log(`Model ${chathost} (${modelName}) is already present in displayNames`)
                                    resolve()
                                }
                
                                logger.log('Model ' + chathost + '(<span class="'+className+'">'+modelName+'</span>) already exists in DB');
                                //=================
                            }else{
                                //console.log(`Adding model ${modelName} to db`)
                                let arrDisplayNames = [];
                                arrDisplayNames.push(modelName);
                                if(modelName != chathost){
                                    arrDisplayNames.push(chathost)
                                }
                                models.putModelInDB(chathost, {
                                    'display_names' : arrDisplayNames.join(';')
                                }).then( response => {
                                    //console.log(response)
                                    resolve()
                                })
                                newModelsCount++;
                                task.tagContent('newmodelcount', newModelsCount)
                                logger.log('<b>[ NEW ]</b> Model ' + chathost + '(<span class="'+className+'">'+modelName+'</span>) does not exist in DB');
                                //logger.log("<b>New "+ newModelsCount + " from " + modelsCount + "</b>");
                
                            }
                        });
                        //check if the model exist in DB end
    
                    });
                    arrModelPromises.push(dbPromise);
                    //DB END


                    const modelBlockPromise = new Promise((resolve, reject)=>{
                        const modelBlockFilename = `modelblock@${modelName}.txt`;
                        parser.isFileExist(chathost, modelBlockFilename).then(async function(isFileExist){
                            if(!isFileExist){
                                logger.log(`File ${modelBlockFilename} for model ${chathost} doesn't exists`);
                                
                                const objModelBlock = {
                                    foldername: chathost,
                                    filename: modelBlockFilename,
                                    content: modelBlockHTML
                                }
                                const ident = logger.log(`Saving file ${objModelBlock.filename}`);
                                parser.saveContentToFile(objModelBlock).then(()=>{
                                    logger.log('ok', ident)
                                    resolve();
                                })
                            }else{
                                logger.log(`File ${modelBlockFilename} for model ${chathost} already exists`);
                                resolve();
                            }
                        });
                    });
                    arrModelPromises.push(modelBlockPromise);



                    const profilePromise = new Promise((resolve, reject)=>{
                        const profileFilename = `profileHTML@${modelName}.txt`;
                        parser.isFileExist(chathost, profileFilename).then(async function(isFileExist){
                            if(!isFileExist){
                                logger.log(`File ${profileFilename} for model ${chathost} doesn't exists`);
                                let profileHTML = await parser.getContentByURL(profileURL, logger);

                                profileHTML = profileHTML.replaceAll(/<!--(.*?)-->/gm, '');
                                let profileHTMLObj = parser.convertHTMLToObject(profileHTML);
                                profileHTMLObj = processing.clearProfileHTML(profileHTMLObj);
                                profileHTML = parser.convertObjectToHTML(profileHTMLObj);
                
                                const objProfile = {
                                    foldername: chathost,
                                    filename: profileFilename,
                                    content: profileHTML
                                }
                                const ident = logger.log(`Saving file ${objProfile.filename}`);
                                parser.saveContentToFile(objProfile).then(()=>{
                                    logger.log('ok', ident)
                                    resolve()
                                })
                
                            }else{
                                logger.log(`File ${profileFilename} for model ${chathost} already exists`);
                                resolve()
                            }
                        });
                    });
                    arrModelPromises.push(profilePromise);

/*
                    const chatPromise = new Promise((resolve, reject)=>{
                        const chatFilename = `chatHTML@${modelName}.txt`; 
                        parser.isFileExist(chathost, chatFilename).then(async function(isFileExist){
                            if(!isFileExist){
                                logger.log(`File ${chatFilename} for model ${chathost} doesn't exists`);
                                
                                let chatHTML = await parser.getContentByURL(chatUrl, logger);

                                
                                chatHTML = chatHTML.replaceAll(/<!--(.*?)-->/gm, '');
                                let chatHTMLObj = parser.convertHTMLToObject(chatHTML);
                                chatHTMLObj = processing.clearProfileHTML(chatHTMLObj);
                                chatHTML = parser.convertObjectToHTML(chatHTMLObj);
                                
                                const objchatHTML = {
                                    foldername: chathost,
                                    filename: chatFilename,
                                    content: chatHTML
                                }
                                const ident = logger.log(`Saving file ${objchatHTML.filename}`);
                                parser.saveContentToFile(objchatHTML).then(()=>{
                                    logger.log('ok', ident)
                                    resolve()
                                })
                
                            }else{
                                logger.log(`File ${chatFilename} for model ${chathost} already exists`);
                                resolve();
                            }
                        });
                    });
                    arrModelPromises.push(chatPromise);
*/



                    Promise.all(arrModelPromises).then(()=>{
                        task.updateProgress()
                        job.progressBar('pbTask').update(task.progressBar().getCurrentValue())
                        resolve()
                    })

                })//modelPromise
                arrPromises.push(modelPromise)
            }//for

            Promise.all(arrPromises).then(()=>{
                task.tagContent('taskDuration', task.end())
                task.tagContent('taskStatus', 'Done!')
                

                let taskResults = task.getTaskResults();
                jl.log('New: ' + taskResults.newModelCount)
                const identTaskResults = jl.log(`Saving task results for ${task.taskId}`)
                task.saveTaskResults(job.jobId).then( response => {
                    jl.replace(response, identTaskResults)
                })
                
                job.updateProgress();
                job.objJobResults['tasks'][task.taskId] = taskResults;
                resolve(true)
            })

            //resolve(true)
        })
    })
}



//robot.doJob = doJob;
robot.doTask = doTask;
robot.startJob = startJob;
window.robot = robot;

})();