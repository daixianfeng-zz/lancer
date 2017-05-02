;(function(){
    if( typeof define === 'function' && define.amd){
        define( 'GSuspensionBox', ['require', 'jquery'], function(require){
            return factory(require('jquery'));
        });
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(require('jquery'));
    }else {
        window.GSuspensionBox = factory(window.jQuery);
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
                if(conf.el){
                    this._delegate(el, conf.el, box, conf);
                }else{
                    this._event(el, box, conf);
                }
                
            },
            _event: function(el, box, conf){
                $(box).hide();
                var event = conf.event;
                var self = this;
                if(event === 'click') {
                    $(document).on('click', function(e){
                        if( $(e.target).closest(box).length>0 ){
                            return false;
                        }
                        $(box).is(':visible') && $(box).hide();
                    });
                }else if(event === 'mouseenter'){
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
                    // $(box).show();
                    self._render(this, box, conf);                 
                    return false;
                });         
            },
            _delegate: function(parent, el, box, conf){
                $(box).hide();
                var event = conf.event;
                var self = this;
                if(event == 'click') {
                    $(document).on('click', function(){
                        $(box).is(':visible') && $(box).hide();
                    });
                    $(parent).on('click', box, function(){
                        $(box).show();
                        return false; //阻止冒泡事件
                    });
                }else if(event == 'mouseenter'){
                    $(parent).on('mouseleave', el, function(){
                        $(box).hide();  
                        return false; 
                    });
                    $(parent).on('mouseenter', box, function(){
                        $(box).show();
                        return false;
                    });
                    $(parent).on('mouseleave', box, function(){
                        $(box).hide();
                    });
                }
                $(parent).on(event, el, function(){
                    $(box).toggle();
                    var $curEl = $(this);
                    self._renderFollow(parent, $curEl, box, conf);                 
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
            },
            _renderFollow: function(parent, $curEl, box, conf){
                var offsetTop = parseInt(conf.position.top);                
                var offsetLeft = parseInt(conf.position.left);
                var positionTop = $curEl.offset().top + $curEl.height() + offsetTop;
                var positionLeft = $curEl.offset().left + offsetLeft; 
                $curEl.css('position','relative');
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
            },
            gSuspensionBoxDelegate: function(el, box, conf){
                this.each(function(i, parent){
                    conf.el = el;
                    var gSuspensionBoxDelegate  = new SuspensionBox($(parent), box, conf);
                    gSuspensionBoxDelegate.init();
                });
                return this;
            }
        });

        // 实例方式
        return SuspensionBox;
    }
    
    
})();