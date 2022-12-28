export default class parser2{

    constructor(cont){
        //console.log('constructor');
        this.cont = cont;
    }


    init(){
        const newsBlock = parser.getBlockContentBySelector(this.cont, 'div.largeTitle');
        this.arrItemsBlocks = parser.getBlocksContentBySelector(newsBlock, 'article>div.textDiv');
        console.log(this.arrItemsBlocks);
        
        this.arrItemsBlocks = this.arrItemsBlocks.filter( itemBlockHTML => {
            if(itemBlockHTML.indexOf('sponsoredBadge') == -1 ){
                return true;
            }
        });

        console.log(this.arrItemsBlocks);

        //console.log('arrItemsBlocks', this.arrItemsBlocks);
        this.itemsCount = this.arrItemsBlocks.length;
        return this.itemsCount;
    }

    async do(cb){

        try{
            return new Promise((resolve, reject) => {

                const arrItems = [];
                for(let i=0; i<this.itemsCount; i++){

            
        
                        let modelBlockHTML = this.arrItemsBlocks[i];
                        let modelBlockObj = parser.convertHTMLToObject(modelBlockHTML);
                        


                            //console.log($(modelBlockObj).find('span.sponsoredBadge'));
                            
                        

                        let title = $(modelBlockObj).find('a').html().trim();
                        let url = $(modelBlockObj).find('a').attr('href');
                        let date = $(modelBlockObj).find('span.date').html();
        
                        let source = $(modelBlockObj).find('.articleDetails>span:not(.date)').html();
                        source = this.sourceParser(source);
                        let short_text = $(modelBlockObj).find('p').html().trim();
        
                        //console.log(date);
                        const dateConverted = this.dateConverter(date);
                        date = (!dateConverted) ? date : dateConverted;
        
                        const objItem = {
                            title,
                            url,
                            source,
                            date,
                            short_text
                        }

        
                        arrItems.push(objItem);
                        
                        const testErrorFlag = cb(objItem);//callback
                        //console.log('testErrorFlag', testErrorFlag);

                        if(testErrorFlag){
                            //note('warning', 'Parsing warning', 5000);
                            reject('Parsing warning');
                        }else{
                            
                        }
                        
        
             
                    //arrPromises.push(modelPromise)
        
                }//for

                resolve(arrItems);
                
        /*
                Promise.all(arrPromises).then(()=>{
                    console.log('class resolve');
                    resolve(arrItems);
                }).catch(err => {
                    console.log('class reject');
                    //note('error', 'catch error');
                    //console.log(err);
                    //reject(err);
                    //arrPromises
                });
        */   
            });

    
        }catch(error){
            note('error', error.message);
            console.error(error);
        }
    }


    dateConverter(str){
        //console.log('str:', str);
        if(/(\d{2}).(\d{2}).(\d{4})/i.test(str)){
            //console.log('dd.dd.dddd');
            const arrDate = str.match(/(\d{2}).(\d{2}).(\d{4})/i);
            const timestamp = dateToTimestamp({year: arrDate[3], month: arrDate[2], day: arrDate[1]});
            return timestamp;
        }else if(/(\w{3}) (\d{2}), (\d{4})/i.test(str)){
            //console.log('www dd, dddd');
            const arrMonths = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
            const arrDate = str.match(/(\w{3}) (\d{2}), (\d{4})/i);
            const timestamp = dateToTimestamp({year: arrDate[3], month: arrMonths.indexOf(arrDate[1].toLowerCase()), day: arrDate[2]});
            return timestamp;

        }else if(/(\d+) (час|часа|часов) назад/i.test(str)){
            //console.log('часа/часов назад');
            const arrDate = str.match(/(\d+) (час|часа|часов) назад/i);
            //console.log(arrDate);
            return Date.now()-arrDate[1]*3600*1000;
        }else if(/(\d+) (hour|hours) ago/i.test(str)){
            //console.log('hour/hours ago');
            const arrDate = str.match(/(\d+) (hour|hours) ago/i);
            //console.log(arrDate);
            return Date.now()-arrDate[1]*3600*1000;
        }else if(/(\d+) (minute|minutes) ago/i.test(str)){
            //console.log('(minute|minutes) ago');
            const arrDate = str.match(/(\d+) (minute|minutes) ago/i);
            //console.log(arrDate);
            return Date.now()-arrDate[1]*60*1000;
        }else if(/(\d+) (минут|минуты|минута) назад/i.test(str)){
            //console.log('(minute|minutes) ago');
            const arrDate = str.match(/(\d+) (минут|минуты|минута) назад/i);
            //console.log(arrDate);
            return Date.now()-arrDate[1]*60*1000;
        }
        else{
            //console.log(`Pattern hasn't been found`);
            return false;
        }
    }
    
    sourceParser(str){
        if( /By (\w+)/i.test(str)){
            return str.match(/By (\w+)/i)[1];
        }else if(/От (\w+)/i.test(str)){
            return str.match(/От (\w+)/i)[1];
        }else{
            return str;
        }
        
    }



}