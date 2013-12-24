$(document).ready(function () {

  $("#post_submit_cell").css({ right: $("#post_submit_cell").outerWidth() + 1 }).hide();
  $("#new_post .message").hide().data({flag: true});
  $("#new_post").css({paddingBottom: "-=10"});

  $("#new_post").validate({
    groups: {
      all: 'comment_thread[title] post[kind] post[item]'
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

  $("#new_post *").filter("select, input[type=text]").on("blur change keydown paste cut", function () {
    var msg = $("#new_post .message");
    if (msg.data().flag) {
      msg.data({flag: false});
      msg.show();
      $("#new_post").css({paddingBottom: "+=10"});
    }
    setTimeout(toggle_submit, 0)
  })

  function toggle_submit() {
    if (!($("#post_submit_cell").css("right") == "0px") && $("#new_post").valid()) {
      $("#post_submit_cell").show()
        .find("input").prop({"tabIndex": 0});
      setTimeout(function () { $("#post_submit_cell").css({right: 0}) }, 0)
      $("#new_post .message").hide()
    } else if ($("#post_submit_cell").css("right") == "0px" && !$("#new_post").valid()) {
      $("#post_submit_cell").css({ right: $("#post_submit_cell").outerWidth() + 1 })
        .find("input").prop({"tabIndex": -1})
      setTimeout(function () {
        $("#new_post .message").show();
        $("#post_submit_cell").hide()
      })
    }
  }

  jQuery.validator.addMethod('kindcheck', function (value) {
    return (value != "kind of post");
  });



  $(".head_subhead > .rename").click(function () {
    $(".head_rename").toggleClass("hide");
    $(".head_rename > input[type=text]").val($(".head_title").attr("data-title"));
    $(".head_title > a").toggleClass("hide");
    dont.call(this, "rename")
  });

  $(".head_subhead > .remove").click(function () {
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

  $("input[value=Discuss]").click(function() {
    this.form["comment[body]"].value = $(this).closest("caption").find("textarea").val()
  })

  $("input[value=Update]").click(function() {
    this.form["comment[body]"].value = $(this).closest("tr").find("textarea").val();
    this.form.action += "/" + $(this).closest("tr").attr("id").split("_")[1];
    this.form._method.value = "patch"
  })

  $(".comments .remove").click(function () {
    c = $(this).closest("tr");
    c.find(".comment_remove").toggleClass("hide");
    dont.call(this, "remove")
  })

  function dont (action) { $(this).text($(this).text() == action ? "don't " + action : action) }

  $(".rename, .remove, .edit").click()

})