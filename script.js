function isEmail(email) {
  var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/;
  return regex.test(email);
}

$(document).ready(function () {
  $("#submitbutton").click(function (event) {
    event.preventDefault(); // stop page reload

    let missingfield = "";
    let errormessage = "";

    // Empty field checks
    if ($("#email").val() === "") {
      missingfield += "<p>Email not filled</p>";
    }
    if ($("#phoneno").val() === "") {
      missingfield += "<p>Phone number not filled</p>";
    }
    if ($("#password").val() === "") {
      missingfield += "<p>Password not filled</p>";
    }
    if ($("#confirmpassword").val() === "") {
      missingfield += "<p>Confirm Password not filled</p>";
    }

    // Email validation
    if ($("#email").val() !== "" && isEmail($("#email").val()) === false) {
      errormessage += "<p>Email id is not valid</p>";
    }

    // Phone validation
    if (
      $("#phoneno").val() !== "" &&
      ($.isNumeric($("#phoneno").val()) === false ||
        $("#phoneno").val().length !== 10)
    ) {
      errormessage += "<p>Phone number is not valid</p>";
    }

    // Password match
    if (
      $("#password").val() !== "" &&
      $("#confirmpassword").val() !== "" &&
      $("#password").val() !== $("#confirmpassword").val()
    ) {
      errormessage += "<p>Password does not match</p>";
    }

    // Show results
    if (missingfield !== "" || errormessage !== "") {
      $("#message")
        .html(missingfield + errormessage)
        .removeClass("success")
        .addClass("error");
    } else {
      $("#message")
        .html("✅ Form submitted successfully!")
        .removeClass("error")
        .addClass("success");
    }
  });
});
