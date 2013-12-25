$(document).ready(function () {

  $(".toggle_tip").click(function () {
    $(".markdown_tip").toggleClass("show_tip")
  }).queue(function () {
    var h = $(".tip_text").outerHeight() + $(".markdown_tip").outerHeight() + 2;
    document.styleSheets[0].insertRule("\
      .show_tip{bottom:" + h + "px}\
    ", document.styleSheets[0].cssRules.length);
    $(this).parent().parent().find("textarea").css({minHeight: h})
  });



  $("#discussion_submit_cell").css({right: $("#discussion_submit_cell").outerWidth() + 1}).hide();
  $("#new_discussion .message, form.show .message").hide().data({
    adj: function () {
      $("#new_discussion, form.show").css({paddingBottom: "+=10"});
      delete $("#new_discussion .message, form.show .message").show().data().adj
    }
  });
  $("#new_discussion").css({paddingBottom: "-=10"});

  $("#new_discussion").validate({
    groups: {
      all: 'comment_thread[title] comment[body]'
    },
    errorPlacement: function(error, element) {
      error.appendTo(element.closest("form").find(".message"))
    },
    rules: {
      "comment_thread[title]": "required",
      "comment[body]": "required"
    },
    messages: {
      "comment_thread[title]": "Write a title.",
      "comment[body]": "What do you want to talk about."
    }
  });

  $("#new_discussion textarea, #new_discussion input[type=text]").on("blur change keydown paste cut", function () {
    var a = $("#new_discussion .message").data().adj; a && a();
    setTimeout(function () { toggle_submit("#new_discussion", "#discussion_submit_cell") }, 0)
  });

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
    if (form == "#new_discussion") return $(form).valid();
    if (form == "form.show") return $(form).valid() && !$(".title > .rename").hasClass("hide");
    if (form == "#poly_comment") return $(form).valid()
    return false
  }



  $("#discussion_edit_cell").css({ right: $("#discussion_edit_cell").outerWidth() + 1 }).hide();

  var validate_show = $("form.show").validate({
    errorPlacement: function (error, element) { element.closest("form").find(".message").html(error) },
    rules: {
      "comment_thread[title]": "required",
      "comment[body]": "required"
    },
    messages: {
      "comment_thread[title]": "Write a title.",
      "comment[body]": "What do you want to talk about."
    }
  });

  $("form.show input[type=text], form.show textarea").on("blur change keydown paste cut", function () {
    setTimeout(function () { toggle_submit("form.show", "#discussion_edit_cell") }, 0);
  });

  $("form.show .action.edit").click(function () {
    $("form.show").toggleClass("active");
    $("form.show > .title > span:first-child").toggleClass("hide");
    $("form.show > .body").toggleClass("hide");
    $("form.show > .title > .rename").toggleClass("hide");
    $("form.show > .body_edit").toggleClass("hide");
    $("form.show > .body_edit + input[type=submit]").toggleClass("hide");
    $("form.show > .title > .rename > input[type=text]").val($("form.show > .title").attr("data-title"));
    $("form.show > .body_edit > textarea").val($("form.show > .body").attr("data-body"));
    var a = $("form.show .message").show().data().adj; a && a();
    setTimeout(function () { toggle_submit("form.show", "#discussion_edit_cell") }, 0);
    dont.call(this, "edit")
  });

  $("form.show .action.remove").click(function () {
    $("form.show > .remove").toggleClass("hide");
    dont.call(this, "remove")
  });

  $("form.show > .remove > input[type=submit]").click(function () {
    this.form._method.value = "delete"
  });



  $("#comment_discuss_cell").css({ right: $("#comment_discuss_cell").outerWidth() + 1 }).hide(); //consolidate

  var validate_comment = $("#poly_comment").validate({
    errorPlacement: function (error, element) { 
      setTimeout(function () { element.closest("div[id*=comment]").find(".message").html(error) }, 0)
    },
    messages: { "required": "No empty comments." }
  });

  $("#poly_comment textarea[name$='[new_body]']").on("blur change keydown paste cut", function () {
    if (!$(this).rules().required) {
      $("[name*='[body_'], [name$='[new_body]']").rules("remove", "required");
      $(this).rules("add", "required")
    }
    setTimeout(function () { toggle_submit("#poly_comment", "#comment_discuss_cell") }, 0)
  });

  $("#poly_comment textarea[name*='[body_']").on("blur change keydown paste cut", function () {
    if (!$(this).rules().required) {
      $("[name*='[body_'], [name$='[new_body]']").rules("remove", "required");
      $(this).rules("add", "required")
    }
  });

  $(".comments .edit").click(function () {
    c = $(this).closest("[id^=comment_]");
    c.find(".comment").toggleClass("hide");
    c.find("input[value=Update]").toggleClass("hide");
    c.find(".comment_edit textarea").val(c.find(".comment").attr("data-body"));
    c.find(".comment_edit textarea").valid();
    c.find(".comment_edit").toggleClass("hide");
    dont.call(this, "edit")
  });

  $("input[value=Discuss]").click(function() {
    this.form["comment[body]"].value = $(this).closest("#new_comment").find("textarea").val();
    $("[name*='[body_'], [name$='[new_body]']").prop({disabled: true})
  });

  $(".comments input[value=Update]").click(function() {
    this.form["comment[body]"].value = $(this).closest("[id^=comment_]").find("textarea").val();
    this.form.action += "/" + $(this).closest("[id^=comment_]").attr("id").split("_")[1];
    this.form._method.value = "patch";
    $("[name*='[body_'], [name$='[new_body]']").prop({disabled: true})
  });

  $(".comments .action.remove").click(function () {
    c = $(this).closest("[id^=comment_]");
    c.find(".comment_remove").toggleClass("hide");
    dont.call(this, "remove")
  });

  function dont (action) { $(this).text($(this).text() == action ? "don't " + action : action) }

  $(".action.edit, .action.remove").click()

})