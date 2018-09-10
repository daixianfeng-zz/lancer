;(function(){
    var Accordion = {};
    if ( typeof define === "function" && define.amd ) {
        define( 'GAccordion', ['require', 'jquery'], function(require) {
            factory(require('jquery'));
            return Accordion;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'))
        module.exports = Accordion;
    }else{
        factory(window.jQuery);
    }
    var accordionList = [];
    var accordionFixed = false;
    function factory($){
        $.fn.extend({
            animateCss: function (animationName, callback) {
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                    $(this).removeClass('animated ' + animationName);
                    callback && callback();
                });
                return this;
            }
        });
        var AccordionItem = function(accordionObj, opt){
            opt = opt ? opt : {};
            this.config = $.extend({}, {
                bg: 'rgba(0,0,0,0.7)',
                leftContent: function(){
                    return accordionObj.getLevel();
                },
                onClose: function(){
                    return false;
                },
                onOpen: function(){
                    return false;
                }
            }, opt);
            this.init(accordionObj, this.config);
            return this;
        };
        AccordionItem.prototype = {
            init: function(accordionObj, config){
                this.level = accordionObj.setNewLevel(this);
                var $containerRoot = accordionObj.getContainer();
                var $el = $(config.el);
                var itemStr = '';
                itemStr += '<div id="accordion-'+config.id+'" class="accordion-item">';
                itemStr += '    <div class="accordion-left" style="background:'+config.bg+';"></div>';
                itemStr += '    <div class="accordion-content"></div>';
                itemStr += '</div>';
                var $itemContainer = $(itemStr);
                $itemContainer.find('.accordion-content').append($el.show());
                $itemContainer.find('.accordion-left').append(accordionObj.setLeftTips(config.leftContent));
                $itemContainer.animateCss('slideInRight');
                $containerRoot.append($itemContainer);
                this.$el = $el;
                this.$container = $itemContainer;
                this.accordionObj = accordionObj;
                this._setCss(accordionObj, config);
                this._event();
            },
            _setCss: function(accordionObj, config){
                var leftPos = this.level * accordionObj.getLeftWidth();
                var contentBg = config.bg;
                var itemWidth = accordionObj.$container.width() - this.level * accordionObj.getLeftWidth();
                var contentWidth = accordionObj.$container.width() - (this.level+1) * accordionObj.getLeftWidth();
                var itemHeight = accordionObj.$container.outerHeight();
                this.$container.css({
                    left: leftPos,
                    width: itemWidth,
                    height: itemHeight,
                    zIndex: this.level+1
                });
                this.$container.find('.accordion-left').css({
                    width: accordionObj.getLeftWidth(),
                    height: itemHeight
                });
                this.$container.find('.accordion-content').css({
                    width: contentWidth,
                    height: itemHeight
                });
            },
            _event: function(){
                var self = this;
                this.$container.find('.accordion-left').on('click', function(e){
                    if(!$(e.target).hasClass('accordion-tips')){
                        self.accordionObj.close(self.level);
                    }
                });
                if(this.config.closeBtn){
                    $(this.config.closeBtn).on('click', function(){
                        self.accordionObj.close(self.level);
                    });
                }
            },
            resize: function(){
                this._setCss(this.accordionObj, this.config);
            },
            destroy: function(){
                var self = this;
                this.$container.animateCss('slideOutRight', function(){
                    self.$el.hide().appendTo($('body'));
                    self.$container.remove();
                    if(self.level === 0){
                        self.accordionObj.$container.empty().hide();
                    }
                }).show();
            },
            onOpen: function(){
                this.config.onOpen && this.config.onOpen();
            },
            onClose: function(){
                this.config.onClose && this.config.onClose();
            }
        };


        Accordion = function(el, opt){
            var self = this;
            opt = opt ? opt : {};
            this.config = $.extend({}, {
                rootClass: '',
                onClose: function(){
                    return false;
                },
                onOpen: function(){
                    return false;
                }
            }, opt);
            if(accordionFixed && this.config.position === 'fixed'){
                return accordionFixed;
            }
            this.initAccordion(el, this.config);
            return this;
        };
        Accordion.prototype = {
            initAccordion: function(el, config){
                var $container = $('<div id="'+config.id+'" class="accordion-root '+config.rootClass+'"></div>');
                $(el).append($container);
                if(config.position === 'fixed'){
                    $container.css('position', 'fixed');
                    this.position = 'fixed';
                    accordionFixed = this;
                }else{
                    $container.width($(el).outerWidth());
                    $container.height($(el).outerHeight());
                    this.position = 'absolute';
                }
                this.$el = $(el);
                this.$container = $container;
                this.leftWidth = config.leftWidth;
                this.level = [];
                this._event();
            },
            _event: function(){
                var self = this;
                if(self.config.position === 'fixed'){
                    $(window).on('resize', function(){
                        self.resize();
                    });
                }
            },
            getLeftWidth: function(){
                return this.$container.find('.accordion-left').outerWidth();
            },
            getContainer: function(){
                return this.$container;
            },
            getLevel: function(){
                return this.level.length-1;
            },
            setNewLevel: function(accordionItem){
                this.level.push(accordionItem);
                return this.level.length-1;
            },
            pushItem: function(item){
                this.level.push(item);
            },
            close: function(level){
                var lastAccordion= {};
                if(typeof level === 'undefined'){
                    lastAccordion = this.level.pop();
                    lastAccordion.destroy();
                }else{
                    level = +level > 0 ? +level : 0;
                    while(this.level.length > level){
                        lastAccordion = this.level.pop();
                        lastAccordion.onClose();
                        lastAccordion.destroy();
                        lastAccordion = null;
                    }
                }
            },
            resize: function(){
                var $el = this.$el;
                if(this.config.position !== 'fixed'){
                    this.$container.width($el.outerWidth());
                    this.$container.height($el.outerHeight());
                }
                $.each(this.level, function(i, v){
                    v.resize();
                });
            },
            add: function(itemConfig){
                var newItem = new AccordionItem(this, itemConfig);
                if(this.level.length > 0){
                    this.$container.show();
                }
                newItem.onOpen();
                this.resize();
            },
            setLeftTips: function(content){
                var tips = '';
                if(typeof content === 'string'){
                    tips = content;
                }else{
                    tips = content();
                }
                var $leftTips = $('<span class="accordion-tips"><i class="left-tips-top"></i><strong>'+tips+'</strong><i class="left-tips-bottom"></i></span>');
                return $leftTips;
            }
        }
        window.GAccordion = Accordion;
    };
})();