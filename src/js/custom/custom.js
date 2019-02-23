$(document).ready(function() {

   var tab = $('.nav-tab-list__link');
   tab.on('click',function (e) {
      e.preventDefault();
      $(this).toggleClass('nav-tab-list__link--active');
      $('.box-tab-cont').removeClass('content-active');
      $('.box-tab-cont[data-tab=' + $(this).attr('data-tab') + ']')
          .toggleClass('content-active');
   });

   var tab = $('.consultations-item__link');
   tab.on('click',function (e) {
      e.preventDefault();
      $('.content').removeClass('content-active');
      $('.content[data-tab=' + $(this).attr('data-tab') + ']')
          .toggleClass('content-active');
   });

    $('#js_carousel').owlCarousel({
        loop:true,
        margin:0,
        nav:true,
        dots: false,
        navText: [],
        responsive:{
            0:{
                items:1,
                dots: true,
                nav: false
            },
            760:{
                items:2
            },
            992:{
                items:3
            }
        }
    })
});

$(window).load(function () {
   $('#js_thanks .thanks__inner').animated('fadeInLeft','fadeInLeft');
   $('#js_thanks .thanks__inner--last').animated('fadeInRight','fadeInRight');
});



