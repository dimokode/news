export async function parser2(cont, task, job, resolve){
    try{

        //const date_title = parser.getBlockContentBySelector(cont, 'div.newspage-news__day-title').html();
        //console.log(date_title);
        
        //const newsBlock = parser.getBlockContentBySelector(cont, 'div.largeTitle');
        //console.log(newsBlock);

        let arrModelBlocks = parser.getBlocksContentBySelector(cont, 'a.newspage-news-item', true);
        console.log('arrModelBlocks', arrModelBlocks);
        

        let itemsCount = arrModelBlocks.length;
        let newItemsCount = 0;

        task.initProgress(itemsCount);
        //init task progressbar in job section
        job.progressBar('pbTask').initMaxValue(itemsCount);
        job.progressBar('pbTask').update(0);

        
        let arrPromises = [];
        const arrItems = [];
        for(let i=0; i<itemsCount; i++){
            const modelPromise = await new Promise((resolve, reject)=>{
                let arrModelPromises = [];

                let modelBlockHTML = arrModelBlocks[i];
                let modelBlockObj = parser.convertHTMLToObject(modelBlockHTML);
                let title = $(modelBlockObj).find('div.newspage-news-item__heading').html().trim();
                let url = $(modelBlockObj).find('a').attr('href');
                let date = url.match(/(\d{4})-(\d{2})-(\d{2})/i);

                let time = $(modelBlockObj).find('div.newspage-news-item__date').html();
                time = time.match(/(\d{2}):(\d{2})/i);
                const objDate = {
                    year: date[1],
                    month: date[2],
                    day: date[3],
                    hours: time[1],
                    minutes: time[2]
                }

                const {year, month, day, hours, minutes} = objDate;
                console.log(year, month, day, hours, minutes);

                date = new Date(year, month, day-1, hours, minutes).getTime();

                let source = 'https://ihodl.com/news/';
                //source = sourceParser(source);
                //let short_text = $(modelBlockObj).find('p').html().trim();

                //console.log(date);
                //date = dateConverter(date);
                //date = (!timestamp) ? date : timestamp;
                //console.log(date);



                const objPatterns = testlab.getPatterns();

                const objItem = {
                    title,
                    url,
                    source,
                    date,
                    //short_text
                }

                let strLog = '';
                for(let prop in objItem){
                    const value = objItem[prop];
                    //let value = (!objItem[prop] || objItem[prop] == false) ? `<span class="w3-text-red">${objItem[prop]}</span>` : `${objItem[prop]}`;
                    const spanClass = (objPatterns[prop].test(value)) ? 'w3-light-grey' : 'w3-red';
                    strLog+= `<span class="${spanClass}"><b>${prop}</b> : ${value} <br></span>`;
                }

                console.log(objItem);
                arrItems.push(objItem);
                
                const logger = new Logger4(title+Date.now(), task.getLoggerElement());
                //logger.log(`${title} : ${url} : ${source} : ${date} : ${short_text}`);
                logger.log(`${strLog}`);

                task.updateProgress();
                job.progressBar('pbTask').update(task.progressBar().getCurrentValue());
                resolve();

            })
            arrPromises.push(modelPromise)

        }//for
        

        Promise.all(arrPromises).then(()=>{
            job.updateProgress();
            resolve(arrItems);
        });

    }catch(error){
        note('error', error.message);
        console.log(error);
    }
}


function dateConverter(str){
    console.log('str:', str);
    if(/(\d{2}).(\d{2}).(\d{4})/i.test(str)){
        console.log('dd.dd.dddd');
        const arrDate = str.match(/(\d{2}).(\d{2}).(\d{4})/i);
        console.log(arrDate);
        const timestamp = dateToTimestamp({year: arrDate[3], month: arrDate[2], day: arrDate[1]});
        return timestamp;
    //}else if(/[а-яА-Я]?/i.test(str)){
    }else if(/(\d+) (часа|часов) назад/i.test(str)){
        console.log('часа/часов назад');
        const arrDate = str.match(/(\d+) (часа|часов) назад/i);
        console.log(arrDate);
        return Date.now()-arrDate[1]*3600*1000;
    }else if(/(\d+) (hour|hours) ago/i.test(str)){
        console.log('hour/hours ago');
        const arrDate = str.match(/(\d+) (hour|hours) ago/i);
        console.log(arrDate);
        return Date.now()-arrDate[1]*3600*1000;
    }else if(/(\d+) (minute|minutes) ago/i.test(str)){
        console.log('(minute|minutes) ago');
        const arrDate = str.match(/(\d+) (minute|minutes) ago/i);
        console.log(arrDate);
        return Date.now()-arrDate[1]*60*1000;
    }else{
        console.log(`Pattern hasn't been found`);
        return false;
    }
}

function sourceParser(str){
    if( /By (\w+)/i.test(str)){
        return str.match(/By (\w+)/i)[1];
    }else if(/От (\w+)/i.test(str)){
        return str.match(/От (\w+)/i)[1];
    }else{
        return str;
    }
    
}