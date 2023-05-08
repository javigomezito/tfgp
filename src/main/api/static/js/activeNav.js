function setActiveNav(activeNav, show) {
    var pagetabs2 = document.getElementsByClassName("nav-link");

    var pagetabs = document.getElementsByClassName("nav-link active");
    var contenttabs = document.getElementsByClassName("tab-pane fade show active");
    
    //Change main navigation bar active nav-item
    document.getElementsByClassName("nav-item active mainNavigation")[0].setAttribute("class", "nav-item mainNavigation");
    document.getElementById("layoutNavGen").setAttribute("class", "navbar-brand");
    switch (show) {
        case 'symbols':
            document.getElementById("layoutNavSym").setAttribute("class", "nav-item active mainNavigation");
            
            break;
        case 'resources':
            document.getElementById("layoutNavRes").setAttribute("class", "nav-item active mainNavigation");
            
            break;
        case 'modules':
            document.getElementById("layoutNavMod").setAttribute("class", "nav-item active mainNavigation");
            
            break;    
        case 'indexes':
            document.getElementById("layoutNavInd").setAttribute("class", "nav-item active mainNavigation");
            
            break;
        case 'categories':
            document.getElementById("layoutNavCat").setAttribute("class", "nav-item active mainNavigation");
            
            break;
        default:
            document.getElementById("layoutNavGen").setAttribute("class", "navbar-brand text-success");
            break;
    }
    

    //i is the number of the search bar nav-links
    //Resources, Modules, Symbols, Categories, Indexes
    for (i = 5; i< pagetabs2.length; i++) {
        if(activeNav == pagetabs2[i].id){
            pagetabs[0].setAttribute("class", "nav-link");
            contenttabs[0].setAttribute("class", "tab-pane fade");

            var item=document.getElementById(activeNav+'I');
            item.setAttribute("class", "nav-item active");

            var link=document.getElementById(activeNav);
            link.setAttribute("class", "nav-link active show");

            var content=document.getElementById(activeNav+'Content');
            content.setAttribute("class", "tab-pane fade show active");
        }
    }

}