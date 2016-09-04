$(document).ready(function(){


    $('.js-terminal').typist({});

    $('.js-terminal').empty();

    $('.js-terminal')
        .typist('prompt', 'h1 class="title mb1"').typist('wait', 1000)
        .typist('type', 'Je suis étudiant et développeur web.')
        .typist('hideCursor');


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