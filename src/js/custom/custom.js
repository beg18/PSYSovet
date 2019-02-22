$(document).ready(function() {

   var tab = $('.nav-tab-list__link');
   tab.on('click',function (e) {
      e.preventDefault();
      $(this).toggleClass('nav-tab-list__link--active');
      $('.box-tab-cont').removeClass('content-active');
      $('.box-tab-cont[data-tab=' + $(this).attr('data-tab') + ']')
          .toggleClass('content-active');
   });
});
$(window).load(function () {
   $('#js_thanks .thanks__inner').animated('fadeInLeft','fadeInLeft');
   $('#js_thanks .thanks__inner--last').animated('fadeInRight','fadeInRight');
});



