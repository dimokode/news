;(function(){

if(user.getCookie('user_id') !== undefined){
	$('#user_info').html(user.getCookie('user_id') + '(' + user.getCookie('userrole') + ')');
}
	

})();