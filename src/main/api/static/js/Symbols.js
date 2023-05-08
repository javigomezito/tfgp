/////////////////////////////
////// Symbol Actions  //////
/////////////////////////////

function modalAdd() {
    document.getElementById("inputAddSymbolName").setAttribute("class", "form-control");
    document.getElementById("inputAddSymbolDefinition").setAttribute("class", "form-control");
    document.getElementById("inputAddSymbolUnit").setAttribute("class", "form-control");
    document.getElementById("inputAddModule").setAttribute("class", "form-control");
    document.getElementById("inputAddCategory").setAttribute("class", "form-control");
    document.getElementById("inputAddPTOV").setAttribute("class", "form-control");
    document.getElementById("inputAddPLST").setAttribute("class", "form-control");

    $('#warningAlertAdd').html('');
}



function addSymbolToDictionary(roleOnModule) {
    var formdata = { name: $('#inputAddSymbolName').val(), definition: $('#inputAddSymbolDefinition').val(), unit: $('#inputAddSymbolUnit').val(), module: $('#inputAddModule').val(), category: $('#inputAddCategory').val(), ProjectTypeOfValue: $('#inputAddPTOV').val(), ProgrammingLanguageSymbolType: $('#inputAddPLST').val() };
    //document.getElementById("demo1").innerHTML = formdata.username;
    //document.getElementById("demo2").innerHTML = formdata.password;

    //Red marks on wrong inputs
    var symbolName = document.getElementById("inputAddSymbolName");
    var symbolDefinition = document.getElementById("inputAddSymbolDefinition");
    var symbolUnit = document.getElementById("inputAddSymbolUnit");
    var symbolModule = document.getElementById("inputAddModule");
    var symbolCategory = document.getElementById("inputAddCategory");
    var symbolPTOV = document.getElementById("inputAddPTOV");
    var symbolPLST = document.getElementById("inputAddPLST");


    symbolName.setAttribute("class", "form-control");
    symbolDefinition.setAttribute("class", "form-control");
    symbolUnit.setAttribute("class", "form-control");
    symbolModule.setAttribute("class", "form-control");
    symbolCategory.setAttribute("class", "form-control");
    symbolPTOV.setAttribute("class", "form-control");
    symbolPLST.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.name) || formdata.name == '') {
        symbolName.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.definition == '') {
        symbolDefinition.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.unit == '') {
        symbolUnit.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.module == 'Choose...') {
        symbolModule.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.category == 'Choose...') {
        symbolCategory.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.ProjectTypeOfValue == 'Choose...') {
        symbolPTOV.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.ProgrammingLanguageSymbolType == 'Choose...') {
        symbolPLST.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (formdata.module == 'Choose...' | formdata.category == 'Choose...' | formdata.ProjectTypeOfValue == 'Choose...' | formdata.ProgrammingLanguageSymbolType == 'Choose...') {
        bootstrap_alert.warning("warningAlertAdd", "You should select a value for all of the following options: <strong>Module, Category, ProjectTypeOfValue</strong> and <strong>ProgrammingLanguageSymbolType.</strong>");

    } else if (/\s/.test(formdata.name) || formdata.name == '') {
        bootstrap_alert.warning("warningAlertAdd", "The symbol name <strong>must have no whitespaces or be left empty</strong>.");

    } else if (formdata.definition == '') {
        bootstrap_alert.warning("warningAlertAdd", "The symbol definition <strong>must be filled</strong>.");

    } else if (formdata.unit == '') {
        bootstrap_alert.warning("warningAlertAdd", "The symbol unit <strong>must be filled</strong>.");

    } else {

        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/add/symbol',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/symbols";
                bootstrap_alert.success("You successfully added the new Symbol to the data dicctionary: <strong>" + formdata.name + ".</strong>");
            },
            error: function (error) {
                console.log(error);
                //console.log(error.status);
                //console.log(typeof error.status);

                if (error.status == 409) {
                    symbolName.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertAdd", "The symbol name is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertAdd", "You don't have <strong>permission</strong> over the module.");
                } else {
                    window.location = "http://localhost:8080/symbols";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to add the new Symbol to the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
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


function selectElement(id, valueToSelect) {
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

function modalModify(symbolName) {
    document.getElementById("previousSymbolName").innerText = symbolName.value;
    document.getElementById("previousSymbolName").value = symbolName.value;
    document.getElementById("inputModifySymbolName").value = symbolName.value;
    document.getElementById("inputModifySymbolDefinition").innerText = document.getElementById(symbolName.value + 'Definition').innerText;
    document.getElementById("inputModifySymbolUnit").value = document.getElementById(symbolName.value + 'Unit').innerHTML;

    selectElement('inputModifyModule', document.getElementById(symbolName.value + 'Module').innerText);
    selectElement('inputModifyCategory', document.getElementById(symbolName.value + 'Category').innerText);
    selectElement('inputModifyPTOV', document.getElementById(symbolName.value + 'PTOV').innerText);
    selectElement('inputModifyPLST', document.getElementById(symbolName.value + 'PLST').innerText);


    document.getElementById("inputModifySymbolName").setAttribute("class", "form-control");
    document.getElementById("inputModifySymbolDefinition").setAttribute("class", "form-control");
    document.getElementById("inputModifySymbolUnit").setAttribute("class", "form-control");

    $('#warningAlertModify').html('');
}


function modifySymbolFromDictionary() {
    var formdata = { previousName: $('#previousSymbolName').val(), newName: $('#inputModifySymbolName').val(), definition: $('#inputModifySymbolDefinition').val(), unit: $('#inputModifySymbolUnit').val(), moduleName: $('#inputModifyModule').val(), categoryName: $('#inputModifyCategory').val(), PTOVName: $('#inputModifyPTOV').val(), PLSTName: $('#inputModifyPLST').val() };

    //Red marks on wrong inputs
    var symbolName = document.getElementById("inputModifySymbolName");
    var symbolDefinition = document.getElementById("inputModifySymbolDefinition");
    var symbolUnit = document.getElementById("inputModifySymbolUnit");


    symbolName.setAttribute("class", "form-control");
    symbolDefinition.setAttribute("class", "form-control");
    symbolUnit.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.newName) || formdata.newName == '') {
        symbolName.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.definition == '') {
        symbolDefinition.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.unit == '') {
        symbolUnit.setAttribute("class", "form-control is-invalid");
    }


    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.newName) || formdata.newName == '') {
        bootstrap_alert.warning("warningAlertModify", "The symbol name <strong>must have no whitespaces or be left empty</strong>.");

    } else if (formdata.definition == '') {
        bootstrap_alert.warning("warningAlertModify", "The symbol definition <strong>must be filled</strong>.");

    } else if (formdata.unit == '') {
        bootstrap_alert.warning("warningAlertModify", "The symbol unit <strong>must be filled</strong>.");

    } else {

        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/modify/symbol',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/symbols";
                bootstrap_alert.success("You successfully modified the Symbol from the data dicctionary: <strong>" + formdata.newName + ".</strong>");
            },
            error: function (error) {
                console.log(error);

                if (error.status == 409) {
                    symbolName.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertModify", "The symbol name is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertModify", "You don't have <strong>permission</strong> over the module.");
                } else {
                    window.location = "http://localhost:8080/symbols";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Symbol from the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
    }
}

function modalDelete(symbolName) {
    document.getElementById("deleteSymbolName").innerText = symbolName.value;
    document.getElementById("deleteSymbolName").value = symbolName.value;
    //If there are secondary modules attached to it the button wont be enabled
    document.getElementById("deleteSecondaryModules").innerText = document.getElementById(symbolName.value + 'SecondaryModules').innerText;
    
    if (document.getElementById(symbolName.value + 'SecondaryModules').innerText != '') {
        document.getElementById("deleteSymbolCardButton").setAttribute("class", document.getElementById("deleteSymbolCardButton").getAttribute("class") + " disabled");
        document.getElementById("deleteSymbolCardButton").setAttribute("onclick", "");
    } else {
        document.getElementById("deleteSymbolCardButton").setAttribute("class", "btn btn-danger mr-auto");
        document.getElementById("deleteSymbolCardButton").setAttribute("onclick", "deleteSymbolFromDictionary()");
    }

}


function deleteSymbolFromDictionary() {
    var formdata = { name: $('#deleteSymbolName').val() };
    formdata.module = document.getElementById(formdata.name + 'Module').innerText;

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/delete/symbol',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/symbols";
            bootstrap_alert.success("You successfully deleted the Symbol from the data dicctionary: <strong>" + formdata.name + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/symbols";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to delete the Symbol from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}


function modalValidate(symbolName, indexes) {
    document.getElementById("validateSymbolName").innerText = symbolName.value;
    document.getElementById("validateSymbolName").value = symbolName.value;
    //If there are indexes attached to it and none displayed the button wont be enabled
    document.getElementById("validateSymbolErrorText").innerText = "Is_indexed: " + document.getElementById(symbolName.value + 'Is_indexed').innerText;
    document.getElementById("validateSymbolErrorText2").innerHTML = '';
    document.getElementById("validateSymbolErrorTextNonValidIndex").style.display = "none";

    if (document.getElementById(symbolName.value + 'Is_indexed').innerText == 'True') {
        if(document.getElementById(symbolName.value + 'Indexes').innerText == ''){
            document.getElementById("validateSymbolCardButton").setAttribute("class", document.getElementById("validateSymbolCardButton").getAttribute("class") + " disabled");
            document.getElementById("validateSymbolCardButton").setAttribute("onclick", "");
        }else{
            associatedIndexes = document.getElementById(symbolName.value + "Indexes").getElementsByTagName("span");
            for (i = 0; i < associatedIndexes.length; i++) {
                if(indexes.indexOf(associatedIndexes[i].innerText) < 0){
                    document.getElementById("validateSymbolErrorText2").innerHTML = document.getElementById("validateSymbolErrorText2").innerHTML + associatedIndexes[i].innerText;
                }
            }
            if(document.getElementById("validateSymbolErrorText2").innerHTML==''){
                document.getElementById("validateSymbolErrorText").style.display = "none";
                document.getElementById("validateSymbolCardButton").setAttribute("class", "btn btn-success mr-auto");
                document.getElementById("validateSymbolCardButton").setAttribute("onclick", "validateSymbolFromDictionary()");
    
            }else{
                document.getElementById("validateSymbolErrorTextNonValidIndex").style.display = "";
                document.getElementById("validateSymbolCardButton").setAttribute("class", document.getElementById("validateSymbolCardButton").getAttribute("class") + " disabled");
                document.getElementById("validateSymbolCardButton").setAttribute("onclick", "");
            }
        }
    } else {
        document.getElementById("validateSymbolCardButton").setAttribute("class", document.getElementById("validateSymbolCardButton").getAttribute("class") + " disabled");
        document.getElementById("validateSymbolCardButton").setAttribute("onclick", "");
    }
}


function validateSymbolFromDictionary() {
    var formdata = { name: $('#validateSymbolName').val() };
    formdata.module = document.getElementById(formdata.name + 'Module').innerText;

    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/validate/symbol',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/symbols";
            bootstrap_alert.success("You successfully validated the Symbol from the data dicctionary: <strong>" + formdata.name + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/symbols";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to validate the Symbol from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}



function modalModifySymbolModules(symbolName) {
    document.getElementById("modifySecondaryModulesSymbolName").innerText = symbolName.value;
    document.getElementById("modifySecondaryModulesSymbolName").value = symbolName.value;
    //mainSide = document.getElementById("modifySecondaryModulesMainSelect");
    secondarySide = document.getElementById("modifySecondaryModulesSecondarySelects");
    currentSecondary = document.getElementById(symbolName.value + "SecondaryModules").getElementsByTagName("span");

    secondarySide.innerHTML = '';

    for (indexSec = 0; indexSec < currentSecondary.length; indexSec++) {
        
        div = '<div id="btnSecondaryModules' + indexSec + 'Div" class="d-flex mb-2 justify-content-center">' +
            '<strong class="pr-2">' + currentSecondary[indexSec].innerText + '</strong>' +
            '<button id="btnSecondaryModules' + indexSec + '" onclick="deleteSecondaryModule(this)" class="btn btn-sm btn-danger p-1">x</button>' +
            '</div>';

        secondarySide.innerHTML = secondarySide.innerHTML + div;
    }
    document.getElementById("inputMainModuleModifySecondary").value= document.getElementById(symbolName.value+"Module").innerText;
    
}


function addSelectSecondaryModules(modules) {
    secondarySide = document.getElementById("modifySecondaryModulesSecondarySelects");

    selectLists = secondarySide.getElementsByTagName("select");
    
    select = '<select class="custom-select text-primary m-2 w-75 d-flex align-self-center"></select>';

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

function deleteSecondaryModule(secModule) {
    document.getElementById(secModule.id + "Div").remove();
}


function modifySymbolModulesFromDictionary() {
    var formdata = { name: $('#modifySecondaryModulesSymbolName').val() };
    formdata.module = document.getElementById("inputMainModuleModifySecondary").value;
    formdata.secondary = [];

    secondarySide = document.getElementById("modifySecondaryModulesSecondarySelects");
    oldSecondary = secondarySide.getElementsByTagName("div");
    newSecondary = secondarySide.getElementsByTagName("select");


    for (i = 0; i < oldSecondary.length; i++) {
        currentSec = oldSecondary[i].getElementsByTagName("strong")[0].innerText;
        if (formdata.secondary.indexOf(currentSec) < 0 && currentSec != formdata.module) {
            formdata.secondary.push(currentSec);
        }
    }

    for (i = 0; i < newSecondary.length; i++) {
        currentSec = newSecondary[i].value;
        if (formdata.secondary.indexOf(currentSec) < 0 && currentSec != formdata.module) {
            formdata.secondary.push(currentSec);
        }
    }

    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/modify/symbol_modules',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/symbols";
            bootstrap_alert.success("You successfully modified the Symbol modules from the data dicctionary: <strong>" + formdata.name + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/symbols";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Symbol modules from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}


function modalModifyIndexes(symbolName) {
    document.getElementById("modifyIndexesSymbolName").innerText = symbolName.value;
    document.getElementById("modifyIndexesSymbolName").value = symbolName.value;
    //mainSide = document.getElementById("modifySecondaryModulesMainSelect");
    secondarySide = document.getElementById("modifyIndexesSelects");
    is_indexed = document.getElementById(symbolName.value + "Is_indexed").innerText;
    currentIndexes = document.getElementById(symbolName.value + "Indexes").getElementsByTagName("span");
    selectIsIndexed = document.getElementById("inputIndexesModifyIsIndexed");

    selectIsIndexed.value = is_indexed;

    secondarySide.innerHTML = '';

    for (index = 0; index < currentIndexes.length; index++) {

        div = '<div id="btnIndexes' + index + 'Div" class="d-flex mb-2 justify-content-center">' +
            '<strong class="pr-2">' + currentIndexes[index].innerText + '</strong>' +
            '<button id="btnIndexes' + index + '" onclick="deleteCurrentIndex(this)" class="btn btn-sm btn-danger p-1">x</button>' +
            '</div>';

        secondarySide.innerHTML = secondarySide.innerHTML + div;
    }

    modifyIndexIsIndexedChanged();
}

function deleteCurrentIndex(currIndex) {
    document.getElementById(currIndex.id + "Div").remove();
}

function addSelectIndexes(indexes) {
    secondarySide = document.getElementById("modifyIndexesSelects");
    selectLists = secondarySide.getElementsByTagName("select");
    
    select = '<select class="custom-select text-primary m-2 w-75 d-flex align-self-center"></select>';

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
    
    for (i = 0; i < indexes.length; i++) {
        var option = document.createElement("option");
        option.value = indexes[i];
        option.text = indexes[i];
        selectList.appendChild(option);
    }

}

function modifyIndexIsIndexedChanged(){
    //console.log(document.getElementById("inputIndexesModifyIsIndexed").value);
    if(document.getElementById("inputIndexesModifyIsIndexed").value== "True"){
        document.getElementById("modifyIndexesSelects").setAttribute("class", "modifyIndexesSelects d-flex justify-content-center flex-column");
        document.getElementById("modifySymbolIndexesButtonAddSelect").setAttribute("onclick", "addSelectIndexes(dataDictionary.indexes)");
        
    }else{
        document.getElementById("modifyIndexesSelects").setAttribute("class", "modifyIndexesSelects d-flex justify-content-center flex-column disabled");
        document.getElementById("modifySymbolIndexesButtonAddSelect").setAttribute("onclick"," ");
        secondarySide = document.getElementById("modifyIndexesSelects").innerHTML=" ";
    }
}

function modifySymbolIndexesFromDictionary() {
    var formdata = { name: $('#modifyIndexesSymbolName').val(), is_indexed: $('#inputIndexesModifyIsIndexed').val() };
    formdata.module = document.getElementById(formdata.name + "Module").innerText;

    formdata.indexes = [];

    secondarySide = document.getElementById("modifyIndexesSelects");
    oldIndexes = secondarySide.getElementsByTagName("div");
    newIndexes = secondarySide.getElementsByTagName("select");

    for (i = 0; i < oldIndexes.length; i++) {
        currentInd = oldIndexes[i].getElementsByTagName("strong")[0].innerText;
        if (formdata.indexes.indexOf(currentInd) < 0) {
            formdata.indexes.push(currentInd);
        }
    }

    for (i = 0; i < newIndexes.length; i++) {
        currentInd = newIndexes[i].value;
        if (formdata.indexes.indexOf(currentInd) < 0) {
            formdata.indexes.push(currentInd);
        }
    }

    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/modify/symbol_indexes',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/symbols";
            bootstrap_alert.success("You successfully modified the Symbol indexes from the data dicctionary: <strong>" + formdata.name + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/symbols";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Symbol indexes from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}



///////////////////////////////////////
////// Symbol Button Permissions //////
///////////////////////////////////////

//Disables add Symbol button and pending tab
function setSymbolButtonPermissions(roleOnModule) {

    var addNewSymbolButton = document.getElementById("addNewSymbolButton");
    var addNewSymbolCardButton = document.getElementById("addNewSymbolCardButton");
    var symbolspendingTabI = document.getElementById("symbolspendingTabI");
    var modifyDeleteButtons = document.getElementsByClassName("modifyDelete");
    var modifySymbolModulesCard = document.getElementById("modifySymbolModulesCard");
    var modifyIndexesCard = document.getElementById("modifySymbolIndexesCard");
    var symbolLinks = document.getElementsByClassName("symbolLinks");

    var roleList = []

    for (index = 0; index < roleOnModule.length; index++) {
        if (roleList.indexOf(roleOnModule[index].role) < 0) {
            roleList.push(roleOnModule[index].role)
        }
    }

    if (roleList[0] == 'Guest' || roleList[0] == 'Quality Assurance') {
        addNewSymbolButton.setAttribute("class", addNewSymbolButton.getAttribute("class") + " disabled d-none");
        addNewSymbolCardButton.setAttribute("class", addNewSymbolCardButton.getAttribute("class") + " disabled d-none");
        symbolspendingTabI.setAttribute("class", symbolspendingTabI.getAttribute("class") + " disabled d-none");
        modifySymbolModulesCard.setAttribute("class", modifySymbolModulesCard.getAttribute("class") + " disabled d-none");
        modifyIndexesCard.setAttribute("class", modifyIndexesCard.getAttribute("class") + " disabled d-none");

        for (index = 0; index < symbolLinks.length; index++) {
            symbolLinks[index].setAttribute("class", "btn btn-outline text-primary p-0 symbolLinks");
            symbolLinks[index].setAttribute("onclick", " ");
            symbolLinks[index].setAttribute("data-target", " ");
        }
        for (index = 0; index < modifyDeleteButtons.length; index++) {
            modifyDeleteButtons[index].setAttribute("class", modifyDeleteButtons[index].getAttribute("class") + " disabled d-none");
        }
    } else {
        var tableValid = document.getElementById("symbolsValidTableBody");
        var tableNonValid = document.getElementById("symbolsNonValidTableBody");
        trValid = tableValid.getElementsByTagName("tr");
        trNonValid = tableNonValid.getElementsByTagName("tr");
        for (i = 0; i < trValid.length; i += 2) {
            td = trValid[i].getElementsByTagName("td");
            tdModule = td[2];
            actionButtons = td[4].getElementsByTagName("button");

            var trRole = '';
            for (rolesIndex = 0; rolesIndex < roleOnModule.length; rolesIndex++) {
                if (roleOnModule[rolesIndex].module == 'All' | roleOnModule[rolesIndex].module == tdModule.innerText) {
                    trRole = roleOnModule[rolesIndex].role;
                }
            }

            if (trRole == '') {
                for (abIndex = 0; abIndex < actionButtons.length; abIndex++) {
                    actionButtons[abIndex].setAttribute("class", actionButtons[abIndex].getAttribute("class") + " disabled");
                    actionButtons[abIndex].setAttribute("onclick", " ");
                    actionButtons[abIndex].setAttribute("data-target", " ");
                }
            } else if (trRole == 'Module Programmer') {
                actionButtons[1].setAttribute("class", actionButtons[1].getAttribute("class") + " disabled");
                actionButtons[1].setAttribute("onclick", " ");
                actionButtons[1].setAttribute("data-target", " ");
            }

        }


        for (i = 0; i < trNonValid.length; i += 2) {
            td = trNonValid[i].getElementsByTagName("td");
            tdModule = td[2].innerText;
            tdSymbolName = td[1].innerText;
            actionButtons = td[4].getElementsByTagName("button");
            validateButton = document.getElementById(tdSymbolName + "Validate");


            var trRole = '';
            for (rolesIndex = 0; rolesIndex < roleOnModule.length; rolesIndex++) {
                if (roleOnModule[rolesIndex].module == 'All' || roleOnModule[rolesIndex].module == tdModule) {
                    trRole = roleOnModule[rolesIndex].role;
                }
            }

            if (trRole == '') {
                for (abIndex = 0; abIndex < actionButtons.length; abIndex++) {
                    actionButtons[abIndex].setAttribute("class", actionButtons[abIndex].getAttribute("class") + " disabled");
                    actionButtons[abIndex].setAttribute("onclick", " ");
                    actionButtons[abIndex].setAttribute("data-target", " ");
                }
                validateButton.setAttribute("onclick", " ");
                validateButton.setAttribute("class", validateButton.getAttribute("class") + " disabled");
                validateButton.setAttribute("data-target", " ");

            } else if (trRole == 'Module Programmer') {
                actionButtons[1].setAttribute("class", actionButtons[1].getAttribute("class") + " disabled");
                actionButtons[1].setAttribute("onclick", " ");
                actionButtons[1].setAttribute("data-target", " ");
                validateButton.setAttribute("onclick", " ");
                validateButton.setAttribute("class", validateButton.getAttribute("class") + " disabled");
                validateButton.setAttribute("data-target", " ");
            }

        }

        var modifymainModuleSelect = document.getElementById("inputMainModuleModifySecondary");
        var modifyIsIndexedSelect = document.getElementById("inputIndexesModifyIsIndexed");
        if (roleOnModule[0].role != 'General Supervisor' && roleOnModule[0].role != 'Project Leader') {
            modifymainModuleSelect.disabled = true;
            modifyIsIndexedSelect.disabled = true;
        }


    }
}


////////////////////////////////////////////////////
/////////  Symbol Pagination  and filtering/////////
////////////////////////////////////////////////////

function filterValidated() {
    table = document.getElementById("symbolsValidTableBody");
    tr = table.getElementsByTagName("tr");
    moduleSelect = document.getElementById("inputFilterMainModuleValidated").value;
    categorySelect = document.getElementById("inputFilterCategoryValidated").value;

    if (moduleSelect == 'Main module' && categorySelect == 'Category') {
        for (i = 0; i < tr.length; i++) {
            tr[i].style.display = "";
        }
        setSymbolPagination(numberOfPages, 1, false, true);
    } else {
        setSymbolPagination(numberOfPages, 1, true, true);
    }
}


function filterNonValidated() {
    table = document.getElementById("symbolsNonValidTableBody");
    tr = table.getElementsByTagName("tr");
    moduleSelect = document.getElementById("inputFilterMainModuleNonValidated").value;
    categorySelect = document.getElementById("inputFilterCategoryNonValidated").value;

    if (moduleSelect == 'Main module' && categorySelect == 'Category') {
        for (i = 0; i < tr.length; i++) {
            tr[i].style.display = "";
        }
        setSymbolPagination(numberOfPages, 1, false, false);
    } else {
        
        setSymbolPagination(numberOfPages, 1, true, false);
    }
}

function setSymbolPagination(numberOfPages, pageNumber, filter, validated) {
    if(validated){
        table = document.getElementById("symbolsValidTableBody");
        paginationTotal = paginationValidated;
        state="Validated";
        is_FilteredValidated=filter;
    }else{
        table = document.getElementById("symbolsNonValidTableBody");
        paginationTotal = paginationNonValidated;
        state="NonValidated";
        is_FilteredNonValidated=filter;
    }
    tr = table.getElementsByTagName("tr");
    if (pageNumber > 0 && pageNumber <= paginationTotal && numberOfPages > 0) {
        if (!filter) {
            for (i = 0; i < tr.length; i = i + 2) {
                tr[i].setAttribute("class", "accordion-toggle collapsed");
                tr[i + 1].setAttribute("class", "hide-table-padding");
                tr[i + 1].getElementsByTagName("td")[1].getElementsByTagName("div")[0].setAttribute("class", "collapse in p-3");
                if (i >= numberOfPages * (pageNumber - 1) * 2 && i < numberOfPages * pageNumber * 2) {
                    //console.log(i);
                    tr[i].style.display = "";
                    tr[i + 1].style.display = "";
                } else {
                    tr[i].style.display = "none";
                    tr[i + 1].style.display = "none";
                }
            }
            document.getElementById("pageNumber"+state).innerText = paginationTotal;
            document.getElementById("lastPagination"+state).setAttribute("onclick", "setSymbolPagination(" + numberOfPages + "," + paginationTotal + "," + filter +","+ validated +")");

            document.getElementById("activePagination"+state).value = pageNumber;
            document.getElementById("activePagination"+state).getElementsByTagName("a")[0].innerText = pageNumber;

        } else {

            moduleSelect = document.getElementById("inputFilterMainModule"+state).value;
            categorySelect = document.getElementById("inputFilterCategory"+state).value;
            auxCount = numberOfPages;
            auxInferiorLimit = (pageNumber - 1) * numberOfPages;
            auxFilteredPages = 0;
            auxFilteredList = [];

            if (moduleSelect == 'Main module') {
                for (i = 0; i < tr.length; i += 2) {
                    tdCategory = tr[i].getElementsByTagName("td")[3];
                    if (tdCategory.innerText != categorySelect) {
                        tr[i].style.display = "none";
                        tr[i + 1].style.display = "none";
                    } else {
                        if (auxInferiorLimit == 0) {
                            if (auxCount != 0) {
                                tdID = tr[i].getElementsByTagName("td")[1].innerText;
                                auxFilteredList.push(tdID);
                                auxCount--;
                            }
                        } else {
                            auxInferiorLimit--;
                        }
                        auxFilteredPages++;
                    }
                }
            } else if (categorySelect == 'Category') {
                for (i = 0; i < tr.length; i += 2) {
                    tdModule = tr[i].getElementsByTagName("td")[2];
                    if (tdModule.innerText != moduleSelect) {
                        tr[i].style.display = "none";
                        tr[i + 1].style.display = "none";
                    } else {
                        if (auxInferiorLimit == 0) {
                            if (auxCount != 0) {
                                tdID = tr[i].getElementsByTagName("td")[1].innerText;
                                auxFilteredList.push(tdID);
                                auxCount--;
                            }
                        } else {
                            auxInferiorLimit--;
                        }
                        auxFilteredPages++;
                    }
                }
            } else {
                for (i = 0; i < tr.length; i += 2) {
                    tdModule = tr[i].getElementsByTagName("td")[2];
                    tdCategory = tr[i].getElementsByTagName("td")[3];
                    if (tdModule.innerText != moduleSelect || tdCategory.innerText != categorySelect) {
                        tr[i].style.display = "none";
                        tr[i + 1].style.display = "none";
                    } else {
                        if (auxInferiorLimit == 0) {
                            if (auxCount != 0) {
                                tdID = tr[i].getElementsByTagName("td")[1].innerText;
                                auxFilteredList.push(tdID);
                                auxCount--;
                            }
                        } else {
                            auxInferiorLimit--;
                        }
                        auxFilteredPages++;
                    }
                }
            }

            filteredNumberOfPages = Math.ceil(auxFilteredPages / numberOfPages);
            document.getElementById("pageNumber"+state).innerText = filteredNumberOfPages;
            document.getElementById("lastPagination"+state).setAttribute("onclick", "setSymbolPagination(" + numberOfPages + "," + filteredNumberOfPages + "," + filter +","+ validated +")");
            
            if (pageNumber > 0 && pageNumber <= filteredNumberOfPages && filteredNumberOfPages > 0) {
                document.getElementById("activePagination"+state).value = pageNumber;
                document.getElementById("activePagination"+state).getElementsByTagName("a")[0].innerText = pageNumber;

                for (i = 0; i < tr.length; i += 2) {
                    tr[i].setAttribute("class", "accordion-toggle collapsed");
                    tr[i + 1].setAttribute("class", "hide-table-padding");
                    tr[i + 1].getElementsByTagName("td")[1].getElementsByTagName("div")[0].setAttribute("class", "collapse in p-3");

                    tdID = tr[i].getElementsByTagName("td")[1].innerText;

                    if (auxFilteredList.indexOf(tdID) < 0) {
                        tr[i].style.display = "none";
                        tr[i + 1].style.display = "none";
                    } else {
                        tr[i].style.display = "";
                        tr[i + 1].style.display = "";
                    }
                }
            }

        }
        //console.log(pageNumber);
        nextPage = parseInt(pageNumber) + 1;
        previousPage = pageNumber - 1;
        document.getElementById("previousPagination"+state).setAttribute("onclick", "setSymbolPagination(" + numberOfPages + "," + previousPage + "," + filter +","+ validated +")");
        document.getElementById("nextPagination"+state).setAttribute("onclick", "setSymbolPagination(" + numberOfPages + "," + nextPage + "," + filter +","+ validated +")");
        document.getElementById("firstPagination"+state).setAttribute("onclick", "setSymbolPagination(" + numberOfPages + "," + 1 + "," + filter +","+ validated +")");

    }
}



function removeFade(popoverName, validated) {
    if(validated){
        var currentPage = document.getElementById("activePaginationValidated").value;
        var lastPage = parseInt(document.getElementById("pageNumberValidated").innerText);

    }else{
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
        if (popoverName == 'lesserPaginationValidated'||popoverName == 'lesserPaginationNonValidated') {
            placeholder = "1-" + currentPage.toString();
        } else if (popoverName == 'greaterPaginationValidated'||popoverName == 'greaterPaginationNonValidated') {
            greaterLastpage = 1;
            if (lastPage > 1) {
                greaterLastpage = lastPage;
            }

            placeholder = currentPage.toString() + "-" + greaterLastpage.toString();
        }
        currentPopover= document.getElementById("inputPagination" + popoverName);
        currentPopover.placeholder = placeholder;

    } catch (error) {

    }

    /*Filter between 0 and 500
    setInputFilter(document.getElementById("intLimitTextBox"), function(value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 500); });*/
}


function popoverInitialization(popoverName, validated) {
    placeholder = "-"
    if(validated){
        var currentPage = document.getElementById("activePaginationValidated").value;
        var lastPage = document.getElementById("lastPaginationValidated").value;
    }else{
        var currentPage = document.getElementById("activePaginationNonValidated").value;
        var lastPage = document.getElementById("lastPaginationNonValidated").value;
    }
    
    if (popoverName == 'lesserPaginationValidated'||popoverName == 'lesserPaginationNonValidated') {
        placeholder = "1-" + currentPage.toString();
    } else if (popoverName == 'greaterPaginationValidated'|| popoverName == 'greaterPaginationNonValidated') {
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

