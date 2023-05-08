

function modalAddAcronym() {
    document.getElementById("inputAddAcronymLetters").setAttribute("class", "form-control");
    document.getElementById("inputAddAcronymMeaning").setAttribute("class", "form-control");

    $('#warningAlertAddAcronym').html('');
}

function modalAddAdjective() {
    document.getElementById("inputAddAdjective").setAttribute("class", "form-control");
    document.getElementById("inputAddAdjectiveUsages").setAttribute("class", "form-control");

    $('#warningAlertAddAdjective').html('');
}

function modalAddSemanticRule() {
    document.getElementById("inputAddRule").setAttribute("class", "form-control");
    document.getElementById("inputAddSemanticRuleExplanation").setAttribute("class", "form-control");

    $('#warningAlertAddSemanticRule').html('');
}


function addAcronymToDictionary() {
    var formdata = { letters: $('#inputAddAcronymLetters').val(), meaning: $('#inputAddAcronymMeaning').val() };

    //Red marks on wrong inputs
    var acronymLetters = document.getElementById("inputAddAcronymLetters");
    var acronymMeaning = document.getElementById("inputAddAcronymMeaning");

    acronymLetters.setAttribute("class", "form-control");
    acronymMeaning.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.letters) || formdata.letters == '') {
        acronymLetters.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.meaning == '') {
        acronymMeaning.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.letters) || formdata.letters == '') {
        bootstrap_alert.warning("warningAlertAddAcronym", "The acronym's letters <strong>must have no whitespaces or be left empty</strong>.");
    } else if (formdata.meaning == '') {
        bootstrap_alert.warning("warningAlertAddAcronym", "The acronym's meaning <strong>must be filled</strong>.");
    } else {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/add/acronym',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/resources";
                bootstrap_alert.success("You successfully added the new Acronym to the data dicctionary: <strong>" + formdata.letters + ".</strong>");
            },
            error: function (error) {
                console.log(error);
               
                if (error.status == 409) {
                    acronymLetters.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertAddAcronym", "The acronym's letters are <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertAddAcronym", "You don't have <strong>permission</strong> over the acronyms.");
                } else {
                    window.location = "http://localhost:8080/resources";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to add the new Acronym to the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
    }
}

function addAdjectiveToDictionary() {
    var formdata = { adjective: $('#inputAddAdjective').val(), usages: $('#inputAddAdjectiveUsages').val() };

    //Red marks on wrong inputs
    var adjective = document.getElementById("inputAddAdjective");
    var adjectiveUsages = document.getElementById("inputAddAdjectiveUsages");

    adjective.setAttribute("class", "form-control");
    adjectiveUsages.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.adjective) || formdata.adjective == '') {
        adjective.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.usages == '') {
        adjectiveUsages.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.adjective) || formdata.adjective == '') {
        bootstrap_alert.warning("warningAlertAddAdjective", "The adjective <strong>must have no whitespaces or be left empty</strong>.");
    } else if (formdata.usages == '') {
        bootstrap_alert.warning("warningAlertAddAdjective", "The adjective's usages <strong>must be filled</strong>.");
    } else {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/add/adjective',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/resources";
                bootstrap_alert.success("You successfully added the new Adjective to the data dicctionary: <strong>" + formdata.adjective + ".</strong>");
            },
            error: function (error) {
                console.log(error);
               
                if (error.status == 409) {
                    adjective.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertAddAdjective", "The adjective is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertAddAdjective", "You don't have <strong>permission</strong> over the adjectives.");
                } else {
                    window.location = "http://localhost:8080/resources";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to add the new Adjective to the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
    }
}

