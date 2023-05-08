/////////////////////////////
////// Index Actions  ///////
/////////////////////////////

function modalAdd() {
    document.getElementById("inputAddIndexName").setAttribute("class", "form-control");
    document.getElementById("inputAddIndexDefinition").setAttribute("class", "form-control");

    $('#warningAlertAdd').html('');
}


function addIndexToDictionary() {
    var formdata = { name: $('#inputAddIndexName').val(), definition: $('#inputAddIndexDefinition').val() };


    //Red marks on wrong inputs
    var indexName = document.getElementById("inputAddIndexName");
    var indexDefinition = document.getElementById("inputAddIndexDefinition");

    indexName.setAttribute("class", "form-control");
    indexDefinition.setAttribute("class", "form-control");


    //console.log(formdata.name);
    //console.log(formdata.definition);

    //Check if they are wrong
    if (/\s/.test(formdata.name) || formdata.name == '') {
        indexName.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.definition == '') {
        indexDefinition.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.name) || formdata.name == '') {
        bootstrap_alert.warning("warningAlertAdd", "The index name <strong>must have no whitespaces or be left empty</strong>.");

    } else if (formdata.definition == '') {
        bootstrap_alert.warning("warningAlertAdd", "The index definition <strong>must be filled</strong>.");

    } else {

        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/add/index',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/indexes";
                bootstrap_alert.success("You successfully added the new Index to the data dicctionary: <strong>" + formdata.name + ".</strong>");
            },
            error: function (error) {
                console.log(error);
                //console.log(error.status);
                //console.log(typeof error.status);

                if (error.status == 409) {
                    indexName.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertAdd", "The index name is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertAdd", "You don't have <strong>permission</strong> over the index.");
                } else {
                    window.location = "http://localhost:8080/indexes";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to add the new Index to the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
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

function modalModify(indexName) {
    document.getElementById("previousIndexName").innerText = indexName.value;
    document.getElementById("previousIndexName").value = indexName.value;
    document.getElementById("inputModifyIndexName").value = indexName.value;
    document.getElementById("inputModifyIndexDefinition").innerText = document.getElementById(indexName.value + 'Definition').innerText;

    document.getElementById("inputModifyIndexName").setAttribute("class", "form-control");
    document.getElementById("inputModifyIndexDefinition").setAttribute("class", "form-control");

}


function modifyIndexFromDictionary() {
    var formdata = { previousName: $('#previousIndexName').val(), newName: $('#inputModifyIndexName').val(), definition: $('#inputModifyIndexDefinition').val() };

    //Red marks on wrong inputs
    var indexName = document.getElementById("inputModifyIndexName");
    var indexDefinition = document.getElementById("inputModifyIndexDefinition");

    indexName.setAttribute("class", "form-control");
    indexDefinition.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.newName) || formdata.newName == '') {
        indexName.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.definition == '') {
        indexDefinition.setAttribute("class", "form-control is-invalid");
    }


    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.newName) || formdata.newName == '') {
        bootstrap_alert.warning("warningAlertModify", "The index name <strong>must have no whitespaces or be left empty</strong>.");

    } else if (formdata.definition == '') {
        bootstrap_alert.warning("warningAlertModify", "The index definition <strong>must be filled</strong>.");

    } else {

        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/modify/index',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/indexes";
                bootstrap_alert.success("You successfully modified the Index from the data dicctionary: <strong>" + formdata.newName + ".</strong>");
            },
            error: function (error) {
                console.log(error);

                if (error.status == 409) {
                    indexName.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertModify", "The index name is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertModify", "You don't have <strong>permission</strong> over the module.");
                } else {
                    window.location = "http://localhost:8080/indexes";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Index from the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
    }
}

