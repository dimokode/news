;(function(){

function users(){}

function show(){
    template.loadTemplateByName('users.html').then(function(tpl){
        $('#content').html(tpl);
    }).then(function(){
        users.getUsers().then(function(json){
            //console.log('aaa: ' + aaa);
            let obj = {
                tpl: `<div><a href="javascript:void(0);" onclick="forma.checkElement($(this)); users.getUserById('{%user_id%}');">{%user_id%}</a></div>`,
                data: json['data']
            }
            $('#users').html(template.generateList(obj));
        });
    });
}


function getUsers(){
    var obj = {
        'controller' : 'dbf',
        'action' : 'getUsers',
    }
    return common.sendAjax(obj).then(function(json){
        console.log(json);
        if(json['success'] === true){
            return json;

        }else{
            alert(json['error']);
            return;
        }
    });
}

function getUserById(user_id){
    const obj = {
        controller: 'user',
        action: 'getUserById',
        user_id: user_id
    }
    common.sendAjax(obj).then(function(json){
        console.log(json);
        let arrData = (JSON.parse(json['jsonData']))['data'];
        let arrSections = JSON.parse(json['jsonSections']);

        if(json !== false && json['success']){
            let objForm = {
                type: 'user',
                action: 'update'
            }

            forma.generateForm2(json, objForm).then(function(formHTML){
                var tags = {
                    'callback' : 'users.cbUpdateUser'
                }
                
                template.loadTemplateByName('forma.html', tags).then(function(tpl){
                    $('#user').html(tpl);
                    $('#form').html(formHTML);
                    forma.fillFormWithData('form', arrData, arrSections);
                    forma.selectInit('#form');//for select groupsets
                    forma.addButtons('#form');
                    forma.identGroups('#form');
                    forma.collapseAllGroups('#form'); 
                });
            });
        }else{
            console.error(json);
        }
    });
    return
}


function addUser(){
    const obj = {
        controller: 'user',
        action: 'addNewUser'
    }
    common.sendAjax(obj).then(function(json){
        console.log(json);
        let arrData = (JSON.parse(json['jsonData']))['data'];
        let arrSections = JSON.parse(json['jsonSections']);

        if(json !== false && json['success']){
            let objForm = {
                type: 'user',
                action: 'add'
            }

            forma.generateForm2(json, objForm).then(function(formHTML){
                var tags = {
                    'callback' : 'users.cbUpdateUser'
                }
                
                template.loadTemplateByName('forma.html', tags).then(function(tpl){
                    $('#user').html(tpl);
                    $('#form').html(formHTML);
                    forma.fillFormWithData('form', arrData, arrSections);
                    forma.selectInit('#form');//for select groupsets
                    forma.addButtons('#form');
                    forma.identGroups('#form');
                    forma.collapseAllGroups('#form'); 
                });
            });
        }else{
            console.error(json);
        }
    });
    return
}



/** callbacks */
function cbAddUser(){
    show();
    alert('User was successfully added');
}

function cbUpdateUser(){
    alert('User was successfully updated');
}

users.show = show;
users.getUsers = getUsers;
users.addUser = addUser;
users.getUserById = getUserById;
users.cbAddUser = cbAddUser;
users.cbUpdateUser = cbUpdateUser;
window.users = users;
})();