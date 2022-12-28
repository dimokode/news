export default class parser2{

    constructor(cont){
        //console.log('constructor');
        this.cont = cont;
    }


    init(){
        this.arrItemsBlocks = parser.getBlocksContentBySelector(this.cont, 'a.newspage-news-item', true);
        console.log('arrItemsBlocks', this.arrItemsBlocks);
        this.itemsCount = this.arrItemsBlocks.length;
        return this.itemsCount;
    }

    async do(cb){

        try{
            return new Promise((resolve, reject) => {

                let arrPromises = [];
                const arrItems = [];
                for(let i=0; i<this.itemsCount; i++){
                    const modelPromise = new Promise((resolve, reject)=>{
    
                        let modelBlockHTML = this.arrItemsBlocks[i];
                        let modelBlockObj = parser.convertHTMLToObject(modelBlockHTML);
                        let title = $(modelBlockObj).find('div.newspage-news-item__heading').html().trim();
                        let url = $(modelBlockObj).find('a').attr('href');
                        let date = url.match(/(\d{4})-(\d{2})-(\d{2})/i);
        
                        let time = $(modelBlockObj).find('div.newspage-news-item__date').html();
                        time = time.match(/(\d{2}):(\d{2})/i);
                        const objDate = {
                            year: date[1],
                            month: date[2]-1,
                            day: date[3],
                            hours: time[1],
                            minutes: time[2]
                        }
        
                        const {year, month, day, hours, minutes} = objDate;
                        //console.log(year, month, day, hours, minutes);
        
                        date = new Date(year, month, day, hours, minutes).getTime();
        
                        let source = 'https://ihodl.com/news/';    
        
                        //const objPatterns = testlab.getPatterns();
        
                        const objItem = {
                            title,
                            url,
                            source,
                            date,
                            //short_text
                        }
    
                        //console.log(objItem);
                        arrItems.push(objItem);
                        
                        cb(objItem);

                        resolve();
                        
        
                    });
                    arrPromises.push(modelPromise)
        
                }//for
                
        
                Promise.all(arrPromises).then(()=>{
                    resolve(arrItems);
                });
            
            });

    
        }catch(error){
            note('error', error.message);
            console.log(error);
        }
    }



}