;(function(){

function utils(){}

function show(){
    template.loadTemplateByName('utils.html').then( async html => {
        $('content').html(html);
        const arrFiles = await getDBs();
        console.log(arrFiles);
        const htmlDBs = await _buildDBSelectionBlock(arrFiles);
        //$('dbs').html(htmlDBs);
        $('#select_target_db').html(htmlDBs);
        $('#select_source_db').html(htmlDBs);
    });
}


function getDBs(){
    return common.sendAjax({
        controller : 'utils',
        action : 'getDBs'
    }).then( response => {
        if(response.success){
            return response.arrFiles;
        }
        note('error', response.error);
    });
}


async function _buildDBSelectionBlock(arrFiles){
    let html = '';

    if(arrFiles.length > 0){
        html = template.generateList({
            tpl : `
           <!--ul class="clickable" onclick="utils.selectDb('{%filename%}')">{%filename%} ({%size%} byte)</ul-->
           <option value="{%filename%}">{%filename%}</option>
            `,
            data : arrFiles
        });
    }else{
        html = 'Empty';
    }

    return `<select onchange="utils.selectDb(this)">
                <option value="">Select DB</option>
                ${html}
            </select>`;
}



async function selectDb(selectElement, outElementId){
    //console.log(selectElement);
    const db_filename = selectElement.options[selectElement.selectedIndex].value;
    console.log(db_filename);
    const tables = await getTablesFromDb(db_filename);
    console.log(tables);
    const outElement = document.querySelector('#'+outElementId);
    if(tables.length > 0){
        let db_html = '';
        for( let table of tables){
            //console.log(table);
            db_html+=`<div><input type="checkbox" value="${table.name}">${table.name}</div>`;
        }

        outElement.innerHTML = db_html;
    }else{
        outElement.innerHTML = "empty";
    }
}



function getTablesFromDb(filename){
    return common.sendAjax({
        controller: 'utils',
        action: 'getTablesFromDb',
        filename: filename
    }).then( tables => {
        return tables;
    });
}



async function mergeDBs(){
    try{
        

        let objTables = {}

        const selectTarget = document.querySelector('#select_target_db');
        const db_target = selectTarget.options[selectTarget.selectedIndex].value;
        const selectSource = document.querySelector('#select_source_db');
        const db_source = selectSource.options[selectSource.selectedIndex].value;

        if(db_target == '' || db_source == ''){
            throw new Error("Select target and source dbs");
        }

        console.log('db_target', db_target);
        console.log('db_source', db_source);
        const cbTables = document.querySelectorAll('div#db_source_details input[type="checkbox"]:checked');
        const tables = Array.from(cbTables).map(item => {
            //console.log(item.value);
            return item.value;
        });
        //console.log('tables', tables);
        if(tables.length == 0){
            throw new Error("Select at least one table in source db");
        }

        const dbData = {
            db_target,
            db_source,
        }

        _openPopup();
        const arrTasks = [];




        for(let table of tables){
            //console.log(table);
            objTables[table] = await _getCountEntries(db_source, table);
        }

        console.log('objTables', objTables);

        const job = new Job({
            containerSelector : 'job-progress',
        });
        job.tagContent('jobStatus', 'In process...');
        job.start();
        job.tagContent('jobStartTimestamp', timestampToDatetime(Date.now(), 'hour:min:sec'));
        job.initJob(tables.length);

        for(let table in objTables){
            //console.log(table);

            arrTasks.push(
                new Task({
                    url : table,
                    containerSelector : 'job-tasks',
                    prependHtml : `<input type="button" class="w3-button w3-grey" shown="true" onclick="job.showHideTaskLog(this, '{%taskId%}')" value="Show/Hide">`
                })
            );
        }


        while(arrTasks.length > 0){
            let task = arrTasks.shift();
            console.log('task', task);

            job.tagContent('jobStatus', 'In progress...');
            task.tagContent('taskStatus', 'Task is running...');

            let result = await doTask(job, task, dbData, objTables[task.url]);
            if(result){
                job.updateProgress();
            }
        }
        

        job.tagContent('jobEndTimestamp', timestampToDatetime(Date.now(), 'hour:min:sec'));
        job.tagContent('jobDuration', job.end() + ' s');
        /*
        common.sendAjax({
            controller: 'utils',
            action: 'mergeDBs',
            data
        }).then( response => {
            console.log(response);
        });
        */
    }catch(error){
        note('error', error.message);
        console.log(error);
    }
}






async function doTask(job ,task, dbData, count){
    try{
        console.log(job, task, dbData, count);

        task.start();
        task.initProgress(count);
        job.progressBar('pbTask').initMaxValue(count);
        job.progressBar('pbTask').update(0);
    
        const jl = new Logger4(job.jobId+'_'+task.taskId, job.getLoggerElement());
        let ident = jl.log(`Transfer data from ${task.url}`);
    
    
        let itemsPosition = 0;
        let itemsLeft = count;
        let step = 100;
        let added = 0, rejected = 0;

        while(itemsLeft>0){
            console.log(itemsPosition, itemsLeft, step);
            
    
            let result = await(_transferData(dbData, task.url, itemsPosition, step));
            console.log(result);

            if(!result.success){
                throw new Error(result.error);
            }

            added = added + result.results.added;
            rejected = rejected + result.results.rejected;

            job.tagContent('addednews', added);
            job.tagContent('rejectednews', rejected);

            task.tagContent('newitemcount', added);
            task.tagContent('doubleitemcount', rejected);
    
            if((itemsLeft - step) <= 0){
                step = itemsLeft;
            }

            itemsLeft = itemsLeft - step;
            itemsPosition = itemsPosition + step;
            task.updateProgress(itemsPosition);
            job.progressBar('pbTask').update(task.progressBar().getCurrentValue());
        }
    
        //task.updateProgress(6);
        
        jl.log('ok', ident);
        return true;
    }catch(error){
        console.log(error);
        note('error', error.message);
    }

}


function _transferData(dbData, tableName, itemsPosition, step){
    return common.sendAjax({
        controller: 'utils',
        action: 'mergeDBs',
        dbData,
        tableName,
        itemsPosition,
        step
    }).then( response => {
        return response;
    });

}


function _getCountEntries(dbName, tableName){
    return common.sendAjax({
        controller: 'utils',
        action: 'getCountEntries',
        dbName,
        tableName
    }).then( response => {
        console.log(response);
        return response;
    });
}


function _openPopup(){
    const popup = new Popup();
    popup.addContent('<job-progress></job-progress><job-tasks></job-tasks>');

    const job = new Job({
        containerSelector : 'job-progress',
    });


    //job.initJob(arrFeeds.length);
}


utils.show = show;
utils.selectDb = selectDb;
utils.mergeDBs = mergeDBs;
window.utils = utils;
})();