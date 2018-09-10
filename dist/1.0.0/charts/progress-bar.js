;(function(){
    if ( typeof define === "function" && define.amd ) {
        define( 'gProgressBar', ['require', 'jquery'], function(require) {
            factory(require('jquery'));
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'));
    }else{
        factory(window.jQuery);
    }
    function factory($){
        $.fn.gProgressBar = function(progressConfig){
            $(this).each(function(i, el){
                var precentage = (+$(el).attr('data-progress')*100).toFixed(2);
                var num = +precentage ? Math.floor(+precentage * 3.6) : 0;
                num = num > 360 ? 360 : num;
                if(!$(el).hasClass('progress-done')){
                    var innerStr = '';
                    innerStr += '<div class="pie_left">';
                    innerStr += '    <div class="left"></div>';
                    innerStr += '</div>';
                    innerStr += '<div class="pie_right">';
                    innerStr += '    <div class="right"></div>';
                    innerStr += '</div>';
                    innerStr += '<div class="inner-center"></div>';
                    $(el).prepend(innerStr);
                }
                if (num<=180) {
                    $(el).find('.right').css('transform', "rotate(" + num + "deg)");
                } else {
                    $(el).find('.right').css('transform', "rotate(180deg)");
                    $(el).find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
                };
                $(el).addClass('progress-done');
            })
        }
    }
})();