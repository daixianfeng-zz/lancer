;(function(){
    if ( typeof define === 'function' && define.amd ){
        define( 'GPutupFollow', ['require', 'jquery'], function(require){
            return factory(require('jquery'));
        });
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(require('jquery'));
    }else{
        window.GPutupFollow = factory(window.jQuery);
    }
    function factory($){
        var cssObj = {
            outerContainer: {
                position: 'relative' 
            },
            putUpButton: {
                position: 'absolute',
                right: '20px',
                display: 'inline-block',
                width: '40px',
                height: '30px',
                background: '#f00'
            }
        };
        var defaultConfig = {};
        var PutupFollow = function(el, conf){
            this.el = el;
            this.conf = $.extend({}, defaultConfig, conf);
            this.init();
            return this;
        }
        PutupFollow.prototype = {
            init: function(){
                var el = this.el;
                var conf = this.conf;
                this._event(el, conf);       
            },
            _addElement: function(el){
                $(el).append('<a href="#" class="put-up">收起</a>');
                this._render(el);
            },
            _event: function(el, conf){
                var me = this; 
                $(window).on('scroll' ,function(){
                    if($(window).scrollTop() - $(el).offset().top > -$(window).height()/2 && $(window).scrollTop() - $(el).offset().top<=$(el).height()){
                        if($(el).find('.put-up').length == 0){ me._addElement(el); }                         
                        var distance = $(window).height() + $(window).scrollTop() - $(el).offset().top;
                        distance = distance>$(el).height() ? $(el).height()-40 : distance-40;
                        $('.put-up').css('top', distance); 
                        $('.put-up').on('click', function(){
                            var reback = $(el).offset().top - $(window).height()/2;
                            $(window).scrollTop(reback);
                            return false;
                        }); 
                    }
                    if($(el).find('.put-up').length == 1){
                        if($(el).height() - $(window).scrollTop() + $(el).offset().top <= $(window).height()/2){
                            $('.put-up').remove();
                        }
                    }                  
                });
                $(window).trigger('scroll');
            },
            _render: function(el){
                $(el).css(cssObj.outerContainer);
                $('.put-up').css(cssObj.putUpButton);
            }
        } 
        return PutupFollow;
    }
})()