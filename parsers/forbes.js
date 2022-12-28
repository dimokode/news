export async function parser2(cont, task, job, resolve){
    
    const obj = JSON.parse(cont);
    console.log(obj);
    //console.log(obj.blocks.items.length);

    
    const arr = [];

    
    
    try{

        let itemsCount = obj.blocks.items.length;
        let newItemsCount = 0;

        task.initProgress(itemsCount);
        //init task progressbar in job section
        job.progressBar('pbTask').initMaxValue(itemsCount);
        job.progressBar('pbTask').update(0);


        
        for(let item of obj.blocks.items){
            const {title, url, date, description} = item;
            //console.log(item);
            const objPatterns = {
                title: /\w+/i,
                url: /\w+/i,
                source: /\w+/i,
                date: /^\d+$/i,
                description: /\w+/i
            }
    
            const objItem = {
                title,
                url,
                source: 'forbes',
                date,
                description
            }
            console.log(timestampToDatetime(objItem.date));
    
            let strLog = '';
            for(let prop in objItem){
                const value = objItem[prop];
                //let value = (!objItem[prop] || objItem[prop] == false) ? `<span class="w3-text-red">${objItem[prop]}</span>` : `${objItem[prop]}`;
                const spanClass = (objPatterns[prop].test(value)) ? 'w3-light-grey' : 'w3-red';
                strLog+= `<span class="${spanClass}"><b>${prop}</b> : ${value} <br></span>`;
            }
    
            console.log(objItem);
            
            const logger = new Logger4(title+Date.now(), task.getLoggerElement());
            //logger.log(`${title} : ${url} : ${source} : ${date} : ${short_text}`);
            logger.log(`${strLog}`);
    
    
            task.updateProgress();
            job.progressBar('pbTask').update(task.progressBar().getCurrentValue());
        }
        


        resolve();


    }catch(error){
        note('error', error.message);
        console.log(error);
    }
}