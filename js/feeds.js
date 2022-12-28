;(function(){

function feeds(){}

function show(){
    template.loadTemplateByName('feeds.html').then( html => {
        $('content').html(html);
        //const html = await _buildTaskSelectionBlock();
        //$('tasks').html(html);
    })
}


async function openConfig(){
    const cont = await _getFeedsList();
    const html = await template.loadTemplateByName('feeds_conf.html')
    $('feeds').html(html);
    $('feeds>textarea').html(cont);

}

function _getFeedsList(){
    return common.sendAjax({
        controller: 'cfeeds',
        action: 'getConfig'
    }).then( response => {
        if(response.success){
            return response.content;
        }else{
            note('error', response.error);
            console.log(response.error);
        }
    })
}

function saveConfig(){
    common.sendAjax({
        controller: 'feeds',
        action: 'saveConfig',
        content: $('feeds>textarea').val()
    }).then( response => {
        console.log(response);
        if(response.success){
            note('success', 'File has been successfully saved');
        }else{
            note('error', response.error);
            console.log(response.error);
        }
    })
}


function parseFeeds(){
    doJob();
}


async function doJob(test = false){
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

        const cont = await _getFeedsList();
        //console.log(cont);

        const arrFeeds = [...new Set( cont.split('\n').map( item => {
            return item.trim();
        })
        )];
        //console.log(arrFeeds.length);

        const arrTasks = [];
        const jobLog = [];

        const popup = new Popup();
        popup.addContent('<job-progress></job-progress><job-tasks></job-tasks>');


        const job = new Job({
                containerSelector : 'job-progress',
        });

        job.tagContent('jobStatus', 'In process...');
        job.start();
        job.tagContent('jobStartTimestamp', timestampToDatetime(Date.now(), 'hour:min:sec'));
        job.initJob(arrFeeds.length);

        for(let url of arrFeeds){
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
            let taskLog = await doTask(task, job, test);//start the Task
            console.log('taskLog', taskLog);


            if(taskLog.success === true){
                //objJob.added+= objResult.true;
                objJob.added+= taskLog.news.true;
                //objJob.rejected+= objResult.false;
                objJob.rejected+= taskLog.news.false;

                job.tagContent('addedNews', objJob.added);
                job.tagContent('rejectedNews', objJob.rejected);
            }

            /*
            if(!test && arrItems){
                task.tagContent('taskStatus', 'News are inserting in DB...');
                const objResult = await news.insertNewsInDB(arrItems);
                objJob.added+= objResult.true;
                objJob.rejected+= objResult.false;
                task.tagContent('newItemCount', objResult.true);
                task.tagContent('doubleItemCount', objResult.false);
                console.log(objResult);
            }
            */
            jobLog.push(taskLog);

            task.tagContent('taskStatus', 'Done');
            job.updateProgress();
            await wait(0);
        
        }//while

        console.log('jobLog +++++++++++++++++++', jobLog);
        logs.saveLog(job.jobId, jobLog);

        if(arrTasks.length == 0){
            job.tagContent('jobStatus', 'Successfully done!');
            //console.log('JOB IS DONE!');
            job.tagContent('jobendtimestamp', timestampToDatetime(Date.now(), 'hour:min:sec'));
            job.tagContent('jobStatus', 'DONE!');
            job.tagContent('jobDuration', job.end() + ' s');
            //job.tagContent('addedNews', objJob.added);
            //job.tagContent('rejectedNews', objJob.rejected);
            return true;
        }else{
            job.tagContent('jobStatus', 'JOB HAS BEEN STOPPED!');
            console.log('JOB HAS BEEN STOPPED!');
            return;
        }

        
    }catch(e){
        console.error(e);
        note('error', 'JOB:' + e.message);
    }

}


function doTask(task, job, test){
    try{
        task.start();

        const taskLog = {
            date: Date.now(),
            url : task.url
        };

        
        const jl = new Logger4(job.jobId+'_'+task.taskId, job.getLoggerElement());
        let ident = jl.log(`Getting content from ${task.url}`);

        const obj = {
            controller: 'cfeeds',
            action: 'parseFeed',
            url: task.url,
            fromFile: false,//get xml from file, if file doesn't exit, download it first
            filename: generateFilenameFromURL(task.url, 'xml')
        };
        //console.log(obj);
    
        return common.sendAjax(obj).then( async response => {
            console.log(response);
            if(response.success){
                jl.log('ok', ident);

                const testErrorFlag = logTask(response.arrItems, task, job);
                console.log('testErrorFlag', testErrorFlag);
                
                if(testErrorFlag){
                    //task.tagContent('taskStatus', 'Interrupted');
                    //throw new Error('Validation error in parsed data. Check red market data.');
                    taskLog.error = 'Validation error in parsed data. Check red market data.';
                    jl.log(taskLog.error, ident, 'error');
                }
                
                

                const arrItems = response.arrItems;

                if(!test && !testErrorFlag){
                    task.tagContent('taskStatus', 'News are inserting in DB...');
                    const objResult = await news.insertNewsInDB(arrItems);
                    //console.log('objResult', objResult);
                    taskLog.news = objResult;

                    task.tagContent('newItemCount', objResult.true);
                    task.tagContent('doubleItemCount', objResult.false);
                    //console.log(objResult);
                    taskLog.success = true;
                }else{
                    taskLog.success = false;
                }


                //return response.arrItems;
                return taskLog;
            }else{
                taskLog.success = false;
                taskLog.error = response.error;
                jl.log(response.error, ident, 'error');
                note('error', response.error);
                console.log(response.error);
                return taskLog;
            }
            
        });

    }catch(e){
        console.error(e);
        note('error', 'TASK:'+e.message);
        Job.setStopTrigger('stop');
        note('error', 'Stop trigger has been set');
    }
}


function logTask(arrItems, task, job){
    const itemsCount = arrItems.length;
    task.initProgress(itemsCount);
    //init task progressbar in job section
    job.progressBar('pbTask').initMaxValue(itemsCount);
    job.progressBar('pbTask').update(0);

    let testErrorFlag = false;

    arrItems.forEach( objItem => {
        //console.log(objItem);


        let testResult;
        const objPatterns = testlab.getPatterns();            

        let strLog = '';
        
        for(let prop in objItem){
            
            let altValue;
            if(prop == 'date'){
                //objItem.date = timestampToDatetime(objItem.date);
                altValue = timestampToDatetime(objItem.date);
            }
            

            const value = objItem[prop];
            if(objPatterns[prop] == undefined){
                //throw Error(`Prop ${prop} doesn't exist in objPatterns array`);
                testResult = true;
            }else{
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

    });

    return testErrorFlag;
}



feeds.show = show;
feeds.openConfig = openConfig;
feeds.saveConfig = saveConfig;
feeds.parseFeeds = parseFeeds;
window.feeds = feeds;
})();