$(document).ready(function () {

  $(".toggle_tip").click(function () {
    $(".markdown_tip").toggleClass("show_tip")
  });

  $(".show .edit").click(function () {
    $(".head_title > span:first-child").toggleClass("hide");
    $(".head_body").toggleClass("hide");
    $(".head_rename").toggleClass("hide");
    $(".head_body_edit").toggleClass("hide");
    $(".head_body_edit + input[type=submit]").toggleClass("hide");
    $(".head_rename > input[type=text]").val($(".head_title").attr("data-title"))
    $(".head_body_edit > textarea").val($(".head_body").attr("data-body"))
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