function addSemanticRuleToDictionary() {
    var formdata = { ruleforShort: $('#inputAddRule').val(), explanation: $('#inputAddSemanticRuleExplanation').val() };

    //Red marks on wrong inputs
    var ruleforShort = document.getElementById("inputAddRule");
    var explanation = document.getElementById("inputAddSemanticRuleExplanation");

    ruleforShort.setAttribute("class", "form-control");
    explanation.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.ruleforShort) || formdata.ruleforShort == '') {
        ruleforShort.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.explanation == '') {
        explanation.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.ruleforShort) || formdata.ruleforShort == '') {
        bootstrap_alert.warning("warningAlertAddSemanticRule", "The rule <strong>must have no whitespaces or be left empty</strong>.");
    } else if (formdata.explanation == '') {
        bootstrap_alert.warning("warningAlertAddSemanticRule", "The semantic rule's explanation <strong>must be filled</strong>.");
    } else {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/add/semantic_rule',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/resources";
                bootstrap_alert.success("You successfully added the new Semantic Rule to the data dicctionary: <strong>" + formdata.ruleforShort + ".</strong>");
            },
            error: function (error) {
                console.log(error);
               
                if (error.status == 409) {
                    ruleforShort.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertAddSemanticRule", "The Semantic Rule is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertAddSemanticRule", "You don't have <strong>permission</strong> over the semantic rules.");
                } else {
                    window.location = "http://localhost:8080/resources";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to add the new Semantic Rule to the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
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



function modalModifyAcronym(letters) {
    document.getElementById("previousLetters").innerText = letters.value;
    document.getElementById("previousLetters").value = letters.value;
    document.getElementById("inputModifyLetters").value = letters.value;
    document.getElementById("inputModifyMeaning").innerText = document.getElementById(letters.value + 'Meaning').innerText;

    document.getElementById("inputModifyLetters").setAttribute("class", "form-control");
    document.getElementById("inputModifyMeaning").setAttribute("class", "form-control");
}

function modalModifyAdjective(adjective) {
    document.getElementById("previousAdjective").innerText = adjective.value;
    document.getElementById("previousAdjective").value = adjective.value;
    document.getElementById("inputModifyAdjective").value = adjective.value;
    document.getElementById("inputModifyUsages").innerText = document.getElementById(adjective.value + 'Usages').innerText;

    document.getElementById("inputModifyAdjective").setAttribute("class", "form-control");
    document.getElementById("inputModifyUsages").setAttribute("class", "form-control");

}

function modalModifySemanticRule(ruleforShort) {
    document.getElementById("previousRule").innerText = ruleforShort.value;
    document.getElementById("previousRule").value = ruleforShort.value;
    document.getElementById("inputModifyRule").value = ruleforShort.value;
    document.getElementById("inputModifyExplanation").innerText = document.getElementById(ruleforShort.value + 'Explanation').innerText;

    document.getElementById("inputModifyRule").setAttribute("class", "form-control");
    document.getElementById("inputModifyExplanation").setAttribute("class", "form-control");

}

function modifyAcronymFromDictionary() {
    var formdata = { previousLetters: $('#previousLetters').val(), newLetters: $('#inputModifyLetters').val(), meaning: $('#inputModifyMeaning').val() };

    //Red marks on wrong inputs
    var letters = document.getElementById("inputModifyLetters");
    var meaning = document.getElementById("inputModifyMeaning");

    letters.setAttribute("class", "form-control");
    meaning.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.newLetters) || formdata.newLetters == '') {
        letters.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.meaning == '') {
        meaning.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.newLetters) || formdata.newLetters == '') {
        bootstrap_alert.warning("warningAlertModifyAcronym", "The acronym's letters <strong>must have no whitespaces or be left empty</strong>.");

    } else if (formdata.meaning == '') {
        bootstrap_alert.warning("warningAlertModifyAcronym", "The acronym's meaning <strong>must be filled</strong>.");

    } else {

        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/modify/acronym',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/resources";
                bootstrap_alert.success("You successfully modified the Acronym from the data dicctionary: <strong>" + formdata.newLetters + ".</strong>");
            },
            error: function (error) {
                console.log(error);

                if (error.status == 409) {
                    letters.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertModifyAcronym", "The acronym's letters are <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertModifyAcronym", "You don't have <strong>permission</strong> over the acronyms.");
                } else {
                    window.location = "http://localhost:8080/resources";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Acronym from the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
    }
}

function modifyAdjectiveFromDictionary() {
    var formdata = { previousAdjective: $('#previousAdjective').val(), newAdjective: $('#inputModifyAdjective').val(), usages: $('#inputModifyUsages').val() };

    //Red marks on wrong inputs
    var adjective = document.getElementById("inputModifyAdjective");
    var usages = document.getElementById("inputModifyUsages");

    adjective.setAttribute("class", "form-control");
    usages.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.newAdjective) || formdata.newAdjective == '') {
        adjective.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.usages == '') {
        usages.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.newAdjective) || formdata.newAdjective == '') {
        bootstrap_alert.warning("warningAlertModifyAdjective", "The adjective <strong>must have no whitespaces or be left empty</strong>.");
    } else if (formdata.usages == '') {
        bootstrap_alert.warning("warningAlertModifyAdjective", "The adjective's usages <strong>must be filled</strong>.");
    } else {
        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/modify/adjective',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/resources";
                bootstrap_alert.success("You successfully modified the Adjective from the data dicctionary: <strong>" + formdata.newAdjective + ".</strong>");
            },
            error: function (error) {
                console.log(error);

                if (error.status == 409) {
                    letters.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertModifyAdjective", "The adjective is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertModifyAdjective", "You don't have <strong>permission</strong> over the adjectives.");
                } else {
                    window.location = "http://localhost:8080/resources";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Adjective from the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
    }
}

