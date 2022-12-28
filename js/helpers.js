// OBJECTS ------------------------------
function isObjectEmpty(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

/*
Object.prototype.length = function(){
    return Object.keys(this).length;
}
*/

function cloneObject(obj){
  return JSON.parse(JSON.stringify(obj));
}

function implode (glue, pieces) {
    //  discuss at: https://locutus.io/php/implode/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Waldo Malqui Silva (https://waldo.malqui.info)
    // improved by: Itsacon (https://www.itsacon.net/)
    // bugfixed by: Brett Zamir (https://brett-zamir.me)
    //   example 1: implode(' ', ['Kevin', 'van', 'Zonneveld'])
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'})
    //   returns 2: 'Kevin van Zonneveld'
  
    var i = ''
    var retVal = ''
    var tGlue = ''
  
    if (arguments.length === 1) {
      pieces = glue
      glue = ''
    }
  
    if (typeof pieces === 'object') {
      if (Object.prototype.toString.call(pieces) === '[object Array]') {
        return pieces.join(glue)
      }
      for (i in pieces) {
        retVal += tGlue + pieces[i]
        tGlue = glue
      }
      return retVal
    }
  
    return pieces
  }

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


HTMLElement.prototype.getDirectChild = function(selector){
	let child = this.querySelector(selector);
	if(child !== null && child.parentNode == this){
		return child;
	}else{
		return false;
	}
}



// DateTime convertation --------------------------------

function formatDate(timestamp, formatString){
	let dateT = formatString.split('T');
	//console.log(dateT);
	dateParts = dateT[0].split('-');
	dateParts = dateParts.concat(dateT[1].split(':'));

	//console.log(dateParts);
	let date = new Date(timestamp);
	//console.log(date);

	let dateObj = {
		yyyy : date.getFullYear(),
		MM : (date.getMonth()+1<10) ? '0' + (date.getMonth()+1) : (date.getMonth()+1),
		dd : (date.getDate()<10) ? '0' + date.getDate() : date.getDate(),
		hh : (date.getHours()<10) ? '0' + date.getHours() : date.getHours(),
		mm : (date.getMinutes()<10) ? '0' + date.getMinutes() : date.getMinutes(),
		ss : (date.getSeconds()<10) ? '0' + date.getSeconds() : date.getSeconds(),
	}

	let formatedDate = formatString;
	dateParts.forEach(function(item){
		//console.log(item);
		formatedDate = formatedDate.replace(item, dateObj[item]);
	});
	return formatedDate;
	//console.log(dateObj);
	//console.log(formatedDate);
}


function timestampToDatetime(timestamp, dFormat = 'date.month.year hour:min:sec'){
  timestamp = Number(timestamp);
  var d = new Date(timestamp);
  //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  let objDate = {
    year : d.getFullYear(),
    month : d.getMonth()+1,
    date : d.getDate(),
    hour : d.getHours(),
    min : d.getMinutes(),
    sec : d.getSeconds(),
  }


  
  for(let item in objDate){
    if(objDate[item]<10){
      objDate[item] = '0'+objDate[item];
    }

    dFormat = dFormat.replace(item, objDate[item]);
  }

  return dFormat;
}


function dateToTimestamp({year, month, day}){
    return new Date(year, month-1, day).getTime();
}



function formatFloat(floatValue){
    floatValue = Number(floatValue)
    if(floatValue > 1){
        floatValue = floatValue.toFixed(2)
    }else if(floatValue < 1 && floatValue > 0.01){
        floatValue = floatValue.toFixed(4)
    }else if(floatValue > 0.01 && floatValue > 0.0001){
        floatValue = floatValue.toFixed(8)
    }
    return Number(floatValue);
}

function openLink(link, blank = true){
  window.open(link, (blank) ? 'blank' : '');
}

async function importObjectFromFile(path_to_file){
  return import(path_to_file + '?'+Date.now()).then( (module) => {
      return module.obj;
  });
}


HTMLElement.prototype.findParentElementByTagname = function(targetElementTagname){
  let currentElement = this;
  targetElementTagname = targetElementTagname.toUpperCase();
  let parentElement = currentElement.parentElement;
  //console.log(parentElement, parentElement.tagName);
  if(parentElement.tagName == targetElementTagname){
      return parentElement;
  }else{
      return parentElement.findParentElementByTagname(targetElementTagname);
  }
}


function timeToLocal(originalTime) {
  const d = new Date(originalTime * 1000);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
}

function note(f,txt,t=5000){

  if(!txt) txt='';
  switch (f){
   case 'success':
      iziToast.success({
          title: 'Успешно!',
          message: txt,
          timeout: t,
      });
   break;
   case 'error':
      iziToast.error({
          title: 'Ошибка!',
          message: txt,
          timeout: t,
      });
   break;
   case 'warning':
      iziToast.warning({
          title: 'Внимание!',
          message: txt,
          timeout: t,
      });
   break;
   case 'info':
      iziToast.info({
          title: txt,
          timeout: t,
      });
   break;
  }
}



function getFileExtension(filename){
  const fileParts = filename.split('.');
  if(fileParts.length == 1){
    return false;
  }else{
    return fileParts.pop();
  }
  
}


//URL ----------
function cleanUrl(url){
  return url.replace('\r', '')
}

function generateFilenameFromURL(url, ext = ''){

  let filename = (url.indexOf('?') !== -1) ? url.split('?').shift() : url;

  filename = filename.replace(/((http|https):\/\/)/i, '').replace(/[.\/]/gi, '_');
  let fileext = (ext != '') ? `.${ext}` : '';
  return filename + fileext;
}

//HASH -------------
const cyrb53 = function(str, seed = 0) {
  if(str !== null){
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
  }else{
    console.log('ERROR', 'str is null');
    return
  }
};



function wait(s, cb){
  if(cb !== undefined && typeof cb == 'function'){
    cb()
  }
  
  return new Promise((resolve, reject) => {
      const tt = setTimeout(()=>{
          resolve()
      }, s*1000);

  })
}