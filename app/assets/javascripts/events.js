$(document).ready(function () {

  $("#event_submit_cell").css({right: $("#event_submit_cell").outerWidth() + 1}).hide();
  $("#new_event .message").hide().data({flag: true});
  $("#new_event").css({paddingBottom: "-=10"});

  $("#new_event").validate({
    groups: {
      all: 'comment_thread[title] event[time(1i)] event[time(2i)] event[time(3i)] event[time(4i)] event[time(5i)] event[details]'
    },
    errorPlacement: function(error, element) {
      error.appendTo(element.closest("form").find(".message"))
    },
    rules: {
      "comment_thread[title]": "required",
      "event[time(1i)]": "tense",
      "event[time(2i)]": "tense",
      "event[time(3i)]": "tense",
      "event[time(4i)]": "tense",
      "event[time(5i)]": "tense",
      "event[details]": "required"
    },
    messages: {
      "comment_thread[title]": "Write a title.",
      "event[time(1i)]": "Must be in the future.",
      "event[time(2i)]": "Must be in the future.",
      "event[time(3i)]": "Must be in the future.",
      "event[time(4i)]": "Must be in the future.",
      "event[time(5i)]": "Must be in the future.",
      "event[details]": "Tell us about it."
    }
  });

  $("#new_event *").filter("textarea, select, input[type=text]").on("blur change keydown paste cut", function () {
    var msg = $("#new_event .message");
    if (msg.data().flag) {
      msg.data({flag: false});
      msg.show();
      $("#new_event").css({paddingBottom: "+=10"});
    }
    setTimeout(toggle_submit, 0)
  })

  function toggle_submit() {
    if (!($("#event_submit_cell").css("right") == "0px") && $("#new_event").valid()) {
      $("#event_submit_cell").show()
        .find("input").prop({"tabIndex": 0});
      setTimeout(function () { $("#event_submit_cell").css({right: 0}) }, 0);
      $("#new_event .message").hide()
    } else if ($("#event_submit_cell").css("right") == "0px" && !$("#new_event").valid()) {
      $("#event_submit_cell")
        .css({ right: $("#event_submit_cell").outerWidth() + 1 })
        .find("input").prop({"tabIndex": -1});
      setTimeout(function () {
        $("#event_submit_cell").hide();
        $("#new_event .message").show()
      }, 400)
    }
  }

  jQuery.validator.addMethod('tense', function (value) {
    var evtm = [];
    $("#event_time_cell > select").find(":selected").each(function(i, el) {
      evtm.push(parseInt($(el).val()))
    })
    return (datetime_tense(evtm) == 1);
  });

  function datetime_tense(arr) {
    var a = 4, t = new Date(),
        now = [ t.getFullYear(), t.getMonth() + 1, t.getDate(), t.getHours(), t.getMinutes()];
    do {
      if (arr[4-a] > now[4-a]) return 1;
      if (arr[4-a] < now[4-a]) return -1
    } while (a--)
    return 0
  }



  $(".toggle_tip").click(function () {
    $(".markdown_tip").toggleClass("show_tip")
  }).queue(function () {
    var h = $(".tip_text").outerHeight() + $(".markdown_tip").outerHeight() + 2;
    document.styleSheets[0].insertRule("\
      .show_tip{bottom:" + h + "px}\
    ", document.styleSheets[0].cssRules.length);
    $("textarea[name$='[details]']").css({minHeight: h})
  })

  $(".show .edit").click(function () {
    $(".head_title > span:first-child").toggleClass("hide");
    $(".head_body").toggleClass("hide");
    $(".head_time").toggleClass("hide");
    $(".head_rename").toggleClass("hide");
    $(".head_body_edit").toggleClass("hide");
    $(".head_time_edit").toggleClass("hide");
    $(".head_body_edit + input[type=submit]").toggleClass("hide");
    $(".head_rename > input[type=text]").val($(".head_title").attr("data-title"));
    $(".head_body_edit > textarea").val($(".head_body").attr("data-body"));
    var dt = $(".head_time").attr("data-time").split(" ");
    $(".head_time_edit > select").each(function (x) { $(this).find("option[value=" + dt[x] + "]").prop("selected", true) });
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

  $("input[value=Discuss]").click(function() {
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
