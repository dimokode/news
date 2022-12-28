;(function(){

	function common(){}


	function test(){
		alert('test');
	}



	function sendAjax(ajaxObj){
		const json = JSON.stringify(ajaxObj);
		//console.log('sendAjax:' + json);
		return fetch('/ajax.php', {
				method: "POST",
				body: json,
				credentials: 'same-origin',
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function(response){
				//console.log(response.json());
				return response.json();	
			}).catch( error => {
				console.log(error);
				console.log(json);
			});
	}



common.test = test;
common.sendAjax = sendAjax;
window.common = common;

})();