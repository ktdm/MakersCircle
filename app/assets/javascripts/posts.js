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



  $("#post_submit_cell").css({ right: $("#post_submit_cell").outerWidth() + 1 }).hide();
  $("#new_post .message, form.show .message").hide().data({
    adj: function () {
      $("#new_post, form.show").css({paddingBottom: "+=10"});
      delete $("#new_post .message, form.show .message").show().data().adj
    }
  });
  $("#new_post, form.show").css({paddingBottom: "-=10"});

  var validate_new = $("#new_post").validate({
    groups: {
      all: "comment_thread[title] post[kind] post[item]"
    },
    errorPlacement: function(error, element) {
      error.appendTo(element.closest("form").find(".message"))
    },
    rules: {
      "comment_thread[title]": "required",
      "post[kind]": "kindcheck",
      "post[item]": {
        required: true,
        url: true
      }
    },
    messages: {
      "comment_thread[title]": "Write a title.",
      "post[kind]": "Select 'project' or 'snippet'.",
      "post[item]": "Give us something to post."
    }
  });

  $("#new_post select, #new_post input[type=text]").on("blur change keydown paste cut", function () {
    var a = $("#new_post .message").data().adj; a && a();
    setTimeout(function () { toggle_submit("#new_post", "#post_submit_cell") }, 0)
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
    if (form == "#new_post") return $(form).valid();
    if (form == "form.show") return $(form).valid() && !$(".title > .rename").hasClass("hide");
    if (form == "#poly_comment") return $(form).valid()
    return false
  }

  jQuery.validator.addMethod('kindcheck', function (value) {
    return (value != "kind of post");
  });



  $("#post_rename_cell").css({ right: $("#post_rename_cell").outerWidth() + 1 }).hide();

  var validate_show = $("form.show").validate({
    errorPlacement: function (error, element) { error.appendTo(element.closest("form").find(".message")) },
    rules: { "comment_thread[title]": "required" },
    messages: { "comment_thread[title]": "Write a title." }
  });

  $("form.show input[type=text]").on("blur change keydown paste cut", function () {
    setTimeout(function () { toggle_submit("form.show", "#post_rename_cell") }, 0);
  });

  $(".action.rename").click(function () {
    $(".show").toggleClass("active");
    $(".title > .rename").toggleClass("hide");
    $(".title > .rename > input[type=text]").val($("form.show > .title").attr("data-title"));
    $("form.show > .title > a").toggleClass("hide");
    var a = $("form.show .message").show().data().adj; a && a();
    setTimeout(function () { toggle_submit("form.show", "#post_rename_cell") }, 0);
    dont.call(this, "rename")
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

  $("div.comments .edit").click(function () {
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

  $("div.comments input[value=Update]").click(function() {
    this.form["comment[body]"].value = $(this).closest("[id^=comment_]").find("textarea").val();
    this.form.action += "/" + $(this).closest("[id^=comment_]").attr("id").split("_")[1];
    this.form._method.value = "patch";
    $("[name*='[body_'], [name$='[new_body]']").prop({disabled: true})
  });

  $("div.comments input[value=Remove]").click(function() {
    $("[name*='[body_'], [name$='[new_body]']").prop({disabled: true})
    this.form.action += "/" + $(this).closest("[id^=comment_]").attr("id").split("_")[1];
    this.form._method.value = "delete"
  });

  $("div.comments .action.remove").click(function () {
    c = $(this).closest("[id^=comment_]");
    c.find(".comment_remove").toggleClass("hide");
    dont.call(this, "remove")
  });

  function dont (action) { $(this).text($(this).text() == action ? "don't " + action : action) }

  $(".action.rename, .action.remove, .action.edit").click()

})