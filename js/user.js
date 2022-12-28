;(function(){

function user(){}

function login(username, password){
	console.log(getCookie('PHPSESSID'));
	if(username != '' && password != ''){}else{
		alert('Username and password must be filled');
		return false
	}
	
	let obj = {
		'controller' : 'dbf',
        'action' : 'login',
		'username' : username,
		'password' : password
	}

	return common.sendAjax(obj).then(function(json){
		console.log(json);
		if(json['success']){
			//let jsonData = JSON.parse(json['data']);
			let jsonData = json['data'];
			setCookie('logged', true);
			//setCookie('user_id', jsonData['user_id']);
			//setCookie('userrole', jsonData['userrole']);
			//setCookie('customer_id', jsonData['customer_id']);
			//document.cookie = "loged=true";
			document.location.href = "/";
			//alert('You were successfully loged in!');
		}else{
			alert(json['error']);
		}
	});

}

function logout(){
	//document.cookie = "";
	//deleteCookie('logged');
	deleteAllCookies();
	document.location.href = "/";
}


function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}


function setCookie(name, value, options = {}) {

	options = {
		path: '/',
		expires: new Date(Date.now() + 24*3600*1000),
		// при необходимости добавьте другие значения по умолчанию
		...options
	};

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString();
	}

	let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

	for (let optionKey in options) {
		updatedCookie += "; " + optionKey;
		let optionValue = options[optionKey];
		if (optionValue !== true) {
		updatedCookie += "=" + optionValue;
		}
	}

	document.cookie = updatedCookie;
}

function deleteCookie(name) {
	setCookie(name, "", {
	  'max-age': -1
	})
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

user.getCookie = getCookie;
user.login = login;
user.logout = logout;
window.user = user;

})();