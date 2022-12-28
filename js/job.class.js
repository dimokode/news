class Job{
    constructor(objJob){
        this.jobId = `job_`+Date.now();
        this.jobFile = objJob.jobFile;
        this.containerSelector = objJob.containerSelector;
        this.objJobResults = {
            job : {},
            tasks : {}
        }
        this.arrTasks = []
        this.jobTags = {
            currentJobProgress : 0,
            taskQty : 0,
            progressBar : new Progressbar("pbJob", 0, 0),
            taskProgressBar : new Progressbar("pbTask", 0, 0),
        }
        let htmlJob = 
`
<h2>${this.jobId}</h2>
<button class="w3-button w3-yellow" onclick="Job.togglePause(this);">Pause</button>
<button class="w3-button w3-red" onclick="Job.setStopTrigger('stop');">Stop</button>
Job status: <jobStatus></jobStatus>

<progressBar></progressBar>
<taskProgressBar></taskProgressBar>

Added:<addedNews>0</addedNews> || Rejected:<rejectedNews>0</rejectedNews>

<br>

Start: <jobStartTimestamp></jobStartTimestamp> || End: <jobEndTimestamp></jobEndTimestamp> || Duration: <jobDuration></jobDuration>

<br>
<logger></logger>
`;
//<currentJobProgress></currentJobProgress> / <taskQty></taskQty>
        this.el = document.querySelector(this.containerSelector);
        this.el.innerHTML = htmlJob;

        const objFields = this.jobTags;

        //this.data = objFields

        for(let field in objFields){
            let value = objFields[field]
            this.tagContent(field, value);
        }
    }
/*
    static setStopTrigger(value = true){
        console.log('setStopTrigger');
        localStorage.setItem('stopTrigger', value);
    }

    static getStopTrigger(){
        return (localStorage.getItem('stopTrigger') == 'true') ? true : false;
    }
*/

    /**
     * status = start / stop / pause
     */
    static setStopTrigger(status = 'start'){
        console.log('setStopTrigger');
        localStorage.setItem('stopTrigger', status);
        console.log('stopTrigger', this.getStopTrigger());
        return this.getStopTrigger();
    }

    static getStopTrigger(){
        return localStorage.getItem('stopTrigger');
    }

    static togglePause(btn){
        const label = btn.innerHTML;
        //console.log(label);
        if(label == 'Pause'){
            this.setStopTrigger('pause');
            btn.innerHTML = 'Resume';
        }else{
            this.setStopTrigger('start');
            btn.innerHTML = 'Pause';
        }
    }


    saveJobResults(){
        //console.log('saveTaskResults', jobId)
        const obj = {
            controller : 'Tasks',
            action : 'saveJobResults',
            jobId: this.jobId,
            jobResult : this.el.outerHTML
        }
        //console.log('saveTaskResults', obj)
        return common.sendAjax(obj).then( response => {
            //console.log(result)
            return response
        })
    }

    getLoggerElement(){
        return document.querySelector('job-progress>logger')
    }

    getUrlArrayFromJobFile(){
        return tasks.getTask(this.jobFile).then( content => {
            if(content){
                let arr = content.split('\n');
                arr = arr.filter(item => {
                    console.log(item[0]);
                    return item[0] != '#';
                });
                console.log(arr);

                arr.map((item) => {
                    return item.replace('\r', '')
                });
                return arr
            }else{
                console.log(response.error)
                return
            }
        })
    }


    addTask(task){
        this.arrTasks.push(task)
    }

    getTasks(){
        return this.arrTasks
    }

    getJobResults(){
        const arr = [
            'taskQty',
            'currentJobProgress',
            'jobStatus',
            'jobDuration',
            'jobStartTimestamp',
            'jobEndTimestamp'
        ]

        let obj = {}
        arr.forEach((item) => {
            obj[item] = this.tagContent(item);
        })

        obj['id'] = this.jobId
        return obj;
    }

    saveJobResultsObject(){
        const obj = {
            controller : 'Tasks',
            action : 'saveJobResultsObject',
            jobId : this.jobId,
            serializedObject : JSON.stringify(this.objJobResults)
        }

        common.sendAjax(obj).then( response => {
            console.log(response)
        })
    }



    initJob(tasksQty){
        //this.tagContent('taskQty', tasksQty)
        this.progressBar('pbJob').initMaxValue(tasksQty)
    }
    
    tagContent(tagName, value){
        //console.log('tagName', tagName)
        //console.log('value', value)
        //console.log('taskId', this.taskId)
        //const taskElement = document.querySelector('#'+this.taskId)
        //console.log(taskElement)
        const tagElement = this.el.querySelector(tagName);

        if(tagElement == null){
            console.warn(`Tag ${tagName} doesn't exist in template`);
            return;
        }
        //if(tagElement == null) return;
        //console.log(tagElement)
        if(value == undefined){
            return tagElement.innerHTML;
        }else{
            if(typeof value == 'object' && value.constructor.name == 'Progressbar'){
                //console.log(value);
                //console.log(value.id);
                
                //this.pbJob = value
                this[value.id] = value;
                value = value.getProgressBar()
            }
            tagElement.innerHTML = value;
            //this.data[tagName] = value
        }   
    }
    
    updateProgress(){
        //let currentProgress = this.tagContent('currentJobProgress');
        let currentProgress = this.progressBar('pbJob').getCurrentValue();
        currentProgress++;
        //this.tagContent('currentJobProgress', currentProgress)
        this.progressBar('pbJob').update(currentProgress);
    }

    initProgress(pbId, value){
        //console.log('initProgress', value)
        //this.tagContent('taskQty', value)
        this.progressBar(pbId).initMaxValue(value)
    }

/*
    progressBar(){
        return {
            pbJob : this.pbJob,
            update(value){
                this.pbJob.updateProgress(value)
            },
            initMaxValue(value){
                this.pbJob.initMaxValue(value)
            }
        }
    }
*/

    progressBar(pbId){
        return {
            pbObj : this[pbId],
            update(value){
                this.pbObj.updateProgress(value);
            },
            initMaxValue(value){
                this.pbObj.initMaxValue(value);
            },
            getCurrentValue(){
                return this.pbObj.getCurrentValue();
            }
        }
    }


    start(){
        this.time = performance.now();
        return this.time
    }

    end(){
        return ((performance.now() - this.time ) / 1000).toFixed(3)
    }
}