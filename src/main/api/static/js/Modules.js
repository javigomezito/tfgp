/////////////////////////////
////// Modules Actions  /////
/////////////////////////////

function modalAdd() {
    document.getElementById("inputAddModuleName").setAttribute("class", "form-control");
    
    $('#warningAlertAdd').html('');
}


function addModuleToDictionary() {
    var formdata = { name: $('#inputAddModuleName').val() };
    
    //Red marks on wrong inputs
    var moduleName = document.getElementById("inputAddModuleName");
    
    moduleName.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.name) || formdata.name == '') {
        moduleName.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.name) || formdata.name == '') {
        bootstrap_alert.warning("warningAlertAdd", "The module name <strong>must have no whitespaces or be left empty</strong>.");

    } else {

        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/add/module',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/modules";
                bootstrap_alert.success("You successfully added the new Module to the data dicctionary: <strong>" + formdata.name + ".</strong>");
            },
            error: function (error) {
                console.log(error);
                //console.log(error.status);
                //console.log(typeof error.status);

                if (error.status == 409) {
                    moduleName.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertAdd", "The module name is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertAdd", "You don't have <strong>permissions</strong>.");
                } else {
                    window.location = "http://localhost:8080/modules";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to add the new Module to the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
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


function modalModify(moduleName) {
    document.getElementById("previousModuleName").innerText = moduleName.value;
    document.getElementById("previousModuleName").value = moduleName.value;
    document.getElementById("inputModifyModuleName").value = moduleName.value;
    
    document.getElementById("inputModifyModuleName").setAttribute("class", "form-control");
}


function modifyModuleFromDictionary() {
    var formdata = { previousName: $('#previousModuleName').val(), newName: $('#inputModifyModuleName').val() };

    //Red marks on wrong inputs
    var moduleName = document.getElementById("inputModifyModuleName");

    moduleName.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.newName) || formdata.newName == '') {
        moduleName.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.newName) || formdata.newName == '') {
        bootstrap_alert.warning("warningAlertModify", "The module name <strong>must have no whitespaces or be left empty</strong>.");

    } else {

        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/modify/module',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/modules";
                bootstrap_alert.success("You successfully modified the Module from the data dicctionary: <strong>" + formdata.newName + ".</strong>");
            },
            error: function (error) {
                console.log(error);

                if (error.status == 409) {
                    moduleName.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertModify", "The module name is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertModify", "You don't have <strong>permissions</strong>.");
                } else {
                    window.location = "http://localhost:8080/modules";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Module from the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
    }
}

function modalDelete(moduleName) {
    document.getElementById("deleteModuleName").innerText = moduleName.value;
    document.getElementById("deleteModuleName").value = moduleName.value;
    //If there are symbols attached to it the button wont be enabled
    
    document.getElementById("deleteModuleSymbolsAssociated").innerText = document.getElementById(moduleName.value + 'Symbols').innerText;
    
    //console.log(typeof(document.getElementById(moduleName.value + 'Symbols').innerText))
    if (document.getElementById(moduleName.value + 'Symbols').innerText != '0') {    
        document.getElementById("deleteModuleCardButton").setAttribute("class", document.getElementById("deleteModuleCardButton").getAttribute("class") + " disabled");
        document.getElementById("deleteModuleCardButton").setAttribute("onclick", "");
    } else {
        document.getElementById("deleteModuleCardButton").setAttribute("class", "btn btn-danger mr-auto");
        document.getElementById("deleteModuleCardButton").setAttribute("onclick", "deleteModuleFromDictionary()");
    }

}