function modifySemanticRuleFromDictionary() {
    var formdata = { previousRule: $('#previousRule').val(), newRule: $('#inputModifyRule').val(), explanation: $('#inputModifyExplanation').val() };

    //Red marks on wrong inputs
    var rule = document.getElementById("inputModifyRule");
    var explanation = document.getElementById("inputModifyExplanation");

    rule.setAttribute("class", "form-control");
    explanation.setAttribute("class", "form-control");

    //Check if they are wrong
    if (/\s/.test(formdata.newRule) || formdata.newRule == '') {
        rule.setAttribute("class", "form-control is-invalid");
    }
    if (formdata.explanation == '') {
        explanation.setAttribute("class", "form-control is-invalid");
    }

    //Last checks for the warning pop ups and the server request
    if (/\s/.test(formdata.newRule) || formdata.newRule == '') {
        bootstrap_alert.warning("warningAlertModifySemanticRule", "The rule <strong>must have no whitespaces or be left empty</strong>.");

    } else if (formdata.explanation == '') {
        bootstrap_alert.warning("warningAlertModifySemanticRule", "The semantic rule's explanation <strong>must be filled</strong>.");

    } else {

        $.ajax({
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formdata),
            dataType: 'json',
            url: 'http://localhost:8080/modify/semantic_rule',
            success: function (e) {
                console.log(e);
                window.location = "http://localhost:8080/resources";
                bootstrap_alert.success("You successfully modified the Semantic Rule from the data dicctionary: <strong>" + formdata.newRule + ".</strong>");
            },
            error: function (error) {
                console.log(error);

                if (error.status == 409) {
                    rule.setAttribute("class", "form-control is-invalid");
                    bootstrap_alert.warning("warningAlertModifySemanticRule", "The rule is <strong>already defined</strong>.");
                } else if (error.status == 401) {
                    bootstrap_alert.warning("warningAlertModifySemanticRule", "You don't have <strong>permission</strong> over the semantic rules.");
                } else {
                    window.location = "http://localhost:8080/resources";
                    bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to modify the Semantic Rule from the data dicctionary. \nTry checking the characters you used or maybe your permissions aren't enought for this action.");
                }
            }
        });
    }
}


function modalDeleteAcronym(letters) {
    document.getElementById("deleteAcronym").innerText = letters.value;
    document.getElementById("deleteAcronym").value = letters.value;
}

function modalDeleteAdjective(adjective) {
    document.getElementById("deleteAdjective").innerText = adjective.value;
    document.getElementById("deleteAdjective").value = adjective.value;
}

function modalDeleteSemanticRule(rule) {
    document.getElementById("deleteRule").innerText = rule.value;
    document.getElementById("deleteRule").value = rule.value;
}

