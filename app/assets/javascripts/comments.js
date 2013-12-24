$(document).ready(function () {

  $("#discussion_submit_cell").css({right: $("#discussion_submit_cell").outerWidth() + 1}).hide();
  $("#new_discussion .message").hide().data({flag: true});
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

  $("#new_discussion *").filter("textarea, input[type=text]").on("blur change keydown paste cut", function () {
    var msg = $("#new_discussion .message");
    if (msg.data().flag) {
      msg.data({flag: false});
      msg.show();
      $("#new_discussion").css({paddingBottom: "+=10"});
    }
    setTimeout(toggle_submit, 0)
  })

  function toggle_submit() {
    if (!($("#discussion_submit_cell").css("right") == "0px") && $("#new_discussion").valid()) {
      $("#discussion_submit_cell").show()
        .find("input").prop({"tabIndex": 0});
      setTimeout(function () { $("#discussion_submit_cell").css({right: 0}) }, 0);
      $("#new_discussion .message").hide()
    } else if ($("#discussion_submit_cell").css("right") == "0px" && !$("#new_discussion").valid()) {
      $("#discussion_submit_cell")
        .css({ right: $("#discussion_submit_cell").outerWidth() + 1 })
        .find("input").prop({"tabIndex": -1});
      setTimeout(function () {
        $("#discussion_submit_cell").hide();
        $("#new_discussion .message").show()
      }, 400)
    }
  }



  $(".toggle_tip").click(function () {
    $(".markdown_tip").toggleClass("show_tip")
  }).queue(function () {
    var h = $(".tip_text").outerHeight() + $(".markdown_tip").outerHeight() + 2;
    document.styleSheets[0].insertRule("\
      .show_tip{bottom:" + h + "px}\
    ", document.styleSheets[0].cssRules.length);
    $("textarea[name$='[body]']").css({minHeight: h})
  })

  $(".show .edit").click(function () {
    $(".head_title > span:first-child").toggleClass("hide");
    $(".head_body").toggleClass("hide");
    $(".head_rename").toggleClass("hide");
    $(".head_body_edit").toggleClass("hide");
    $(".head_body_edit + input[type=submit]").toggleClass("hide");
    $(".head_rename > input[type=text]").val($(".head_title").attr("data-title"));
    $(".head_body_edit > textarea").val($(".head_body").attr("data-body"));
    dont.call(this, "edit")
  });

  $(".show .remove").click(function () {
    $(".head_remove").toggleClass("hide");
    dont.call(this, "remove")
  });

  $(".head_remove > input[type=submit]").click(function () {
    this.form._method.value = "delete"
  });

  $(".comments .edit").click(function () {
    c = $(this).closest("tr");
    c.find(".comment").toggleClass("hide");
    c.find("input[value=Update]").toggleClass("hide");
    c.find(".comment_edit > textarea").val(c.find(".comment").attr("data-body"));
    c.find(".comment_edit").toggleClass("hide");
    dont.call(this, "edit")
  });

  $(".comments input[value=Discuss]").click(function() {
    this.form["comment[body]"].value = $(this).closest("caption").find("textarea").val()
  });

  $(".comments input[value=Update]").click(function() {
    this.form["comment[body]"].value = $(this).closest("tr").find("textarea").val();
    this.form.action += "/" + $(this).closest("tr").attr("id").split("_")[1];
    this.form._method.value = "patch"
  });

  $(".comments .remove").click(function () {
    c = $(this).closest("tr");
    c.find(".comment_remove").toggleClass("hide");
    dont.call(this, "remove")
  });

  function dont (action) { $(this).text($(this).text() == action ? "don't " + action : action) }

  $(".edit, .remove").click()

})
