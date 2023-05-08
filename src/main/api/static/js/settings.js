
function modalAdd() {
    document.getElementById("inputAddUsername").setAttribute("class", "form-control");
    document.getElementById("inputAddFullname").setAttribute("class", "form-control");
    document.getElementById("inputAddEmail").setAttribute("class", "form-control");
    document.getElementById("inputAddPassword").setAttribute("class", "form-control");

    //Set user role on module settings with selects
    secondarySide = document.getElementById("addUserProfileSelects").innerHTML='';

    $('#switchAddModuleSupervisor').prop('checked', false);
    $('#switchAddModuleProgrammer').prop('checked', false);
    $('#switchAddGeneralSupervisor').prop('checked', false);

    $('#switchAddModuleSupervisor').prop('disabled', false);
    $('#switchAddModuleProgrammer').prop('disabled', false);
    $('#switchAddGeneralSupervisor').prop('disabled', false);

    document.getElementById("switchAddGeneralSupervisor").click();
    
    $('#warningAlertAdd').html('');
}

function addSelectAddUserModules(modules) {
    secondarySide = document.getElementById("addUserProfileSelects");
    selectLists = secondarySide.getElementsByTagName("select");  
    select = '<select class="mt-2 mr-auto ml-auto mb-auto custom-select text-info w-75"></select>';
    savedValues=[]

    for(i=0; i< selectLists.length; i++){
        savedValues.push(selectLists[i].value);
    }
    secondarySide.innerHTML = secondarySide.innerHTML + select;
    
    //Values wont save so I have to put them back
    for(i=0; i< savedValues.length; i++){
        selectLists[i].value=savedValues[i];    
    }

    selectList = selectLists[selectLists.length - 1];  
    for (i = 0; i < modules.length; i++) {
        var option = document.createElement("option");
        option.value = modules[i].name;
        option.text = modules[i].name;
        selectList.appendChild(option);
    }
}

function addUserToDictionary() {
    var formdata = { username: $('#inputAddUsername').val(), fullname: $('#inputAddFullname').val(), email: $('#inputAddEmail').val(), password: $('#inputAddPassword').val() };

    //Red marks on wrong inputs
    var username = document.getElementById("inputAddUsername");
    var fullname = document.getElementById("inputAddFullname");
    var email = document.getElementById("inputAddEmail");
    var password = document.getElementById("inputAddPassword");
    formdata.roles = [];

    username.setAttribute("class", "form-control");
    fullname.setAttribute("class", "form-control");
    email.setAttribute("class", "form-control");
    password.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.username) || formdata.username == '') {
        username.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.fullname == '') {
        fullname.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.email == '') {
        email.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.password == '' || formdata.password.length < 5) {
        password.setAttribute("class", "form-control is-invalid");
    }
    
    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.username) || formdata.username == '') {
        bootstrap_alert.warning("warningAlertAdd", "The user name <strong>must have no whitespaces or be left empty</strong>.");

    } else if (formdata.fullname == '') {
        bootstrap_alert.warning("warningAlertAdd", "The user's fullname <strong>must be filled</strong>.");
    
    } else if (formdata.email == '') {
        bootstrap_alert.warning("warningAlertAdd", "The user's email <strong>must be filled</strong>.");
    
    } else if (formdata.password == '' || formdata.password.length < 5) {
        bootstrap_alert.warning("warningAlertAdd", "The user's password <strong>must be filled</strong> and have at least 5 characters.");

    } else {
        sendRequest=true; 
        if($("#switchAddGeneralSupervisor").is(':checked')){
            formdata.roles = [{"role": "General Supervisor","module": "All"}];
        }else{
            if($("#switchAddModuleSupervisor").is(':checked')){
                formdata.roles = [{"role": "Module Supervisor","module": document.getElementById("inputAddMainUserModule").value}];
                if(document.getElementById("inputAddMainUserModule").value== 'Choose'){
                    sendRequest=false;
                }
            }
            if($("#switchAddModuleProgrammer").is(':checked')){
                secondarySide = document.getElementById("addUserProfileSelects");
                newModules = secondarySide.getElementsByTagName("select");
                ModuleList = [];

                for(index=0; index<newModules.length; index++){
                    if(ModuleList.indexOf(newModules[index].value) < 0){
                        ModuleList.push(newModules[index].value);
                        formdata.roles.push({"role": "Module Programmer", "module": newModules[index].value});
                    } 
                }
                if(ModuleList.length==0){
                    sendRequest=false;
                }
                
            }
        }

        if(sendRequest){
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formdata),
                dataType: 'json',
                url: 'http://localhost:8080/add/user',
                success: function (e) {
                    console.log(e);
                    window.location = "http://localhost:8080/settings";
                    bootstrap_alert.success("You successfully added the new User to the data dicctionary: <strong>" + formdata.username + ".</strong>");
                },
                error: function (error) {
                    console.log(error);
    
                    if (error.status == 409) {
                        username.setAttribute("class", "form-control is-invalid");
                        bootstrap_alert.warning("warningAlertAdd", "The user name is <strong>already defined</strong>.");
                    } else if (error.status == 401) {
                        bootstrap_alert.warning("warningAlertAdd", "You don't have <strong>permission</strong> over the user.");
                    } else {
                        window.location = "http://localhost:8080/settings";
                        bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to add the new Index to the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                    }
                }
            });
        }else{
            bootstrap_alert.warning("warningAlertAdd", "You can't save a user <strong>without a module</strong> assigned.");
        }
    }
}

