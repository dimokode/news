class Jobtask{

    start(){
        this.time = performance.now();
    }

    end(){
        return ((performance.now() - this.time ) / 1000).toFixed(3)
    }

    /*
    tagContent(tagName, value){
        console.log('this.element', this.element)
        //console.log('taskId', this.taskId)
        //const taskElement = document.querySelector('#'+this.taskId)
        //console.log(taskElement)
        const tagElement = this.element.querySelector(tagName)
        console.log('tagElement', tagElement)
        if(value == undefined){
            return tagElement.innerHTML    
        }else{
            tagElement.innerHTML = value
            this.data[tagName] = value
        }   
    }
    */

}