/*Sends proper request when searching at the search bar on the navigation bar
If we search from a certain tab we will get its own elements
*/
function getTab(show) {
    //Try to get tabulation, if it can't get one we are showing general
    var text = document.getElementById("searchText").value;
    //document.getElementById("demo3").innerHTML = text;
    
    try{
        var tab = document.getElementsByClassName("nav-link active")[0].id;
    }catch(Exception){
        var tab = '';
    }

    if($("#switchSearch").is(':checked')){
        //Exact  search activated
        var tabulation = { tab : tab, exact : true, text: text };
    }else{
        var tabulation = { tab : tab, exact : false, text: text };
    }

    if(show=="general"){
        domain="http://localhost:8080/search/symbols";
        redirect="http://localhost:8080/symbols";
    }else{
        domain="http://localhost:8080/search/"+show;
        redirect="http://localhost:8080/"+show;
    }

    console.log(tabulation);
    //Build and send request
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(tabulation),
        dataType: 'json',
        url: domain,
        success: function (e) {
            console.log(e);
            window.location = redirect;
        },
        error: function(error) {
            console.log(error);
        }
    });
}
