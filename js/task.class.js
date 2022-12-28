class Task{

    constructor(objTask){
        this.url = objTask.url;
        this.taskId = `task_`+cyrb53(this.url)
        this.prependHtml = (objTask.prependHtml !== undefined) ? objTask.prependHtml : ''

        this.taskTags = {
            taskId : this.taskId,
            currentModelNr : 0,
            modelCount : 0,
            newModelCount : 0,
            taskDuration : 0,
            progressBar : new Progressbar("pb_"+this.taskId, 0, 0)
        }

        
        let htmlTask = 
        `${this.prependHtml}
        <task class="task" id="${this.taskId}">
            <url>${this.url}</url>
            <br>
            <taskData>
            Status: <taskStatus></taskStatus>
<progressBar></progressBar>
Models: <currentModelNr></currentModelNr>/<modelCount></modelCount>
New: <newItemCount></newItemCount>
Doubles: <doubleItemCount></doubleItemCount>
Duration: <taskDuration></taskDuration>
            </taskData>
            <logger></logger>
        </task>`

        const objFields = this.taskTags
        for(let field in objFields){
            let value = objFields[field]
            htmlTask = htmlTask.replace("{%"+field+"%}", value)
        }

        document.querySelector(objTask.containerSelector).insertAdjacentHTML('beforeend', htmlTask)
        this.el = document.querySelector(objTask.containerSelector+`>task#${this.taskId}`)
        

        for(let field in objFields){
            let value = objFields[field]
            this.tagContent(field, value);
        }


    }

    initTask(subtaskQty){
        this.tagContent('modelCount', subtaskQty)
        this.progressBar().initMaxValue(subtaskQty)
    }


    saveTaskResults(jobId){
        return new Promise((resolve, reject) => {
            let taskLoggerHtml = this.el.querySelector('logger').innerHTML
            let copyElement = this.el.cloneNode(true)
            copyElement.querySelector('logger').innerHTML = ''
            let taskHeaderHtml = copyElement.outerHTML
            copyElement = null
    
            let arrPromises = []
    
            arrPromises.push(
                common.sendAjax({
                    controller : 'Tasks',
                    action : 'saveContentToFile',
                    foldername: jobId,
                    filename: this.taskId+'.txt',
                    content : taskHeaderHtml
                }).then( response => {
                    console.log(response)
                    return response
                })
            )
    
            arrPromises.push(
                common.sendAjax({
                    controller : 'Tasks',
                    action : 'saveContentToFile',
                    foldername: jobId,
                    filename: this.taskId+'.log',
                    content : taskLoggerHtml
                }).then( response => {
                    console.log(response)
                    return response
                })
            )

            Promise.all(arrPromises).then(response => {
                resolve(`Task results for ${this.taskId} were successfully saved!`)
            })
        })


    }

    saveTaskResults2(jobId){
        //console.log('saveTaskResults', jobId)
        const obj = {
            controller : 'Tasks',
            action : 'saveTaskResults',
            jobId: jobId,
            taskId: this.taskId,
            taskResult : this.el.outerHTML
        }
        //console.log('saveTaskResults', obj)
        return common.sendAjax(obj).then( result => {
            console.log(result)
        })
    }

    getLoggerElement(){
        return document.querySelector('#'+this.taskId+'>logger')
    }

    getTaskResults(){
        const arr = [
            'url',
            'taskStatus',
            'currentModelNr',
            'modelCount',
            'newModelCount',
            'taskDuration'
        ]

        let obj = {}
        arr.forEach((item) => {
            obj[item] = this.tagContent(item);
        })
        obj['id'] = this.taskId
        return obj;
    }



    getTaskHtml(){
        return this.htmlTask
    }


    tagContent(tagName, value){
        const tagElement = this.el.querySelector(tagName)
        //console.log(this.el, tagElement)
        if(tagElement == null) return
        if(value == undefined){
            return tagElement.innerHTML    
        }else{
            if(typeof value == 'object' && value.constructor.name == 'Progressbar'){
                this.pbTask = value
                value = value.getProgressBar()
            }
            tagElement.innerHTML = value
        }   
    }

    updateProgress(progressValue = undefined){
        let currentProgress = this.tagContent('currentModelNr')
        //console.log('currentProgress', currentProgress)
        currentProgress++

        if(progressValue !== undefined){
            currentProgress = progressValue;
        }
        this.tagContent('currentModelNr', currentProgress)
        this.progressBar().update(currentProgress)
    }

    initProgress(value){
        this.tagContent('modelCount', value)
        this.progressBar().initMaxValue(value)
    }

    progressBar(){
        /*
        if(this.pbTask == undefined){
            //console.log('pbTask is undefined')
            this.pbMin = 0
            this.pbMax = 100
            //this.pbCurrent = 0
            this.pbTaskId = "pb_"+this.taskId
            this.pbTask = new Progressbar(this.pbTaskId, this.pbMin, this.pbMax)
            this.updateField('progressBar', this.pbTask.getProgressBar())
        }
        */
        return {
            pbTask : this.pbTask,
            update(value){
                this.pbTask.updateProgress(value)
            },
            initMaxValue(value){
                this.pbTask.initMaxValue(value)
            },
            getCurrentValue(){
                return this.pbTask.getCurrentValue()
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