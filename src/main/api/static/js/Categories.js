/////////////////////////////
///// Category Actions //////
/////////////////////////////

function modalAdd() {
    document.getElementById("inputAddCategoryName").setAttribute("class", "form-control");

    $('#warningAlertAdd').html('');
}


function addCategoryToDictionary() {
    var formdata = { name: $('#inputAddCategoryName').val() };


    //Red marks on wrong inputs
    var categoryName = document.getElementById("inputAddCategoryName");

    categoryName.setAttribute("class", "form-control");

    //Check if it is wrong
    if (/\s/.test(formdata.name) || formdata.name == '') {
        categoryName.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.name) || formdata.name == '') {
        bootstrap_alert.warning("warningAlertAdd", "The category name <strong>must have no whitespaces or be left empty</strong>.");

    } else {

        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/add/category',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/categories";
                bootstrap_alert.success("You successfully added the new Category to the data dicctionary: <strong>" + formdata.name + ".</strong>");
            },
            error: function (error) {
                console.log(error);
                if (error.status == 409) {
                    categoryName.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertAdd", "The category name is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertAdd", "You don't have <strong>permission</strong> over the category.");
                } else {
                    window.location = "http://localhost:8080/categories";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to add the new Category to the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
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

function modalModify(categoryName) {
    document.getElementById("previousCategoryName").innerText = categoryName.value;
    document.getElementById("previousCategoryName").value = categoryName.value;
    document.getElementById("inputModifyCategoryName").value = categoryName.value;

    document.getElementById("inputModifyCategoryName").setAttribute("class", "form-control");

    if (document.getElementById(categoryName.value + 'SubCategoriesCount') == null) {
        document.getElementById("modifyCategoryPromoteCardButton").style.display = "";
    } else {
        document.getElementById("modifyCategoryPromoteCardButton").style.display = "none";
    }


    $('#warningAlertModify').html('');
}


function modifyCategoryFromDictionary() {
    var formdata = { previousName: $('#previousCategoryName').val(), newName: $('#inputModifyCategoryName').val() };

    //Red marks on wrong inputs
    var categoryName = document.getElementById("inputModifyCategoryName");

    categoryName.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.newName) || formdata.newName == '') {
        categoryName.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.newName) || formdata.newName == '') {
        bootstrap_alert.warning("warningAlertModify", "The index name <strong>must have no whitespaces or be left empty</strong>.");

    } else {

        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/modify/category',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/categories";
                bootstrap_alert.success("You successfully modified the Category from the data dicctionary: <strong>" + formdata.newName + ".</strong>");
            },
            error: function (error) {
                console.log(error);

                if (error.status == 409) {
                    categoryName.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertModify", "The category name is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertModify", "You don't have <strong>permission</strong> over the category.");
                } else {
                    window.location = "http://localhost:8080/categories";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Category from the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
    }
}

function promoteSubCategoryFromDictionary() {
    var formdata = { name: $('#previousCategoryName').val() };

    $.ajax({
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/modify/category/promote',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/categories";
            bootstrap_alert.success("You successfully modified the Category from the data dicctionary: <strong>" + formdata.name + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            if (error.status == 409) {
                categoryName.setAttribute("class", "form-control is-invalid");
                bootstrap_alert.warning("warningAlertModify", "The category name is <strong>already defined</strong>.");
            } else if (error.status == 401) {
                bootstrap_alert.warning("warningAlertModify", "You don't have <strong>permission</strong> over the category.");
            } else {
                window.location = "http://localhost:8080/categories";
                bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Category from the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
            }
        }
    });

}



function modalDelete(categoryName) {
    document.getElementById("deleteCategoryName").innerText = categoryName.value;
    document.getElementById("deleteCategoryName").value = categoryName.value;
    //If there are index elements or symbols attached to it the button wont be enabled
    //document.getElementById("deleteIndexElementsAssociated").innerText = document.getElementById(indexName.value + 'IndexElements').innerText;
    document.getElementById("deleteCategorySymbolsAssociated").innerText = document.getElementById(categoryName.value + 'Symbols').innerText;


    if (document.getElementById(categoryName.value + 'Symbols').innerText != '0') {
        document.getElementById("deleteCategoryCardButton").setAttribute("class", document.getElementById("deleteCategoryCardButton").getAttribute("class") + " disabled");
        document.getElementById("deleteCategoryCardButton").setAttribute("onclick", "");
    } else {
        try {
            if (document.getElementById(categoryName.value + 'SubCategoriesCount').innerText != '0') {
                document.getElementById("deleteCategoryCardButton").setAttribute("class", document.getElementById("deleteCategoryCardButton").getAttribute("class") + " disabled");
                document.getElementById("deleteCategoryCardButton").setAttribute("onclick", "");
            } else {
                document.getElementById("deleteCategoryCardButton").setAttribute("class", "btn btn-danger mr-auto");
                document.getElementById("deleteCategoryCardButton").setAttribute("onclick", "deleteCategoryFromDictionary()");
            }
        } catch (error) {
            document.getElementById("deleteCategoryCardButton").setAttribute("class", "btn btn-danger mr-auto");
            document.getElementById("deleteCategoryCardButton").setAttribute("onclick", "deleteCategoryFromDictionary()");
        }
    }

}


