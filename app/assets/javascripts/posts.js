$(document).ready(function () {

  $(".rename").click(function () {
    $(".head_rename").toggleClass("hide");
    $(".head_rename > input[type=text]").val($(".head_title").attr("data-title"))
    $(".head_title > a").toggleClass("hide")
    dont.call(this, "rename")
  });

  $(".remove").click(function () {
    $(".head_remove").toggleClass("hide");
    dont.call(this, "remove")
  });

  $(".head_remove > input[type=submit]").click(function () {
    this.form._method.value = "delete"
  })

  function dont (action) { $(this).text($(this).text() == action ? "don't " + action : action) }

  $(".rename, .remove").click()

})