function modalDelete(indexName) {
    document.getElementById("deleteIndexName").innerText = indexName.value;
    document.getElementById("deleteIndexName").value = indexName.value;
    //If there are index elements or symbols attached to it the button wont be enabled
    document.getElementById("deleteIndexElementsAssociated").innerText = document.getElementById(indexName.value + 'IndexElements').innerText;
    document.getElementById("deleteSymbolsAssociated").innerText = document.getElementById(indexName.value + 'Symbols').innerText;


    if (document.getElementById(indexName.value + 'Symbols').innerText != '') {
        document.getElementById("deleteIndexCardButton").setAttribute("class", document.getElementById("deleteIndexCardButton").getAttribute("class") + " disabled");
        document.getElementById("deleteIndexCardButton").setAttribute("onclick", "");
    } else {
        document.getElementById("deleteIndexCardButton").setAttribute("class", "btn btn-danger mr-auto");
        document.getElementById("deleteIndexCardButton").setAttribute("onclick", "deleteIndexFromDictionary()");
    }

}


function deleteIndexFromDictionary() {
    var formdata = { name: $('#deleteIndexName').val() };

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/delete/index',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/indexes";
            bootstrap_alert.success("You successfully deleted the Index from the data dicctionary: <strong>" + formdata.name + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/indexes";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to delete the Index from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}


function modalValidate(indexName) {
    document.getElementById("validateIndexName").innerText = indexName.value;
    document.getElementById("validateIndexName").value = indexName.value;
    //If there are indexes attached to it and none displayed the button wont be enabled
    console.log(document.getElementById(indexName.value + 'IndexElements').getElementsByTagName("span").length);
    if (document.getElementById(indexName.value + 'IndexElements').getElementsByTagName("span").length == 0) {
        document.getElementById("validateIndexErrorText").style.display = "";
        document.getElementById("validateIndexCardButton").setAttribute("class", document.getElementById("validateIndexCardButton").getAttribute("class") + " disabled");
        document.getElementById("validateIndexCardButton").setAttribute("onclick", "");
    } else {
        document.getElementById("validateIndexErrorText").style.display = "none";
        document.getElementById("validateIndexCardButton").setAttribute("class", "btn btn-success mr-auto");
        document.getElementById("validateIndexCardButton").setAttribute("onclick", "validateIndexFromDictionary()");
    }

}


function validateIndexFromDictionary() {
    var formdata = { name: $('#validateIndexName').val() };

    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/validate/index',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/indexes";
            bootstrap_alert.success("You successfully validated the Index from the data dicctionary: <strong>" + formdata.name + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/indexes";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to validate the Index from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}


function modalModifyIndexElements(indexName) {
    document.getElementById("modifyIndexElementsIndexName").innerText = indexName.value;
    document.getElementById("modifyIndexElementsIndexName").value = indexName.value;

    secondarySide = document.getElementById("modifyIndexElementsDiv");
    currentElements = document.getElementById(indexName.value + "IndexElements").getElementsByTagName("span");

    secondarySide.innerHTML = '';

    btnclick = "deleteIndexElem(this)";
    btnclass = "btn btn-sm btn-danger p-1";
    console.log(user.roles[0].role);
    if (user.roles[0].role != "Project Leader" && user.roles[0].role != "General Supervisor") {
        btnclick = " ";
        btnclass = "btn btn-sm btn-danger p-1 disabled"
    }

    for (index = 0; index < currentElements.length; index++) {

        div = '<div id="btnIndexVal' + index + 'Div" class="d-flex mb-2 justify-content-center">' +
            '<strong class="pr-2">' + currentElements[index].innerText + '</strong>' +
            '<button id="btnIndexVal' + index + '" onclick="' + btnclick + '" class="' + btnclass + '">x</button>' +
            '</div>';

        secondarySide.innerHTML = secondarySide.innerHTML + div;
    }
    $('#warningAlertModifyIndexElements').html('');
}

function addTextBoxIndexElements() {
    secondarySide = document.getElementById("modifyIndexElementsDiv");
    selectLists = secondarySide.getElementsByTagName("input");


    input = '<input type="text" class="form-control mb-3" placeholder="Index Element">';

    savedValues = []

    for (i = 0; i < selectLists.length; i++) {
        savedValues.push(selectLists[i].value);
    }

    secondarySide.innerHTML = secondarySide.innerHTML + input;

    //Values wont save so I have to put them back
    for (i = 0; i < savedValues.length; i++) {
        selectLists[i].value = savedValues[i];
    }
}

function deleteIndexElem(indexElem) {
    document.getElementById(indexElem.id + "Div").remove();
}


function modifyIndexElementsFromDictionary() {
    var formdata = { name: $('#modifyIndexElementsIndexName').val() };

    formdata.elements = [];

    secondarySide = document.getElementById("modifyIndexElementsDiv");
    oldElements = secondarySide.getElementsByTagName("div");
    newElements = secondarySide.getElementsByTagName("input");


    for (i = 0; i < oldElements.length; i++) {
        currentElem = oldElements[i].getElementsByTagName("strong")[0].innerText;
        if (formdata.elements.indexOf(currentElem) < 0 && !(/\s/.test(currentElem))) {
            formdata.elements.push(currentElem);
            console.log(currentElem)
        }
    }

    for (i = 0; i < newElements.length; i++) {
        currentElem = newElements[i].value;
        if (formdata.elements.indexOf(currentElem) < 0 && !(/\s/.test(currentElem)) && currentElem != '') {
            formdata.elements.push(currentElem);
            console.log(currentElem)
        }
    }

    //bootstrap_alert.warning("warningAlertModifyIndexElements", "The indexes names are <strong>badly written</strong>.");


    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/modify/index_elements',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/indexes";
            bootstrap_alert.success("You successfully modified the Index elements from the data dicctionary: <strong>" + formdata.name + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/indexes";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Index elements from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });

}


function modalAssociatedSymbols(symbols) {
    document.getElementById("associatedSymbolsTableBody").innerHTML = "";
    associatedSymbols = symbols.value.split(",");
    for (symbolsIndex = 0; symbolsIndex < associatedSymbols.length; symbolsIndex++) {
        item = '<tr>' +
            '<td>' + (symbolsIndex + 1) + '</td>' +
            '<td>' + associatedSymbols[symbolsIndex] + '</td>' +
            '</tr>';

        $(item).appendTo("#associatedSymbolsTableBody");
    }

}


///////////////////////////////////////
////// Index Button Permissions ///////
///////////////////////////////////////

//Set user's permissions
function setIndexButtonPermissions(roleOnModule) {

    var addNewIndexButton = document.getElementById("addNewIndexButton");
    var addNewIndexCardButton = document.getElementById("addNewIndexCardButton");
    var indexespendingTabI = document.getElementById("indexespendingTabI");
    var modifyDeleteButtons = document.getElementsByClassName("modifyDelete");
    var validateIndexButtons = document.getElementsByClassName("validateIndex");
    var modifyIndexElementsCard = document.getElementById("modifyIndexElementsCard");
    var indexLinks = document.getElementsByClassName("indexLinks");
    var modifyIndexElementsCardButton = document.getElementById("modifyIndexElementsCardButton");
    var modifyIndexElementsPlusButton = document.getElementById("modifyIndexElementsPlusButton");

    var roleList = []

    for (index = 0; index < roleOnModule.length; index++) {
        if (roleList.indexOf(roleOnModule[index].role) < 0) {
            roleList.push(roleOnModule[index].role)
        }
    }

    if (roleList[0] == 'Guest' || roleList[0] == 'Quality Assurance') {
        addNewIndexButton.setAttribute("class", addNewIndexButton.getAttribute("class") + " disabled d-none");
        addNewIndexCardButton.setAttribute("class", addNewIndexCardButton.getAttribute("class") + " disabled d-none");
        indexespendingTabI.setAttribute("class", indexespendingTabI.getAttribute("class") + " disabled d-none");
        modifyIndexElementsCard.setAttribute("class", modifyIndexElementsCard.getAttribute("class") + " disabled d-none");

        for (index = 0; index < indexLinks.length; index++) {
            indexLinks[index].setAttribute("class", "btn btn-outline text-primary p-0 indexLinks");
            indexLinks[index].setAttribute("onclick", " ");
            indexLinks[index].setAttribute("data-target", " ");
        }
        for (index = 0; index < modifyDeleteButtons.length; index++) {
            modifyDeleteButtons[index].setAttribute("class", modifyDeleteButtons[index].getAttribute("class") + " disabled d-none");
            modifyDeleteButtons[index].setAttribute("onclick", " ");
            modifyDeleteButtons[index].setAttribute("data-target", " ");
        }
    } else {
        if (user.roles[0].role != "Project Leader" && user.roles[0].role != "General Supervisor") {

            for (abIndex = 0; abIndex < modifyDeleteButtons.length; abIndex++) {
                modifyDeleteButtons[abIndex].setAttribute("class", modifyDeleteButtons[abIndex].getAttribute("class") + " disabled");
                modifyDeleteButtons[abIndex].setAttribute("onclick", " ");
                modifyDeleteButtons[abIndex].setAttribute("data-target", " ");
            }
            for(index=0; index< validateIndexButtons.length; index++){
                validateIndexButtons[index].setAttribute("class", validateIndexButtons[index].getAttribute("class") + " disabled");
                validateIndexButtons[index].setAttribute("onclick", " ");
                validateIndexButtons[index].setAttribute("data-target", " ");
            }
            addNewIndexButton.setAttribute("class", addNewIndexButton.getAttribute("class") + " disabled");
            addNewIndexButton.setAttribute("onclick", " ");
            addNewIndexButton.setAttribute("data-target", " ");
            addNewIndexCardButton.setAttribute("class", addNewIndexCardButton.getAttribute("class") + " disabled d-none");
            modifyIndexElementsCardButton.setAttribute("onclick", " ");
            modifyIndexElementsCardButton.setAttribute("class", modifyIndexElementsCardButton.getAttribute("class") + " disabled");
            modifyIndexElementsPlusButton.setAttribute("onclick", " ");
            modifyIndexElementsPlusButton.setAttribute("class", modifyIndexElementsPlusButton.getAttribute("class") + " disabled");

        }

    }
}


////////////////////////////////////////////////////
/////////  Index Pagination  and filtering//////////
////////////////////////////////////////////////////


function setIndexPagination(numberOfPages, pageNumber, validated) {
    if (validated) {
        table = document.getElementById("indexesValidTableBody");
        paginationTotal = paginationValidated;
        state = "Validated";
    } else {
        table = document.getElementById("indexesNonValidTableBody");
        paginationTotal = paginationNonValidated;
        state = "NonValidated";
    }
    tr = table.getElementsByTagName("tr");
    if (pageNumber > 0 && pageNumber <= paginationTotal && numberOfPages > 0) {

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
        document.getElementById("pageNumber" + state).innerText = paginationTotal;
        document.getElementById("lastPagination" + state).setAttribute("onclick", "setIndexPagination(" + numberOfPages + "," + paginationTotal + "," + validated + ")");

        document.getElementById("activePagination" + state).value = pageNumber;
        document.getElementById("activePagination" + state).getElementsByTagName("a")[0].innerText = pageNumber;

    }
    //console.log(pageNumber);
    nextPage = parseInt(pageNumber) + 1;
    previousPage = pageNumber - 1;
    document.getElementById("previousPagination" + state).setAttribute("onclick", "setIndexPagination(" + numberOfPages + "," + previousPage + "," + validated + ")");
    document.getElementById("nextPagination" + state).setAttribute("onclick", "setIndexPagination(" + numberOfPages + "," + nextPage + "," + validated + ")");
    document.getElementById("firstPagination" + state).setAttribute("onclick", "setIndexPagination(" + numberOfPages + "," + 1 + "," + validated + ")");

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

    /*Filter between 0 and 500
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