function deleteAcronymFromDictionary() {
    var formdata = { letters: $('#deleteAcronym').val() };

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/delete/acronym',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/resources";
            bootstrap_alert.success("You successfully deleted the Acronym from the data dicctionary: <strong>" + formdata.letters + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/resources";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to delete the Acronym from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}

function deleteAdjectiveFromDictionary() {
    var formdata = { adjective: $('#deleteAdjective').val() };

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/delete/adjective',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/resources";
            bootstrap_alert.success("You successfully deleted the Adjective from the data dicctionary: <strong>" + formdata.adjective + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/resources";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to delete the Adjective from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}

function deleteSemanticRuleFromDictionary() {
    var formdata = { ruleforShort: $('#deleteRule').val() };

    $.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/delete/semantic_rule',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/resources";
            bootstrap_alert.success("You successfully deleted the Semantic Rule from the data dicctionary: <strong>" + formdata.ruleforShort + ".</strong>");
        },
        error: function (error) {
            console.log(error);
            window.location = "http://localhost:8080/resources";
            bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to delete the Semantic Rule from the data dicctionary. \nMaybe your permissions aren't enought for this action.");
        }
    });
}




///////////////////////////////////////
////// Index Button Permissions ///////
///////////////////////////////////////

//Set user's permissions
function setResourcesButtonPermissions(roleOnModule) {
    var modifyDeleteButtons = document.getElementsByClassName("modifyDelete");
    var modalCards = document.getElementsByClassName("ModalCard");
    var addButtons = document.getElementsByClassName("addResourceButton");

    var roleList = []

    for (index = 0; index < roleOnModule.length; index++) {
        if (roleList.indexOf(roleOnModule[index].role) < 0) {
            roleList.push(roleOnModule[index].role)
        }
    }

    if (roleList[0] != 'Project Leader' && roleList[0] != 'General Supervisor') {
        for (index = 0; index < addButtons.length; index++) {
            addButtons[index].setAttribute("class", addButtons[index].getAttribute("class") + " disabled d-none");
        }
        for (index = 0; index < modalCards.length; index++) {
            modalCards[index].setAttribute("class", modalCards[index].getAttribute("class") + " disabled d-none");
        }
        for (index = 0; index < modifyDeleteButtons.length; index++) {
            modifyDeleteButtons[index].setAttribute("class", modifyDeleteButtons[index].getAttribute("class") + " disabled d-none");
        }
    }
}


////////////////////////////////////////////////////
/////// Resources Pagination  and filtering ////////
////////////////////////////////////////////////////


function setResourcesPagination(numberOfPages, pageNumber, state) {
    if (state=="Acronyms") {
        table = document.getElementById("acronymsTableBody");
        paginationTotal = acronyms_pagination;
        
    } else if(state=="Adjectives"){
        table = document.getElementById("adjectivesTableBody");
        paginationTotal = adjectives_pagination;
    }else{
        table = document.getElementById("semanticRulesTableBody");
        paginationTotal = rules_pagination;
    }
    tr = table.getElementsByTagName("tr");
    if (pageNumber > 0 && pageNumber <= paginationTotal && numberOfPages > 0) {

        for (i = 0; i < tr.length; i++) {
            tr[i].setAttribute("class", "accordion-toggle collapsed");
            if (i >= numberOfPages * (pageNumber - 1) && i < numberOfPages * pageNumber) {
                //console.log(i);
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
        document.getElementById("pageNumber" + state).innerText = paginationTotal;
        document.getElementById("lastPagination" + state).setAttribute("onclick", "setResourcesPagination(" + numberOfPages + "," + paginationTotal + ", '" + state + "')");

        document.getElementById("activePagination" + state).value = pageNumber;
        document.getElementById("activePagination" + state).getElementsByTagName("a")[0].innerText = pageNumber;

    }
    
    nextPage = parseInt(pageNumber) + 1;
    previousPage = pageNumber - 1;
    document.getElementById("previousPagination" + state).setAttribute("onclick", "setResourcesPagination(" + numberOfPages + "," + previousPage + ", '" + state + "')");
    document.getElementById("nextPagination" + state).setAttribute("onclick", "setResourcesPagination(" + numberOfPages + "," + nextPage + ",'" + state + "')");
    document.getElementById("firstPagination" + state).setAttribute("onclick", "setResourcesPagination(" + numberOfPages + "," + 1 + ",'" + state + "')");

}



function removeFade(popoverName, state) {
    
    var currentPage = document.getElementById("activePagination"+state).value;
    var lastPage = parseInt(document.getElementById("pageNumber"+state).innerText);
    
    $('#' + popoverName).popover('show');
    $(".popover").removeClass("fade");

    try {
        setInputFilter(document.getElementById("inputPagination" + popoverName), function (value) {
            return /^-?\d*$/.test(value);
        });

        //Update popover input field
        placeholder = "1-10";
        if (popoverName == 'lesserPagination'+state) {
            placeholder = "1-" + currentPage.toString();
        } else if (popoverName == 'greaterPagination'+state) {
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


function popoverInitialization(popoverName, state) {
    placeholder = "-"
    var currentPage = document.getElementById("activePagination"+state).value;
    var lastPage = document.getElementById("lastPagination"+state).value;

    if (popoverName == 'lesserPagination'+state) {
        placeholder = "1-" + currentPage.toString();
    } else if (popoverName == 'greaterPagination'+state) {
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







