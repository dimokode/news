;(function(){

function jobber(){}


async function startJob(taskId){
    const formData = SimpleForm.getFormData(taskId);
    doJob(formData, test = false);
}




async function doJob(objTaskConfigData, test = true){
    try{

        if(test){
            console.log('TEST MODE!');
        }else{
            console.log('WORK MODE!');
        }

        const objJob = {
            added: 0,
            rejected: 0
        };
        let stopTrigger = Job.setStopTrigger('start');
        //console.log(stopTrigger);

        const {parseURL, pageNumberFrom, pageNumberTo, parserFilename, baseURL, category, pause = 0} = objTaskConfigData;

        //console.log('fe:', getFileExtension(parser));
        //in config the extension of parser file can be omitted
        if(!getFileExtension(parserFilename)){
            parserFilename+= '.js';
        }

        if(!parserFilename){
            note('error', 'Parser is undefined');
            return;
        }

        const parserClass = (await import('/parsers/'+parserFilename+'?'+Date.now())).default;

        const arrJobUrls = generateUrlsArray(parseURL, pageNumberFrom, pageNumberTo);
        console.log(arrJobUrls);

        let arrTasks = []

        const popup = new Popup();
        popup.addContent('<job-progress></job-progress><job-tasks></job-tasks>');


        const job = new Job({
                containerSelector : 'job-progress',
        });
        job.tagContent('jobStatus', 'In process...');
        job.start();
        job.tagContent('jobStartTimestamp', timestampToDatetime(Date.now(), 'hour:min:sec'));
        job.initJob(arrJobUrls.length);



        //console.log('TASK ADDING');
        //TASKS ADDING
        for(let url of arrJobUrls){
            //add task
            url = cleanUrl(url);
            //console.log('filename', filename);
            arrTasks.push(
                
                new Task({
                    url : url,
                    containerSelector : 'job-tasks',
                    prependHtml : `<input type="button" class="w3-button w3-grey" shown="true" onclick="job.showHideTaskLog(this, '{%taskId%}')" value="Show/Hide">`
                })
            );
            
        }

        console.log(arrTasks);

        //let stopTrigger = Job.getStopTrigger();
        //console.log('stopTrigger', stopTrigger);

        //TASKS PROCESSING
        while((stopTrigger=='start' || stopTrigger=='pause') && arrTasks.length>0){
            stopTrigger = Job.getStopTrigger();

            if(stopTrigger == 'pause'){
                job.tagContent('jobStatus', 'Paused...');
                console.log(Job.getStopTrigger());
                await wait(1);
                continue;
            }

            if(stopTrigger == 'stop'){
                job.tagContent('jobStatus', 'STOPPED!!!');
                break;
            }
            
            let task = arrTasks.shift();
            console.log('task', task);

            job.tagContent('jobStatus', 'In progress...');
            task.tagContent('taskStatus', 'Task is running...');

            //TASK RUNNING ----------------------------------------------------------
            let arrItems = await doTask(task, job, parserClass, test);//start the Task
            //console.log(objTaskResult);

            arrItems.forEach( objSingleNews => {
                //console.log(objSingleNews);
                //if(objSingleNews.url.indexOf(baseURL) == -1){
                if(!/^(http:\/\/|https:\/\/)/i.test(objSingleNews.url)){
                    objSingleNews.url = baseURL+objSingleNews.url;
                }

                if(!objSingleNews.category){
                    objSingleNews.category = category;
                }

                if(/[а-яА-Я]+/i.test(objSingleNews.title)){
                    objSingleNews.language = 'ru';
                }else{
                    objSingleNews.language = 'en';
                }

            });

            
            if(!test){
                task.tagContent('taskStatus', 'News are inserting in DB...');
                const objResult = await news.insertNewsInDB(arrItems);
                objJob.added+= objResult.true;
                objJob.rejected+= objResult.false;
                task.tagContent('newItemCount', objResult.true);
                task.tagContent('doubleItemCount', objResult.false);
                console.log(objResult);
            }

            
            task.tagContent('taskStatus', 'Done');
            job.updateProgress();
            //console.log(arrTaskResult);
            await wait(pause);
        }//cycle end(while)


        if(arrTasks.length == 0){
            job.tagContent('jobStatus', 'Successfully done!');
            //console.log('JOB IS DONE!');
            job.tagContent('jobendtimestamp', timestampToDatetime(Date.now(), 'hour:min:sec'));
            job.tagContent('jobStatus', 'DONE!');
            job.tagContent('jobDuration', job.end() + ' s');
            job.tagContent('addedNews', objJob.added);
            job.tagContent('rejectedNews', objJob.rejected);
            return true;
        }else{
            job.tagContent('jobStatus', 'JOB HAS BEEN STOPPED!');
            console.log('JOB HAS BEEN STOPPED!');
            return;
        }

    }catch(e){
        console.error(e);
    }


    

    
    
    

    //const jobResults = job.getJobResults();
    //job.objJobResults['job'] = jobResults;
    //console.log('jobResult', jobResult);
    //console.log('objJobResults', job.objJobResults);

    //console.log('arrTasksPromses', arrTasksPromses);

    //JOB END
    /*
    Promise.all(arrTasksPromses).then(()=> {
        job.tagContent('jobStatus', 'Done!')
        job.tagContent('jobendtimestamp', Date.now())
        job.tagContent('jobDuration', job.end())

        const jobResults = job.getJobResults();
        job.objJobResults['job'] = jobResults;
        //console.log('jobResult', jobResult);
        console.log('objJobResults', job.objJobResults)
    });
    */

}





function doTask(task, job, parserClass, test){
    console.log('doTask');
    let cont;
    task.start()
    const jl = new Logger4(job.jobId+'_'+task.taskId, job.getLoggerElement())

    return new Promise(async (resolve, reject)=>{
        let ident = jl.log(`Getting content from ${task.url}`);

        //return parser.getContentByURL(task.url).then( async cont => {

        //let promiseParserContent;
//        console.log('indexof', task.url.indexOf('file://'));

        if(task.url.indexOf('file://') == 0){
            const filename = task.url.replace('file://', '');
//            console.log(filename);
            cont = await parser.getContentFromFile(filename);
        }else{

            if(test){
                const filename = generateFilenameFromURL(task.url)+'.html';
                cont = await parser.getContentFromFile(filename);
                if(!cont){
                    cont = await parser.getContentByURL(task.url);
                    parser.saveContentToFile({
                        foldername: 'source',
                        filename,
                        content : cont
                    }).then( response => {
                        console.log(response);
                    });
                }
                //promiseParserContent = parser.getContentByURL(task.url);
            }else{
                cont = await parser.getContentByURL(task.url);
            }
            
        }

        //return parser.getContentFromFile(task.url).then( async cont => {
        //return promiseParserContent.then( async cont => {
            jl.log('ok', ident);


            //SITE RELEVANT PARSER START (DINAMICALLY IMPORTED)
            //parserFunc(cont, task, job, resolve);
            const parser2 = new parserClass(cont);
            //SITE RELEVANT PARSER END



            const itemsCount = parser2.init();
            console.log('itemsCount', itemsCount);

            task.initProgress(itemsCount);
            //init task progressbar in job section
            job.progressBar('pbTask').initMaxValue(itemsCount);
            job.progressBar('pbTask').update(0);





            parser2.do(
                //callback function
                ( objItem ) => {
                    const objPatterns = testlab.getPatterns();            

                    let strLog = '';
                    let testErrorFlag;
                    for(let prop in objItem){
                        
                        let altValue;
                        if(prop == 'date'){
                            //objItem.date = timestampToDatetime(objItem.date);
                            altValue = timestampToDatetime(objItem.date);
                        }
                        
                        const value = objItem[prop];
                        let testResult = true;
                        if(objPatterns[prop]!== undefined){
                            testResult = objPatterns[prop].test(value);
                        }
                        
                        if(!testResult){
                            testErrorFlag = true;
                        }
                        //let value = (!objItem[prop] || objItem[prop] == false) ? `<span class="w3-text-red">${objItem[prop]}</span>` : `${objItem[prop]}`;
                        const spanClass = (testResult) ? 'w3-light-grey' : 'w3-red';
                        strLog+= `<span class="${spanClass}"><b>${prop}</b> : ${value}`;
                        strLog+= (altValue) ? `  (${altValue})` : '';
                        strLog+=`</span><br>`;
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
                resolve(endTaskResponse);
                //job.updateProgress(); 
            })
            .catch( err => {
                note('warning', err, 5000);
                console.log(err);
            });
            




        //});
    });
}









/** PRIVATE METHODS */
function generateUrlsArray(parseURL, pageNumberFrom, pageNumberTo){
    const urls = [];
    let indexFrom;
    if(parseURL.includes('{%pageNumber%}')){
        let indexTo;
        if(pageNumberFrom == ''){
            urls.push(parseURL.replace('{%pageNumber%}', ''));
            indexFrom = 2;
        }else{
            indexFrom = Number(pageNumberFrom);
        }
        indexTo = Number(pageNumberTo);
        console.log('indexFrom', indexFrom);
        console.log('indexTo', indexTo);

        for(let i = indexFrom; i<=indexTo; i++){
            urls.push(parseURL.replace('{%pageNumber%}', i));
        }
    }else{
        urls.push(parseURL);
    }

    //console.log(urls);
    return urls;
}




jobber.startJob = startJob;
jobber.doJob = doJob;
jobber.generateUrlsArray = generateUrlsArray;
window.jobber = jobber;
})();