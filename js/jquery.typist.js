/*
  Typist-jquery (modify by me)
  see original : https://github.com/davidcrawford/typist-jquery
  */
(function( $ ) {
  // $('head').append('\
  //   <style>\
  //   .typist-container {\
  //     overflow: hidden;\
  //     padding-left: 4px;\
  //   }\
  //   .typist-container p {\
  //     margin: 0 0 3px;\
  //   }\
  //   .typist-container p.prompt {\
  //     margin: 5px 0;\
  //   }\
  //   </style>');

  var MAX_SCROLL = 999999999;
  var defaults = {
    // backgroundColor: '#333',
    // textColor: '#DDD',
    // height: 300
  };
  var $el, typeDelay = 40;


  var blinkTimer;

  var startBlink = function(next) {
    blinkTimer = setInterval(function() {
      $('.cursor').toggle();
    }, 500);
    next && next();
  };

  var stopBlink = function(next) {
    clearInterval(blinkTimer);
    next && next();
  };

  var addLine = function(html) {
    html = typeof html !== 'undefined' ? html : 'p';

    $('.cursor').remove();
    var p = $('<'+html+'>&nbsp;</'+html+'>');

    $el.append(p);

    var height = 0;

    $el.children().each(function() {
      height += $(this).height();
    });
    $el.scrollTop(height);

    return p;
  };

  var br = function(html) {
    $el.append('<br />');
  };

  var methods = {
    
    init: function(config) {
      config = $.extend(defaults, config);

      $el = this;

      var oldStyle = $el.attr('style') + ';' || '';
      var style = 'background-color: ' + config.backgroundColor;
      style += '; color: ' + config.textColor;
      style += '; height: ' + config.height;
      style += '; width :' + config.width;

      $el.addClass('typist-container')
        .attr('style', oldStyle + style)

      startBlink();

      return $el;
    },
    prompt: function(html) {
      return $el.queue(function(next) {
        $('.cursor').remove();
        addLine(html)
          .addClass('prompt')
          .html('<span class="cursor">|</span>');
        next();
      });
    },

    type: function(text) {
     $el.queue(stopBlink);

      var typeChar = function(index) {
        $el.queue(function(next) {
          $('.cursor').before(text[index]);
          next();
        })
        .delay(typeDelay);
      };

      for (var i = 0; i < text.length; i++) {
        typeChar(i);
      }

      return $el.queue(startBlink);  
    },

    echo: function(text, html) {
      var $p;

      var typeChar = function(index) {
        $el.queue(function(next) {
          if (index === 0) {
            $p = addLine(html);
          }

          $p.append(text[index]);
          next();
        })
        .delay(typeDelay);
      };
      for (var i = 0; i < text.length; i++) {
        typeChar(i);
      }
      return $el;
    },

    wait: function(millis) {
      return $el.delay(millis);
    },
    speed: function(speed) {
      if (speed === 'fast') {
        typeDelay = 40;
      }
      else if (speed === 'slow') {
        typeDelay = 120;
      }
      return $el;
    },

    br: function() {

     $el.queue(stopBlink); 

      var typeChar = function() {
        $el.queue(function(next) {
          $('.cursor').before('<br/>');
          next();
        })
        .delay(typeDelay);
      };

      typeChar();

      return $el.queue(startBlink);  
    },

    link: function(text, link, attr) {
      
      attr = typeof attr !== 'undefined' ? attr : "";

      $el.queue(stopBlink);
      var a = '<a '+attr+' href="'+link+'"></a>';

      var linkStart = function() {
        $el.queue(function(next) {
          $('.cursor').before(a);
          a = $('.cursor').parent().find('a').last();
          next();
        })
        .delay(typeDelay);
      };

      var typeChar = function(index) {
        $el.queue(function(next) {
          $(a).text( $(a).text() +''+ text[index] );
          next();
        })
        .delay(typeDelay);
      }; 

      linkStart();
      for (var i = 0; i < text.length; i++) {
        typeChar(i);
      }

      return $el.queue(startBlink); 
    },

    hideCursor : function(){
      var cursor = function(index) {
        $el.queue(function(next) {
        $('.cursor').remove();
          next();
        })
        .delay(typeDelay);
      }; 
      cursor();
    }

  };

  $.fn.typist = function(method) {

    // Method calling logic
    if ( methods[method] ) 
    {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1));
    } 
    else if ( typeof method === 'object' || ! method ) 
    {
      return methods.init.apply( this, arguments );
    }
    else 
    {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }    
  };


})( jQuery );



