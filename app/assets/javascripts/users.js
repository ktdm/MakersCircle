$(document).ready(function () {

  $(".show .edit").click(function () {
    $(".head_body").toggleClass("hide");
    $(".head_body_edit").toggleClass("hide");
    $(".head_prefs").toggleClass("hide");
    $(".head_body_edit + input[type=submit]").toggleClass("hide");
    $(".head_body_edit > textarea").val($(".head_body").attr("data-body"));
    dont.call(this, "edit")
  });

  $(".comments .edit").click(function () {
    c = $(this).closest("tr");
    c.find(".comment").toggleClass("hide");
    c.find("input[value=Update]").toggleClass("hide");
    c.find(".comment_edit > textarea").val(c.find(".comment").attr("data-body"));
    c.find(".comment_edit").toggleClass("hide");
    dont.call(this, "edit")
  });

  $(".comments input[value=Update]").click(function() {
    this.form["comment[body]"].value = $(this).closest("tr").find("textarea").val();
    this.form.action += "/" + $(this).closest("tr").attr("id").split("_")[1];
    this.form._method.value = "patch"
  });

  function dont (action) { $(this).text($(this).text() == action ? "don't " + action : action) }

  $(".edit").click()

})
