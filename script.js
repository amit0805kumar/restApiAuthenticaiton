$(function () {


    function init(){
        $('#response').html("");

        // validate jwt to verify access
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({
                jwt: jwt
            })).done(function (result) {

                // if valid, show homepage
                var html = `
                <div class="card">
                <h1 class="card-header">Welcome to Home!</h1>
                <div class="card-body">
                    <h5 class="card-title">You are logged in.</h5>
                    <p class="card-text">You won't be able to access the home and account pages if you are not logged in.</p>
                </div>
            </div>  
                    `;

                $('#content').html(html);
                showLoggedInMenu();
            })

            .fail(function (result) {
                
                $('#content').html("<h1>Please Login First.</h1>");
                showLoggedOutMenu();
            });
    }
    init();

    $(document).on('click', '#sign_up', function () {

        var html = `
        <h2>Sign Up</h2>
        <form id='sign_up_form'>
            <div class="form-group">
                <label for="firstname">Firstname:</label>
                <input type="text"  name="firstname" id="firstname" required />
            </div>

            <div class="form-group">
                <label for="lastname">Lastname:</label>
                <input type="text"  name="lastname" id="lastname" required />
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email"  name="email" id="email" required />
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password"  name="password" id="password" required />
            </div>

            <button type='submit'>Sign Up</button>
        </form>
            `;

        clearResponse();
        $('#content').html(html);
    });

    function clearResponse() {
        $('#response').html('');
    }

    function showHomePage() {

        // validate jwt to verify access
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({
                jwt: jwt
            })).done(function (result) {

                // if valid, show homepage
                var html = `
                    <div class="card">
                        <h1 class="card-header">Welcome to Home!</h1>
                        <div class="card-body">
                            <h5 class="card-title">You are logged in.</h5>
                            <p class="card-text">You won't be able to access the home and account pages if you are not logged in.</p>
                        </div>
                    </div>
                    `;

                $('#content').html(html);
                showLoggedInMenu();
            })

            .fail(function (result) {
                showLoginPage();
                $('#response').html("<div>Please login to access the home page.</div>");
            });
    };


    // showUpdateAccountForm() will be here

    // trigger when registration form is submitted
    $(document).on('submit', '#sign_up_form', function () {

        // get form data
        var sign_up_form = $(this);
        var form_raw_data = {
            "firstname": $('input[name=firstname]').val(),
            "lastname": $('input[name=lastname]').val(),
            "email": $('input[name=email]').val(),
            "password": $('input[name=password]').val(),
        };

        console.log(JSON.stringify(form_raw_data));
        var form_data = JSON.stringify(form_raw_data);
        $('.loader__container').css('display', 'block');

        $.ajax({
            url: "api/create_user.php",
            type: "POST",
            contentType: 'application/json',
            data: form_data,
            success: function (result) {
                // if response is a success, tell the user it was a successful sign up & empty the input boxes
                $('#response').html("<div>Successful sign up. Please login.</div>");
                sign_up_form.find('input').val('');
                $('.loader__container').css('display', 'none');
            },
            error: function (xhr, resp, text) {
                // on error, tell the user sign up failed
                $('#response').html("<div>Unable to sign up. Please contact admin.</div>");
                $('.loader__container').css('display', 'none');
            }
        });

        return false;
    });


    $(document).on('click', '#login', function () {
        showLoginPage();
    });

    function showLoginPage() {

        // remove jwt
        setCookie("jwt", "", 1);

        // login page html
        var html = `
            <h2>Login</h2>
            <form id='login_form'>
                <div class='form-group'>
                    <label for='email'>Email address</label>
                    <input type='email'  id='email' name='email' placeholder='Enter email'>
                </div>
     
                <div class='form-group'>
                    <label for='password'>Password</label>
                    <input type='password'  id='password' name='password' placeholder='Password'>
                </div>
     
                <button type='submit'>Login</button>
            </form>
            `;

        $('#content').html(html);
        clearResponse();
        showLoggedOutMenu();
    }

    // function to set cookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    // function to get cookie
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }


    // if the user is logged out
    function showLoggedOutMenu() {
        // show login and sign up from navbar & hide logout button
        $("#login, #sign_up").show();
        $("#logout").hide();
    }
    // if the user is logged in
    function showLoggedInMenu() {
        // hide login and sign up from navbar & show logout button
        $("#login, #sign_up").hide();
        $("#logout").show();
    }


    // trigger when login form is submitted
    $(document).on('submit', '#login_form', function () {

        // get form data
        var login_form = $(this);
        var json_raw_data = {
            "email": $('input[name=email]').val(),
            "password": $('input[name=password]').val(),
        };
        var form_data = JSON.stringify(json_raw_data);
        $('.loader__container').css('display', 'block');
        // submit form data to api
        $.ajax({
            url: "api/login.php",
            type: "POST",
            contentType: 'application/json',
            data: form_data,
            success: function (result) {

                // store jwt to cookie
                setCookie("jwt", result.jwt, 1);

                // show home page & tell the user it was a successful login
                showHomePage();
                $('#response').html("<div class='alert alert-success'>Successful login.</div>");

                $('.loader__container').css('display', 'none');
            },
            error: function (xhr, resp, text) {
                // on error, tell the user login has failed & empty the input boxes
                $('#response').html("<div class='alert alert-danger'>Login failed. Email or password is incorrect.</div>");
                login_form.find('input').val('');
                $('.loader__container').css('display', 'none');
            }
        });

        return false;
    });

    // show home page
    $(document).on('click', '#home', function () {
        showHomePage();
        clearResponse();
    });

    // trigger to show account form will be here


    // logout the user
    $(document).on('click', '#logout', function () {
        showLoginPage();
        $('#response').html("<div class='alert alert-info'>You are logged out.</div>");
    });

    $('#update_account').click(function () {
        showUpdateAcc();  
    });

    function showUpdateAcc() {
        $('#response').html("");

        // validate jwt to verify access
        var jwt = getCookie('jwt');
        $.post("api/validate_token.php", JSON.stringify({
                jwt: jwt
            })).done(function (result) {

                // if valid, show homepage
                var html = `
                <h2>Update Your Account</h2>
             <form id='update_form'>
              <div class="form-group">
                <label for="firstname">Firstname:</label>
                <input type="text"  name="firstname" id="firstname" required value="` + result.data.firstname + `" />
            </div>

            <div class="form-group">
                <label for="lastname">Lastname:</label>
                <input type="text"  name="lastname" id="lastname" required value="` + result.data.lastname + `"/>
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email"  name="email" id="email" required value="` + result.data.email + `"/>
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password"  name="password" id="password" required />
            </div>

            <button type='submit'>Update Account</button>
        </form>
                    `;

                $('#content').html(html);
                
            })

            .fail(function (result) {
                showLoginPage();
                $('#response').html("<div>Please login to Update Account.</div>");
            });
    };

    $(document).on('submit',"#update_form",function(){

          // get form data
          var update_form = $(this);
          var jwt = getCookie('jwt');
          var form_raw_data = {
              "firstname": $('input[name=firstname]').val(),
              "lastname": $('input[name=lastname]').val(),
              "email": $('input[name=email]').val(),
              "password": $('input[name=password]').val(),
              "jwt": jwt
          };
  
          //console.log(JSON.stringify(form_raw_data));
          var form_data = JSON.stringify(form_raw_data);
          $('.loader__container').css('display', 'block');
  
          $.ajax({
              url: "api/update_user.php",
              type: "POST",
              contentType: 'application/json',
              data: form_data,
              success: function (result) {

                    setCookie("jwt",result.jwt,1);
                  // if response is a success, tell the user it was a successful sign up & empty the input boxes
                  $('#response').html("<div>Successful Updated.</div>");
                  update_form.find('input').val('');
                  $('.loader__container').css('display', 'none');
              },
              error: function (xhr, resp, text) {
                  // on error, tell the user sign up failed
                  if(xhr.responseJSON.message=="Unable to update user."){
                    $('#response').html("<div class='alert alert-danger'>Unable to update account.</div>");
                }
             
                else if(xhr.responseJSON.message=="Access denied."){
                    showLoginPage();
                    $('#response').html("<div class='alert alert-success'>Access denied. Please login</div>");
                }
                  $('.loader__container').css('display', 'none');
              }
          });
  
          return false;

    });

});