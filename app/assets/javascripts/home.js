$(document).ready(function () {

  $(".enter").on("mouseenter", function () {
    $(this).children().delay(400).queue(function (next) {
      $(this).show();
      next()
    });
    $(".hello > .title").css({width: "60%"});
    $(".hello > .byline > :last-child").css({opacity: 1, textIndent: 0})
  }).on("mouseleave", function () {
    $(this).children().queue(function (next) {
      $(this).hide();
      next()
    });
    $(".hello > .title").css({width: "89%"})
  }).children().hide();

  $("#user_handle").on("keypress keydown paste cut", function () {
    setTimeout(registerToggle, 0)
  });

  function registerToggle () {
    var val = $("#user_handle").val();
    if (val != "") letCreate()
    else if (val == "") letLogin();
  }

  $(".form_toggle > :last-child").on("click", function () {
    if ($(".enter").attr("action") == "/users") actuallyLetLogin()
    else if ($(".enter").attr("action") == "/login") letCreate()
  });

  function letCreate () {
    $(".form_toggle > :first-child").text("with these login details");
    $(".form_toggle > :last-child").text("(don't create)");
    $(".login > input[type=submit]").val("Register!");
    $(".enter").attr({action: "/users"})
  }

  function letLogin () {
    $(".form_toggle > :first-child").text("Log in");
    $(".form_toggle > :last-child").text("");
    $(".login > input[type=submit]").val("Log in");
    $(".enter").attr({action: "/login"});
    $("label[for=user_handle]").css({display: "none"})
  }

  function actuallyLetLogin () {
    $(".form_toggle > :first-child").text("oops, I mean log in!");
    $(".form_toggle > :last-child").text("(actually, make an account)");
    $(".login > input[type=submit]").val("Log in");
    $(".enter").attr({action: "/login"});
    $("label[for=user_handle]").css({display: "none"})
  }

  $(".enter").validate({
    errorPlacement: function(error, element) {
      element.parent("p").next("p").html(error)
    },
    rules: {
      "user[handle]": {
        remote: {
          url: "/checkhandle",
          method: "post",
          complete: function (data) {
            if (data.responseText == "true") {
              $("#user_handle").parent("p").next("p").html(
                "<label for=\"user_handle\" class=\"valid\">That username is available!</label>"
              )
            }
          }
        }
      },
      "user[email]": {
        required: true,
        email: true
      },
      "user[password]": "required"
    }
  })

})
