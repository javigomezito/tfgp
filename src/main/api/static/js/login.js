function loginForm() {
    formdata = { username: $('#username').val(), password: $('#password').val() };

    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formdata),
        dataType: 'json',
        url: 'http://localhost:8080/login',
        success: function (e) {
            console.log(e);
            window.location = "http://localhost:8080/general";
        },
        error: function (error) {
            console.log(error);
            if (error.status == 409) {
                moduleName.setAttribute("class", "form-control is-invalid");
                bootstrap_alert.error("Incorrect <strong>username or password</strong>.");
            } else {
                bootstrap_alert.error("An <strong>ERROR</strong> has occurred while trying to identify the User. \nTry checking the characters you used.");
            }
        }
    });

}
function loginFormGuest() {
    document.getElementById("username").value="guest";
    document.getElementById("password").value="guest";
    loginForm();
}

bootstrap_alert.error = function (message) {
    $('#errorAlert').html('<div class="alert alert-error alert-dismissible fade show" role="alert">' + message + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
}