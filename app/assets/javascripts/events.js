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

  

  $("#event_submit_cell").css({right: $("#event_submit_cell").outerWidth() + 1}).hide();
  $("#new_event .message, form.show .message").hide().data({
    adj: function () {
      $("#new_event, form.show").css({paddingBottom: "+=10"});
      delete $("#new_event .message, form.show .message").show().data().adj
    }
  });
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

  $("#new_event textarea, #new_event select, #new_event input[type=text]").on("blur change keydown paste cut", function () {
    var a = $("#new_event .message").data().adj; a && a();
    setTimeout(function () { toggle_submit("#new_event", "#event_submit_cell") }, 0)
  })

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
    if (form == "#new_event") return $(form).valid();
    if (form == "form.show") return $(form).valid() && !$(".title > .rename").hasClass("hide");
    if (form == "#poly_comment") return $(form).valid()
    return false
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



  $("#event_edit_cell").css({ right: $("#event_edit_cell").outerWidth() + 1 }).hide();

  var validate_show = $("form.show").validate({
    errorPlacement: function (error, element) { element.closest("form").find(".message").html(error) },
    rules: {
      "comment_thread[title]": "required",
      "event[time(1i)]": "tense", /* change to relative to existing event rather than present moment? */
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

  $("form.show select, form.show textarea, form.show input[type=text]").on("blur change keydown paste cut", function () {
    setTimeout(function () { toggle_submit("form.show", "#event_edit_cell") }, 0);
  });

  $("form.show .action.edit").click(function () {
    $("form.show").toggleClass("active");
    $("form.show > .title > span:first-child").toggleClass("hide");
    $("form.show > .body").toggleClass("hide");
    $("form.show > .time").toggleClass("hide");
    $("form.show .rename").toggleClass("hide");
    $("form.show > .body_edit").toggleClass("hide");
    $("form.show > .time_edit").toggleClass("hide");
    $("form.show > .body_edit + input[type=submit]").toggleClass("hide");
    $("form.show .rename > input[type=text]").val($("form.show > .title").attr("data-title"));
    $("form.show > .body_edit > textarea").val($("form.show > .body").attr("data-body"));
    var dt = $("form.show > .time").attr("data-time").split(" ");
    $("form.show > .time_edit > select").each(function (x) { $(this).find("option[value=" + dt[x] + "]").prop("selected", true) });
    var a = $("form.show .message").show().data().adj; a && a();
    setTimeout(function () { toggle_submit("form.show", "#event_edit_cell") }, 0);
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

  $(".comments .action.edit").click(function () {
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
