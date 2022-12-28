;(function(){

function de(){}

function show(){

    //alert('de');
    template.loadTemplateByName('de.html').then(function(tpl){
        $('#content').html(tpl);
    });
}


function hasSubs(li){
	var subs = [];
	for(var i = 0, il = li.childNodes.length; i < il; i ++){
		if(li.childNodes[i].nodeName == "UL"){
			subs[subs.length] = li.childNodes[i];
		}
	}
	return subs;
}
		
function isLI(node){
	return node.nodeName == "LI";
}
		
function count(el, cont = ''){
    //var childs = ul.childNodes;
    //console.log(el);
    let ul = el.querySelector('ul');
    if(ul !== null){

    
    let childs = ul.childNodes;
	for(var i = 0, il = childs.length; i < il; i ++){
		if(isLI(childs[i])){
			var subs = hasSubs(childs[i]);
			if(subs.length){
				for(var j = 0, jl = subs.length; j < jl; j ++){
                    //cont+=childs[i].innerHTML;
                    cont+=childs[i].textContent;
                    count(subs[j], cont);
                    //console.log(childs[i].firstChild.textContent);
                    cont+=childs[i].firstChild.textContent;
				}
			}else{
                //cont+=childs[i].innerHTML;
                cont+=childs[i].textContent;
				//return(childs[i].innerHTML);
			}	
		}
    }
    
    }
    return cont;
}

function getXML(){
   //console.log(getTree(document.getElementById('de')));
   //console.log(getTree(document.getElementById('de')));
   let cont = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+getTree(document.getElementById('de'));
   let obj = {
    'controller' : 'files',
    'action' : 'saveContentToFile',
    'folder' : '/test/out/word/',
    'filename' : 'document.xml',
    'cont' : cont
    }

    common.sendAjax(obj).then(function(json){
        console.log(json);
        if(json['success']){
            //alert(json['msg']);
            
            let obj = {
                'controller' : 'documents',
                'action' : 'assembyDoc',
                'sourceFolder' : '/test/out/',
                'destinationFolder' : '/test/',
                'filename' : 'test3.docx'
            }

            common.sendAjax(obj).then(function(json){
                console.log(json);
            });
        }
    });
}


function getTree(el, cont=''){
	//let cont = '';

	if(el.tagName == 'UL'){
		//console.log('ul');
		let children = el.children;
		for(let i=0, clen = children.length; i<clen; i++){
			//console.log(children[i]);
			if(children[i].children){
				cont+=getTree(children[i], cont);
			}
		}
	}else if(el.tagName == 'LI'){
		//console.log('li');
		//console.log(el.firstChild);
		let value = el.firstChild.textContent;
		let value1 = value.replace(/\s+/g, '');
		if(value1 == ''){
			value = value1;
		}else{
			value = value.replace(/[\t\n]+/g, '');
		}

		//console.log(value.match(/^w:/gi));

		
		if(el.children.length > 0){

			if(value.trim() != ''){
				//out('<'+value+'>\n');
				cont ='<'+value+'>\n';
			}
			let children = el.children;
			//console.log(children);
			for(let i=0, clen = children.length; i<clen; i++){
				//console.log(children[i].tagName);
				if(children[i].tagName == 'UL'){
					cont = getTree(children[i], cont);
				}
			}
			let tag = value.split(' ');
			//console.log(tag[0]);
			//out('</'+tag[0]+'>\n');
			cont+= '</'+tag[0]+'>\n';
		}else{
			//if(value.trim() != ''){
			//	out(value + '\n');
			//}
			if(value.match(/^w:/gi)){
				//out(`<${value}/>\n`);
				cont = `<${value}/>\n`;
			}else{
				//out(value + '\n');
				cont = value + '\n';
			}
		}

		//getTree(el);

	}else{
		//console.log('else');
		let children = el.children;
		for(let i=0, clen = children.length; i<clen; i++){
			//console.log(children[i].tagName);
			if(children[i].tagName == 'UL'){
				cont+=getTree(children[i], cont);
			}
		}
	}
	//console.log(cont);
	return cont;
}

function recXML(el, cont=''){
    //let cont = '';
    let li = el.querySelector('li');
    
    if(li !== null){
        cont+=li.firstChild.textContent;
        recXML(li, cont);
    }
    
    //recXML(li);
    /*
    if(li !== null){
        if(li.childNode && li.firstChild.nodeType == 3){
            cont+=li.firstChild.textContent;
        }
        if(li.querySelector('li') !== undefined){

            recXML(li.querySelector('li'), cont);
        }
    }

/*
    if(li.firstChild.nodeType == 3){
        cont+=li.firstChild.textContent;
        let ul = li.querySelector('li');
        console.log(ul);
    }else{

        console.log(li.firstChild.nodeType);
    }
    if(c>100){
        //break;
    }
    if(li.querySelector('li') !== undefined){
        c++;

        recXML(li.querySelector('li'));
    }*/
    //console.log(li.firstChild.nodeType);
    //return cont;    
    //console.log(cont);
    return cont;
}


function getDocument(filename){
    var obj = {
        'controller' : 'documents',
        'action' : 'extractDoc',
        'folder' : '/template/',
        'filename' : filename,
        'folderTo' : '/template/out/'
    }

    common.sendAjax(obj).then(function(json){
        //console.log(json['fcont']);
        //$('#out').html(json['fcont']);
        //createTextarea('de', 'ta1', json['fcont']);
        let parser = new DOMParser();
        let arr = parser.parseFromString(json['fcont'], "application/xml");
        //console.log(arr);
        let parElement = document.querySelector('#de');
        parElement.innerHTML = '';
        //console.log(recdom(arr));

        //document.body.append(recdom(arr));
        parElement.append(recdom(arr));
        addEvents('de');

    });
}


function addEvents(parElId){
    let parEl = document.querySelector('#'+parElId);
    let children = parEl.querySelectorAll('LI');
    console.log(children);
    for(let i=0, lilen = children.length; i<lilen; i++){
        console.log(children[i].firstChild);
        children[i].addEventListener('mouseup', function(event){
            console.log(event.target.firstChild);
        }, false);
    }
}

function getDocument2(){
    var obj = {
        'controller' : 'files',
        'action' : 'getFileInFolder',
        'folder' : '/test/out/word/',
        'filename' : 'document.xml',

    }

    common.sendAjax(obj).then(function(json){
        if(json['success']){
            let parser = new DOMParser();
            let arr = parser.parseFromString(json['fcont'], "application/xml");
            console.log(arr);
            let parElement = document.querySelector('#de');
            //console.log(recdom(arr));

            //document.body.append(recdom(arr));
            parElement.append(recdom(arr));
            addEvents('de');
        }else{
            alert(json['error']);
        }

    });
}


function getDocument3(){
    var obj = {
        'controller' : 'files',
        'action' : 'getFileInFolder',
        'folder' : '/work/word/',
        'filename' : 'document.xml',

    }

    common.sendAjax(obj).then(function(json){
        if(json['success']){
            let parser = new DOMParser();
            let arr = parser.parseFromString(json['fcont'], "application/xml");
            console.log(arr);
            let parElement = document.querySelector('#de');
            //console.log(recdom(arr));

            //document.body.append(recdom(arr));
            parElement.append(recdom(arr));
            addEvents('de');
        }else{
            alert(json['error']);
        }

    });
}
/*
function getDocument(filename){
    const obj = {
        'controller' : 'documents',
        'action' : 'generateDoc',
        'docType' : docType,
        'formData' : forma.getForm3(formId)['formData']
    }
}
*/
function recdom(arr){

    let ul = document.createElement('ul');
    let li;
    for(let node of arr.childNodes){
        //console.log(node.childNodes.length);
        if(node.childNodes.length == 0){
            //console.log(node);
            //return;
        }
        let tagName = node.tagName;
        
        li = document.createElement('li');
        if(tagName !== undefined){
            li.textContent = tagName;
        }else{
            li.textContent = node.textContent;
        }
        
        if(node.attributes !== undefined){
  
            //console.log(node.attributes);
            for(let i=0; i<node.attributes.length; i++){
                //console.log(node.attributes[i]);
                //console.log(node.attributes[i].name + '=>' + node.attributes[i].value);
                li.textContent+= ' ' + node.attributes[i].name + '="' + node.attributes[i].value + '"';
            }
        }
        
        if(node.childNodes.length != 0){
            li.appendChild(recdom(node));
        }else{
            //console.log(node);
        }

        ul.appendChild(li);
        
    }

    
    
    return ul;

}

function createTextarea(parElementId, taId, cont){
    let textarea = document.createElement('textarea');
    textarea.rows = 10;
    textarea.cols = 100;
    textarea.id = taId;
    textarea.innerHTML = cont;
    let parElement = document.querySelector('#'+parElementId);
    parElement.append(textarea);
}


function showTemplates(){
    var obj = {
        'controller' : 'files',
        'action' : 'getFilesInFolder',
        'fldname' : 'template/'
    }

    common.sendAjax(obj).then(function(json){
        console.log(json);
        
        var html = '';
        for(key in json['files']){
            var filename = json['files'][key];
            //html+='<input type="checkbox" value="'+ filename +'"><a href="' + obj['fldname'] + '/' + filename +'">' + filename + '</a><br>';
            //html+=`<a href="js:void();" onclick="de.getDocument('${obj['fldname']}${filename}')">${filename}</a><br>`;
            html+=`<a href="js:void();" onclick="de.getDocument('${filename}')">${filename}</a><br>`;
        }
        $('#templates').html(html);
        
    });
}

de.show = show;
de.getDocument = getDocument;
de.getDocument2 = getDocument2;
de.getXML = getXML;
de.showTemplates = showTemplates;
window.de = de;

})();