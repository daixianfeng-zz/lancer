;(function(){
    if ( typeof define === "function" && define.amd ) {
        define( 'GNavVer', ['require', 'jquery'], function(require) {
            return factory(require('jquery'));
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(require('jquery'))
    }else{
        window.GNavVer = factory(window.jQuery);
    }
    function factory($){
        var defaultConfig = {
            content: [],
            fixedNav: { position: 'left', distance: '0'}        
        };
        var NavVer = function(el, conf){
            this.el = el;
            this.conf = $.extend({}, defaultConfig, conf);
            this.init();
        };
        NavVer.prototype = {
            _render: function(){
                var el = this.el;
                var conf = this.conf;
                $(el).append('<div class="nav-list-container"><ul class="nav-list"></ul></div>');
                var navListHtml ='';
                $.each(conf.content, function(index, item){
                    var navSubList ='';
                    var navSubListHtml ='';
                    if(item.sub){
                        $.each(item.sub, function(i, itemSub){
                            navSubList += '<li><a href="'+itemSub.link+'">'+itemSub.title+'</a></li>'    
                        });
                        navSubListHtml = '<ul class="nav-sub-list">'+navSubList+'</ul>';            
                    }
                    navListHtml += '<li><a href="'+item.link+'"">'+item.title+'</a>'+navSubListHtml+'</li>';
                });
                $(el).find('.nav-list').append(navListHtml);
            },
            init: function(el, conf){
                this._render();
                this._renderStyle();
                this._rePosition();
            },
            _renderStyle: function(){
                var conf = this.conf;
                var el = this.el;
                $(el).find('.nav-list').css('position','fixed');
                $(el).find('.nav-list-container').css('position','relative');
                if(conf.fixedNav.position == 'right'){
                    $(el).find('.nav-list-container').append('<div class="support-block-right"></div>');
                    $(el).find('.nav-list').css('right', conf.fixedNav.distance+'px');
                    $(el).css('float', 'right');
                    $(el).find('.support-block-right').css('float', 'right');
                }else{
                    $(el).find('.nav-list-container').append('<div class="support-block-left"></div>');
                    $(el).find('.nav-list').css('left', conf.fixedNav.distance+'px'); 
                    $(el).css('float', 'left');   
                }
                $(el).find('[class^=support-block]').width($(el).find('.nav-list').width()+parseInt(conf.fixedNav.distance));
                $(el).find('[class^=support-block]').height($(el).find('.nav-list').height());
            },
            _rePosition: function(){
                var el = this.el;
                $(window).on('resize', function(){
                    $(el).find('.nav-list').css('position', $(el).find('.nav-list').height()>$(window).height() ? 'absolute':'fixed');   
                 });
                 $(window).trigger('resize');
            }
        };  
        return NavVer;
    }
})();