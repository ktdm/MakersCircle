// https://github.com/sstephenson/sprockets#sprockets-directives
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require jquery_validate

$(document).ready(function () {

  $(".list_group").each(function (i, el) {
    var th = $(this).find("tr:first-of-type > *");
    $("<span class=\"th\">with</span>").appendTo(th.eq(-2));
    $("<span class=\"th\">by</span>").appendTo(th.eq(-3));
    $("<span class=\"th\">on</span>").appendTo(th.eq(-4))
  })

})