bootstrap_alert = function () { }
bootstrap_alert.warning = function (alertId, message) {
    $('#' + alertId).html('<div class="alert alert-warning alert-dismissible fade show" role="alert">' + message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
}
bootstrap_alert.error = function (message) {
    $('#errorAlert').html('<div class="alert alert-error alert-dismissible fade show" role="alert">' + message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
}
bootstrap_alert.success = function (message) {
    $('#successAlert').html('<div class="alert alert-success alert-dismissible fade show" role="alert">' + message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
}


function modalModifyUserProfile(userName) {
    document.getElementById("previousUserName").innerText = userName.value;
    document.getElementById("previousUserName").value = userName.value;
    document.getElementById("inputModifyUsername").value = userName.value;
    document.getElementById("inputModifyFullname").value = document.getElementById(userName.value + 'Fullname').innerText;
    document.getElementById("inputModifyEmail").value = document.getElementById(userName.value + 'Email').innerText;

    //Set user role on module settings with selects
    secondarySide = document.getElementById("modifyUserProfileSelects");
    secondarySide.innerHTML='';
    roles= document.getElementById(userName.value + 'Roles').innerText.split(",");
    mainModule= document.getElementById("inputMainUserModule");

    $('#switchModuleSupervisor').prop('checked', false);
    $('#switchModuleProgrammer').prop('checked', false);
    $('#switchGeneralSupervisor').prop('checked', false);

    $('#switchModuleSupervisor').prop('disabled', false);
    $('#switchModuleProgrammer').prop('disabled', false);
    $('#switchGeneralSupervisor').prop('disabled', false);


    mainModule.value= 'All';
    programmerClicked=true;
    for(index=0; index< roles.length;index+=2){
        if(roles[index]=='General Supervisor' || roles[index]=='Project Leader'){    
            document.getElementById("switchGeneralSupervisor").click();
    
        }else if(roles[index]=='Module Supervisor'){
            document.getElementById("switchModuleSupervisor").click();
            mainModule.value= roles[index+1];

        }else{
            //There can be multiple modules associated with the module programmer role
            if(programmerClicked){
                document.getElementById("switchGeneralSupervisor").click();
                document.getElementById("switchModuleProgrammer").click();
                programmerClicked=false;
            }else{
                addSelectUserModules(dataDictionary.modules);
            }
            secondarySide.getElementsByTagName("select")[secondarySide.getElementsByTagName("select").length-1].value = roles[index+1];
        }
        //console.log(roles[index]);
        //console.log(roles[index+1]);

        if(user.roles[0].role != 'Project Leader' && user.roles[0].role != 'General Supervisor' || user.username == userName.value){
            $('#switchModuleSupervisor').prop('disabled', true);
            $('#switchModuleProgrammer').prop('disabled', true);
            $('#switchGeneralSupervisor').prop('disabled', true);
            $('#inputMainUserModule').prop('disabled', true);
            $('#modifyUserModulesAddSelect').prop('disabled', true);
            document.getElementById("modifyUserModulesAddSelect").setAttribute("onclick", " ");
        }
    }
    

    
    document.getElementById("inputModifyUsername").setAttribute("class", "form-control");
    document.getElementById("inputModifyFullname").setAttribute("class", "form-control");
    document.getElementById("inputModifyEmail").setAttribute("class", "form-control");

    $('#warningAlertModifyUserProfile').html('');
}

function addSelectUserModules(modules) {
    secondarySide = document.getElementById("modifyUserProfileSelects");
    selectLists = secondarySide.getElementsByTagName("select");
    select = '<select class="mt-2 mr-auto ml-auto mb-auto custom-select text-info w-75"></select>';
    savedValues=[]

    for(i=0; i< selectLists.length; i++){
        savedValues.push(selectLists[i].value);
    }
    secondarySide.innerHTML = secondarySide.innerHTML + select;
    
    //Values wont save so I have to put them back
    for(i=0; i< savedValues.length; i++){
        selectLists[i].value=savedValues[i];    
    }

    selectList = selectLists[selectLists.length - 1];
    for (i = 0; i < modules.length; i++) {
        var option = document.createElement("option");
        option.value = modules[i].name;
        option.text = modules[i].name;
        selectList.appendChild(option);
    }
}

function modifyUserProfileFromDictionary() {
    var formdata = { previousUsername: $('#previousUserName').val(), newUsername: $('#inputModifyUsername').val(), fullname: $('#inputModifyFullname').val(), email: $('#inputModifyEmail').val() };

    //Red marks on wrong inputs
    var newUsername = document.getElementById("inputModifyUsername");
    var fullname = document.getElementById("inputModifyFullname");
    var email = document.getElementById("inputModifyEmail");
    formdata.roles = [];

    newUsername.setAttribute("class", "form-control");
    fullname.setAttribute("class", "form-control");
    email.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.newUsername) || formdata.newUsername == '') {
        newUsername.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.fullname == '') {
        fullname.setAttribute("class", "form-control is-invalid");
    }
    if (/\s/.test(formdata.email) || formdata.email == '') {
        email.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.newUsername) || formdata.newUsername == '') {
        bootstrap_alert.warning("warningAlertModifyUserProfile", "The user name <strong>must have no whitespaces or be left empty</strong>.");

    } else if (formdata.fullname == '') {
        bootstrap_alert.warning("warningAlertModifyUserProfile", "The user's fullname <strong>must be filled</strong>.");
    } else if (formdata.email == '') {
        bootstrap_alert.warning("warningAlertModifyUserProfile", "The user's email <strong>must be filled</strong> and can't have whitespaces.");

    } else {
        sendRequest=true; 
        if($("#switchGeneralSupervisor").is(':checked')){
            formdata.roles = [{"role": "General Supervisor","module": "All"}];
        }else{
            if($("#switchModuleSupervisor").is(':checked')){
                formdata.roles = [{"role": "Module Supervisor","module": document.getElementById("inputMainUserModule").value}];
                if(document.getElementById("inputMainUserModule").value== 'Choose'){
                    sendRequest=false;
                }
            }
            if($("#switchModuleProgrammer").is(':checked')){
                secondarySide = document.getElementById("modifyUserProfileSelects");
                newModules = secondarySide.getElementsByTagName("select");
                ModuleList = [];

                for(index=0; index<newModules.length; index++){
                    if(ModuleList.indexOf(newModules[index].value) < 0){
                        ModuleList.push(newModules[index].value);
                        formdata.roles.push({"role": "Module Programmer", "module": newModules[index].value});
                    } 
                }
                if(ModuleList.length==0){
                    sendRequest=false;
                }
                
            }
        }
        //console.log(formdata);
        if(sendRequest){
            $.ajax({
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(formdata),
                dataType: 'json',
                url: 'http://localhost:8080/modify/userProfile',
                success: function (e) {
                    console.log(e);
                    window.location = "http://localhost:8080/settings";
                    bootstrap_alert.success("You successfully modified the User from the data dicctionary: <strong>" + formdata.newUsername + ".</strong>");
                },
                error: function (error) {
                    console.log(error);

                    if (error.status == 409) {
                        newUsername.setAttribute("class", "form-control is-invalid");
                        bootstrap_alert.warning("warningAlertModifyUserProfile", "The user name is <strong>already defined</strong>.");
                    } else if (error.status == 401) {
                        bootstrap_alert.warning("warningAlertModifyUserProfile", "You don't have <strong>permission</strong> over the user.");
                    } else {
                        window.location = "http://localhost:8080/settings";
                        bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the User from the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                    }
                }
            });
        }else{
            bootstrap_alert.warning("warningAlertModifyUserProfile", "You can't save a user <strong>without a module</strong> assigned.");
        }
    }
}

