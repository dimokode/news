;(function(){


function dropdownmenu(){}

function init(container = null){
	if(container == null){
		//console.log('container is null');
		let elements = document.querySelector('body').querySelectorAll('input[data-dropmenu]');
		//console.log(elements);
		for(let element of elements){
			//console.log(element);
			element.setAttribute('onfocus', 'dropdownmenu.showDropdownList()');
			element.setAttribute('onblur', 'dropdownmenu.hideDropdownList()');
			element.setAttribute('onkeyup', 'dropdownmenu.keyup(event)');
			//console.log(element);
		}
	}
}

function showDropdownList(){
	hideDropdownList();
	let el = event.target;
	let elName = el.name;
	let dataSource = el.getAttribute('data-dropmenu-source');
	console.log(dataSource);
	//let aaa = 'data.getSomeShit';
	//let arrFunc = dataSource.split('.');
	//dataSet = window[arrFunc[0]][arrFunc[1]]();
	let regexp = /(.*?)\.(.*?)\((.*?)\)/g;
	let matchAll = dataSource.matchAll(regexp);
	results = Array.from(matchAll);
	let r = results[0];
	//console.log(results);
	console.log(r);
	let mod = r[1],
		func = r[2],
		args = r[3];
	let arrArgs = args.split(',').map(function(item){
		return item.trim();
	});
	//console.log(arrArgs);
	//arrArgs = ['set1', 2];
	console.log(arrArgs);
	//dataSet = window[mod][func](args);
	//dataSet = window[mod][func].apply(this, arrArgs);
	window[mod][func].apply(this, arrArgs).then(function(dataSet){
		if(dataSet){
			sessionStorage.dropmenuData = JSON.stringify(dataSet);
			let listHtml = showDataSet(el.value);

			let div = document.createElement('DIV');
			div.className = "dropdown";
			div.id = 'dropdownmenu_'+elName;
			div.innerHTML = listHtml;
			el.after(div);
		}else{
			return 'Error by retrieving dataSet';
		}
	});



}

function showDataSet(query){

	//let dataSet = Array.from(sessionStorage.dropmenuData);
	//console.log(dataSet);
	let dataSet  = JSON.parse(sessionStorage.dropmenuData);
	//console.log(Array.from(Object.entries(dataSet)));
	//console.log(Object.entries(dataSet));
	let listHtml = '';
	let i = 0;
	//let itemVisible = 'visible';
	let itemVisible = '';
	let marker = '';

	
		for(let dataItem in dataSet){
			//console.log(dataItem);
			if(query == '' || dataSet[dataItem].startsWith(query)){		
			if(i == 0){
				marker = 'view="first"';
			}else if(i == 4){
				marker = 'view="last"';
			}else{
				marker = '';
			}
			if(i>=5){
				itemVisible = "hidden";
			}
			
			
				listHtml+=`<div class="${itemVisible}" ${marker} onclick="dropdownmenu.selectItem();">${dataSet[dataItem]}</div>`;
			// onclick="dropdownmenu.selectItem();"
			i++;
			}
		}
		console.log(listHtml);

	return listHtml;
}

function hideDropdownList(){
	/*
	let el = event.target;
	let elName = el.name;
	//console.log(document.getElementById('dropdownmenu_'+elName));
	if(document.getElementById('dropdownmenu_'+elName) !== null){
		document.getElementById('dropdownmenu_'+elName).remove();
	}
	*/
	let dp = document.querySelector('.dropdown');
	//console.log(dp);
	if(dp){
		setTimeout(() => {
			dp.remove();
		}, 200);
		
	}
	sessionStorage.clear();
	
	return
}

function keyup(event){
	let el = event.target;
	let elName = el.name;
	let elId = el.id;
	let dropDownId = 'dropdownmenu_'+elName;
	let key = event.key;
	//console.log(key);
	
	let menuElement = document.getElementById('dropdownmenu_'+elName);
	if(menuElement == null){
		showDropdownList();
		//menuElement = document.getElementById('dropdownmenu_'+elName);
		return;
	}
	let menuElements = menuElement.childNodes;

	let selectedElements = document.querySelectorAll('.selected');

	switch(key) {
		case 'ArrowDown':
			if(selectedElements.length == 0){
				menuElements[0].classList.toggle("selected");
			}else{
				let selectedElement = selectedElements[0];
				let nextElement = selectedElement.nextElementSibling;
				//console.log(nextElement);
				if(nextElement !== null){
					selectedElement.classList.toggle("selected");
					nextElement.classList.toggle("selected");
					//console.log(selectedElement.getAttribute('view'));
					if(selectedElement.getAttribute('view') == 'last'){
						let firstViewElement = document.querySelector('[view="first"]');
						firstViewElement.removeAttribute('view');
						firstViewElement.classList.toggle('hidden');
						firstViewElement.nextElementSibling.setAttribute('view', 'first');
						selectedElement.removeAttribute('view');
						nextElement.setAttribute('view', 'last');
						nextElement.classList.toggle('hidden');
					}
				}
			}
			break
		case 'ArrowUp':
			if(selectedElements.length == 0){
				menuElements[0].classList.toggle("selected");
			}else{
				let selectedElement = selectedElements[0];
				let previousElement = selectedElement.previousElementSibling;
				//console.log(nextElement);
				if(previousElement !== null){
					selectedElement.classList.toggle("selected");
					previousElement.classList.toggle("selected");
					if(selectedElement.getAttribute('view') == 'first'){
						let lastViewElement = document.querySelector('[view="last"]');
						lastViewElement.removeAttribute('view');
						lastViewElement.classList.toggle('hidden');
						lastViewElement.previousElementSibling.setAttribute('view', 'last');
						selectedElement.removeAttribute('view');
						previousElement.setAttribute('view', 'first');
						previousElement.classList.toggle('hidden');
					}
				}
			}
			break
		case 'Enter':

			if(selectedElements.length == 1){
				let selectedElement = selectedElements[0];
				el.value = selectedElement.innerHTML;
			}
			hideDropdownList();
			break
		case 'Escape':
			hideDropdownList();
			break
		default:
			console.log(dropDownId);
			document.getElementById(dropDownId).innerHTML = showDataSet(el.value);
			break;
	}
	//console.log(key);
}

function selectItem(){
	let el = event.target;
	let selectedItemValue = el.innerHTML;
	//console.log(el.innerHTML);
	console.log(el.parentElement.previousElementSibling);
	el.parentElement.previousElementSibling.value = selectedItemValue;
	hideDropdownList(el.parentElement);
}

dropdownmenu.init = init;
dropdownmenu.showDropdownList = showDropdownList;
dropdownmenu.hideDropdownList = hideDropdownList;
dropdownmenu.selectItem = selectItem;
dropdownmenu.keyup = keyup;
window.dropdownmenu = dropdownmenu;
})();