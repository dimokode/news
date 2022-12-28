;(function(){

	function documents(){}


	function show(){
		template.loadTemplateByName('documents.html').then(function(tpl){
			$('#content').html(tpl);
		}).then(function(){
			showCustomerFolders();
		});
	}

	function showCustomerFolders(){
		customers.getCustomersInFolder().then(function(arrCustomers){
				var html = '';
				arrCustomers.forEach(function(element, index){
				//console.log(element + "=> " + index);
				html+='<input type="checkbox" value="'+element+'"><a href="js:void();" onclick="forma.checkElement($(this));documents.showReklamaFolder(\''+element+'\');">'+element+'</a><br>';
			});
			$('#customers').html(html);
			$('#claims').html('');
			$('#documents').html('');
		});
	}

	function showReklamaFolder(customer){
		if(customer.indexOf('.php') != -1){
			customer = customer.substr(0, customer.indexOf('.php'));
		}
		//console.log();

		var obj = {
			'controller' : 'files',
			'action' : 'getFolders',
			'fldname' : 'download/'+customer
		}

		//console.log(obj);
		common.sendAjax(obj).then(function(json){
			console.log(json);
			var html = '';
			if(json['result'] !== false && json['folders'].length>0){
				for(key in json['folders']){
					//console.log(key + '=>' + arrList[key]);
					var folder = customer + '/' + json['folders'][key];
					html+='<input type="checkbox" value="'+json['folders'][key]+'"><a href="js:void(0);" onclick="forma.checkElement($(this)); documents.showDocs(\''+folder+'\');">'+json['folders'][key]+'</a><br>';
				}
			}
			$('#claims').html(html);
			$('#documents').html('');
		});
	}

	//formId without #
	function generateDoc(docType, formId){
		//alert('generate');
		//console.log(forma.getForm3(formId));
		//return
		var obj = {
			'controller' : 'documents',
			'action' : 'generateDoc',
			'docType' : docType,
			'formData' : forma.getForm4(formId)
		}

		console.log(obj.formData);
		//return

		common.sendAjax(obj).then(function(json){
			//console.log(json);
			if(json['success']===true){
				alert('Document was successfully generated');
			}else{
				alert(json['error']);
			}
		});

	}


	function showDocs(folder){
		//alert(folder);
		var obj = {
			'controller' : 'files',
			'action' : 'getFilesInFolder',
			'fldname' : 'download/'+folder
		}

		common.sendAjax(obj).then(function(json){
			console.log(json);
			var html = '';
			for(key in json['files']){
				var filename = json['files'][key];
				html+='<input type="checkbox" value="'+ filename +'"><a href="' + obj['fldname'] + '/' + filename +'">' + filename + '</a><br>';
			}
			$('#documents').html(html);
		});
	}

	function deleteDocuments(){
		var customerFolder = $('#customers').find('.selected').text();
		var claimFolder = $('#claims').find('.selected').text();
		console.log('customerFolder:' + customerFolder + ' claimFolder:' + claimFolder);

		var claims = [];
		$('#claims').find('input[type=checkbox]:checked').each(function(){
			//console.log($(this).val());
			claims.push($(this).val());
		});

		var documents = [];
		$('#documents').find('input[type=checkbox]:checked').each(function(){
			//console.log($(this).val());
			documents.push($(this).val());
		});

		console.log(claims);
		console.log(documents);

		if(claims.length>0){
			var obj = {
				'controller' : 'files',
				'action' : 'deleteFiles',
				//'fldname' : 'download/'+customer + '/' + claimFolder,
				'fldname' : 'download/'+customerFolder,
				'folders' : claims,
				//'files' : claims,
				'filetype' : 'folder'
			}

			common.sendAjax(obj).then(function(json){
				//console.log(json);
				if(json['success']){
					showReklamaFolder(customerFolder);
					//alert(customerFolder);
				}else{
					alert(json['error']);
				}
			});

		}else if(documents.length>0){
			var obj = {
				'controller' : 'files',
				'action' : 'deleteFiles',
				'fldname' : 'download/'+customerFolder + '/' + claimFolder,
				'files' : documents,
				'filetype' : 'docx'
			}

			common.sendAjax(obj).then(function(json){
				//console.log(json);
				if(json['success']){
					//showDocs(customerFolder);
					alert(customerFolder);
				}else{
					alert(json['error']);
				}
			});
		}else{
			alert('Select something for deletion');
		}
	}

function showDocumentsByClaimId(claim_id){
	template.loadTemplateByName('documents-claim.html').then(function(tpl){
		$('#claim').html(tpl);
		$('#claim').show();
	});
}


function showDocumentPanel(docType){
	let obj = {
		controller : 'documents',
		action : 'getDocumentTemplate',
		docType : docType
	}

	common.sendAjax(obj).then(function(json){
		console.log(json);
	});
}

documents.show = show;
documents.generateDoc = generateDoc;
documents.showCustomerFolders = showCustomerFolders;
documents.showReklamaFolder = showReklamaFolder;
documents.showDocs = showDocs;
documents.deleteDocuments = deleteDocuments;
documents.showDocumentsByClaimId = showDocumentsByClaimId;
documents.showDocumentPanel = showDocumentPanel;
window.documents = documents;	

})();