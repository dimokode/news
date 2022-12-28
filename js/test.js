;(function(){

function test(){}


function startLogger(){
    let arrPromises = [];
    
    arrPromises.push(logBlock('Alfred', 1000))
    arrPromises.push(logBlock('Elena', 2000))
    arrPromises.push(logBlock('Michael', 500))
    arrPromises.push(logBlock('Rudolf', 3000))
    //arrPromises.push()
    
    
    
    Promise.all(arrPromises).then(()=>{
        logger.log('all promises were resolved!');
    }).finally(()=>{
        console.log('finally!');
    })
}

function logBlock(name, delay){
    return new Promise((resolve, reject) => {
        const logger = new Logger(name);
        const msgIdent = logger.log(`Hello, ${name}!`);
        //logger.log('hello!!!', msgIdent);
        logger.log('how are you?');
        logger.log("I'm fine! and you?");
        
        setTimeout(()=>{
            logger.log('hello!!!', msgIdent);
            resolve()
        }, delay)
    })

}

/*
function show(){
    //alert('show');
    $('#content').html(`<h1>Test</h1>`);

    const obj = {
        controller: 'test',
        action: 'getForm'
    }

    common.sendAjax(obj).then(function(json){
        console.log(json);
        let html = generateForm(json['data']);
        $('#content').html(html);
    });
}
*/

function generateForm(formData){
    
}

function test1(){
    /*
    console.log('test1')
    let chathost = 'SugarDolly'
    chathost = 'aaaa'
    chathost = 'bbbb'
    let modelName = 'bbbbxxx'
    models.isModelExist(chathost).then(response => {
        console.log(response)
        let data = response.data
        console.log(data)
        //return
        if(response.isModelExist){
            let arrDisplayNames = (data.display_names) ? data.display_names.split(';') : []
            console.log(arrDisplayNames)
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
                })
            }else{
                console.log(`Model ${chathost} (${modelName}) is already present in displayNames`)
            }

            //=================
        }else{
            console.log(`Adding model ${modelName} to db`)
            let arrDisplayNames = [];
            arrDisplayNames.push(modelName);
            if(modelName != chathost){
                arrDisplayNames.push(chathost)
            }
            models.putModelInDB(chathost, {
                'display_names' : arrDisplayNames.join(';')
            }).then( response => {
                console.log(response)
            })
        }
    })
    */
}

function test2(){
    //const arr = [1,4,3,6,0,1,2,3]
    //const arr = ['aaa', 'bbb', 'aaa', 'ccc', 'bbb']
    const arr = [
        'https://www.youtube.com/playlist?list=PLvdy3GhOJQJySoWJmKfZdgGOm76biUM7x',
        'https://vk.com/donbassdatascience',
        'https://www.youtube.com/playlist?list=PLvdy3GhOJQJySoWJmKfZdgGOm76biUM7x',
        'http://dondata.ru/cv/',
        '/',
        'http://dondata.ru/donbassdatascince/',
        'https://www.youtube.com/playlist?list=PLvdy3GhOJQJySoWJmKfZdgGOm76biUM7x',
        '/'

    ]
    console.log(arr)
    const arrUnique = uniqueArray(arr);
    console.log(arrUnique)
}

async function syncFunc(logger, task){
    let ident = logger.log('start syncFunc')
    /*
    const msg = task.log('start syncFunc')
    await wait(1);
    logger.log('ok', ident);
    const msgPartObj = msg.add('ok');
    msgPartObj.setClass('w3-pale-green');
    await wait(3);
    msgPartObj.removeClass('w3-pale-green').setClass('w3-pale-red');
    await wait(1);
    msgPartObj.remove();
    */
    //wait(1)
    //msgPartObj.setClass('w3-pale-red')
    /*
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            logger.log('ok', ident)
            
            resolve()
            return msg.add('ok').setClass('w3-pale-green')
        }, 1000)
    })
    */
}

function wait(s){
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve()
        }, s*1000);
    })
}

