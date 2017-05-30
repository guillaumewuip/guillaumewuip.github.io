$(document).ready(function(){
    $('.js-slideToTop').click(function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    });

    $( '.js-goToID' ).on('click', function(event) {
        event.preventDefault();

        var target = "#" + $(this).data('target');

        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 'fast');
    });
});
