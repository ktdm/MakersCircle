$(document).ready(function () {

  $(".toggle_tip").click(function () {
    $(".markdown_tip").toggleClass("show_tip")
  }).queue(function () {
    var h = $(".tip_text").outerHeight() + $(".markdown_tip").outerHeight() + 2;
    document.styleSheets[0].insertRule("\
      .show_tip{bottom:" + h + "px}\
    ", document.styleSheets[0].cssRules.length);
    $(this).parent().parent().find("textarea").css({minHeight: h})
  })



  $("#user_edit_cell").css({right: $("#user_edit_cell").outerWidth() + 1}).hide();
  $("form.show .message").hide().data({
    adj: function () {
      $("form.show").css({paddingBottom: "+=10"});
      delete $("form.show .message").show().data().adj
    }
  });
  $("form.show").css({paddingBottom: "-=10"});

  function toggle_submit(form, submit) {
    if (!($(submit).css("right") == "0px") && submit_decide(form)) {
      $(submit).show().find("input").prop({"tabIndex": 0});
      $(form + " .message").hide();
      setTimeout(function () { $(submit).css({right: 0}) }, 10);
    } else if ($(submit).css("right") == "0px" && !submit_decide(form)) {
      $(submit).css({ right: $(submit).outerWidth() + 1 })
        .find("input").prop({"tabIndex": -1});
      setTimeout(function () {
        $(form + " .message").show();
        $(submit).hide()
      }, 400)
    }
  }

  function submit_decide(form) {
    if (form == "form.show") return $(".body").hasClass("hide");;
    return false
  }

  $("form.show textarea, form.show input[type=radio]").on("blur change keydown paste cut", function () {
    setTimeout(function () { toggle_submit("form.show", "#user_edit_cell") }, 0);
  });

  $("form.show .edit").click(function () {
    $("form.show").toggleClass("active");
    $("form.show > .body").toggleClass("hide");
    $("form.show > .body_edit").toggleClass("hide");
    $("form.show > .prefs").toggleClass("hide");
    $("form.show > .body_edit + input[type=submit]").toggleClass("hide");
    $("form.show > .body_edit > textarea").val($("form.show > .body").attr("data-body"));
    var a = $("form.show .message").show().data().adj; a && a();
    setTimeout(function () { toggle_submit("form.show", "#user_edit_cell") }, 0);
    dont.call(this, "edit")
  });

  function dont (action) { $(this).text($(this).text() == action ? "don't " + action : action) }

  $(".action.edit").click()

})
