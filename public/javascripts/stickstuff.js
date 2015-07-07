$(".animsition").animsition({
 inClass: 'fade-in-right-lg',
 outClass: 'fade-out-right-lg',
 linkElement: 'header a',
 inDuration: 1000,
 outDuration: 500
});

$('.header').sticky({
 getWidthFrom: '.container',
 responsiveWidth: true
});

$('.header').on('sticky-start', function () {
 $('.description').html('We provide <strong>great</strong> entertainment');
});

$('.header').on('sticky-end', function () {
 $('.description').html('The other half of LA sports');
});

$('.work').sticky({
 topSpacing: 60,
 getWidthFrom: '.container',
 responsiveWidth: true
});
$('.work').on('sticky-start', function() {
 $(this).append(' <a href="mailto:email@website.com" class="email-text">Email&nbsp;us</a>');
});
$('.work').on('sticky-end', function() {
   $('.email-text').remove();
});