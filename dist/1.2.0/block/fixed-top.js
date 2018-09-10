;(function(){
    if ( typeof define === "function" && define.amd ) {
        define( 'gFixedTop', ['require', 'jquery'], function(require) {
            factory(require('jquery'));
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'));
    }else{
        factory(window.jQuery);
    }
    function factory($){
        var defaultConfig = {position: 'fixed'};
        var triggers = [];
        $.fn.gFixedTop = function(options) {
            if(!$(this).data('cloneArea')){
                var $cloneArea = $(this).clone(false).attr('id', 'fix-clone-'+triggers.length).hide().insertAfter($(this));
                $(this).data('cloneArea', 'fix-clone-'+triggers.length);
            }
            options = $.extend({}, defaultConfig, options);
            $(this).data('fixedOptions', options);

            oriGPS($(this));
            triggers.push($(this));
            windowScroll();
            return $(this);
        };
        var init = function(){
            if (triggers.length === 0) {
                return;
            }
            for (var i = 0; i < triggers.length; i++) {
                var $t = triggers[i];
                $t.insertBefore($('#'+$t.data('cloneArea')));
                $t.css({
                    'position' : '',
                    'left': '',
                    'top': '',
                    'right': '',
                    'bottom': ''
                });
                oriGPS($t);
                var oriPos = getPosInfo($t);
            }
        };
        
        function oriGPS($ori){
            var oriPos = getPosInfo($ori);
            var positionOri = {
                top: oriPos.offsetTop,
                left: oriPos.offsetLeft,
                bottom: oriPos.offsetBottom,
                right: oriPos.offsetRight
            };
            var cssOri = {
                'position' : 'absolute',
                'left': oriPos.offsetLeft + 'px',
                'top': oriPos.offsetTop + 'px',
                'right': 'auto',
                'bottom': 'auto'
            };
            $ori.data('cssOri', cssOri);
            $ori.data('positionOri', positionOri);
            $('body').append($ori);
            $ori.css(cssOri);
        };
        function windowScroll() {
            if (triggers.length === 0) {
                return;
            }
            for (var i = 0; i < triggers.length; i++) {
                var $t = triggers[i];
                var opt = $t.data("fixedOptions");
                var cssOri = $t.data("cssOri");
                var positionOri = $t.data("positionOri");
                
                var curPos = getPosInfo($t);

                if(opt.position === 'absolute'){
                    if(opt.topEnd){
                        var top = (curPos.scrollY + opt.topEnd) < positionOri.top ? positionOri.top : curPos.scrollY + opt.topEnd;
                        $t.css({
                            'position': 'absolute',
                            'top': top + 'px'
                        });
                    } 
                }
                if(opt.position === 'fixed'){
                    var isFloat = false;
                    var isBottom = false;
                    var pTop = cssOri.top;

                    if(opt.topEnd){
                        isFloat = (curPos.scrollY + opt.topEnd) < positionOri.top ? false : true;
                        pTop = opt.topEnd + 'px';
                        if(isFloat){
                            $t.css({
                                'position': 'fixed',
                                'top': pTop,
                                'bottom': 'auto'
                            }); 
                        }
                    }
                    if(opt.bottomEnd){
                        isBottom = (curPos.scrollY + opt.topEnd + curPos.outHeight) < curPos.documentY - opt.bottomEnd ? false : true;
                        pTop = curPos.documentY - opt.bottomEnd - curPos.outHeight + 'px';
                        if(isBottom){
                            $t.css({
                                'position': 'absolute',
                                'top': pTop,
                                'bottom': 'auto'
                            }); 
                        }
                    }
                    if(!isFloat && !isBottom){
                         $t.css(cssOri);
                    }
                }
            }
        };
        function getPosInfo($block){
            var paddingLeft = $block.css('paddingLeft');
            var paddingRight = $block.css('paddingRight');
            var paddingTop = $block.css('paddingTop');
            var paddingBottom = $block.css('paddingBottom');
            var elWidth = $block.width();
            var elHeight = $block.height();
            var posInfo = {};

            posInfo.scrollY = $(window).scrollTop();
            posInfo.scrollX = $(window).scrollLeft();
            posInfo.viewY = $(window).height();
            posInfo.viewX = $(window).width();
            posInfo.documentY = $(document).height();
            posInfo.documentX = $(document).width();

            posInfo.outWidth = parseFloat(paddingLeft) + parseFloat(elWidth) + parseFloat(paddingRight);
            posInfo.outHeight = parseFloat(paddingTop) + parseFloat(elHeight) + parseFloat(paddingBottom);

            posInfo.elTop = $block.offset()['top'] - posInfo.scrollY;
            posInfo.elLeft = $block.offset()['left'] - posInfo.scrollX;
            posInfo.elBottom = posInfo.viewY - posInfo.outHeight - ($block.offset()['top'] - posInfo.scrollY);
            posInfo.elRight = posInfo.viewX - posInfo.outWidth - ($block.offset()['left'] - posInfo.scrollX);

            posInfo.offsetTop = $block.offset()['top'];
            posInfo.offsetLeft = $block.offset()['left'];
            posInfo.offsetBottom = posInfo.documentY - posInfo.offsetTop - posInfo.outHeight;
            posInfo.offsetRight = posInfo.documentX - posInfo.offsetLeft - posInfo.outWidth;

            return posInfo;
        }
        $(window).on('scroll', function(){
            windowScroll();
        });
        $(window).on('resize', function(){
            init();
            windowScroll();
        });
    };
})();