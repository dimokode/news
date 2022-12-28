;(function(){

	function forma(){}

/*
	function getForm(formId){
		var formData = {};

		$('#'+formId).children('input').each(function(){
			//console.log($(this)[0].type);
			var value = "";
			if($(this)[0].type == 'text' || $(this)[0].type == 'hidden' ){
				value = $(this).val();
				//console.log($(this).val());
			}else if($(this)[0].type == 'checkbox'){
				value = $(this).prop('checked');
				//console.log($(this).prop('checked'));
			}

			formData[$(this)[0].id] = value;
		});
		return formData;
	}

*/
	function getForm2(formId){
		var formData = {};
		$('#'+formId).find('div').find('input, select, textarea').each(function(){
			formData[$(this)[0].id] = defineValue($(this));
		});
		return formData;
	}


	function getForm3(id){
		let formData = {},
			formFile = {},
			formDb ={},
			//formRequired = {},
			formValidationRules = {
				file: {},
				required : {},
				data: {},
			},
			formId = '#'+id;

		/** section file */
		$(formId).find('section[name="file"]').find('input, select:not([nodb=true]), textarea').each(function(){
			let elValue = defineValue($(this)),
				elId = $(this)[0].id,
				elName = $(this)[0].name;
				//console.log(elName);
				if(elName == ''){
					elName = elId;
				}
				console.log(elId + '=>' + elName);
				formFile[elName] = elValue;

			//let validateString = $(this).data('validate') !== undefined ? $(this).data('validate') : false;
			formValidationRules['file'][elId] = {
				'elRules' : $(this).data('validation') !== undefined ? $(this).data('validation') : false,
				'elValue' : elValue
				}
		});

		/** required fileds only */
		$(formId).find('section:not([name="file"])').find('input, select:not([nodb=true]), textarea').each(function(){
			let elValue = defineValue($(this)),
			elId = $(this)[0].id,
			elName = $(this)[0].name;
			console.log(elName);
			if(elName == ''){
				elName = elId;
			}
			if($(this)[0].required){
				formValidationRules['required'][elId] = {
					'elRules' : $(this).data('validation') !== undefined ? $(this).data('validation') : false,
					'elValue' : elValue
					}
			}
		});

		/** all fields */
		$(formId).find('section:not([name="file"])').find('input, select:not([nodb=true]), textarea').each(function(){
			let elValue = defineValue($(this)),
				elId = $(this)[0].id,
				elName = $(this)[0].name;
				console.log(elName);
				if(elName == ''){
					elName = elId;
				}
				console.log(elId + '=>' + elName);
				formData[elName] = elValue;
				if($(this).attr('data-db') !== undefined){
					formDb[elName] = elValue;
				}

			//let validateString = $(this).data('validate') !== undefined ? $(this).data('validate') : false;
			formValidationRules['data'][elId] = {
				'elRules' : $(this).data('validation') !== undefined ? $(this).data('validation') : false,
				'elValue' : elValue
				}
		});
		
		$(formId).find('section-group').each(function(){
			let i = 0;
			//alert($(this).length);
			let groupname = $(this).data('groupname');
			//console.log(groupname);
			formData[groupname] = {};
			$(this).find('groupitem').each(function(){
				formData[groupname][i] = {};
				$(this).find('input, select:not([nodb=true]), textarea').each(function(){
					let elValue = defineValue($(this)),
					elId = $(this)[0].id,
					elName = $(this)[0].name;
					formData[groupname][i][elName] = elValue;
					formValidationRules['data'][elId] = {
						'elRules' : $(this).data('validation') !== undefined ? $(this).data('validation') : false,
						'elValue' : elValue
						}
				});
				i++;
			});
		});

		let form = {
			formData : formData,
			formFile : formFile,
			formDb : formDb,
			//formRequired : formRequired,
			formValidation : {
				'file' : validator.getFormValidationRules(formValidationRules['file']),
				'data' : validator.getFormValidationRules(formValidationRules['data']),
				'required' : validator.getFormValidationRules(formValidationRules['required']),
			}
		}
		//console.log(formData);
		//return formData;
		return form;
	}




	function defineValue(obj){
		let value = '';
		const tagname = obj[0].tagName;
		switch(tagname) {
			case 'INPUT':
				if(obj[0].type == 'text' || obj[0].type =='date' || obj[0].type == 'hidden' ){
					value = obj.val();
		
				}else if(obj[0].type == 'checkbox'){
					value = obj.prop('checked');
				}
				break;
			case 'SELECT':
				value = obj.children("option:selected").val();
				break;
			case 'TEXTAREA':
				value = obj.val();
				break;
			default:
				//value = '';
				console.warn(`Element with tagName ${tagname} ${obj[0].type} was not recognized`);
		}

		return value;
	}


	function getSectionGroup(groupElement, level = 0){
		let elName = $(groupElement).attr('name');
		let separator = '+++'.repeat(level) + '+++';
		console.log(separator + elName);
	}

/*
	function getElements(elementsContainer, arr = {}){
		//let arr = {};
		$(elementsContainer).children().each(function(){
			if($(this).prop('tagName') == 'DIV'){
				$(this).children('input, select, textarea').each(function(){
					console.log('---' + $(this).attr('name'));
					arr[$(this).attr('name')] = $(this).val();
				});
			}else if($(this).prop('tagName') == 'SECTION-GROUP'){
				let groupName = $(this).attr('name');
				arr[groupName] = {};
				console.log('+++' + $(this).attr('name'));
				$(this).children('groupitem').each(function(i){
					arr[groupName][i] = getElements(this);
				});
			}
		});
		return arr;
	}
*/

	function getElements(container, separator = '', elIndex = '', parent = ''){
		separator+='---';
		//console.log(containerTag + '=>' + containerName);
		let arr = {};
		
		//arr[containerName] = {};
		$(container).children('SECTION-BLOCK, SECTION-GROUP, DIV').not('[dependency-status="false"]').each(function(){
			//console.log($(this).prop('tagName') + ' => ' + $(this).attr('name'));
			let elName = $(this).attr('name');
			let elTag = $(this).prop('tagName');
			//console.log('### ' + elTag + '=>' + elName);
			//arr[elName] = {};

			if(elTag == 'SECTION-BLOCK'){
				//console.log(separator + elTag + '=>' + elName);
				//arr[elName] = getElements($(this), separator);
				$(this).children('section-body').each(function(){
					arr = Object.assign(arr, getElements($(this), separator, elIndex));
				});
			}else if(elTag == 'SECTION-GROUP'){
				//console.log(separator + elTag + '=>' + elName);
				arr[elName] = {};
				elIndex = elIndex!='' ? elIndex+'_'+ $(this).attr('item') : $(this).attr('item');
				$(this).attr('parent', parent);
				$(this).children('section-body').children('groupitem').each(function(i){
					let elIndx = elIndex;
					//arr[elName][i] = getElements($(this), separator);
					elIndx = elIndx!='' ? elIndx+'_'+ $(this).attr('item') : $(this).attr('item');
					arr[elName][i] = getElements($(this), separator, elIndx, elName);
				});

			}else if(elTag == 'DIV'){
				//console.log(separator + elTag + '=>' + elName);
				//arr[elName] = getValues($(this));
				arr = Object.assign(arr, getValues($(this), elIndex));
			}
		});
		return arr;
	}

	function getValues(elDiv, elIndex){
		let arr = {};
		$(elDiv).children('input,select,textarea').each(function(){
			if($(this).attr('ignore') === undefined){
				//arr[$(this).attr('name')] = $(this).val();
				let elIndx = elIndex;
				let elName = $(this).attr('name');
				arr[elName] = {};
				arr[elName]['value'] = defineValue($(this));
				arr[elName]['validRule'] = $(this).data('validation') !== undefined ? $(this).data('validation') : '';
				arr[elName]['required'] = $(this).attr('required') !== undefined ? $(this).attr('required') : false;
				arr[elName]['index'] = elName+(elIndx == '' ? elIndx : '_'+elIndx);
				$(this)[0].id = elName+(elIndx == '' ? elIndx : '_'+elIndx);
				//console.log($(this).attr('name') + ' => ' + $(this).attr('required'));
			}
		});
		return arr;
	}

	function getForm4(id){
		let form = $('#'+id);
		let obj = {};
		//form.children('section:not([name="file"])').each(function(){
		form.children('section').each(function(){
			obj = Object.assign(obj, getElements(this));
		});
		//console.log(obj);
		return obj;

	}

	function getFormAction(id){
		let form = $('#'+id+ '>section-file');
		let obj = {};

		form.find('input').each(function(){
			obj[$(this).attr('name')] = $(this).val();
		});

		return obj;

	}


	function validateForm(){

	}

	function assembleValidationArray(formData, required = false){
		let arr = {};
		for(let elName in formData){
			if(formData[elName]['index'] === undefined){
				for(let index in formData[elName]){
					arr = Object.assign(arr, assembleValidationArray(formData[elName][index], required));
				}
			}else{
				if(required){
					arr[formData[elName]['index']] = {
						'elRules' : formData[elName]['validRule'],
						'elValue' : formData[elName]['value'],
						'elRequired' : formData[elName]['required'],
					};
				}else if(!required && formData[elName]['required'] !== false){
					arr[formData[elName]['index']] = {
						'elRules' : formData[elName]['validRule'],
						'elValue' : formData[elName]['value'],
						'elRequired' : formData[elName]['required'],
					};
				}

			}
		}
		return arr;
	}

	function saveForm2(callback = null, saveType = 'save', validation = true){
		//let arrStatus = JSON.parse(sessionStorage.getItem('status'));
		let arrStatus = {};
			//arrStatus['submit'] = false;
			arrStatus['status'] = saveType;
			console.clear();
		let formAction = getFormAction('form');
		let formData = getForm4('form');
		let arrValidation = assembleValidationArray(formData, validation);
		let validationRules = validator.getFormValidationRules(arrValidation);
		let validResult = validator.showValidationResults(validationRules);

		console.log(arrValidation);
		console.log(validationRules);
		console.log(validResult);
		console.log(formData);
		if(!validResult){
			return;
		}

		var obj = {
			'controller' : 'dbf',
			'action' : 'saveForm',
			'formAction' : formAction,
			'formData' : formData,
			//'formDb' : formDb,
			'status' : arrStatus,
		}

		//console.log(arrStatus);
		//console.log(obj);
		common.sendAjax(obj).then(function(json){
			console.log(json);
			if(json['success'] === false){
				alert(json['error']);
			}else{
				var arrFunc = callback.split('.');
				//window[arrFunc[0]][arrFunc[1]](cbObj);
				window[arrFunc[0]][arrFunc[1]]();
				//window[arrFunc[0]][arrFunc[1]](formAction);
			}
		});
		
	}



	function loadDataFile(objData = null, objConfig = null){
		var obj = {
			'controller' : 'files',
			'action' : 'loadDataFile3',
			'objData' : objData,
			'objConfig' : objConfig
		}
/*
		let obj = {
			controller: 'dbf',
			action : 'loadDataFile'
		}
		*/
		//console.log(obj);
		//console.log(filepath);
		return common.sendAjax(obj).then(function(json){
			if(json['success']){
				//console.log(json);
				//return json['jsonData'];
				return json;
			}else{
				//alert(json['error']);
				//console.log(json['errors']);
				outErrors(json['errors']);
				return false;
			}
			
		})
	}


	function loadConfigDataFile(configFile){
		var obj = {
			'controller' : 'files',
			'action' : 'loadConfigDataFile',
			'configFile' : configFile
		}
		//console.log(obj);
		//console.log(filepath);
		return common.sendAjax(obj).then(function(json){
			if(json['success']){
				//return json['jsonData'];
				return json;
			}else{
				alert(json['error']);
				return false;
			}
			
		})
	}

	// formType = 'fe' formEditor
  	function loadForm(jsonData, objForm, formType = ''){
  	//function loadForm(jsonData, objForm, filepath, filetype = ''){
  		var arrData = JSON.parse(jsonData);

  		var folder = objForm['folder'];
  		var filename = objForm['filename'];
  		var customer = objForm['customer'];
  		var formAction = objForm['formAction'];
  		var hidden = '';
  		if(formAction == 'update'){
  			hidden = 'hidden';
  		}
  		var html = createElement('folder', folder, hidden);
  			html+= createElement('filename', filename, hidden);
  			html+= createElement('customer', customer, hidden);
  		//if(filetype == 'new'){
  			html+= createElement('formAction', formAction, hidden);
  		//}
  		for (key in arrData){
  			//console.log(key + "=>" + arrData[key]);
  			html+= createElement(key, arrData[key], '', formType);
  		}

  		return html;
  	}

	let arrData = [];



	function generateFileSection(objFile){
		let sectionHtml = '';
		/*
		let obj = {
			element: 'input',
			label: 'Folder',
			attributes: {
				type: 'text',
				id: 'folder',
				name: 'folder',
				value: objFile.folder,
			}
		}
		sectionHtml+=fg.generate(obj);
		obj = {
			element: 'input',
			label: 'Filename',
			attributes: {
				type: 'text',
				id: 'filename',
				name: 'filename',
				'data-validation': 'isNotEmpty()',
				value: objFile.filename,
			}
		}
		sectionHtml+=fg.generate(obj);
		obj = {
			element: 'input',
			label: 'Customer',
			attributes: {
				type: 'text',
				id: 'customer',
				name: 'customer',
				value: objFile.customer,
			}
		}
		sectionHtml+=fg.generate(obj);
		obj = {
			element: 'input',
			label: 'formAction',
			attributes: {
				type: 'text',
				id: 'formAction',
				name: 'formAction',
				value: objFile.formAction,
			}
		}
		sectionHtml+=fg.generate(obj);
		*/
		for(formElement in objFile){
			obj = {
				element: 'input',
				label: formElement,
				attributes: {
					type: 'hidden',
					id: formElement,
					name: formElement,
					value: objFile[formElement],
					'data-validation': 'isNotEmpty();',
				}
			};
			sectionHtml+=fg.generate(obj);
			}
		
		return `<section-file class="hidden"><h3>File</h3>` + sectionHtml+`</section-file>`;
	}
	

function cub232(arrBlock){
	//console.log(arrBlock);
	let obj = {};

		for(let formElement in arrBlock['elements']){
			if(arrBlock['elements'][formElement]['element'] == 'subgroup'){
				obj[formElement] = {
					type : 'subgroup',
					data : arrBlock['elements'][formElement]
				};
			}else{
				if(arrBlock['elements'][formElement]['dependency'] !== undefined){
					arrBlock['elements'][formElement]['attributes']['dependency-field'] = arrBlock['elements'][formElement]['dependency']['field'];
					arrBlock['elements'][formElement]['attributes']['dependency-value'] = arrBlock['elements'][formElement]['dependency']['value'];
					
				}
				obj[formElement] = {
					type : 'html',
					html : fg.generate(arrBlock['elements'][formElement])
				};

				//if(arrBlock['elements'][formElement]['dependency'] !== undefined){
				//	obj[formElement]['dependency'] = arrBlock['elements'][formElement]['dependency'];
				//}
			}

		}


	return obj;

}




async function assemblyBlock(blockData, blocksData){
	//console.log(blockData);
	let htmlBlock = '';
	for(let elementName in blockData['elements']){
		let elementData = blockData['elements'][elementName];
		if(elementData['type'] == 'html'){
			htmlBlock+= elementData['html'];
		}
	}

	let sectionTags = {
		sectionName: blockData['name'],
		sectionLabel: blockData['label'],
		sectionForm: htmlBlock,
		sectionAttributes: '',
	}

	if(blockData['attributes'] !== undefined){
		sectionTags['sectionAttributes'] = assemblyAttributes(blockData['attributes']);
	}
	//return (await template.loadTemplateByName('section-block.html', sectionTags))['html'];
	return (await template.loadTemplateByName('section-block.html', sectionTags));
}

function assemblyAttributes(attrData){
	let attrHtml = '';
	for(let attrName in attrData){
		attrHtml+=`${attrName}="${attrData[attrName]}" `;
	}
	return attrHtml;
}

async function assemblyGroupItem(blockData, blocksData){
	console.log('blockData');
	console.log(blockData);
	let htmlGroup = '';
	let htmlSubgroup = '';
	for(let elementName in blockData['elements']){
		let elementData = blockData['elements'][elementName];
		if(elementData['type'] == 'html'){
			htmlGroup+= elementData['html'];
		}else if(elementData['type'] == 'subgroup'){
			
			//htmlSubgroup = await assemblyGroup(blocksData[elementName]);
			//htmlGroup+= await assemblyGroup(blocksData[elementName]);
			htmlGroup+=`
				<subgroup>${elementName}</subgroup>
			`;
			/*
			let sectionTags = {
				sectionName: blocksData[elementName]['name'],
				sectionLabel: blocksData[elementName]['label'],
				sectionForm: htmlSubgroup
			}
			let htmlGroupitem = (await template.loadTemplateByName('section-group.html', sectionTags))['html'];
			htmlBlock+=`
				<groupitem>
					<button class="w3-button w3-red" onclick="forma.deleteGroupItem(this);">Delete</button>
						${htmlGroupitem}
				</groupitem>`;
				*/
		}
	}

	htmlGroup = `
	<groupitem class="groupopen" name="${blockData['name']}" item="0">
		<button class="w3-button w3-tiny w3-pale-red" onclick="forma.deleteGroupItem(this);">x</button>
			${htmlGroup}
	</groupitem>`;
/*
	let sectionTags = {
		sectionName: blockData['name'],
		sectionLabel: blockData['label'],
		sectionForm: htmlGroup
	}
	return (await template.loadTemplateByName('section-group.html', sectionTags))['html'];
	return htmlBlock;
*/
	return htmlGroup;
}


async function generateForm2(json, objForm){
//console.log(json['jsonData']);
	let arrData = (json['jsonData']!='{}') ? (JSON.parse(json['jsonData']))['data'] : {},
		arrBlocks = JSON.parse(json['jsonBlocks']),
		//arrGroups = JSON.parse(json['jsonGroups']);
		arrSections = JSON.parse(json['jsonSections']);

		console.log(arrData);
		console.log(arrSections);
		console.log(arrBlocks);//dependency presents


	let blocksData = [],
		groupsData = [],
		groupItemsData = [],
		templatesHtml = [],
		html = '',
		htmlTemplates = '',
		htmlSection = '',
		htmlFormAction = generateFileSection(objForm),
		arrFormSections = [];
/*
		arrFormSections['file'] = {
			'type' : '',
			'html' : generateFileSection(objForm),
		  }
*/
	let arrPromises = [],
	arrSectionNames = [];

	for(let blockName in arrBlocks){
		let arrBlock = cloneObject(arrBlocks[blockName]);
		delete arrBlock['elements'];
		//console.log(arrBlock);
		blocksData[blockName] = arrBlock;
		blocksData[blockName]['elements'] = cub232(arrBlocks[blockName]);
		/*
		blocksData[blockName] = {
			name: arrBlocks[blockName]['name'],
			label: arrBlocks[blockName]['label'],
			type: arrBlocks[blockName]['type'],
			elements: cub232(arrBlocks[blockName]),
		};
		*/
		//blocksData[blockName]['type'] = arrBlocks[blockName]['type'];
		//blocksData[blockName]['html'] = cub232(arrBlocks[blockName]);
	}

	console.log(blocksData);


	for(let blockName in blocksData){
		if(blocksData[blockName]['type'] == 'group' || blocksData[blockName]['type'] == 'subgroup'){
			groupItemsData[blockName] = await assemblyGroupItem(blocksData[blockName], blocksData);

			let blockData = blocksData[blockName];
			console.log(blockData);

			let sectionTags = {
				sectionName: blockData['name'],
				sectionLabel: blockData['label'],
				//sectionForm: groupItemsData[blockName],
				sectionForm: '',
				sectionAttributes: '',
			}
			
			if(blockData['attributes'] !== undefined){
				sectionTags['sectionAttributes'] = assemblyAttributes(blockData['attributes']);
			}
			//sectionTags['sectionAttributes']['type'] = blocksData[blockName]['type'];
			
			//let blockAttributes = {};

			if(blockData['dependency'] !== undefined){
				sectionTags['sectionAttributes'] = `dependency-field="${blockData['dependency']['field']}" dependency-value="${blockData['dependency']['value']}"`;
				//blockAttributes['dependency-field'] = blockData['dependency']['field']
			}

			groupsData[blockName] = (await template.loadTemplateByName('section-group.html', sectionTags));
/*
			htmlTemplates+=`<template id="template-${blockName}">
					${groupItemsData[blockName]}
			</template>`;
*/
			/*
						htmlTemplates+=`<template id="template-${blockName}">
			<button class="w3-button w3-red" onclick="forma.deleteGroupItem(this);">Delete</button>
				<groupitem>
					${groupsData[blockName]}
				</groupitem>
			</template>`;
			*/
		}
	}
	console.log('groupItemsData');
	console.log(groupItemsData);
	//console.log('groupsData');
	//console.log(groupsData);

	for(let groupName in groupItemsData){
		let result = Array.from(groupItemsData[groupName].matchAll(/<subgroup>(.*?)<\/subgroup>/gi));
		if(result.length>0){
			console.log(groupItemsData[groupName]);
			groupItemsData[groupName] = groupItemsData[groupName].replace(result[0][0], groupsData[result[0][1]]);
			console.log(groupItemsData[groupName]);
		}
		htmlTemplates+=`<template id="template-${groupName}">
			${groupItemsData[groupName]}
		</template>`;
		
	}
	console.log('groupItemsData');
	console.log(groupItemsData);


	for(let sectionName in arrSections){
		let blocks = arrSections[sectionName]['blocks'];
		//let htmlGroup = '';
		htmlSection = '';
		for(blockName in blocks){
			let blockType = blocks[blockName]['type'];
			//console.log(blocks[blockName]);
			if(blockType == 'block'){
				htmlBlock = await assemblyBlock(blocksData[blockName], blocksData);
				//html+=htmlBlock;
				//htmlSection+= 'BLOCK:<br>'+htmlBlock;
				htmlSection+= htmlBlock;
			}else if(blockType == 'group'){
				//htmlGroup = await assemblyGroup(blocksData[blockName], blocksData);
				let blockData = blocksData[blockName];
				let result = groupsData[blockName].matchAll(/<subgroup>(.*?)<\/subgroup>/gi);
				result = Array.from(result);
				
				if(result.length > 0){
					//console.log('Object isnot empty');
					//console.log(result);	
					//console.log(`SUBGROUP ${result[0][1]} was found in ${blockName}`);
					htmlGroup = groupsData[blockName].replace(result[0][0], groupsData[result[0][1]]);
				}else{
					htmlGroup = groupsData[blockName];

				}
				htmlSection+= htmlGroup;
			}
		}

		let sectionTags = {
			sectionName: sectionName,//label
			sectionForm: htmlSection
		}
		//temp[sectionName] = await template.loadTemplateByName('section.html', sectionTags);
		//html+= (await template.loadTemplateByName('section.html', sectionTags))['html'];
		html+= (await template.loadTemplateByName('section.html', sectionTags));

		
		//console.log(sectionHtml);
	}


	return new Promise((resolve) => {
		return resolve(htmlFormAction + html + htmlTemplates);
	});

	
}


	function generateForm2_temp(json, objForm){
		//console.log(objForm);
		return new Promise(function(resolve){
			let arrData = {...JSON.parse(json['jsonData'])};
			let arrFormData = {...JSON.parse(json['jsonFormData'])};
			console.log(arrFormData);
			let arrTemplate =  false;
			if(json['jsonTemplates'] !== undefined){
				arrTemplate = {...JSON.parse(json['jsonTemplate'])};
			}
			let arrSections = false;
			if(json['jsonSections'] !== undefined){
				arrSections = {...JSON.parse(json['jsonSections'])};
			}
			let arrStatus = false;
			if(json['jsonStatus'] !== undefined){
				arrStatus = {...JSON.parse(json['jsonStatus'])};
			}
			let rule = objForm['action'] + objForm['type'].capitalize();
			fg.rule = rule;
			//console.log(rule);
			//console.log(arrStatus);
			//sessionStorage.setItem('status', JSON.stringify(arrStatus));

			let html = '', sectionHtml = '', arrFormSections = [];

			arrFormSections['file'] = {
				'type' : '',
				'html' : generateFileSection(objForm),
		  	}

			for(formSection in arrFormData) {
				sectionHtml ='', templateHtml = '';
				let arrSectionData = arrFormData[formSection];//data of one single section

				for(fieldName in arrSectionData){
					//console.log(JSON.stringify(arrSectionData[fieldName]));
					let fieldData = cloneObject(arrSectionData[fieldName]);
					
					if(fieldData['element'] == 'group'){

						let groupSectionName = fieldName;
						let groupHTML = '',templateHtml = '', groupType = 'group';
						if(arrSections[groupSectionName] !== undefined){
							//console.log(`Section ${groupSectionName} exists`);
							if(arrSections[groupSectionName]['type'] !== undefined && arrSections[groupSectionName]['type'] == 'select'){
								groupType = 'select';
							}
						}
						//console.log(`Section ${groupSectionName} exists and has type = ${groupType}`);
						
						//console.log(fieldData);
// group template start						
						for(let fieldNameInGroupItem in fieldData['groupitem']){
							let fieldDataInGroupItem = cloneObject(fieldData['groupitem'][fieldNameInGroupItem]);
							if(fieldDataInGroupItem['dependency'] !== undefined){
								fieldDataInGroupItem['type'] = 'hidden';
								if(fieldDataInGroupItem['groupitem'] !== undefined){
									fieldDataInGroupItem['attributes'] = [];	
								}
								fieldDataInGroupItem['attributes']['data-depfield'] = fieldDataInGroupItem['dependency']['field'];
								fieldDataInGroupItem['attributes']['data-depvalue'] = fieldDataInGroupItem['dependency']['value'];
							}
							templateHtml+=fg.generate(fieldDataInGroupItem);//values in template should be empty
						}
// group template end	

						if(groupType == 'select'){
							selectObj = {
								element: 'select',
								attributes: {
									id: fieldName,
									name: fieldName,
									onchange: 'forma.getSelect(this);',
									nodb: true
								},
								options: {
									0:{
										value:'null',
										text:'Choice from list',
										attributes:{

										}
									}
								}
							}

							if(arrData[fieldName] !== undefined){
								//if data already exists
								//console.log('data already exists');
								//console.log(arrData[fieldName]);
								for(let fieldNameInGroupItem in fieldData['groupitem']){
									let fieldDataInGroupItem = cloneObject(fieldData['groupitem'][fieldNameInGroupItem]);
									fieldDataInGroupItem['attributes']['value'] = (arrData[fieldNameInGroupItem] !== undefined) ? arrData[fieldNameInGroupItem] : '';
									//if(fieldDataInGroupItem['attributes']['value'] !== ''){
										//delete selectObj['options'][0];
									//}
									//console.log(arrData[fieldNameInGroupItem]);
									if(arrData[fieldNameInGroupItem] === undefined){
										prependOptionToSelect(fieldDataInGroupItem);
									}
									//addSelectedAttr(fieldDataInGroupItem, arrData[fieldNameInGroupItem]);
									groupHTML+=fg.generate(fieldDataInGroupItem);//values in template should be empty
								}
								//delete selectObj['options'][0];
							}else{
								//if data don't exist
								//groupHTML+= templateHtml;
							}

							for(let groupItemNr in arrData[fieldName]){
								//console.log(arrData[fieldName][groupItemNr]);
								//let groupItemNr = groupItemNrInDataset + 1;
								selectObj['options'][groupItemNr+1] = {};
								selectObj['options'][groupItemNr+1]['attributes'] = {};
								for(let fieldNameInGroupItem in fieldData['groupitem']){
									let fieldDataInGroupItem = cloneObject(fieldData['groupitem'][fieldNameInGroupItem]);
									//console.log(fieldDataInGroupItem);
									
									selectObj['options'][groupItemNr+1]['attributes']['data-'+fieldNameInGroupItem] = arrData[fieldName][groupItemNr][fieldNameInGroupItem];
									if(fieldDataInGroupItem['attributes']['selected'] == 1){
										//selectObj['attributes']['id'] = fieldName;
										selectObj['options'][groupItemNr+1]['value'] = arrData[fieldName][groupItemNr][fieldNameInGroupItem];
										selectObj['options'][groupItemNr+1]['text'] = arrData[fieldName][groupItemNr][fieldNameInGroupItem];
										if(arrData[fieldName][groupItemNr][fieldNameInGroupItem] == arrData[fieldNameInGroupItem]){
											selectObj['options'][groupItemNr+1]['attributes']['selected'] = 'selected';
										}
									}
								}
							}
							//console.log(selectObj);
							groupHTML= fg.generate(selectObj) + groupHTML;


							
						}else{
							//console.log(typeof arrData[fieldName]);
							if(arrData[fieldName] !== undefined){	
								//in case group is already exist in data file				
								for(let groupItemNr in arrData[fieldName]){
									let dependGroupItem = [];
									groupHTML+= `<groupitem id="${groupSectionName}-${groupItemNr}">`;
									groupHTML+= '<button class="w3-button w3-red" onclick="forma.deleteGroupItem(this);">Delete</button>';
									//console.log(arrData[fieldName][groupItemNr]);
									for(let fieldNameInGroupItem in fieldData['groupitem']){
										let fieldDataInGroupItem = cloneObject(fieldData['groupitem'][fieldNameInGroupItem]);
										//console.log(fieldDataInGroupItem);
										fieldDataInGroupItem['attributes']['value'] = (arrData[fieldName][groupItemNr][fieldNameInGroupItem] !== undefined) ? arrData[fieldName][groupItemNr][fieldNameInGroupItem] : '';
										fieldDataInGroupItem['attributes']['id'] = fieldNameInGroupItem + '-' + groupItemNr;
										if(fieldDataInGroupItem['element'] == 'select'){
											//addSelectedAttr(fieldDataInGroupItem, arrData[fieldName][groupItemNr][fieldNameInGroupItem]);
										}
/*
										if(fieldDataInGroupItem['dependency'] !== undefined){
											if(dependGroupItem[fieldDataInGroupItem['dependency']['field']] === undefined){
												dependGroupItem[fieldDataInGroupItem['dependency']['field']] = [];
											}
											if(dependGroupItem[fieldDataInGroupItem['dependency']['field']][fieldDataInGroupItem['dependency']['value']] === undefined){
												dependGroupItem[fieldDataInGroupItem['dependency']['field']][fieldDataInGroupItem['dependency']['value']] = [];
											}
											
											dependGroupItem[fieldDataInGroupItem['dependency']['field']][fieldDataInGroupItem['dependency']['value']][fieldNameInGroupItem] = fieldDataInGroupItem;
											groupHTML+=`<b>${fieldNameInGroupItem}</b><br>`;
										}else{
											groupHTML+=fg.generate(fieldDataInGroupItem);
										}
										//console.log(JSON.stringify(fieldDataInGroupItem));
*/										
										
										if(fieldDataInGroupItem['dependency'] !== undefined){
											fieldDataInGroupItem['type'] = 'hidden';
											fieldDataInGroupItem['attributes']['data-depfield'] = fieldDataInGroupItem['dependency']['field'];
											fieldDataInGroupItem['attributes']['data-depvalue'] = fieldDataInGroupItem['dependency']['value'];
											//groupHTML+="<div>";
											groupHTML+=fg.generate(fieldDataInGroupItem);
										}else{
											groupHTML+=fg.generate(fieldDataInGroupItem);
										}
										
									}
									
									groupHTML+=`</groupitem><hr>`;
									//console.log(dependGroupItem);
								}
							}else{
								
								//in case group isn't exist yet in data file
								let groupItemNr = 0;
								groupHTML+= `<groupitem id="${groupSectionName}-${groupItemNr}">`;
								groupHTML+= '<button class="w3-button w3-red" onclick="forma.deleteGroupItem(this);">Delete</button>';
								//console.log(arrData[fieldName][groupItemNr]);
								for(let fieldNameInGroupItem in fieldData['groupitem']){
									let fieldDataInGroupItem = cloneObject(fieldData['groupitem'][fieldNameInGroupItem]);
									//console.log(fieldDataInGroupItem);
									fieldDataInGroupItem['attributes']['value'] = '';
									fieldDataInGroupItem['attributes']['id'] = fieldNameInGroupItem + '-' + groupItemNr;
									groupHTML+=fg.generate(fieldDataInGroupItem);
								}
								groupHTML+=`</groupitem>`;
								
							}
						}
						//templateHtml+=groupHTML;
						//sectionHtml+=groupHTML;
						arrFormSections[groupSectionName] = {
							//type : 'group',
							type : groupType,
							html : groupHTML,
							template : (templateHtml!==undefined) ? templateHtml : '',
						};

					}else{
						if(fieldData['element'] == 'select'){
							console.log('element = select : ' + arrData[fieldName]);
							if(arrFormData[formSection][fieldName]['attributes']['value'] !== undefined){
								$defaultValue = arrFormData[formSection][fieldName]['attributes']['value'];
							}else{
								$defaultValue = '';
							}
							fieldData['attributes']['value'] = (arrData[fieldName] !== undefined) ? arrData[fieldName] : $defaultValue;
							//console.log(fieldData);
							//addSelectedAttr(fieldData, arrData[fieldName]);
							/*
							if(arrData[fieldName] !== undefined){
								for(let optionIndex in fieldData['options']){
									if(fieldData['options'][optionIndex]['value'] == arrData[fieldName]){
										if(fieldData['options'][optionIndex]['attributes'] == undefined){
											fieldData['options'][optionIndex]['attributes'] = {};
										}
										fieldData['options'][optionIndex]['attributes']['selected'] = 'selected';
									}
								}
							}
							*/
						}else{
							if(arrFormData[formSection][fieldName]['attributes']['value'] !== undefined){
								$defaultValue = arrFormData[formSection][fieldName]['attributes']['value'];
							}else{
								$defaultValue = '';
							}
							console.log('$defaultValue:' + $defaultValue);
							fieldData['attributes']['value'] = (arrData[fieldName] !== undefined) ? arrData[fieldName] : $defaultValue;

						}
						sectionHtml+= fg.generate(fieldData);
					}
					//console.log(JSON.stringify(arrSectionData[fieldName]));
				}

				arrFormSections[formSection] = {
					type : '',
					html : sectionHtml,
					template : (templateHtml!==undefined) ? templateHtml : '',
				};
				
			}

//console.log(arrFormSections);

			let tags = [];
			for(sectionName in arrSections){
			//for(sectionName in arrFormSections){
				//console.log(arrFormSections[sectionName]);
				if(arrFormSections[sectionName] !== undefined){	
					if(arrFormSections[sectionName]['html'] !== undefined && arrFormSections[sectionName]['html'] != ''){
							tags.push({
							'sectionName' : sectionName,
							'sectionType' : (arrFormSections[sectionName]['type'] !== undefined) ? arrFormSections[sectionName]['type'] : '',  
							'sectionForm' : (arrFormSections[sectionName]['html'] !== undefined) ? arrFormSections[sectionName]['html'] : '',
							'sectionTemplate' : (arrFormSections[sectionName]['template'] !== undefined) ? arrFormSections[sectionName]['template'] : '',
							'sectionDisplay' : (arrSections[sectionName]['display'] !== undefined) ? arrSections[sectionName]['display'] : '',
							'sectionCollapse' : (arrSections[sectionName]['collapse'] !== undefined) ? arrSections[sectionName]['collapse'] : false,
							});
					}
				}
			}

			let requests  =  tags.map(tag => {
				console.log(tag);
				if(tag['sectionType'] == 'group'){
					return template.loadTemplateByName('section-group.html', tag);
				}else{
					return template.loadTemplateByName('section.html', tag);
				}
			});
			//console.log(requests);
			
			Promise.all(requests).then((responses) => {
				//console.log(responses);
				responses.forEach((item) => {
					html+=item;
					//console.log(item);
				});
				return resolve(html);
			});



			//return resolve('hello');

		});
	}
	

	function hideDependencyChain(parentElement, elName){
		parentElement.find('[dependency-field="'+elName+'"]').each(function(){
			if($(this).parent().prop('tagName') == 'DIV'){
				$(this).parent().addClass('hidden').attr('dependency-status', false);
			}else{
				$(this).addClass('hidden').attr('dependency-status', false);
			}
			hideDependencyChain(parentElement, $(this).attr('name'));
		});
		return
	}

	function showDependencyItem(el){
		let depField = el.name,
			depValue =  '';

		if(el.tagName == 'SELECT'){
			//console.log('SELECT');
			depValue =  el.options[el.options.selectedIndex].value;
			
		//}else if(el.tagName == 'INPUT' && el.getAttribute('type') == 'CHECKBOX'){
		}else if(el.tagName == 'INPUT' && el.getAttribute('type') == 'checkbox'){
			//console.log('CHECKBOX');
			//console.log(el.type);
			depValue = String(el.checked);
		}

		//console.log(depField + '=>' + depValue);
			let parentElement = $(el).parent('DIV').parent('GROUPITEM');
			parentElement.find('[dependency-field="'+depField+'"]:not([dependency-value="'+depValue+'"])').each(function(){
				let elName = $(this).attr('name');
				hideDependencyChain(parentElement, elName);
				/*
				parentElement.find('[dependency-field="'+elName+'"]').each(function(){
					if($(this).parent().prop('tagName') == 'DIV'){
						$(this).parent().addClass('hidden');
					}else{
						$(this).addClass('hidden');
					}
				});
				*/
				//showDependencyItem($(this));
				//console.log('depElement:' + elName);
				if($(this).parent().prop('tagName') == 'DIV'){
					$(this).parent().addClass('hidden').attr('dependency-status', false);
				}else{
					$(this).addClass('hidden').attr('dependency-status', false);
				}
			});

			parentElement.find('[dependency-field="'+depField+'"][dependency-value="'+depValue+'"]').each(function(){
				if($(this).parent().prop('tagName') == 'DIV'){
					$(this).parent().removeClass('hidden').attr('dependency-status', true);
				}else{
					$(this).removeClass('hidden').attr('dependency-status', true);
					console.log($(this).html());
					console.log($(this).children('section-body').children('groupitem').length);
					let groupItemsQty = $(this).children('section-body').children('groupitem').length;
					if(groupItemsQty == 0){
						let btnAdd = $(this).find('section-header>button')[0];
						btnAdd.click();
					}
					//let btnAdd = $(this).find('section-header>button')[0];
					//console.log($(this).children('section-header').children('[name="btnAddGroupItem"]'));
					//$(this).children('section-header').children('[name="btnAddGroupItem"]').removeClass('w3-blue').addClass('w3-yellow').click();
					//btnAdd.click();
					
				}
				/*
				if($(this).attr('onchange') !== undefined){
					$(this).change();
				}
				*/
			});
			return;
	}

	function showSubGroup_temp(el){
		//console.log('showSubGroup');
		//console.log(el.options[el.options.selectedIndex].value);
		let depfield = el.name,
			depvalue =  el.options[el.options.selectedIndex].value;

		//$('#form').find('[data-depfield="'+ depfield +'"][data-depvalue='+ depvalue +']').each(function(){
		//	$(this).attr('type', 'text');
		//});
		let groupIemId = $(el).parent().parent().attr('id');
		//let groupIemId = $(this).html();
		//console.log('groupIemId:'  +groupIemId);
		
		$('#'+groupIemId).find('[data-depfield="'+ depfield +'"]:not([data-depvalue='+ depvalue +'])').parent().each(function(){
			$(this).addClass('hidden');
			let data_name = $(this).attr('data-name');
			if(data_name !== undefined){
				$('#'+groupIemId).find('[data-depfield="'+data_name+'"]').each(function(){
					$(this).parent().addClass('hidden');
				});
			}
		});
		$('#'+groupIemId).find('[data-depfield="'+ depfield +'"][data-depvalue='+ depvalue +']').each(function(){
			$(this).parent().removeClass('hidden');
			//if($(this).onchange)
			//console.log($(this).attr('onchange'));
			if($(this).attr('onchange') !== undefined){
				$(this).change();
			}
		});
		
	}


	function addSelectedAttr(arrDestination, refValue){
		console.log(arrDestination);
		
		if(refValue !== undefined){
			console.log('refValue:' + refValue);
			for(let optionIndex in arrDestination['options']){
				
				if(arrDestination['options'][optionIndex]['value'] == refValue){
					console.log(arrDestination['options'][optionIndex]['value'] + '===' + refValue);
					if(arrDestination['options'][optionIndex]['attributes'] == undefined){
						arrDestination['options'][optionIndex]['attributes'] = {};
					}
					arrDestination['options'][optionIndex]['attributes']['selected'] = 'selected';
				}
			}
		}
	}

	
	function selectInit(formSelector){

		$(formSelector).find('select').each(function(){
			//$(this).change();
			if($(this).attr('selectingField') !== undefined){
				//for selection from groupitems
				let fValue = $(this).parent().parent().find('[name="'+$(this).attr('selectingField')+'"]').val();
				//console.log('SELECTED VALUE: ' + fValue);
				$(this).val(fValue);
			}else{
				$(this).change();
			}
		});

		$(formSelector).find('input[type="checkbox"]').each(function(){
			if($(this).attr('onchange') !== undefined){
				$(this).change();
			}
		});
	}
	
	function prependOptionToSelect(arrDestination){
		//console.log(arrDestination['options']);
		if(arrDestination['options'] !== undefined){
			let arr = Object.values(arrDestination['options']);
			console.log(arr);
			
			arr.unshift({
				'value': null,
				'text': 'Select'
			});
			console.log(arr);
			let obj = Object.assign({}, arr);
			console.log(obj);
			
			arrDestination['options'] = obj;
		}
		//console.log(arrDestination);
	}



	//for fe only
	function createElement(key){
		let elHtml = "<div>";
		elHtml+= "<span onclick=\"forma.getElementProps('"+key+"')\">" + key + "</span>" + "<i class=\"fa fa-close w3-text-red\" onclick=\"fe.deleteElement(\'"+key+"\');\"></i>";
		console.log(arrData[key]);
		elHtml+='<div class="props_section">';
		for(key2 in arrData[key]){
			console.log(key2);
			console.log(arrData[key][key2]);
			elHtml+=createProp(key2, arrData[key][key2]);
		}
		elHtml+="</div>";
		elHtml+="</div>";
		return elHtml;
	}

	function createProp(key, value){
		return '<div class="prop">'+key+'<input type="text" value="'+value+'"></div>';
	}

	function getElementProps(elId){
		//alert(arrData[key]);
		//console.log(arrData[key]);
		let html = '';
		for (key in arrData[elId]){
			//console.log(key + "=>" + arrData[key]);
			//html+= forma.createElement(key, arrData[key], '', formType);
			//html+= forma.createElement(key);
			var obj = {
				type: 'text',
				id: key,
				value: arrData[elId][key],
				hidden: false
			}
			html+=forma.generateField(obj);
		}
		$('#elementprops').html(html);
	}

  	function createElement_temp(key, value, hidden = '', formType){
  		var elHtml = "<div>";
  		var elDelHtml = '';
  		if(formType == 'fe'){
  			elDelHtml = "<span onclick=\"fe.deleteElement(\'"+key+"\');\">X</span>";
  		}else{
  			elDelHtml = '';
  		}

  		if(typeof value === 'boolean'){
  			//var valtype = "boolean";
  			var checked = "";
  			if(value===true){
  				checked = 'checked';
  			}
  			elHtml+= key + " : <input type='checkbox' id='"+key+"' " + checked + ">"+elDelHtml+"<br>";
  		}else{
  			if(hidden == 'hidden'){
  				elHtml+= "<input type='hidden' id='"+key+"' value='"+value+"'>";
  			}else{
  				elHtml+= key + " : <input type='text' id='"+key+"' value='"+value+"'>"+elDelHtml+"<br>";	
  			}
  			
  		}
  		//return "<b>"+key+"==="+value+" type "+"</b>";
  		return elHtml+"</div>";
  	}


	function checkElement(el){
		console.log('checkElement');
		console.log(el);
		//alert(el);
		//el.toggleClass('selected');	
		console.log(el.parent().attr('id'));
		el.parent().parent().find('.selected').each(function(){
			//console.log($(this).html());
			$(this).toggleClass('selected');
		});
		el.toggleClass('selected');
	}

	//function addGroupItem(groupname){
	function addGroupItem(){
		
		//form.find('section-group[collapsable-groups]>section-body>groupitem').each(function(){
			//console.log($(this).html());
		//	$(this).prepend(`<button class="collapse" status="opened" onclick="forma.toggleCollapsable(this);">-</button>`);



		let sectionContainer = $(event.target).parent('section-header').parent('section-group');
		let sectionBody = sectionContainer.children('section-body');
		//console.log(sectionContainer);
		//console.log(sectionBody);
		let groupItemsLength = sectionBody.children('groupitem').length;
		//console.log('groupitems length:' + sectionContainer.children('groupitem').length);
		let groupName = sectionContainer.attr('data-groupname');
		let groupItem = new DocumentFragment();
		//$(groupItem).attr('item', groupItemsLength++);
		let templateElem = document.getElementById('template-'+groupName);
		groupItem.append(templateElem.content.cloneNode(true));
		//console.log(groupItem);
	
		$(groupItem).children('groupitem').each(function(){
			$(this).attr('item', groupItemsLength);
			$(this).find('section-group').attr('item', groupItemsLength);
		});

		//console.log(sectionContainer.attr('collapsable-groups'));
		if(sectionContainer.attr('collapsable-groups') !== undefined){
			$(groupItem).children('groupitem').each(function(){
				$(this).prepend(`<button class="w3-button w3-tiny collapse" status="opened" onclick="forma.toggleCollapsable(this);">-</button>`);
			});
		}
		
		/*
		if(sectionContainer.attr('collapsable-groups') == 'true'){
			$(groupItem).prepend(`<button class="collapse" status="opened" onclick="forma.toggleCollapsable(this);">-</button>`);
		}
		*/

		sectionBody.append(groupItem);
		hideDependencyItems('#form');
		//identForm($('#form'));
	}

	function deleteGroupItem(elem){
		//let groupItemsLength = $(elem).parents().parent('section-group').find('groupitem').length;
		let groupItemsLength = $(elem).parent('groupitem').parent('section-body').parent('section-group').children('section-body').children('groupitem').length;
		//console.log($(elem).parent().parent('section-group').attr('name'));
		//console.log(groupItemsLength);
		if(groupItemsLength>1){
			let delElem = $(elem).parent('groupitem');
			delElem.remove();
		}else{
			alert('Group must have at least one groupitem');
		}

	}

	function getSelect_temp(obj){
		//alert('click');
		//console.log(obj.id);
		let optionIndex = document.getElementById(obj.id).options.selectedIndex;
		let optionDataset = document.getElementById(obj.id).options[optionIndex].dataset;
		for(dataitem in optionDataset){
			//console.log(dataitem + '=>' + optionDataset[dataitem]);
			document.getElementById(dataitem).value = optionDataset[dataitem];
		}
		//console.log(optionDataset);
	}

	function getSelect(obj){
		let sectionContainer = $(obj).parent().parent();
		console.log(sectionContainer.html());
		let optionIndex = obj.options.selectedIndex;
		let optionDataset = JSON.parse(obj.options[optionIndex].getAttribute('dataset'));
		console.log(optionDataset);
		for(dataitem in optionDataset){
			console.log(dataitem + '=>' + optionDataset[dataitem]);
			//document.getElementById(dataitem).value = optionDataset[dataitem];
			$(sectionContainer).find('[name="'+dataitem+'"]').val(optionDataset[dataitem]);
			
		}
		//alert(optionIndex);
		//let dataset = selectElement
		//let sectionContainer = $(event.target).parent();
	}


	function showValidationResults(formValidation){
		//console.log(formValidation);
		let flag = 0;
		for(let elId in formValidation){
			$('#'+elId).parent('div.validation_error').find('div').each(function(){
				//console.log($(this)[0]);
				$(this).remove();
			});
			$('#'+elId).parent('div.validation_error').removeClass('validation_error');

			console.log(elId + '=>' + formValidation[elId]);
			
			for(let validFuncNr in formValidation[elId]){
				if(formValidation[elId][validFuncNr] !== true){
					let errMsgElement = document.createElement('DIV');
					//errMsgElement.className = 'validation_error';
					errMsgElement.innerHTML = formValidation[elId][validFuncNr];
					$('#'+elId).parent('div').addClass('validation_error');
					//console.log($('#'+elId).parent('div'));
					$('#'+elId).after(errMsgElement);
					flag++;
				}
			}
		}
		if(flag>0){
			return false;
		}else{
			return true;
		}
	}


	function outErrors(errors){
		//console.log(arrErrors);
		let alertHtml = '';
		if(Array.isArray(errors)){
			errors.forEach(function(item){
				alertHtml+= `${item}<br>`;
			});
		}else{
			alertHtml = errors;
		}

		let tags = {
			alertHtml : alertHtml
		}
		return template.loadTemplateByName('alert.html', tags).then(function(alertHtml){
			//console.log(alertHtml);
			document.body.insertAdjacentHTML('beforeend', alertHtml);
		});
	}
	


	async function getData(dataType){
		const obj = {
			controller: 'dbf',
			action: 'getData',
			dataType: dataType,
		}
		return await common.sendAjax(obj).then(function(json){
			console.log(json);
			if(json['success']){
				return json['data'];
			}else{
				return false;
			}
		});
	}

	function showDropdownList(e, listType){
		//console.log(e.target);
		let parentId = e.target.id;
		let listId = document.getElementById(parentId).getAttribute('data-list-id');
		//console.log("Customer Id List");
		const obj = {
			controller: 'dbf',
			action: listType,
		}

		common.sendAjax(obj).then(function(json){
			console.log(json);
			if(json['success'] !== undefined && json['success']){
				let obj = {
					//tpl: `<div><a href="javascript:void(0);" onclick="forma.hideDropdownList('${listId}');forma.copyValueTo($(this).html(), 's_customer_id')">{%customer_id%}</a></div>`,
					data: json['data']
				}
				if(listType == 'getCustomersIds'){
					obj['tpl'] = `<div><a href="javascript:void(0);" onclick="$('#${parentId}').blur(); forma.copyValueTo($(this).html(), 's_customer_id')">{%customer_id%}</a></div>`;
				}else if(listType == 'getUsersIds'){
					obj['tpl'] = `<div><a href="javascript:void(0);" onclick="$('#${parentId}').blur(); forma.copyValueTo($(this).html(), 's_user_id')">{%user_id%}</a></div>`;
				}else if(listType == 'getCustomersNames'){
					obj['tpl'] = `<div><a href="javascript:void(0);" onclick="$('#${parentId}').blur(); forma.copyValueTo($(this).html(), 's_customer_name')">{%customer_name%}</a></div>`;
				}

				let listDiv = document.createElement('DIV');
				//listId = "sadadasdad";
				listDiv.id = listId;
				$('#'+parentId).append(listDiv);


				$('#'+listId).html(template.generateList(obj)).show();
				if(e.target.value != ''){
					console.log(e.target.value);
					let val = e.target.value.replace(/\*/g, '\\*').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\+/g, '\\+').replace(/\?/g, '\\?');
					selectList(listId, val);
				}else{
					selectList(listId, '');
				}

			}
		});
	}

	function showDropdownList_temp(e, listType){
		//console.log(e.target);
		let parentId = e.target.id;
		let listId = document.getElementById(parentId).getAttribute('data-list-id');
		//console.log("Customer Id List");
		const obj = {
			controller: 'dbf',
			action: listType,
		}

		common.sendAjax(obj).then(function(json){
			console.log(json);
			if(json['success'] !== undefined && json['success']){
				let obj = {
					//tpl: `<div><a href="javascript:void(0);" onclick="forma.hideDropdownList('${listId}');forma.copyValueTo($(this).html(), 's_customer_id')">{%customer_id%}</a></div>`,
					data: json['data']
				}
				if(listType == 'getCustomersIds'){
					obj['tpl'] = `<div><a href="javascript:void(0);" onclick="$('#${parentId}').blur(); forma.copyValueTo($(this).html(), 's_customer_id')">{%customer_id%}</a></div>`;
				}else if(listType == 'getUsersIds'){
					obj['tpl'] = `<div><a href="javascript:void(0);" onclick="$('#${parentId}').blur(); forma.copyValueTo($(this).html(), 's_user_id')">{%user_id%}</a></div>`;
				}else if(listType == 'getCustomersNames'){
					obj['tpl'] = `<div><a href="javascript:void(0);" onclick="$('#${parentId}').blur(); forma.copyValueTo($(this).html(), 's_customer_name')">{%customer_name%}</a></div>`;
				}

				$('#'+listId).html(template.generateList(obj)).show();
				if(e.target.value != ''){
					console.log(e.target.value);
					let val = e.target.value.replace(/\*/g, '\\*').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\+/g, '\\+').replace(/\?/g, '\\?');
					selectList(listId, val);
				}else{
					selectList(listId, '');
				}

			}
		});
	}

	function hideDropdownList(e){
		//console.log(event.target);
		let parentId = e.target.id;
		let listId = document.getElementById(parentId).getAttribute('data-list-id');
		setTimeout(function(){
			$('#'+listId).hide();
		}, 200);
		
	}

	function copyValueTo(val, elId){
		console.log(val + ' => ' + elId);
		$('#'+elId).val(val);
		customers.showCustomersByCriteria('customer-selector');
	}

	function selectList(listId, val){
		//console.log('selectList');
		if(val == ''){
			$('#'+listId).find('div a').each(function(){
				//console.log($(this).html());
				$(this).parent().show();
			});
		}else{
			$('#'+listId).find('div a').each(function(){
				//console.log($(this).html());
				$(this).parent().hide();
				let regexp = new RegExp("^"+val+"(.*?)+", "g");
				if($(this).html().match(regexp) !== null){
					//console.log($(this).html());
					$(this).parent().show();
				}
			});
		}
		//console.log($('#'+listId+' div:first-child').html());
		//$('#'+listId+' div:first-child').addClass('selectedListElement');

	}

	function keyup(e){
		
		//console.log(e);
		let parentId = e.target.id;
		let listId = document.getElementById(parentId).getAttribute('data-list-id');
		let val = document.getElementById(parentId).value;
		let key = e.key;
		//console.log(parentId + ' => ' + listId + '  => ' + val + ' => ' + key);

		

		if(key == 'Enter'){
			$('#'+parentId).val($('#'+listId+' .selectedListElement>a').text());
			$('#s_button').click();
			$('#'+listId).hide();
			e.target.blur();
			return
		}else if(key == 'Escape'){
			$('#'+listId).hide();
			return
		}else if(key == 'ArrowDown' && $('#'+listId).is(':visible')){
			//console.log($('#'+listId).find('div.selectedListElement').length);
			if($('#'+listId).find('div.selectedListElement').length == 0){
				//console.log($('#'+listId+'>div:first-child').html());
				$('#'+listId+' div:visible:first').addClass('selectedListElement');
			}else{
				//$('#'+listId).find('div.selectedListElement')[0].toggleClass('selectedListElement');
				//console.log($('#'+listId+' div.selectedListElement').next().length);
				let nextElement = $('#'+listId+' div.selectedListElement').next(':visible');
				//console.log(nextElement.length);
				$('#'+listId+' div.selectedListElement').removeClass('selectedListElement');
				if(nextElement.length == 1){
					
					nextElement.addClass('selectedListElement');
					
				}else{
					$('#'+listId+' div:visible:first').addClass('selectedListElement');
					//$('#'+listId+' div.selectedListElement').removeClass('selectedListElement');
				}
			}
			//$('#'+parentId).val($('#'+listId+' .selectedListElement>a').text());

		}else if(key == 'ArrowUp' && $('#'+listId).is(':visible')){
			//console.log($('#'+listId).find('div.selectedListElement').length);
			if($('#'+listId).find('div.selectedListElement').length == 0){
				//console.log($('#'+listId+'>div:first-child').html());
				$('#'+listId+' div:visible:last').addClass('selectedListElement');
			}else{
				//$('#'+listId).find('div.selectedListElement')[0].toggleClass('selectedListElement');
				//console.log($('#'+listId+' div.selectedListElement').next().length);
				let prevElement = $('#'+listId+' div.selectedListElement').prev(':visible');
				//console.log(prevElement.length);
				$('#'+listId+' div.selectedListElement').removeClass('selectedListElement');
				if(prevElement.length == 1){
					
					prevElement.addClass('selectedListElement');
					
				}else{
					$('#'+listId+' div:visible:last').addClass('selectedListElement');
					//$('#'+listId+' div.selectedListElement').removeClass('selectedListElement');
				}
				
				//if($('#'+listId+' div.selectedListElement').next())
			}
		}else{
			if($('#'+listId).is(':hidden')){
				$('#'+listId).show();
				//$('#'+listId+' div.selectedListElement').removeClass('selectedListElement');
			}
			$('#'+listId+' div.selectedListElement').removeClass('selectedListElement');
		}

		if(val != ''){
			val = val.replace(/\*/g, '\\*').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\+/g, '\\+').replace(/\?/g, '\\?');
				//console.log(key);
				selectList(listId, val);
				//$('#'+listId+' div.selectedListElement').removeClass('selectedListElement');
		}else{
			$('#'+listId).find('div').each(function(){
				$(this).show();
			});
		}

		//console.log('selectedItemLength:' + $('#'+listId).find('div.selectedListElement').length + ' => ' + $('#'+listId).find('div.selectedListElement').html());
	}

	function closePopup(){
		console.log('close popup');
		try{
			let coord = $('section-group[name="items"]').offset().top;
			console.log('coord:' + coord);
		}catch(e){
			console.log(e);
		}
		
		$('#claim').hide();
	}


	function scrollToElement(containerClass, elName){
		//console.log(elId);
		let obj = document.querySelector('.'+containerClass);
		let vpTop = obj.offsetTop;
		console.log('vpTop:' + vpTop);
		let el = document.getElementsByName(elName)[0];
		//let elName = el.getAttribute('name');
		//let sectionNr = elName[elName.length-1];
		//console.log(sectionNr);
		//let bounds = el.getBoundingClientRect();
		//console.log(bounds);

		let coordTop = el.offsetTop;

		console.log('coordTop:' + coordTop);
		//console.log(bounds.y);
		
		//obj.scroll(0, bounds.y);
		let offset2 = coordTop-vpTop;
		//obj.scroll(0, (sectionNr-1)*200);
		//obj.scroll(0, offset2);
		
		obj.scroll({
			top: offset2,
			left: 0,
			behavior: 'smooth'
		});
	}


	function identGroups(el, ident = ''){
		/*
		el.find('section-group').each(function(){
			let groupName = $(this).attr('name');
			console.log(groupName);
			$(this).children('groupitem').each(function(i){
				$(this).attr('name', groupName+'-'+i);
			});
		});
		*/
		el.children('SECTION-GROUP').each(function(){
			let groupName = $(this).attr('name');
			ident+=groupName;
			$(this).children('GROUPITEM').each(function(i){
				$(this).attr('id', ident+'-'+i);
				identGroups($(this), ident+'-'+i+'_');
			});


			//console.log(elName + ' ' + elTag );
		});
	}

	function initGroups(formSelector){
		let form = $(formSelector);

		form.find('button[name="btnAddGroupItem"]').each(function(){
			$(this)[0].click();
		});
	}

	function fillFormWithData(formId, arrData, arrSections){
		
		let form = $('#'+formId);
		/*
		form.find('section').each(function(){
			identGroups($(this));
		});
		*/
		let sections = {};
		for(let sectionName in arrSections){
			sections = Object.assign(sections, arrSections[sectionName]['blocks']);
		}
		//console.log(sections);
		for(let fieldName in arrData){
			//console.log(fieldName);
			//console.log(form.find('*[name="'+fieldName+'"]'));
			//console.log('%%%%%%%%%%%');
			//console.log(fieldName + '  => ' + typeof arrData[fieldName]);
			if(typeof arrData[fieldName] === 'object'){
				fillGroup(arrData[fieldName], fieldName, sections, form);
				
			}else{
				//form.find('#'+fieldName).val(arrData[fieldName]);
				form.find('[name="'+fieldName+'"]').val(arrData[fieldName]);
				//console.log(fieldName + ' => ' + arrData[fieldName]);
				//alert($('#form').find('#'+fieldName).prop('tagName'));
			}
		}
	}

	function fillGroup(groupData, fieldName, sections, form, item = 0){
		console.log(groupData);
				//console.log('object');
				//console.log('GROUP:');
				//console.log(arrData[fieldName]);
				//let groupData = arrData[fieldName];
				let groupSize = Object.keys(groupData).length;
				console.log('fillGroup:' + fieldName);
				//console.log(sections[fieldName]);
			
				if(sections[fieldName] !== undefined){
					/** in case data exists but the configuration of it has been removed */
					if(sections[fieldName]['selectable'] !== undefined){
						let fieldAsSelect = sections[fieldName]['selectable'];
						//console.log(fieldName + ' is selectable group');

						let selObj = {
							'element' : 'select',
							'label' : 'Select',
							'attributes' : {
								'name' : 'select_'+ fieldAsSelect,
								'selectingField' : fieldAsSelect,
								'ignore' : true,
								'onchange' : 'forma.getSelect(this)'
							},
							'options' : {
								/*
								'0' : {
									'value' : 'aaaa',
									'text' : 'aaaa',
									'attributes' : {
										'data-field' : 'some data'
									}
								},
								'1' : {
									'value' : 'bbbb',
									'text' : 'bbbb',
									'attributes' : {
										'data-field' : 'some data'
									}
								}
							*/
							}
						};
						for(let groupItemNr in groupData){
							//console.log(groupData[groupItemNr]);
							let groupItemData = groupData[groupItemNr];
							selObj['options'][groupItemNr] = {
								//'value': groupItemData[fieldAsSelect],
								'attributes':{
									'dataset':JSON.stringify(groupItemData),
								},
								//'value': JSON.stringify(groupItemData),//dataset ha been stored in value
								'value': groupItemData[fieldAsSelect],//dataset ha been stored in value
								'text': groupItemData[fieldAsSelect],
							}
						}
						let selectHtml = fg.generate(selObj);
						//console.log(selectHtml);
						let grSection = form.find('section-block[name="'+fieldName+'"]>section-body');
						//grSection.after(selectHtml);
						grSection.before(selectHtml);


					}else{

						if(groupSize>0){
							let btnAdd = form.find('section-group[name="'+fieldName+'"][item="'+item+'"]>section-header>button')[0];
							for(let i=0; i<groupSize; i++){
								btnAdd.click();//create groupitems
							}
						}
		
						form.find('section-group[name="'+fieldName+'"][item="'+item+'"]>section-body').children('groupitem').each(function(groupNr){
							//console.log($(this).html());
							//console.log($(this).find('input'));
							//console.log('groupsize:' + groupSize);
							let groupItemData = groupData[groupNr];
		
							for(let groupItemFieldName in groupItemData){
								if(typeof groupItemData[groupItemFieldName] === 'object'){
									//console.log(groupItemFieldName + ' is an Object');
									fillGroup(groupItemData[groupItemFieldName], groupItemFieldName, sections, form, groupNr);
								}
								//$(this).find('[name="'+groupitemFieldName+'"]').val(groupitemData[groupitemFieldName]);
								$(this).find('input, select, textarea').filter('[name="'+groupItemFieldName+'"]').each(function(){
									setValue($(this), groupItemData[groupItemFieldName]);
									//$(this).val(groupItemData[groupItemFieldName]);
									//console.log('name=' + groupItemFieldName + ', tagName=' + $(this).prop('tagName') + ' val=' + $(this).val());
									//console.log(defineValue($(this)));
								});			
							}
						});
					}
				}
	}

	function setValue(el, value){
		let tagName = el.prop('tagName');
		
		switch(tagName) {
			case 'INPUT':
				let elType = el.attr('type');
				if(elType == 'text' || elType =='date' || elType == 'hidden' ){
					el.val(value);
		
				}else if(elType == 'checkbox'){
					if(value == 'on' || value == true){
						el.prop('checked', true);
					}else{
						el.prop('checked', false);
					}
					
				}
				break;
			case 'SELECT':
				el.val(value);
				break;
			case 'TEXTAREA':
				el.val(value);
				break;
			default:
				//value = '';
				console.warn(`Element with tagName ${tagName} ${el.type} was not recognized`);
		}
	}

	function identForm(el, ident = '', separator = ''){
		//console.log('IDENTFORM=================');
		//let form = $('#'+formId);
		el.children('section, section-block, section-group, groupitem, div').each(function(){
			let tagName = $(this).prop('tagName');
			//console.log(tagName);
			if(tagName == 'SECTION' || tagName=='SECTION-BLOCK'){
				identForm($(this));
			}else if(tagName == 'SECTION-GROUP'){
				//identForm($(this), $(this).attr('item'));
				identForm($(this), ident);
			}else if(tagName == 'GROUPITEM'){
				itemNr = $(this).attr('item');
				idenntt = (ident=='')?'':ident+'-';
				identForm($(this), idenntt+itemNr);
			}else if(tagName == 'DIV'){
				//dataElement = $($(this).children('input, checkbox, textarea')[0]);
				//console.log(dataElement);
				//dataElement.attr('id', dataElement.attr('name')+'-'+ident);
			}
			return;
			/*
			if($(this).attr('name') !== undefined){
				let tagName = $(this).prop('tagName');
				let elName = $(this).attr('name');
				console.log(separator + ' ' + i + " => " + $(this).prop('tagName') + ' => ' + $(this).attr('name'));
				if(tagName == 'groupitem'){
					$(this).attr('name', elName);
				}
				if($(this).children().length > 0){
					//separator+='===';
					ident+=$(this).attr('name');
					identForm($(this), ident, separator+'===');
				}
			}
			*/
		});
	}
	
	function hideDependencyItems(formSelector){
		let form = $(formSelector);
		form.find('[dependency-field]').each(function(){
			let dependencyField = $(this).attr('dependency-field');
			let dependencyValue = $(this).attr('dependency-value');
			
			//console.log('dependency-field=' + $(this).attr('name'));
			
			if($(this).parent().prop('tagName') == 'DIV'){
				let groupItemElement = $(this).parent('DIV').parent('GROUPITEM');
				let dependencySetterElement = groupItemElement.find('[name="'+dependencyField+'"]');
				if(dependencySetterElement.attr('type') !== undefined && dependencySetterElement.attr('type') == 'checkbox'){
					dependencySetterValue = dependencySetterElement.prop('checked');
				}else{
					dependencySetterValue = dependencySetterElement.val();
				}
				if(String(dependencySetterValue) == dependencyValue){
					$(this).parent().attr('dependency-status', true);
				}else{
					$(this).parent().addClass('hidden').attr('dependency-status', false);
				}
				
			}else{
				let groupItemElement = $(this).parent('GROUPITEM');
				let dependencySetterElement = groupItemElement.find('[name="'+dependencyField+'"]');
				if(dependencySetterElement.attr('type') !== undefined && dependencySetterElement.attr('type') == 'checkbox'){
					dependencySetterValue = dependencySetterElement.prop('checked');
				}else{
					dependencySetterValue = dependencySetterElement.val();
				}
				if(String(dependencySetterValue) == dependencyValue){
					$(this).attr('dependency-status', true);
				}else{
					console.log(dependencyField + ' : ' + dependencyValue + ' ===== ' + dependencySetterValue + '!=' + dependencyValue)
					$(this).addClass('hidden').attr('dependency-status', false);
				}
			}
			
			//showDependencyItem($(this));
			//let depField = $(this).attr('dependency-field');
			//let depValue = $(this).attr('dependency-value');
			//console.log(depField + '=>' +depValue);
		});
	}

	function addButtons(formSelector){
		let form = $(formSelector);
		form.find('section-block[getData]').each(function(){
			let ident = $(this).attr('getData');
			$(this).find('h3').after(`<button class="w3-button w3-tiny w3-grey" onclick="forma.fillBlockWithData('${ident}');">L</button>`);
		});
	}


	function identGroups(formSelector){
		let form = $(formSelector);

	}

	function collapseAllGroups(formSelector){
		let form = $(formSelector);

		form.find('button.collapse').each(function(){
			//console.log($(this).html());
			$(this).click();
		});
	}

	function toggleCollapsable(el = null){
		//console.log(event);
		//return
		let btnElement = (el==null) ? event.target : el;
		
		//let btnElement = event.target;
		let groupItemElement = $(btnElement).parent('groupitem');
		let btnStatus = $(btnElement).attr('status');

		if(btnStatus == 'closed'){
			$(btnElement).attr('status', 'opened').html('-');

			$(groupItemElement).find('div,section-group').not('[collapse-view]').not('[dependency-status="false"]').each(function(){
				//console.log($(this));
				$(this).removeClass('hidden');
				//console.log($(this).attr('div-name') + ' was hidden');
			});
		}else{
			$(btnElement).attr('status', 'closed').html('+');

			$(groupItemElement).find('div,section-group').not('[collapse-view]').each(function(){
				//console.log($(this));
				$(this).addClass('hidden');
				//console.log($(this).attr('div-name') + ' was hidden');
			});
		}

	}

	function fillBlockWithData(ident){
		//console.log(event.target);
		let fieldSet = [];
		const customer_id = $('#customer_id').val() !== undefined ? $('#customer_id').val() : false;
		if(!customer_id){
			alert('Customer ID was not recognized');
		}
		$(event.target).parent('section-header').parent('section-block').find('input,select,textarea').each(function(){
			if($(this).val() == ''){
				fieldSet.push($(this).attr('name'));
			}
		});
		console.log(fieldSet);
		let obj = {
			controller : 'dbf',
			action : 'getDataSet',
			customer_id: customer_id,
			dataType : ident,
			fieldSet : fieldSet
		}
		common.sendAjax(obj).then(function(json){
			console.log(json);
			if(json['success']){
				for(let fieldName in json['data']){
					$('#form').find('[name="'+fieldName+'"]').val(json['data'][fieldName]);
					//console.log(fieldName);
				}
			}else{
				alert(json['error']);
			}
		});

	}



	function test222(){
		let btnAdd = $('#form').find('section-group[name="contact"]>button')[0];
		//console.log(btnAdd);
		//let event = new Event('click');
		//btnAdd.dispatchEvent(event);
		btnAdd.click();
	}


	function test(){
		console.clear();
		//console.log('hallo');
		let form = $('#form');
		form.find('section-group').each(function(){
			console.log($(this).attr('name'));
		});
	}

	forma.saveForm2 = saveForm2;
	forma.fillFormWithData = fillFormWithData;
	forma.test222 = test222;
	forma.test = test;
	//forma.getForm = getForm;
	forma.getForm2 = getForm2;
	forma.getForm3 = getForm3;
	forma.getForm4 = getForm4;
	forma.loadForm = loadForm;
	forma.showValidationResults = showValidationResults;
	forma.generateForm2 = generateForm2;
	forma.loadDataFile = loadDataFile;
	forma.loadConfigDataFile = loadConfigDataFile;
	forma.checkElement = checkElement;
	forma.addGroupItem = addGroupItem;
	forma.deleteGroupItem = deleteGroupItem;
	forma.getSelect = getSelect;
	forma.createElement = createElement;
	forma.getData = getData;
	forma.getElementProps = getElementProps;
	forma.outErrors = outErrors;
	//forma.showSubGroup = showSubGroup;
	forma.selectInit = selectInit;
	forma.showDropdownList = showDropdownList;
	forma.hideDropdownList = hideDropdownList;
	forma.copyValueTo = copyValueTo;
	forma.keyup = keyup;
	forma.closePopup = closePopup;
	forma.scrollToElement = scrollToElement;
	forma.identForm = identForm;
	forma.hideDependencyItems = hideDependencyItems;
	forma.showDependencyItem = showDependencyItem;
	forma.addButtons = addButtons;
	forma.initGroups = initGroups;
	forma.fillBlockWithData = fillBlockWithData;
	forma.collapseAllGroups = collapseAllGroups;
	forma.toggleCollapsable = toggleCollapsable;
	forma.identGroups = identGroups;
	//forma.loadDataFile = loadDataFile;
	//forma.createElement = createElement;
	window.forma = forma;
})();