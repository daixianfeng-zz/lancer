;(function(){
    if( typeof define === 'function' && define.amd){
        define( 'gSuspensionBox', ['require', 'jquery'], function(require){
            factory(require('jquery'));
        });
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'));
    }else {
        factory(window.jQuery);
    }
    
    function factory($){
        var SuspensionBox = function(el, box, conf){
            this.el = el;
            this.box = box;
            this.defaultConfig = {
                event: 'click',//mouseenter/click
                style: {'width':'50px','height':'100px'},
                position: {'left':'0', 'top':'0'}   
            };
            this.conf = $.extend({}, this.defaultConfig, conf);
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
                $(box).hide();
                var event = conf.event;
                var self = this;
                if(event == 'click') {
                    $(document).on('click', function(){
                        $(box).is(':visible') && $(box).hide();
                    });
                    $(box).on('click', function(){
                        $(box).show();
                        return false; //阻止冒泡事件
                    });
                }else if(event == 'mouseenter'){
                    $(el).on('mouseleave', function(){
                        $(box).hide();  
                        return false; 
                    });
                    $(box).on('mouseenter',function(){
                        $(box).show();
                        return false;
                    });
                    $(box).on('mouseleave',function(){
                        $(box).hide();
                    });
                }
                $(el).on(event, function(){
                    $(box).toggle();
                    self._render(el, box, conf);                 
                    return false;
                });         
            },
            _render: function(el, box, conf){
                var offsetTop = parseInt(conf.position.top);                
                var offsetLeft = parseInt(conf.position.left);
                var positionTop = $(el).offset().top + $(el).height() + offsetTop;
                var positionLeft = $(el).offset().left + offsetLeft; 
                $(el).css('position','relative');
                $(box).css('position','absolute')
                        .css({'height':conf.style.height, 'width':conf.style.width})
                        .css('top',positionTop ).css('left',positionLeft);
            }
        };
        /*
        $.fn.gSuspensionBox = function(box, conf){
            var gSuspensionBox = new SuspensionBox(this, box, conf);
            return gSuspensionBox.init();  
        }*/
        $.fn.extend({
            gSuspensionBox: function(box, conf){
                this.each(function(i, el){
                    var gSuspensionBox  = new SuspensionBox($(el), box, conf);
                    gSuspensionBox.init();
                });
                return this;
            }
        });

        // 实例方式
        return SuspensionBox;
    }
    
    
})();