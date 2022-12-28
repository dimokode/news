function isObjectEmpty(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

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
/*
String.prototype.hash = function() {
  var hash = 0;
  for (var i = 0; i < this.length; i++) {
      var char = this.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
  }
  return hash;

String.prototype.hash = function(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1>>>0);
};
}
*/

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

HTMLElement.prototype.getDirectChild = function(selector){
	let child = this.querySelector(selector);
	if(child !== null && child.parentNode == this){
		return child;
	}else{
		return false;
	}
}


Promise.prototype.cancel = function(){
  console.log('Promise cancel')
  console.log(this)
}

function getFilenameFromUrl(url){
	let urlArray = url.split('/');
	return filename = urlArray[urlArray.length-1];
}


function timestampConverter(unix_timestamp){
  /*
  if(unix_timestamp.length > 10){

  }
  */
    //let unix_timestamp = 1549312452
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    var year = date.getFullYear();
    var month = (date.getMonth()+1<10) ? '0'+(date.getMonth()+1) : date.getMonth()+1;
    var day = (date.getDate()<10) ? '0'+date.getDate() : date.getDate();
    // Hours part from the timestamp
    var hours = (date.getHours()<10) ? '0'+date.getHours() : date.getHours();
    // Minutes part from the timestamp
    var minutes = (date.getMinutes() <10) ? '0'+date.getMinutes() : date.getMinutes();
    // Seconds part from the timestamp
    var seconds = (date.getSeconds()<10) ? '0'+date.getSeconds() : date.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = `${day}.${month}.${year} / ` + hours + ':' + minutes + ':' + seconds;
    return formattedTime;
}


function uniqueArray(array){
    return array.filter((item, index) => {
        if(item !== null)  return array.indexOf(item) === index
    })
}


function hash(str){
  console.log('str', str)
  str = String(str);
    let hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
      char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

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


function cleanUrl(url){
  return url.replace('\r', '')
}