function deleteCategoryFromDictionary() {
    var formdata = { name: $('#deleteCategoryName').val() };

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/delete/category',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/categories";
            bootstrap_alert.success("You successfully deleted the Category from the data dicctionary: <strong>" + formdata.name + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/categories";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to delete the Category from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}



function modalAddSubCategories(categoryName) {
    document.getElementById("addSubCategorySuperName").innerText = categoryName.value;
    document.getElementById("addSubCategorySuperName").value = categoryName.value;

    secondarySide = document.getElementById("addSubCategoriesDiv");
    currentElements = document.getElementById(categoryName.value + "SubCategories").getElementsByClassName("SubCategoryDiv");

    secondarySide.innerHTML = '';

    for (index = 0; index < currentElements.length; index++) {

        div = '<div id="btnIndexVal' + index + 'Div" class="d-flex mb-2 justify-content-center">' +
            '<strong class="pr-2">' + currentElements[index].getElementsByTagName("div")[0].innerText + '</strong>' +
            '</div>';

        secondarySide.innerHTML = secondarySide.innerHTML + div;
    }

    $('#warningAlertAddSubCategories').html('');
}

function addTextBoxSubCategories() {
    secondarySide = document.getElementById("addSubCategoriesDiv");
    selectLists = secondarySide.getElementsByTagName("input");

    input = '<input type="text" class="form-control mb-3" placeholder="SubCategory">';

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

function addSubCategoriesToDictionary() {
    var formdata = { supercategory: $('#addSubCategorySuperName').val() };

    elements = [];
    formdata.categories = [];

    secondarySide = document.getElementById("addSubCategoriesDiv");
    oldElements = secondarySide.getElementsByTagName("div");
    newElements = secondarySide.getElementsByTagName("input");


    for (i = 0; i < oldElements.length; i++) {
        currentElem = oldElements[i].getElementsByTagName("strong")[0].innerText;
        if (elements.indexOf(currentElem) < 0 && !(/\s/.test(currentElem))) {
            elements.push(currentElem);
        }
    }

    for (i = 0; i < newElements.length; i++) {
        currentElem = newElements[i].value;
        if (elements.indexOf(currentElem) < 0 && !(/\s/.test(currentElem)) && currentElem != '') {
            elements.push(currentElem);
            formdata.categories.push(currentElem)
        }
    }

    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/add/subcategory',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/categories";
            bootstrap_alert.success("You successfully added the new subcategories to the data dicctionary: <strong>" + formdata.supercategory + ".</strong>");
        },
        error: function (error) {
            console.log(error);

            if (error.status == 409) {
                categoryName.setAttribute("class", "form-control is-invalid");
                bootstrap_alert.warning("warningAlertAddSubCategories", "The supercategory name needs to be <strong>already defined</strong>.");
            } else if (error.status == 401) {
                bootstrap_alert.warning("warningAlertAddSubCategories", "You don't have <strong>permission</strong> over the category.");
            } else {
                window.location = "http://localhost:8080/categories";
                bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to add the new subcategories to the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
            }
        }
    });
}

///////////////////////////////////////
///// Category Button Permissions /////
///////////////////////////////////////

//Set user's permissions
function setCategoryButtonPermissions(roleOnModule) {

    var addNewCategoryButton = document.getElementById("addNewCategoryButton");
    var addNewCategoryCardButton = document.getElementById("addNewCategoryCardButton");
    var modifyDeleteButtons = document.getElementsByClassName("modifyDelete");
    var modifyCategoryCard = document.getElementById("modifyCategoryCard");
    var deleteCategoryCard = document.getElementById("deleteCategoryCard");
    var indexLinks = document.getElementsByClassName("indexLinks");

    var roleList = []

    for (index = 0; index < roleOnModule.length; index++) {
        if (roleList.indexOf(roleOnModule[index].role) < 0) {
            roleList.push(roleOnModule[index].role)
        }
    }

    if (roleList[0] != 'Project Leader' && roleList[0] != 'General Supervisor') {
        addNewCategoryButton.setAttribute("class", addNewCategoryButton.getAttribute("class") + " disabled d-none");
        addNewCategoryCardButton.setAttribute("class", addNewCategoryCardButton.getAttribute("class") + " disabled d-none");
        modifyCategoryCard.setAttribute("class", modifyCategoryCard.getAttribute("class") + " disabled d-none");
        deleteCategoryCard.setAttribute("class", modifyCategoryCard.getAttribute("class") + " disabled d-none");

        for (index = 0; index < indexLinks.length; index++) {
            indexLinks[index].setAttribute("class", "btn btn-outline text-primary p-0 indexLinks");
            indexLinks[index].setAttribute("onclick", " ");
            indexLinks[index].setAttribute("data-target", " ");
        }
        for (index = 0; index < modifyDeleteButtons.length; index++) {
            modifyDeleteButtons[index].setAttribute("class", modifyDeleteButtons[index].getAttribute("class") + " disabled d-none");
        }
    }
}


////////////////////////////////////////////////////
/////// Categories Pagination  and filtering ///////
////////////////////////////////////////////////////


function setCategoryPagination(numberOfPages, pageNumber, validated) {
    if (validated) {
        table = document.getElementById("categoriesTableBody");
        paginationTotal = paginationValidated;
        state = "Validated";
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
        document.getElementById("lastPagination" + state).setAttribute("onclick", "setCategoryPagination(" + numberOfPages + "," + paginationTotal + "," + validated + ")");

        document.getElementById("activePagination" + state).value = pageNumber;
        document.getElementById("activePagination" + state).getElementsByTagName("a")[0].innerText = pageNumber;

    }
    //console.log(pageNumber);
    nextPage = parseInt(pageNumber) + 1;
    previousPage = pageNumber - 1;
    document.getElementById("previousPagination" + state).setAttribute("onclick", "setCategoryPagination(" + numberOfPages + "," + previousPage + "," + validated + ")");
    document.getElementById("nextPagination" + state).setAttribute("onclick", "setCategoryPagination(" + numberOfPages + "," + nextPage + "," + validated + ")");
    document.getElementById("firstPagination" + state).setAttribute("onclick", "setCategoryPagination(" + numberOfPages + "," + 1 + "," + validated + ")");

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

