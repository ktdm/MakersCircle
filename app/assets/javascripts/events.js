$(document).ready(function () {

  $(".toggle_tip").click(function () {
    $(".markdown_tip").toggleClass("show_tip")
  });

  $(".edit").click(function () {
    $(".head_title > span:first-child").toggleClass("hide");
    $(".head_body").toggleClass("hide");
    $(".head_rename").toggleClass("hide");
    $(".head_body_edit").toggleClass("hide");
    $(".head_body_edit + input[type=submit]").toggleClass("hide");
    $(".head_rename > input[type=text]").val($(".head_title").attr("data-title"))
    $(".head_body_edit > textarea").val($(".head_body").attr("data-body"))
    dont.call(this, "edit")
  });

  $(".remove").click(function () {
    $(".head_remove").toggleClass("hide");
    dont.call(this, "remove")
  });

  $(".head_remove > input[type=submit]").click(function () {
    this.form._method.value = "delete"
  });

  function dont (action) { $(this).text($(this).text() == action ? "don't " + action : action) }

  $(".edit, .remove").click()

})