function progressbar_test(){
    //const t = Date.now()
    //console.log(t, hex_md5(t));
    //return
    console.log('progressbar_test');
    const logger_info = new Logger('info_block');
    logger_info.log('some message')
    let pb = new Progressbar('pb');
    logger_info.log(pb.getProgressBar())
    pb.updateProgress(changeProgress())

    pb = new Progressbar('pb_'+hex_md5(Date.now()));
    logger_info.log(pb.getProgressBar())
    pb.updateProgress(changeProgress())
}


function changeProgress(){

        return Math.floor(Math.random()*100)

}

function logSaver(){
    const content = document.querySelector('#models').innerHTML;
    const obj = {
        controller : 'logger',
        action : 'saveContentToFile',
        taskId : 'task_1',
        subTaskId : 'subtask_'+Date.now(),
        content : content
    }

    common.sendAjax(obj).then((response) => {
        console.log(response)
    })
}


function filterUrls(arrUrls, baseUrl){
    arrUrls = arrUrls.filter((url)=>{
        return url != null
    })
    arrUrls = arrUrls.map((href)=>{
        //console.log(url)
        //console.log(href)
        
        if(href.indexOf('http') !== -1){
            return href;
        }else{
            if(baseUrl[baseUrl.length-1]!=="/" && href[0]!=="/"){
                return baseUrl+"/"+href;    
            }else{
                return baseUrl+href;
            }
            
        }
        
       //return url + href
    })

    arrUrls = uniqueArray(arrUrls)
    return arrUrls
}


function doJob(btnElement){
    tasks.getTask('test.txt').then(async (content) => {
        //console.log(response)
        btnElement.disabled = true
        let arrJobPromises = [];
        const arrTask = content.split('\n');
        //console.log(arrTask)
        const pbJob = new Progressbar('pbJob', 0, arrTask.length)
        document.querySelector('pbJob').innerHTML = pbJob.getProgressBar()
        let jobProgress = 1;
        const logger_info = new Logger('logger_header');
        const logger2 = new Logger2('logger2');
        const taskInfo = logger2.addTask('logger_info');

        const msg = taskInfo.log('Get content from: aaaa')
        msg.add('ok').setClass('w3-pale-green')

        
        let timeJob = 0;
        let resultJob = true;
        for(let url of arrTask){
            let timeTask = performance.now();
            $resultTask = await doTask(url, logger_info, logger2)
            pbJob.updateProgress(jobProgress++)
            timeTask = performance.now() - timeTask;
            timeJob+=timeTask;
            logger_info.log(`Task is done :` + (timeTask / 1000).toFixed(3) + ` s`);
            resultJob*=$resultTask;
            console.log($resultTask)
            //await wait(5)
        }


        if(resultJob){
            btnElement.disabled = false
            logger_info.log(`Job is done :` + (timeJob / 1000).toFixed(3) + ` s`);
            //alert('Job is done!');
        }
        
    });
}


function doTask(url, logger_info, logger2){
    return new Promise((resolve, reject)=>{
        const taskInfo = logger2.getTask('logger_info')
        const msg = taskInfo.log('Get content from: ' + url)
        return parser.getContentByURL(url, logger_info).then( cont => {
            msg.add('ok').setClass('w3-pale-green')
            //console.log(cont)
            //const logger = new Logger('link_'+cyrb53(url));
            let arrUrls = filterUrls(parser.getBlocksBySelector(cont, 'a', 'href'), url);
            console.log(arrUrls)
    
            let arrPromises = [];
            let taskProgress = 1;
            
            arrUrls.forEach((href) => {
                const pbTask = new Progressbar('pbTask', 0, arrUrls.length)
                document.querySelector('pbTask').innerHTML = pbTask.getProgressBar()
                
    
                let promise = new Promise((resolve, reject) => {
                    const logger = new Logger('link_'+cyrb53(href));
                    
                    const ident = logger.log(href)
                    const task = logger2.addTask('task_'+cyrb53(href))
                    const msg = task.log(href)

                    network.getHttpCode(href).then((response)=>{
                        logger.log(response['http_code'], ident)
                        msg.add(response['http_code']).setClass('w3-pale-green')
                        test.syncFunc(logger, task).then(()=>{
                            pbTask.updateProgress(taskProgress++)
                            resolve()
                        })
                        
                    })
                })
    
                arrPromises.push(promise)
    
            });
    
            Promise.all(arrPromises).then(()=>{
                logger_info.log('All promisses are done!')
                resolve(true)
            })
    
        })
    });
    
}

