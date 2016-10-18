;(function(){
    if( typeof define === 'function' && define.amd){
        define( 'gSuspensionBox', ['require', 'jquery'], function(require){
            factory(require('jquery'));
        });
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'));
    }else {
        factroy(window.jQuery);
    }
    /*
    function factory($){
        var cssObj = {
            outerStyle: {
                position: 'relative'
            },
            boxStyle: {        
                position: 'absolute',
                zIndex: 999999,
                background: '#fff',
                border: '1px solid #ddd'
            }
        };
        var defaultConfig = {
            event: 'mouseenter',//mouseenter/click
            style: {'width':'50px','height':'100px'},
            position: {'left':'0', 'top':'0'}
        };
        var SuspensionBox = function(el,box,conf){
            this.el = el;
            this.box = box;
            this.conf = $.extend({}, defaultConfig, conf);
            this.init();
            return this;
        };
        SuspensionBox.prototype = {
            init: function(){
                var el = this.el;
                var box = this.box;
                var conf = this.conf;
                this._event(el, box, conf);
            },
            _event: function(el, box, conf){
                var event = conf.event;
                var me = this;
                if(event == 'click') {
                    $(document).on('click', function(){
                        $(box).css('display')=='block' && $(box).css('display','none');
                    });
                    $(box).on('click', function(){
                        $(box).css('display','block');
                        return false; //阻止冒泡事件
                    });
                }else if(event == 'mouseenter'){
                    $(el).on('mouseleave', function(){
                        $(box).css('display','none');  
                        return false; 
                    });
                    $(box).on('mouseenter',function(){
                        $(box).css('display','block');
                        return false;
                    });
                    $(box).on('mouseleave',function(){
                        $(box).css('display','none');
                    })
                }
                $(el).on(event, function(){
                    $(box).css('display', $(box).css('display')=='none'?'block':'none');
                    me._render(el, box, conf);                 
                    return false;
                });         
            },
            _render: function(el, box, conf){
                var offsetTop = parseInt(conf.position.top);                
                var offsetLeft = parseInt(conf.position.left);
                var positionTop = $(el).offset().top + $(el).height() + offsetTop;
                var positionLeft = $(el).offset().left + offsetLeft; 
                $(el).css(cssObj.outerStyle);
                $(box).css({'height':conf.style.height, 'width':conf.style.width});
                $(box).css(cssObj.boxStyle).css('top',positionTop ).css('left',positionLeft);
            }
        };

        return SuspensionBox;
    }
    */
    
    
    function factory($){

        var cssObj = {
            outerStyle: {
                position: 'relative'
            },
            boxStyle: {        
                position: 'absolute',
                zIndex: 999999,
                background: '#fff',
                border: '1px solid #ddd'
            }
        };

        var SuspensionBox = function(el, box, conf){
            this.el = el;
            this.box = box;
            this.defaultConfig = {
                event: 'click',//mouseenter/click
                style: {'width':'50px','height':'100px'},
                position: {'left':'0', 'top':'0'}   
            }
            this.conf = $.extend({}, this.defaultConfig, conf);
            return this;
        }
        SuspensionBox.prototype = {
            init: function(){
                var el = this.el;
                var box = this.box;
                var conf = this.conf;
                this._event(el, box, conf);
            },
            _event: function(el, box, conf){
                var event = conf.event;
                var me = this;
                if(event == 'click') {
                    $(document).on('click', function(){
                        $(box).css('display')=='block' && $(box).css('display','none');
                    });
                    $(box).on('click', function(){
                        $(box).css('display','block');
                        return false; //阻止冒泡事件
                    });
                }else if(event == 'mouseenter'){
                    $(el).on('mouseleave', function(){
                        $(box).css('display','none');  
                        return false; 
                    });
                    $(box).on('mouseenter',function(){
                        $(box).css('display','block');
                        return false;
                    });
                    $(box).on('mouseleave',function(){
                        $(box).css('display','none');
                    })
                }
                $(el).on(event, function(){
                    $(box).css('display', $(box).css('display')=='none'?'block':'none');
                    me._render(el, box, conf);                 
                    return false;
                });         
            },
            _render: function(el, box, conf){
                var offsetTop = parseInt(conf.position.top);                
                var offsetLeft = parseInt(conf.position.left);
                var positionTop = $(el).offset().top + $(el).height() + offsetTop;
                var positionLeft = $(el).offset().left + offsetLeft; 
                $(el).css(cssObj.outerStyle);
                $(box).css({'height':conf.style.height, 'width':conf.style.width});
                $(box).css(cssObj.boxStyle).css('top',positionTop ).css('left',positionLeft);
            }
        };
        /*
        $.fn.gSuspensionBox = function(box, conf){
            var gSuspensionBox = new SuspensionBox(this, box, conf);
            return gSuspensionBox.init();  
        }*/
        $.fn.extend({gSuspensionBox: function(box, conf){
            var gSuspensionBox  = new SuspensionBox(this, box, conf);
            return gSuspensionBox.init(); }
        });
    }
    
    
})();