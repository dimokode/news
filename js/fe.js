;(function(){

function fe(){}

function show(){
	template.loadTemplateByName('formeditor.html').then(function(tpl){
		$('#content').html(tpl);
	}).then(function(){
		showConfigFiles();
	});
}


function showConfigFiles(){
	var obj = {
		'controller' : 'files',
		'action' : 'getFilesInFolder',
		'fldname' : 'config',
	}

	common.sendAjax(obj).then(function(json){
		var html = '';
		//var arrConfigFiles = JSON.parse(json['files']);
		//arrConfigFiles.forEach(element, index){
		json['files'].forEach(function(element, index){
			html+='<input type="checkbox" value="'+element+'"><a href="javascript:void();" onclick="forma.checkElement($(this));fe.getConfigFile(\''+element+'\');">'+element+'</a><br>';
		});
		$('#configfiles').html(html);
	});
}

function generateForm(jsonData, objForm){
	return new Promise(function(resolve){
		arrData = JSON.parse(jsonData);
		let html='', sectionHtml = '';
		sectionHtml='<div id="form_header">';
		for(key in objForm){
			let obj = {
				element: 'input',
				label: key,
				attributes : {
					id: key,
					name: key,
					type: 'text',
					value: objForm[key],
				}
			}
			//sectionHtml+=forma.generateField(obj);//file section
			sectionHtml+=fg.generate(obj);//file section
		}
		sectionHtml+='</div>';

		console.log(arrData);
		//html+=`<div id="list" class="treeline">`;
		html+=`<div id="list">`;
		for (key in arrData){
			html+= fe.createElement(key, arrData[key]);
		}
		html+=`</div>`;
		return resolve(sectionHtml+html);
	});//promise
}

function getConfigFile(configDataFile){
	//var filepath = 'config/' + configDataFile;
	let configFile =  'config/' + configDataFile;

	forma.loadConfigDataFile(configFile).then(function(json){
		//console.log('jD:' + jsonData);
		console.log(json);

		if(json !== false){
			//json = JSON.stringify(json2);
			var jsonData = json['jsonData'];
			//console.log(jsonData);
			var objForm = {
				//filepath: filepath,
				folder: 'config',
				filename: configDataFile,
				formAction: 'update'
			}
			
			fe.generateForm(jsonData, objForm).then(function(formHTML){
				var tags = {
					'callback' : 'fe.cbSaveFile'
				}
				//console.log('formHTML:' + formHTML);
				//console.log(generateOptions('element'));

				template.loadTemplateByName('forma-fe.html', tags).then(function(tpl){
					let tags = {
						'element_options' : generateOptions(config['htmlElements']),
						'elementType_options' : generateOptions(config['htmlElements']['input']),
					}
					template.loadTemplateByName('formeditor-menu.html', tags).then(function(formEditorHtml){
						$('#formeditor').html(tpl);
						$('#form').html(formEditorHtml+formHTML);
						//addSortableEvents();
						//fillElementById('elementType', $('#element').val());
						globalEvents();
						//addAllEvents();							
						//toggleItemGroupEditor();

						/*
						$("#list").find('ul,li').each(function(){
							$(this).enableSelection();
						});
						*/
						if(json['msg'] != undefined){
							alert(json['msg']);
						}
					});

				});
			});
		}	
	});
}

function toggleSortable(disabledTrigger = ''){
	//const disabled = (disabledTrigger === '') ? $("#list").sortable( "option", "disabled" ) : disabledTrigger;
	let disabled = '';
	if(disabledTrigger === ''){
		disabled = $("#list").sortable( "option", "disabled" );
	}else if(disabledTrigger == 'enable'){
		disabled = true;
	}else{
		disabled = false;
	}
	//const disabled = $("#list").sortable( "option", "disabled" );
	console.log('disabled:' + disabled);
	if (disabled) {
		$("#list").sortable( "enable" );
		$('#test').html('Sortable is now Enabled!!');
	}
	else {
		$("#list").sortable("disable");
		$('#test').html('Sortable is Disabled');
	}
}

function toggleSortableItem(obj, trigger = ''){
	console.log(obj.attr('id') + ' trigger:' + trigger);

	//$('.sorta').sortable("disable");//если не дисаблить, то сорта будет работать на всех активированныхх элементах
	//$('.sorta').removeClass('sorta').css('background', 'none');

/*сортировка между всеми элеменами, можно перебрасывать их между группами
	$('#list').find('ul>li>ul').addClass('sorta').css('background', 'yellow');
	$('.sorta').sortable({
		connectWith: '.sorta',
		//grid: [ 20, 10 ],
		cursor: "move"
	}).sortable("enable");
*/

/*сортировка между всеми уровнями в пределах одной группы
	obj.parent('li').find('ul').each(function(){
		$(this).addClass('sorta').css('background', 'yellow');
	});
	$('.sorta').sortable({
		connectWith: '.sorta',
		//grid: [ 20, 10 ],
		cursor: "move"
	}).sortable("enable");
*/		

	
/** сортировка в пределах одной гпуппы и в пределах одного уровня */
//obj.parent('li').css('background', 'yellow');
if(trigger == 'enable'){
console.log('Enable sortable for group');
console.log($('#menu').length);
	if($('#menu').length > 0){
		let activeSortableGroupId = $('#menu').attr('data-itemgroup-id');
		$('#'+activeSortableGroupId).find('.sorta').sortable('disable');
	}


	obj.find('.sorta').sortable('enable');
	/*
	obj.find('ul').each(function(){
		$(this).addClass('sorta').css('background', 'yellow');
		//$(this).css('background', 'blue');
	});

	$('.sorta').sortable({
		//connectWith: '.sorta',
		//grid: [ 20, 10 ],
		cursor: "move",
		opacity: true,
		//placeholder: "highlight"
	}).sortable("enable");
	*/
	
}else{
	obj.find('.sorta').sortable('disable').css('background', 'none');
}

console.log(obj.find('.sorta').sortable('option', 'disabled'));

}

function fillElementById(elId, value){
	//alert(value);
	//console.log(this);
	const html = generateOptions(config['htmlElements'][value]);
	document.getElementById(elId).innerHTML = html;
}

/**
 * @param {String} arrKey - key in config array
 */
function generateOptions(configArray){
	//console.log(cc['data'][el]);
	let html = '';
	for(let htmlElement in configArray){
		//html+=`<option value="${config[el][element]}">${config[el][element]}</option>`;
		html+=`<option value="${htmlElement}">${htmlElement}</option>`;
	}
	return html;
} 


/**
 * 
 * @param {String} elId - parent element ID
 * @param {Object} elObj - element configuration object
 */
function createElement(elId, elObj, flag = ''){
	//console.log('key:' + elId);
	//console.log(elObj);
	let html = ``;
	if(flag == ''){
		html+=`<div id="${elId}">`;
		html+=`<ul class="treeline">`;
		//html+= `<li name="${elId}"><i class="drop closed"></i><span onclick="fe.openMenu('${elId}');">` + elId + `</span>`;
		//html+= `<li name="${elId}" class="root_item"><i class="drop closed"></i><span contenteditable="true">` + elId + `</span>`;
		//html+= `<li name="${elId}" class="root_item"><i class="drop closed"></i><span class="root_item">` + elId + `</span>`;
		html+= `<li name="${elId}" class="root_item"><i class="drop closed"></i><span>` + elId + `</span>`;
	}else{
		//html+= `<li name="${elId}"><span class="drop closed">+</span><span contenteditable="true" onclick="fe.openMenu();">` + elId + `</span>`;
		html+= `<li name="${elId}"><i class="drop closed"></i><span class="group_item">` + elId + `</span>`;
		//html+= `<li name="${elId}"><span>` + elId + `</span>`;
	}
	if(!isEmptyObject(elObj)){
		//console.log(elId + ' is not empty');

		html+=`<ul class="sorta">`;

		
	
		for(key in elObj){	
			if(typeof elObj[key] == 'object' && !isEmptyObject(elObj[key])){
				//console.log('OBBBJECT');
				//html+=`<ul>`;
				html+= createElement(key, elObj[key], 'f');
				//html+=`</ul>`;
			}else{
				//html+=`<li name="${key}"><span contenteditable="true">${key}</span><input type="text" name="${key}" value="${elObj[key]}"></li>`;
				html+=`<li name="${key}"><span>${key}</span><input type="text" name="${key}" value="${elObj[key]}"></li>`;
			}
		}
		html+=`</ul>`;
	}else{
		console.log(elId + ' is empty');
	}
	html+='</li>';
	if(flag == ''){
		html+='</ul>';
		html+='</div>';
	}
	return html;
}

function toggleExpand(obj){
	let arg = obj.text();
	//console.log(arg);
	//console.log($('#list').find('i.drop'));
	
	$('#list').find('i.drop').each(function(){
		switch (arg) {
			case '+':
				$(this).removeClass('closed').addClass('opened');
				obj.text('-');
				break;
			case '-':
				$(this).removeClass('opened').addClass('closed');
				obj.text('+');
				break;
		}
	});
	
}


/** ITEM GROUP */
function openItemGroupMenu(th){
	let elId = th.textContent;
	console.log(elId);
	
	let html = `
<div id="itemGroupMenu" data-itemgroup-id="${elId}">
<button name="clone" class="w3-button" onclick="fe.cloneItemGroup(this)">Clone</button>
<button name="remove" class="w3-button" onclick="fe.removeItemGroup(this)">X</button>
<button name="rename" class="w3-button" onclick="fe.renameItemGroup(this)">Re</button>
<button class="w3-button" onclick="fe.testItemGroup(this)">TEst</button>
</div>
`;

	//if($('#itemGroupMenu').length>0){
	//	$('#itemGroupMenu').remove();
	//}

	if($('#'+elId).hasClass('opened_menu')){
		//close menu for clicked element
		$('#itemGroupMenu').remove();
		$('#'+elId).removeClass('opened_menu');
		toggleSortableItem($('#'+elId), 'desable');
		toggleSortable('enable');
		toggleItemGroupEditor(elId, 'off');
		toggleContenteditableEvents(elId, false);
		//addContenteditableEvents(elId, false);
	}else{
		//if exist close opened menu for another element
		//conseole.log('menu ');
		if($('#itemGroupMenu').length>0){
			let oldElId = $('#itemGroupMenu').parent('div').attr('id');
			$('#'+oldElId).removeClass('opened_menu');
			$('#itemGroupMenu').remove();
			toggleSortableItem($('#'+oldElId), 'disable');
			console.log('Remove group editor from ' + oldElId);
			toggleItemGroupEditor(oldElId, 'off');
			toggleContenteditableEvents(oldElId, false);
			addOpenmenuEvents(oldElId);
			//addContenteditableEvents(oldElId, false);
		}
		//open menu for clicked element
		$('#'+elId).prepend(html).addClass('opened_menu');
		toggleSortableItem($('#'+elId), 'enable');
		toggleSortable('disable');
		toggleItemGroupEditor(elId, 'on');
		//addContenteditableEvents(elId, true);
		
	}
	


/*
	toggleSortable('disable');
	//menu is already opened and will be closed
	if( $('#'+elId).parent().hasClass('opened_menu') ){
		console.log('menu1');
		let el = $('#'+elId).clone(true, true);
		$('#'+elId).parent().after(el);
		$('#'+elId).parent().remove();
		$('#menu').remove();
		//addEvents();
		addAllEvents(elId);
		toggleSortableItem($('#'+elId), 'disable');
		toggleSortable('enable');
		toggleItemGroupEditor(elId, 'off');
		//$('.opened_menu').removeClass('opened_menu');
	}else{
	//menu is closed and will be opened
	console.log('menu2');
		//if another menu is already opened first close it
		if($('.opened_menu').length > 0){
			let oldElId = $('.opened_menu').data('id');
			toggleSortableItem($('#'+oldElId), 'disable');
			let el = $('#'+oldElId).clone(true, true);
			$('#'+oldElId).parent().after(el);
			$('#'+oldElId).parent().remove();

			//addContenteditableEvents(oldElId, false);

			$('#menu').remove();
			console.log('oldElId: ' +oldElId);
			toggleItemGroupEditor(oldElId, 'off');

			//addAllEvents(oldElId);
			//addEvents();
		}
		//open new menu
		$('#'+elId).wrap(function(){
			return `<div class="opened_menu" data-id="${elId}" />`;
		}).before(html);
		//.addClass('opened_menu');
		toggleItemGroupEditor(elId, 'on');
		//toggleSortable(false);
		addSortableEvents();
		toggleSortableItem($('#'+elId), 'enable');
	}
	//toggleSortable(false);
	*/

}

function changeElementState(obj){
obj.css('border', '1px solid blue').attr('data-active', true);
}

function cloneItemGroup(th){
	const elId = getItemgroupIDfromMenu(th);
	let cloneElId = elId + '_clone';
	if($('#' + cloneElId).length > 0){
		alert(`Clone of element ${elId} already exists`);
	}else{
		let targetElement = $('#'+elId).clone();
		targetElement[0].id = cloneElId;
		$('#list').append(targetElement);
		$('#'+cloneElId).removeClass('opened_menu');
		$('#'+cloneElId+ ' #itemGroupMenu').remove();
		$('#'+cloneElId+ ' li[name='+elId+']').attr('name', cloneElId).find('>span').html(cloneElId);
		$('#'+cloneElId+ ' li[name=id]>input[name=id]').val(cloneElId);
		$('#'+cloneElId+ ' li[name=name]>input[name=name]').val(cloneElId);
		toggleItemGroupEditor(cloneElId, 'off');
		toggleContenteditableEvents(cloneElId, false);
		addSortableEvents(cloneElId);
		addOpenmenuEvents(cloneElId);
		//toggleSortableItem($('#'+cloneElId), 'disable');
	}
}


/*
function cloneItemGroup(btnObj){
const elId = btnObj.parent('div').attr('data-itemgroup-id');
//$('#menu').remove();
let newElId = elId+'_clone';
//console.log($('#'+newElId));
if( $('#'+newElId).length>0 ){
	alert(`Clone of element ${elId} already exists`);
}else{
	let targetElement = $('#'+elId).clone(true);
	targetElement[0].id = newElId;

	$('#list').append(targetElement);
	toggleItemGroupEditor(newElId, 'off');
	//console.log('clone:'+newElId);
	$('#'+newElId+ ' li[name='+elId+']').attr('name', newElId).find('>span.root_item').html(newElId);
	$('#'+newElId+ ' li[name=id]>input[name=id]').val(newElId);
	$('#'+newElId+ ' li[name=name]>input[name=name]').val(newElId);
	addContenteditableEvents(newElId, false);
	addAllEvents(newElId);
	toggleSortable(false);
}
}
*/

function renameItemGroup(th){
	const elId = getItemgroupIDfromMenu(th);
	const btnObj = $(th);

	let btnActive = btnObj.attr('data-active');
	if(btnActive == 'false' || btnActive === undefined){
		btnObj.attr('data-active', 'true').addClass('button_active');
		//elId = btnObj.parent('div').attr('data-itemgroup-id');
		$('#'+elId+' li.root_item>span').attr('onclick', false);
		//addContenteditableEvents(elId);
		toggleContenteditableEvents(elId, true);
		toggleSortableItem($('#'+elId), 'disable');
	}else{
		btnObj.attr('data-active', 'false').removeClass('button_active');
		//addContenteditableEvents(elId, false);
		toggleContenteditableEvents(elId, false);
		addOpenmenuEvents();
		toggleSortableItem($('#'+elId), 'enable');
		//addSortableEvents();
	}


/*
let btnActive = btnObj.attr('data-active');
console.log(btnActive);
if(btnActive == 'false' || btnActive === undefined){
	//alert('false');
	btnObj.css('border', '1px solid blue').attr('data-active', 'true');
	//$('#'+elId+' li.root_item>span.root_item').attr('onclick', false);
	$('#'+elId+' li.root_item>span').attr('onclick', false);
	//window.contentEditableState = true;
	sc.obj['contentEditableState'] = true;
	addContenteditableEvents(elId);
}else{
	//alert('true');
	btnObj.attr('data-active', 'false').css('border', '');
	addContenteditableEvents(elId, false);
	//window.contentEditableState = false;
	sc.obj['contentEditableState'] = false;
	addAllEvents();
}
*/
//$('#'+elId+' li.root_item>span.root_item').attr('contenteditable', true).focus();
//$('#'+elId+' li.root_item>span').focus();	
}

function removeItemGroup(th){
	$('div[id='+getItemgroupIDfromMenu(th)+']').remove();
}


function addNewElementInConfigurationFile(formId){
	let form = forma.getForm3(formId);
	let formData = form['formData'];
	let formValidation = form['formValidation'];
	let validResult = forma.showValidationResults(formValidation);

	if(validResult !== false){
		const element = formData['element'],
			elementType = formData['elementType'],
			elementId = formData['elementId'];
		if(( $.inArray(elementId, getElementsIds()) >= 0)){
			alert(`Element with Id ${elementId} already presents`);
			return false;
		}
		let elObj = config['htmlElements'][element][elementType];
		//console.log(elObj);
		let html = createElement(elementId, elObj);
		//console.log(html);
		document.getElementById('list').insertAdjacentHTML('beforeend', html);
		$('#'+elementId+ ' li[name=id]>input[name=id]').val(elementId);
		$('#'+elementId+ ' li[name=name]>input[name=name]').val(elementId);
		addAllEvents(elementId);
		
	}else{
		return;
	}
}

function getElementsIds(){
	let arr = [];
	$('#list').find('div').each(function(){
		if($(this)[0].id != '' && $(this)[0].id != 'temp'){
			arr.push($(this)[0].id);
		}
	});
	//console.log(arr);
	return arr;
}


/** add field menu  */
function toggleItemGroupEditor(elId = 'list', trigger = null){
	console.log(toggleItemGroupEditor.caller.name);
	console.log('elId:' + elId + ' trigger:' + trigger);
	//if(!sc.obj['toggleItemGroupEditor'] || trigger == 'on'){
	if(trigger == 'on'){
		const wpanOpenTag = `<submenu class="field-menu">`,
			wrapCloseTag = `</submenu>`;
		$('#'+elId).find('submenu.field-menu').remove();

		$('#'+elId).find('li>span+input').each(function(){
			$(this).before(`${wpanOpenTag}<button class="w3-button w3-pale-red" onclick="fe.removeField($(this).parent().parent())">X</button>${wrapCloseTag}`);
		});
		$('#'+elId).find('li.root_item>span').each(function(){
			$(this).after(`${wpanOpenTag}
			<button class="w3-button w3-lime" onclick="fe.addField($(this).parent().parent())">+</button>
			<!--button class="w3-button w3-pale-red" onclick="fe.removeField($(this).parent().parent())">X</button-->
			${wrapCloseTag}`);
		});
		$('#'+elId).find('li>span.group_item').each(function(){
			$(this).after(`${wpanOpenTag}
			<button class="w3-button w3-lime" onclick="fe.addField($(this).parent().parent())">+</button>
			<button class="w3-button w3-pale-red" onclick="fe.removeField($(this).parent().parent())">X</button>
			${wrapCloseTag}`);
		});
		//sc.obj['toggleItemGroupEditor'] = true;
		//fe.toggleSortable(false);
	}else{
		$('#'+elId).find('submenu.field-menu').remove();
		//sc.obj['toggleItemGroupEditor'] = false;
	}
}

function addField(elObj){

	const elId = $('#itemGroupMenu').attr('data-itemgroup-id');
	const renameState = $('#itemGroupMenu').find('button[name="rename"]').hasClass('button_active');
	console.log('elId:' + elId);
	console.log('renameState:' + renameState);
	elObj.find('>ul>li:last-child').after(`<li name="field"><span>field</span><input type="text" name="field" value=""></li>`);
	toggleItemGroupEditor(elId, 'on');
	if(renameState){
		toggleContenteditableEvents(elId, true);
	}
/*
	if(sc.obj['contentEditableState'] === true){
		elObj.find('>ul>li:last-child').after(`<li name="field"><span contenteditable="true">field</span><input type="text" name="field" value=""></li>`);
	}else{
		elObj.find('>ul>li:last-child').after(`<li name="field"><span>field</span><input type="text" name="field" value=""></li>`);
	}
	toggleItemGroupEditor(elId, 'on');
	//addContenteditableEvents(elId, true);
*/
}

function removeField(elObj){
	//if(elObj.data('first-click') !== true){
	//	elObj.data('first-click', true).removeClass('w3-pale-red').addClass('w3-red');
	//}else{
		elObj.remove();
	//}
}


/** EVENTS */
function addAllEvents(elId = 'list'){
	//addOpenmenuEvents(elId);
	//addContenteditableEvents(elId);
	//addTreeEvents();
	//addSortableEvents();
}

function globalEvents(){
	addSortableEvents();
	addContenteditableEvents();
	addOpenmenuEvents();
	addTreeEvents();
}


function addContenteditableEvents(){

	//$('#'+elId).find('span').attr('contenteditable', true);
	let elId = 'list';
	$('#'+elId).on("keydown", 'span[contenteditable="true"]', function(event){
		if(event.key == "Enter"){
			event.preventDefault();
			liName = $(this).parent('li').attr('name');
			rootItem = $(this).parent('li').hasClass('root_item');
			newValue = $(this).html();
			console.log('liName:' + liName + ' rootItem:' + rootItem + ' newValue:' + newValue);
			if(newValue == liName){
				$(this).blur();
			}else if(newValue == ''){
				alert(`The name must have at least one symbol`);
			}else{

				if(rootItem){
					if( $.inArray(newValue, getElementsIds()) == -1){
						$('#' + liName).attr('id', newValue);
						$(this).parent('li').attr('name', newValue);
						$('#itemGroupMenu').attr('data-itemgroup-id', newValue);
						$(this).blur();
					}else{
						alert('Element with name ' + newValue + ' already exits');
						$(this).focus();
					}
				}else{
					$(this).parent('li').attr('name', newValue);
					$(this).blur();
				}

			}
			return;
		}
	})
	.on('focusout', 'span[contenteditable="true"]', function(event){
		liName = $(this).parent('li').attr('name');
		$(this).html(liName);
	});

}

function toggleContenteditableEvents(elId = 'list', activated = true){
	console.log('activated:' + activated);
	if(activated === true){
	//add check sc state =====================================================
		$('#' + elId + ' span').attr('contenteditable', true).css('color', 'blue');
	}else{
		$('#' + elId + ' span').attr('contenteditable', false).css('color', 'black');
	}
}

function addSortableEvents(parElId = ''){
/** сортировка групп */
	if(parElId == ''){
		$("#list").sortable();
		$(".sorta").sortable().sortable("disable");
	}else{
		$("#"+parElId).find('.sorta').sortable().sortable("disable");
	}
}

function addOpenmenuEvents(elId = 'list'){
	$('#'+elId+' li.root_item>span').each(function(){
		//$(this).attr('onclick', `fe.openItemGroupMenu('`+ $(this).html() +`')` );
		$(this).attr('onclick', `fe.openItemGroupMenu(this)`);
		//$(this).css('color', 'red');
	});
}



function addTreeEvents(){
	let dropElements = document.querySelectorAll('.drop');
	console.log(dropElements);
	for (let i=0; i<dropElements.length; i++){
		dropElements[i].onclick = function(){
			console.log(this.classList);
			if(this.classList.contains('closed')){
				//this.innerHTML = "-";
				this.classList.remove('closed');
				this.classList.add('opened');
			}else{
				//this.innerHTML = "+";
				this.classList.remove('opened');
				this.classList.add('closed');
			}
			//this.className = (this.className == 'drop' ? 'dropM' : 'drop');
		}
	}
}

/** EVENTS END */

function createField(formId, elementType, elementId){
	//alert(elementType);
	if(elementId != ''){
		var elHtml = '<div>' + elementId + '<input type="'+elementType+'" id="'+elementId+'"></div>';
	}else{
		alert("Element ID musn't be empty");
	}

	if(checkDoubleId(formId, elementId) == true){
		var firstDiv = $('#'+formId).find('div').find('input[type=text]').parent();
		//console.log(firstDiv.html());
		$(elHtml).insertBefore(firstDiv[0]);
		//console.log($(this).attr('id') + '=>' + $(this).val());
	}
	
}


function checkDoubleId(formId, elementId){
	var result = true;
	$('#'+formId).find('div').find('input').each(function(){
		if($(this).attr('id') == elementId){
			alert('Form element with ID ' + elementId + ' already exists');
			result = false;
		}
	});
	return result;
}

function deleteElement(elId){
	//console.log(elId);
	$('#'+elId).parent().remove();

}


function cbSaveFile(obj){
	alert('Config file ' + obj.filename + ' was successfully saved');
	//console.log('cbSaveFile:');
	//console.log(obj);
}


function saveForm(){
	let form = document.getElementById('list');
	let formData = createArray(form, {});
	let formHeader = forma.getForm2('form_header');
	console.log(formHeader);
	let obj = {
		controller: 'files',
		action: 'writeDataInFile',
		folder : formHeader.folder,
		filename : formHeader.filename,
		formAction : formHeader.formAction,
		formData : formData
	}

	common.sendAjax(obj).then(function(json){
		if(json['success'] === false){
			alert(json['error']);
		}else{
			alert('File was successfully saved');
		}
	});
	//console.log(arr);
}


function createArray(obj, arr){
	if(obj.hasChildNodes()){
		obj.childNodes.forEach(function(item){
			//console.log(item);
			if(item.tagName == 'LI'){
				//console.log(item);
				let elContent = item.getAttribute('name');
				let inputElement = item.getDirectChild('INPUT');
				//console.log(elContent + '=>' + inputElement);
				if(inputElement !== false){
					arr[elContent] = inputElement.value;
				}else{
					arr[elContent] = {};
				}
				//console.log(item.firstChild.textContent);
				createArray(item, arr[elContent]);
			}else{
				createArray(item, arr);
			}
		});
		//console.log(obj.tagName + obj.childNodes);
	}

	return arr;
}

function testItemGroup(th){
	let groupId = $(th).parent('div#itemGroupMenu').attr('data-itemgroup-id');
	console.log(groupId);
	//console.log(th.textContent);
}

function getItemgroupIDfromMenu(th){
	return $(th).parent('div#itemGroupMenu').attr('data-itemgroup-id');
}

fe.show = show;
fe.cbSaveFile = cbSaveFile;
fe.createField = createField;
fe.createElement = createElement;
fe.getConfigFile = getConfigFile;
fe.deleteElement = deleteElement;
fe.generateForm = generateForm;
fe.fillElementById = fillElementById;
fe.toggleExpand = toggleExpand;
fe.toggleSortableItem = toggleSortableItem;

fe.cloneItemGroup = cloneItemGroup;
fe.removeItemGroup = removeItemGroup;
fe.renameItemGroup = renameItemGroup;
fe.testItemGroup = testItemGroup;
fe.changeElementState = changeElementState;

//fe.openDialog = openDialog;
fe.openItemGroupMenu = openItemGroupMenu;
fe.toggleSortable = toggleSortable;
fe.toggleItemGroupEditor = toggleItemGroupEditor;
fe.removeField = removeField;
fe.addField = addField;
//fe.createElementCard = createElementCard;
fe.addNewElementInConfigurationFile = addNewElementInConfigurationFile;
fe.saveForm = saveForm;
window.fe = fe;

})();