function jobber(){
    const logger = new Logger2('logger2');
    const task = logger.addTask('_model1_')

    
    console.log(task)
    const msg = task.log('aaaa');

    const msgPart = msg.add('bbb');
    //msgPart.setClass('w3-red');
    //console.log(msgPart)

    const mmmm = logger.addTask('_model2_').log('some log message').log('jsdklasjdklajdl').log('once more message').log('xaxaxa')
    //logger.getTask('_model2_').log('another message')
    //const task2 = logger.getTask('_model2_')
    const nnn = mmmm.log('22222222').add('222233333')
    nnn.toggleClass('w3-green')
    mmmm.log('ffffffffffff')
    mmmm.add('ddd')
    

    const task3 = logger.addTask('_model3_')
    task3.log('333333')
    //logger.getTask('_model1_')
    //console.log(msgPart)
    msgPart.setClass('w3-red');

    return
    let msgObj = logger.log('Saving some shit!')
    console.log('msgObj get()', msgObj.get())
    let msgPartObj = msgObj.add('hello!')
    
    console.log('msgPartObj', msgPartObj)
    console.log(msgPartObj.get());
    let msgObj2 = logger.log('second message')
    let mmm = msgObj2.add('Fuck!')

    setTimeout(()=>{
        msgPartObj.get().innerHTML = 'AAAA!'
        msgPartObj.setClass('w3-orange')
        mmm.update('You!')
    }, 1000)
    
    setTimeout(()=>{
        msgPartObj.get().innerHTML = 'BBBB!'
        msgPartObj.setClass('w3-yellow')  
        //mmm.remove()
        //msgObj.update(`<button onclick="Logger2.func()">X</button>`)
        msgObj.toggleClass('w3-text-blue')
    }, 1500)

    setTimeout(()=>{
        msgPartObj.get().innerHTML = 'CCCC!'
        msgPartObj.toggleClass('w3-yellow')
    }, 2000)

    console.log(logger)
    //console.log('msgPartId', msgPartId)
    //console.log(msgObj.get(msgPartId))
    //let msgObj2 = logger.log('Message number 2')
    //console.log('msgId', msgObj)
    //let msg2PartId = msgObj2.add('World!')

    //msgObj.add('Msg1')
    //let msgPartId2 = ''
/*
    setTimeout(()=>{
        msgObj.update(msgPartId, 'World!')
        msgObj.setClass('w3-green')
        
    }, 1000)

    
    setTimeout(()=>{
        msgObj2.update(msg2PartId, 'Fuck!')
        msgPartId2 = msgObj.add('Вот твк!', {class : 'w3-grey'})
    }, 2000)

    setTimeout(()=>{
        //msgObj2.update(msg2PartId, 'Fuck!')
        msgObj.update(msgPartId2, 'Вот так!', {class : 'w3-green'})
    }, 3000)
    */
}


function testSocket(){
    common.sendAjax({
        controller : 'Test',
        action : 'testSocket'
    }).then( response => {
        console.log(response)
    })
}



function sendRequest(){

    const data = {
        url: 'https://cointelegraph.com/news/alameda-research-withdrew-204m-ahead-of-bankruptcy-filing-arkham-intelligence',
        title: 'test'
    }

    const jsonData = JSON.stringify(data);
    console.log(jsonData);


    fetch('./api.php', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then( response => {
        return response.json()
    }).then( response => {
        console.log(response);
    });
}

//test.show = show;
//test.test1 = test1;
test.doJob = doJob;
test.filterUrls = filterUrls;
test.jobber = jobber;
test.doTask = doTask;
test.syncFunc = syncFunc;
test.logSaver = logSaver;
test.startLogger = startLogger;
test.logBlock = logBlock;
test.test2 = test2;
test.progressbar_test = progressbar_test;
test.testSocket = testSocket;
test.sendRequest = sendRequest;
window.test = test;

})();