function deleteModuleFromDictionary() {
    var formdata = { name: $('#deleteModuleName').val(), redirect: '' };
    
    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/delete/module',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/modules";
            bootstrap_alert.success("You successfully deleted the Module from the data dicctionary: <strong>" + formdata.name + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/modules";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to delete the Module from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}



///////////////////////////////////////
////// Module Button Permissions //////
///////////////////////////////////////

//Set user's permissions
function setModuleButtonPermissions(roleOnModule) {

    var addNewModuleButton = document.getElementById("addNewModuleButton");
    var addNewModuleCardButton = document.getElementById("addNewModuleCardButton");
    var modifyDeleteButtons = document.getElementsByClassName("modifyDelete");
    var modifyModuleCard = document.getElementById("modifyModuleCard");
    var deleteModuleCard = document.getElementById("deleteModuleCard");
    
    var roleList = []

    for (index = 0; index < roleOnModule.length; index++) {
        if (roleList.indexOf(roleOnModule[index].role) < 0) {
            roleList.push(roleOnModule[index].role)
        }
    }

    if (roleList[0] != 'Project Leader' && roleList[0] != 'General Supervisor') {
        addNewModuleButton.setAttribute("class", addNewModuleButton.getAttribute("class") + " disabled d-none");
        addNewModuleCardButton.setAttribute("class", addNewModuleCardButton.getAttribute("class") + " disabled d-none");
        modifyModuleCard.setAttribute("class", modifyModuleCard.getAttribute("class") + " disabled d-none");
        deleteModuleCard.setAttribute("class", deleteModuleCard.getAttribute("class") + " disabled d-none");
        
        for (index = 0; index < modifyDeleteButtons.length; index++) {
            modifyDeleteButtons[index].setAttribute("class", modifyDeleteButtons[index].getAttribute("class") + " disabled d-none");
        }
    }
}


////////////////////////////////////////////////////
/////////  Module Pagination  and filtering/////////
////////////////////////////////////////////////////


function setModulePagination(numberOfPages, pageNumber, validated) {
    if (validated) {
        table = document.getElementById("modulesTableBody");
        paginationTotal = paginationValidated;
        state = "Validated";
    }
    tr = table.getElementsByTagName("tr");
    if (pageNumber > 0 && pageNumber <= paginationTotal && numberOfPages > 0) {
        for (i = 0; i < tr.length; i++) {
            tr[i].setAttribute("class", "accordion-toggle collapsed");
            if (i >= numberOfPages * (pageNumber - 1)&& i < numberOfPages * pageNumber) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
        document.getElementById("pageNumber" + state).innerText = paginationTotal;
        document.getElementById("lastPagination" + state).setAttribute("onclick", "setModulePagination(" + numberOfPages + "," + paginationTotal + "," + validated + ")");

        document.getElementById("activePagination" + state).value = pageNumber;
        document.getElementById("activePagination" + state).getElementsByTagName("a")[0].innerText = pageNumber;

    }
    //console.log(pageNumber);
    nextPage = parseInt(pageNumber) + 1;
    previousPage = pageNumber - 1;
    document.getElementById("previousPagination" + state).setAttribute("onclick", "setModulePagination(" + numberOfPages + "," + previousPage + "," + validated + ")");
    document.getElementById("nextPagination" + state).setAttribute("onclick", "setModulePagination(" + numberOfPages + "," + nextPage + "," + validated + ")");
    document.getElementById("firstPagination" + state).setAttribute("onclick", "setModulePagination(" + numberOfPages + "," + 1 + "," + validated + ")");

}



function removeFade(popoverName, validated) {
    if (validated) {
        var currentPage = document.getElementById("activePaginationValidated").value;
        var lastPage = parseInt(document.getElementById("pageNumberValidated").innerText);

    } else {
        var currentPage = document.getElementById("activePaginationNonValidated").value;
        var lastPage = parseInt(document.getElementById("pageNumberNonValidated").innerText);
    }

    $('#' + popoverName).popover('show');
    $(".popover").removeClass("fade");

    try {
        setInputFilter(document.getElementById("inputPagination" + popoverName), function (value) {
            return /^-?\d*$/.test(value);
        });

        //Update popover input field
        placeholder = "1-10";
        if (popoverName == 'lesserPaginationValidated' || popoverName == 'lesserPaginationNonValidated') {
            placeholder = "1-" + currentPage.toString();
        } else if (popoverName == 'greaterPaginationValidated' || popoverName == 'greaterPaginationNonValidated') {
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

    /*Filtro entre 0 y 500
    setInputFilter(document.getElementById("intLimitTextBox"), function(value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500); });*/
}


function popoverInitialization(popoverName, validated) {
    placeholder = "-"
    if (validated) {
        var currentPage = document.getElementById("activePaginationValidated").value;
        var lastPage = document.getElementById("lastPaginationValidated").value;
    } else {
        var currentPage = document.getElementById("activePaginationNonValidated").value;
        var lastPage = document.getElementById("lastPaginationNonValidated").value;
    }

    if (popoverName == 'lesserPaginationValidated' || popoverName == 'lesserPaginationNonValidated') {
        placeholder = "1-" + currentPage.toString();
    } else if (popoverName == 'greaterPaginationValidated' || popoverName == 'greaterPaginationNonValidated') {
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

