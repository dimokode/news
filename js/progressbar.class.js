class Progressbar{

    constructor(id, min=0, max=100){
        //console.log('max', max)
        this.id = id;
        this.min = min;
        this.max = max;
        this.current = 0;
        this.perPercentage = 100/(this.max-this.min);
        //console.log(this.perPercentage);
        const htmlProgressBar = `
        <progresso id="${id}" min="${this.min}" max="${this.max}" current="${this.current}">
            <bar>0%</bar>
        </progresso>`;
        //document.querySelector(id).innerHTML = htmlProgressBar;
        this.htmlProgressBar = htmlProgressBar;
        //return htmlProgressBar;
    }


    getProgressBar(){
        return this.htmlProgressBar;
    }

    initMaxValue(value){
        this.max = value;
        this.perPercentage = 100/(this.max-this.min);
        const pb = document.querySelector('progresso#'+this.id);
        pb.setAttribute('max', value);
        this.updateProgress(this.current)
    }


    updateProgress(currentValue){
        const pb = document.querySelector('progresso#'+this.id);
        const bar = pb.querySelector('bar');
        this.current = currentValue;
        pb.setAttribute('current', currentValue);
        const progressPercentage = (currentValue*this.perPercentage).toFixed(2);
        bar.innerHTML = `${currentValue}/${this.max} (${progressPercentage})%`;
        bar.style.width = progressPercentage+"%";
    }

    getCurrentValue(){
        const pb = document.querySelector('progresso#'+this.id);
        return Number(pb.getAttribute('current'));

    }
}