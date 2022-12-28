;(function(){

function logs(){}

function show(){
    console.log('show');
    template.loadTemplateByName('logs.html').then( async html => {
        $('content').html(html);
        const htmlLogs = await _buildLogSelectionBlock();
        $('logs').html(htmlLogs);
    });
}


async function _buildLogSelectionBlock(){
    const arrLogs = await getLogs();
    let html = '';
    //console.log(arrLogs);

    arrLogs.map( item => {
        //console.log(item);
        item.id = generateFilenameFromURL(item.filename);
    });
    console.log(arrLogs);

    if(arrLogs.length > 0){
        //console.log(files);
        html = template.generateList({
            tpl : `
            <div id="{%id%}" class="w3-padding-small">
                <input type="checkbox" name="cb" value="{%filename%}">
                <button class="w3-button w3-grey" onclick="logs.showLog('{%filename%}');">Show</button>
                {%filename%}
            </div>
            `,
            data : arrLogs
        });
    }else{
        html = 'Empty';
    }
    return html;
}



function getLogs(){
    return common.sendAjax({
        controller : 'logs',
        action : 'getLogsFileList'
    }).then( response => {
        if(response.success){
            return response.arrFiles;
        }
        note('error', response.error);
    });
}

async function showLog(filename){
    try{
        const objLog = await getLogByFilename(filename);
        console.log(objLog);

        objLog.map( item => {
            item.timestamp = item.date;
            item.date = timestampToDatetime(item.date, 'date.month.year hour:min');

            if(item.error !== undefined){
                item.memo = item.error;
                item.class = "w3-pale-red";
            }else{
                if(item.news){
                    item.memo = `New: ${item.news.true} / Rejected: ${item.news.false}`;
                    item.class = "";
                }else{
                    //console.log("!!!!!", item);
                }

            }
        });

        let htmlLog = template.generateList({
            tpl: await template.loadRawTemplateFromFile('logrow.html'),
            data: objLog
        });

        const htmlLogFrame = await template.loadRawTemplateFromFile('log.html'); 

        //$('logs').html(htmlLog);

        const popup = new Popup('log');
        globo.set('popupLog', popup);
        popup.addContent(htmlLogFrame);
        $('log').html(htmlLog);
        popup.addContent(objLog.length, 'all');
    
    
    }catch(e){
        note('error', e.message);
        console.log(e);
    }
}



function filterItems(params){
    console.log(params);
    //const popup = globo.get('popupLog');
    
    //let c = 0;
    $('log').find('div.logslist').each(function(){
        //console.log($(this).find('input[type="checkbox"]').prop('checked'));
        
        for(param in params){
            //console.log(param, params[param]);
            const value = $(this).find('span.'+param).html().trim();
            console.log(value, params[param]);
            if(value.toString() == params[param].toString()){
                console.log('bingo');
                $(this).find('input[type="checkbox"]').prop('checked', true);
                //c++;
            }
        }
        //const vv = $(this).find('span.url').html().trim();
        //console.log(vv);
        //$(this).find('input[type="checkbox"]').prop('checked', true);
    });
    //popup.addContent(c.toString(), 'selected');
    updateSelectionTicker();
}

function updateSelectionTicker(){
    const popup = globo.get('popupLog');
    const popupElement = popup.getPopupElement();
    //console.log(popupElement);
    const c = $(popupElement).find('log div.logslist input[type="checkbox"]:checked').length;
    //console.log(c);
    popup.addContent(c.toString(), 'selected');
}

function deselectAll(){
    $('log').find('div.logslist input[type="checkbox"]').prop('checked', false);
    updateSelectionTicker();
}


function getSelected(){
    const popup = new Popup('SelectedItems');
    popup.addContent('<textarea class="selectedItems" rows="20" cols="100"></textarea>');
    const out = [];
    $('log').find('div.logslist input[type="checkbox"]:checked').each(function(){
        //console.log($(this).val());
        out.push($(this).val());
    });
    
    $('popup#popup_SelectedItems textarea').html(out.join('\n'));
    //$('popup#selectedItems textarea').text(out.join('\n'));
}



function toggleSelectAll(el){
    const cbState = el.checked;
    const cbs = document.querySelector('logs').querySelectorAll('div.logslist>span>input[type="checkbox"]');
    //console.log(trs);

    cbs.forEach( cb => {
        cb.checked = cbState;
    });
}

function getLogByFilename(filename){
    if(filename === undefined) throw new Error("No log filename was selected")
    const obj = {
        controller : 'logs',
        action : 'getLog',
        filename : filename
    }

    return common.sendAjax(obj).then( response => {
        if(response.success){
            return JSON.parse(response.content);
        }else{
            throw new Error(response.error);
        }
    })
}



function saveLog(jobId, dataLog){
    common.sendAjax({
        controller: 'logs',
        action: 'saveLog',
        filename: `${jobId}.log`,
        data: JSON.stringify(dataLog)
    }).then( response => {
        console.log(response);
    });
}


function toggleSelectAll(el){
    const cbState = el.checked;
    const cbs = document.querySelector('logs').querySelectorAll('div>input[type="checkbox"]');
    //console.log(trs);

    cbs.forEach( cb => {
        cb.checked = cbState;
    });
}

function doAction(action){
    console.log(action);
    const selectedItems = document.querySelector('logs').querySelectorAll('div>input[type="checkbox"]:checked');
    //console.log(selectedItems);
    const arrPromises = [];
    selectedItems.forEach( item => {
        //console.log(item.value);
        const filename = item.value;
        arrPromises.push(deleteLog(filename));
    });

    Promise.all(arrPromises).then( () => {
        note('success', 'Log(s) have been successfully removed')
    }).catch( error => {
        note('error', error.message);
        console.log(error);
    })
}


function deleteLog(filename){

    return common.sendAjax({
        controller: 'logs',
        action: 'deleteLog',
        filename: filename
    }).then( response => {
        console.log(response);
        if(response.success){
            note('success', `Log ${filename} has been successfully deleted`);
            $('logs>div#'+generateFilenameFromURL(filename)).remove();
        }else{
            note('error', response.error);
            console.log(response.error);
        }

        return response.success;
    });
}

logs.show = show;
logs.showLog = showLog;
logs.saveLog = saveLog;
logs.toggleSelectAll = toggleSelectAll;
logs.filterItems = filterItems;
logs.deselectAll = deselectAll;
logs.getSelected = getSelected;
logs.updateSelectionTicker = updateSelectionTicker;
logs.toggleSelectAll = toggleSelectAll;
logs.doAction = doAction;
window.logs = logs;
})();