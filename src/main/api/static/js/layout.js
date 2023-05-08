/*Disables settings configuration and notifications tabs from the menu dropdown at the top-fixed navigation bar
*/

function setLayoutPermissions(roleOnModule) {
    
    var settingsDrop = document.getElementById("settingsDrop");
    var notificationsDrop = document.getElementById("notificationsDrop");
    
    var roleList = []

    for (index = 0; index < roleOnModule.length; index++) {
        if(roleList.indexOf(roleOnModule[index].role)< 0){
            roleList.push(roleOnModule[index].role)
        } 
    }

    if(roleList[0] == 'Guest'){
        settingsDrop.setAttribute("class", settingsDrop.getAttribute("class")+" disabled d-none");
        notificationsDrop.setAttribute("class", notificationsDrop.getAttribute("class")+" disabled d-none");       
    }         
}

