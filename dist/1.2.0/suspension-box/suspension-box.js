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
                event: 'click',//mouse/click
                closeBtn: false,
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
                    this._delegate(el, box, conf, conf.el);
                }else{
                    this._event(el, box, conf);
                }
            },
            _event: function(el, box, conf){
                $(box).hide();
                var event = conf.event;
                this._view(el, box, conf, '');
                      
            },
            _delegate: function(parent, box, conf, children){
                $(box).hide();
                var event = conf.event;
                this._view(parent, box, conf, children);
            },
            _view: function(parent, box, conf, children){
                var self = this;
                if(conf.closeBtn){
                    $(conf.closeBtn).on('click', function(){
                        self.hide();
                    });
                }
                if(conf.event === 'click'){
                    parent.on('click', children, function(){
                        $(box).is(':visible') ? self.hide() : self.show();
                        return false;
                    });   
                    $(document).on('click', function(e){
                        $(box).is(':visible') && $(box).hide();
                    });
                    $(document).on('click', box, function(e){
                        return false;
                    });
                }else if(conf.event == 'mouse'){
                    parent.on('mouseenter', children, function(e){
                        self.show();
                        return false;
                    }).on('mouseleave', children, function(e){
                        if(isInRect($(box), e)){
                            return false;
                        }
                        self.hide();
                        return false;
                    });
                    $(document).on('mouseleave', box, function(e){
                        self.hide();
                        return false;
                    });
                }
            },
            _render: function(el, box, conf){
                var offsetTop = parseInt(conf.position.top);                
                var offsetLeft = parseInt(conf.position.left);
                $(el).css('position','relative');
                $(box).css('position','absolute')
                        .css({'height':conf.style.height, 'width':conf.style.width})
                        .css('top',offsetTop ).css('left',offsetLeft);
            },
            _renderFollow: function(parent, $curEl, box, conf){
                var offsetTop = parseInt(conf.position.top);                
                var offsetLeft = parseInt(conf.position.left);
                $curEl.css('position','relative');
                $(box).css('position','absolute')
                        .css({'height':conf.style.height, 'width':conf.style.width})
                        .css('top',offsetTop ).css('left',offsetLeft);
            },
            show: function(){
                if(this.conf.el){
                    this._renderFollow(this.el, $(this.conf.el), this.box, this.conf);
                }else{
                    this._render(this.el, this.box, this.conf);
                }
                $(this.box).show();
            },
            hide: function(){
                $(this.box).hide();
            }
        };
        function isInRect(rect, pointer){
            var x1 = rect.offset()['left'];
            var y1 = rect.offset()['top'];
            var x2 = x1 + rect.outerWidth();
            var y2 = y1 + rect.outerHeight();
            return pointer.pageX >= x1 && pointer.pageX <= x2 && pointer.pageY >= y1 && pointer.pageY <= y2;
        }
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