function modalChangeUserPassword(userName) {
    document.getElementById("changePasswordUserName").innerText = userName.value;
    document.getElementById("changePasswordUserName").value = userName.value;

    document.getElementById("inputPreviousPassword").setAttribute("class", "form-control");
    document.getElementById("inputNewPassword").setAttribute("class", "form-control");
    document.getElementById("inputNewPasswordRepeat").setAttribute("class", "form-control");

    $('#warningAlertChangeUserPassword').html('');
}

function changeUserPasswordFromDictionary() {
    var formdata = { username: $('#changePasswordUserName').val(), previousPassword: $('#inputPreviousPassword').val(), newPassword: $('#inputNewPassword').val() };

    //Red marks on wrong inputs
    var previousPassword = document.getElementById("inputPreviousPassword");
    var newPassword = document.getElementById("inputNewPassword");
    var newPasswordRepeat = document.getElementById("inputNewPasswordRepeat");

    previousPassword.setAttribute("class", "form-control");
    newPassword.setAttribute("class", "form-control");
    newPasswordRepeat.setAttribute("class", "form-control");

    //Check if they are wrong
    if (formdata.previousPassword == '' || formdata.previousPassword.length < 5) {
        previousPassword.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.newPassword == '' || formdata.newPassword.length < 5) {
        newPassword.setAttribute("class", "form-control is-invalid");
    }
    if (newPasswordRepeat.value == '' || newPasswordRepeat.value.length < 5) {
        newPasswordRepeat.setAttribute("class", "form-control is-invalid");
    }
    if (newPasswordRepeat.value != formdata.newPassword) {
        newPassword.setAttribute("class", "form-control is-invalid");
        newPasswordRepeat.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.previousPassword == formdata.newPassword) {
        previousPassword.setAttribute("class", "form-control is-invalid");
        newPassword.setAttribute("class", "form-control is-invalid");
    }
    
    //Last checks for the warning pop ups and the server request
    if (formdata.previousPassword == '' || formdata.previousPassword.length < 5) {
        bootstrap_alert.warning("warningAlertChangeUserPassword", "The current password field <strong>must be filled</strong> and have at least 5 characters.");
    } else if (formdata.newPassword == '' || formdata.newPassword.length < 5) {
        bootstrap_alert.warning("warningAlertChangeUserPassword", "The new password field <strong>must be filled</strong> and have at least 5 characters.");
    } else if (newPasswordRepeat.value == '' || newPasswordRepeat.value.length < 5) {
        bootstrap_alert.warning("warningAlertChangeUserPassword", "The new password repeat field <strong>must be filled</strong> and have at least 5 characters.");
    } else if (newPasswordRepeat.value != formdata.newPassword) {
        bootstrap_alert.warning("warningAlertChangeUserPassword", "The new password repetition field must match the fist one.");
    } else if (formdata.previousPassword == formdata.newPassword) {
        bootstrap_alert.warning("warningAlertChangeUserPassword", "The new password is the same as the previous password field.");

    } else {
        //console.log(formdata);
        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/modify/userPassword',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/settings";
                bootstrap_alert.success("You successfully modified the User's Password from the data dicctionary: <strong>" + formdata.username + ".</strong>");
            },
            error: function (error) {
                console.log(error);

                if (error.status == 409) {
                    previousPassword.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertChangeUserPassword", "The user password is <strong>not correct</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertChangeUserPassword", "You don't have <strong>permission</strong> over the user.");
                } else {
                    window.location = "http://localhost:8080/settings";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the User's Password from the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
    }
}

function modalDeleteUser(userName) {
    document.getElementById("deleteUserName").innerText = userName.value;
    document.getElementById("deleteUserName").value = userName.value;
}

function deleteUserFromDictionary() {
    var formdata = { username: $('#deleteUserName').val() };

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/delete/user',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/settings";
            bootstrap_alert.success("You successfully deleted the User from the data dicctionary: <strong>" + formdata.username + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/settings";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to delete the User from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}

//Set table view for Programming Language Symbol Type
function modalPLST(){
    document.getElementById("PLSTorPTOVTitle").innerText="Programming Language Symbol Type";
    document.getElementById("PLSTorPTOVTableBody").innerHTML="";
    for (index = 0; index < dataDictionary.ProgrammingLanguageSymbolType.length; index++) {
        item = '<tr>' +
          '<td>'+(index+1)+'</td>' +
          '<td>' + dataDictionary.ProgrammingLanguageSymbolType[index].name + '</td>' +
          '</tr>';

        $(item).appendTo("#PLSTorPTOVTableBody");
    }
}

//Set table view for Project Type Of Value
function modalPTOV(){
    document.getElementById("PLSTorPTOVTitle").innerText="Project Type Of Value";
    document.getElementById("PLSTorPTOVTableBody").innerHTML="";
    for (index = 0; index < dataDictionary.ProjectTypeOfValue.length; index++) {
        item = '<tr>' +
          '<td>'+(index+1)+'</td>' +
          '<td>' + dataDictionary.ProjectTypeOfValue[index].name + '</td>' +
          '</tr>';

        $(item).appendTo("#PLSTorPTOVTableBody");
    }
}


/* Disables tabs and buttons refering to each own user's top level permissions at the settings page
*/
function setTabPermissions(roleOnModule) {
    //roles is a list with role and module
    profileSettings = document.getElementById("profileSettingsNav");
    generalSettings = document.getElementById("generalSettingsNav");
    userManagement = document.getElementById("userManagementNav");
    projectManagement = document.getElementById("projectManagementNav");
    modifyDeleteButtons = document.getElementsByClassName("modifyDelete");
    actionCards = document.getElementsByClassName("modal fade");
    

    if(roleOnModule[0].role == 'Guest'){
        profileSettings.setAttribute("class", profileSettings.getAttribute("class")+" disabled");
        generalSettings.setAttribute("class", generalSettings.getAttribute("class")+" disabled");
        userManagement.setAttribute("class", userManagement.getAttribute("class")+" disabled");
        projectManagement.setAttribute("class", projectManagement.getAttribute("class")+" disabled");
        for (index = 0; index < modifyDeleteButtons.length; index++) {
            modifyDeleteButtons[index].setAttribute("class", modifyDeleteButtons[index].getAttribute("class") + " disabled d-none");
        }
        for (index = 0; index < actionCards.length; index++) {
            actionCards[index].setAttribute("class", actionCards[index].getAttribute("class") + " disabled d-none");
        }
        document.getElementById("buttonAddNewUser").setAttribute("class", document.getElementById("buttonAddNewUser").getAttribute("class")+" disabled");
        document.getElementById("buttonAddNewUser").setAttribute("onclick", " ");

    }else if(roleOnModule[0].role != 'Project Leader' && roleOnModule[0].role != 'General Supervisor'){
        generalSettings.setAttribute("class", generalSettings.getAttribute("class")+" disabled");
        userManagement.setAttribute("class", userManagement.getAttribute("class")+" disabled");
        projectManagement.setAttribute("class", projectManagement.getAttribute("class")+" disabled");
        //Profile and password edit on the first and second one
        for (index = 2; index < modifyDeleteButtons.length; index++) {
            modifyDeleteButtons[index].setAttribute("class", modifyDeleteButtons[index].getAttribute("class") + " disabled d-none");
        }
        document.getElementById("buttonAddNewUser").setAttribute("class", document.getElementById("buttonAddNewUser").getAttribute("class")+" disabled");
        document.getElementById("buttonAddNewUser").setAttribute("onclick", " ");
        document.getElementById("addUserCard").setAttribute("class", document.getElementById("addUserCard").getAttribute("class")+" disabled");
        
        if(roleOnModule[0].role == 'Quality Assurance'){
            document.getElementById("modifyUserProfileButton").setAttribute("class", document.getElementById("modifyUserProfileButton").getAttribute("class")+" disabled");
            document.getElementById("modifyUserProfileButton").setAttribute("onclick", " ");
            document.getElementById("modifyUserProfileButton").setAttribute("data-target", " ");
        }
    }
        
}


////////////////////////////////////////////////////
///////////////   User Pagination   ////////////////
////////////////////////////////////////////////////


function setUserPagination(numberOfPages, pageNumber) {
    
    table = document.getElementById("userGlobalTableBody");
    paginationTotal = usersPagination;
    state = "User";
    
    tr = table.getElementsByTagName("tr");
    if (pageNumber > 0 && pageNumber <= paginationTotal && numberOfPages > 0) {
        for (i = 0; i < tr.length; i++) {
            if (i >= numberOfPages * (pageNumber - 1) && i < numberOfPages * pageNumber) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
            
        }
        document.getElementById("pageNumber" + state).innerText = paginationTotal;
        document.getElementById("lastPagination" + state).setAttribute("onclick", "setUserPagination(" + numberOfPages + "," + paginationTotal + ")");

        document.getElementById("activePagination" + state).value = pageNumber;
        document.getElementById("activePagination" + state).getElementsByTagName("a")[0].innerText = pageNumber;

    }
    //console.log(pageNumber);
    nextPage = parseInt(pageNumber) + 1;
    previousPage = pageNumber - 1;
    document.getElementById("previousPagination" + state).setAttribute("onclick", "setUserPagination(" + numberOfPages + "," + previousPage + ")");
    document.getElementById("nextPagination" + state).setAttribute("onclick", "setUserPagination(" + numberOfPages + "," + nextPage + ")");
    document.getElementById("firstPagination" + state).setAttribute("onclick", "setUserPagination(" + numberOfPages + "," + 1 + ")");
    
}



function removeFade(popoverName) {
    
    var currentPage = document.getElementById("activePaginationUser").value;
    var lastPage = parseInt(document.getElementById("pageNumberUser").innerText);

    $('#' + popoverName).popover('show');
    $(".popover").removeClass("fade");

    try {
        setInputFilter(document.getElementById("inputPagination" + popoverName), function (value) {
            return /^-?\d*$/.test(value);
        });

        //Update popover input field
        placeholder = "1-10";
        if (popoverName == 'lesserPaginationUser') {
            placeholder = "1-" + currentPage.toString();
        } else if (popoverName == 'greaterPaginationUser') {
            greaterLastpage = 1;
            if (lastPage > 1) {
                greaterLastpage = lastPage;
            }

            placeholder = currentPage.toString() + "-" + greaterLastpage.toString();
        }
        currentPopover = document.getElementById("inputPagination" + popoverName);
        currentPopover.placeholder = placeholder;

    } catch (error) {

    }

    /*Filter between 0 and 500
    setInputFilter(document.getElementById("intLimitTextBox"), function(value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500); });*/
}


function popoverInitialization(popoverName) {
    placeholder = "-"
    var currentPage = document.getElementById("activePaginationUser").value;
    var lastPage = document.getElementById("lastPaginationUser").value;
    

    if (popoverName == 'lesserPaginationUser') {
        placeholder = "1-" + currentPage.toString();
    } else if (popoverName == 'greaterPaginationUser') {
        placeholder = currentPage.toString() + "-" + lastPage.toString();
    }

    $('#' + popoverName).popover({
        placement: 'top',
        html: 'true',
        content: '<p class="text-center m-0 pr-2 pl-2">Enter the page number</p><input type="text" class="form-control-sm text-center m-1 mt-0 w-50 inputTextPagination" placeholder="' + placeholder + '" id="inputPagination' + popoverName + '"></input>' +
            '<button type="button" id="inputButtonPagination' + popoverName + '" class="btn btn-default ml-4 inputButtonPagination">' +
            '<span class="oi oi-arrow-thick-right"></span></button>',
        template: '<div class="popover"><div class="arrow"></div>' +
            '<h3 class="popover-title"></h3><div class="popover-content">' +
            '</div><div class="popover-footer"></div>' +
            '</div>'
    });
}


// Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}