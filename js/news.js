;(function(){

function news(){}


function show(){
    template.loadTemplateByName('news.html').then(async function(html){
        $('content').html(html);
        showNews();
        //models.showModels(0);
    });
}


async function showNews(page = null){
    try{

        const sObj = getSearchParams(page);
        console.log(sObj);
        let {s_page, s_limit} = sObj;

        let {news, count} = await getNews(sObj);
        console.log(news);
        news = news.map( item => {
            //console.log(item);
            let {date} = item;
            item.timestamp = date;
            
            date = timestampToDatetime(date, 'date.month.year hour:min');
            item.negative = Number(item.negative).toFixed(2);
            item.neutral = Number(item.neutral).toFixed(2);
            item.positive = Number(item.positive).toFixed(2);

            /*
            item.t_negative = Number(item.t_negative).toFixed(2);
            item.t_neutral = Number(item.t_neutral).toFixed(2);
            item.t_positive = Number(item.t_positive).toFixed(2);
            */
            //console.log(date);
            return Object.assign(item, {date}, {id: _generateNewsId(item.url)});
        });
        //console.log(news);
    
        
        let html = template.generateList({
            tpl: await template.loadRawTemplateFromFile('newsrow.html'),
            data: news
        });
    
        $('newsFound').html(count);
        $('newslist').html(html);
        $('paginator').html( buildPaginator(count, s_page, s_limit));
        $('input[name="s_page"]').val(s_page);
    }catch(error){
        note('error', error.message);
    }

}

function getApi(page = null){
    const sObj = getSearchParams(page);
    //console.log(sObj);
    const arr = [];
    for(item in sObj){
        //console.log(item);
        arr.push(`${item}=${sObj[item]}`);
    }
    const searchParams = arr.join('&');
    console.log(searchParams);
}


function getSearchParams(page){
    let sObj = SimpleForm.getFormData('news_search_form');
        
    if(page != null){
        sObj.s_page = page;
    }

    //let {s_date_start, s_date_end, s_page, s_limit} = sObj;
    let {s_date_start, s_date_end} = sObj;

    const timeOffset = new Date().getTimezoneOffset()*60*1000;
    
    sObj = Object.assign(sObj, {
        //s_start : start_position,
        s_date_start : (s_date_start != '') ? new Date(s_date_start).getTime() + timeOffset : '',
        s_date_end : (s_date_end != '') ? new Date(s_date_end).getTime()+(24*60*60*1000) + timeOffset : ''
    });

    //$('input[name="s_position"]').val(Number(start_position) + Number($('select[name="s_limit"]').val()));
    return sObj;
}


function buildPaginator(count, page, limit){
    page = Number(page);

    const gen = (from, to) => {
        let html2 = '';
        for(let i=from; i<=to; i++){
            if(page == i){
                htmlDisabled = `disabled="true"`;
            }else{
                htmlDisabled = '';
            }
            //html+= `<button class="w3-button w3-grey" onclick="news.showNews(${i});" ${htmlDisabled}>${i}</button>`;
            html2+= genButton(i, i, htmlDisabled);
        }
        return html2;
    }

    const genButton = (page, text, htmlDisabled = '', className = '') => {
        return `<button class="w3-button w3-grey ${className}" onclick="news.showNews(${page});" ${htmlDisabled}>${text}</button>`;
    }

    //console.log(page);
    const pagesCount = Math.ceil(count/limit);
    //console.log(pagesCount, typeof pagesCount);
    let html = '';
    console.log('page', page);
    console.log('pagesCount', pagesCount);

    if(pagesCount<=20){

        html+= gen(1, pagesCount);

    }else if(pagesCount>20){
        if( page > 1 ){
            html+= genButton(page-1, '<<<', '','rightIndent');
        }

        if( page<=6 ){

            html+= gen(1, 7);
            html+= genButton(pagesCount, 'Last', '','leftIndent');

        }else if( page>6 && page<pagesCount-6 ){

            html+= genButton(1, 'First', '','rightIndent');
            html+= gen(page-5, page+5);
            html+= genButton(pagesCount, 'Last', '','leftIndent');

        }else if(page >= pagesCount-6){

            html+= genButton(1, 'First', '','rightIndent');
            html+= gen(pagesCount-7, pagesCount);

        }

        if( page < pagesCount ){
            html+= genButton(page+1, '>>>', '','leftIndent');
        }
        //html = gen(html, page, page+19);
    }


    
    //return `<button class="w3-button w3-green" onclick="">${count}</button>`;
    return html;
}



function showNewsNext(){
    let start_position = $('input[name="s_position"]').val();
    showNews(start_position);
}


function _generateNewsId(url){
    let id = (url.indexOf('?') !== -1) ? url.split('?').shift() : url;
    return id.replace(/((http|https):\/\/)/i, '').replace(/[.\/]/gi, '_');
}



function getNews(sObj){
    //console.log(sObj);
    return common.sendAjax({
        controller : 'News',
        action : 'getNews',
        searchParams : sObj
    }).then( response => {
        console.log(response);
        if(response.success){
            return {
                news: response.news,
                count: response.count
            }
        }else{
            note('error', response.error);
            console.log(response.error);
            return;
        }
    });
}


function deleteNews(url){

    return common.sendAjax({
        controller: 'news',
        action: 'deleteSingleNewsById',
        id: url
    }).then( response => {
        console.log(response);
        if(response.success){
            note('success', `News ${url} has been successfully deleted`);
            $('div#'+_generateNewsId(url)).remove();
        }else{
            note('error', response.error);
            console.log(response.error);
        }

        return response.success;
    });
}





//DB ------------------------
async function insertNewsInDB(arrNews){

    const result = {
        true: 0,
        false: 0
    }

    for(let i=0, len = arrNews.length; i<len; i++ ){
        if(await insertSingleNewsInDB(arrNews[i])){
            result.true++;
        }else{
            result.false++;
        }
    }

    return result;

}

/**
function insertNewsInDB(arrNews){
    const arrPromises = [];

    arrNews.forEach(  (objSingleNews, index) => {
        //if(index == 0){
            arrPromises.push( insertSingleNewsInDB(objSingleNews));
        //}
        //console.log(objSingleNews);
    });

    //console.log('arrPromises', arrPromises);

    return Promise.all(arrPromises).then( arrResponses => {
        //console.log(arrResponses);
        const result = {
            true: 0,
            false: 0
        }
        for(let i=0; i<arrResponses.length; i++){
            if(arrResponses[i]){
                result.true++;
            }else{
                result.false++;
            }
        }
        return result;
    });
}
 */

function insertSingleNewsInDB(objNews){
    //console.log(objNews);
    const obj = {
        controller : 'news',
        action : 'insertSingleNewsInDB',
        data : objNews
    }

    return common.sendAjax(obj).then(function(response){
        //console.log(response);
        return response.success;
    });
}

function toggleSelectAll(el){
    const cbState = el.checked;
    const cbs = document.querySelector('newslist').querySelectorAll('div.newslist>span>input[type="checkbox"]');
    //console.log(trs);

    cbs.forEach( cb => {
        cb.checked = cbState;
    });
}

function doAction(action){
    console.log(action);
    const selectedItems = document.querySelector('newslist').querySelectorAll('div.newslist>span>input[type="checkbox"]:checked');
    //console.log(selectedItems);
    const arrPromises = [];
    selectedItems.forEach( item => {
        //console.log(item.value);
        const url = item.value;
        arrPromises.push(deleteNews(url));
    });

    Promise.all(arrPromises).then( () => {
        note('success', 'News have been successfully removed from db')
    }).catch( error => {
        note('error', error.message);
        console.log(error);
    })

}

news.insertNewsInDB = insertNewsInDB;
news.showNews = showNews;
news.deleteNews = deleteNews;
news.showNewsNext = showNewsNext;
news.toggleSelectAll = toggleSelectAll;
news.doAction = doAction;
news.getApi = getApi;
news.show = show;
window.news = news;
})();