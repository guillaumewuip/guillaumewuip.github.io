$(document).ready(function(){


    $('.js-terminal').typist({});

    $('.js-terminal').empty();

    $('.js-terminal')
        .typist('prompt', 'h1 class="term-line"')
        .typist('type', "> ")
        .typist('wait', 1000)
        .typist('type', "Hi !")
        .typist('prompt', 'h1 class="term-line"')
        .typist('type', "> ")
        .typist('wait', 1000)
        .typist('type', "I'm a 21 year old student from France and a web developer")
        .typist('prompt', 'h1 class="term-line"')
        .typist('type', "> ")
        .typist('wait', 1000)
        .typist('type', "This summer ")
        .typist('wait', 300)
        .typist('type', "I'd like to be your intern !")
        .typist('prompt', 'h1 class="term-line"')
        .typist('type', "> ");
        // .typist('hideCursor');


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
