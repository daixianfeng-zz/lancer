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
        var cssObj = {
            //最外层div
            //navListContainer: {
            //},
            //外层UL
            navList: {
                position: 'fixed',
                listStyle: 'none',
                padding: '0',
                margin: '0',
                lineHeight: '24px'
            },
            // 内层UL
            navSubList: {
                listStyle: 'none',
                padding: '0',
                margin: '0',
                textIndent: '2em'
            },
            // 底层撑起框样式
            supportBlock: {
                float: 'left',
            }
        }; 
        var defaultConfig = {
            content: [{title: '列表一', link: 'javascript.void(0)',sub: [{title:'Number1',link: 'javascript.void(0)'},{title:'Number2',link: 'javascript.void(0)'},{title:'Number3',link: 'javascript.void(0)'},{title:'Number4',link: 'javascript.void(0)'}]}, {title:'列表二', link: 'javascript.void(0)', sub: [{title:'queue1',link: 'javascript.void(0)'},{title:'queue2',link: 'javascript.void(0)'},{title:'queue3',link: 'javascript.void(0)'},{title:'queue4',link: 'javascript.void(0)'}]}, {title:'列表三', link: 'javascript.void(0)', sub: [{title:'the1',link: 'javascript.void(0)'},{title:'the2',link: 'javascript.void(0)'},{title:'the3',link: 'javascript.void(0)'},{title:'the4',link: 'javascript.void(0)'}]},{title:'列表四', link: 'javascript.void(0)', sub: null},{title:'列表五', link: 'javascript.void(0)', sub: null},{title:'列表六', link: 'javascript.void(0)', sub: null}],
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
                })
                $('.nav-list').append(navListHtml);
            },
            init: function(el, conf){
                this._render();
                this.rePosition();
            },
            rePosition: function(){
                var conf = this.conf;
                var el = this.el;
                // $('.nav-list-container').css(cssObj.navListContainer);
                $('.nav-list').css(cssObj.navList);
                $('.nav-sub-list').css(cssObj.navSubList);

                $('.nav-list-container').append('<div class="support-block"></div>');
                $('.support-block').css(cssObj.supportBlock);
                $('.support-block').width($('.nav-list').width()+parseInt(conf.fixedNav.distance));
                $('.support-block').height($('.nav-list').height());

                if(conf.fixedNav.position == 'right'){
                    $('.nav-list').css('right', conf.fixedNav.distance+'px');
                    $(el).css('float', 'right');
                    $('.support-block').css('float', 'right');
                }else{
                    $('.nav-list').css('left', conf.fixedNav.distance+'px');    
                }

                $(window).on('resize', function(){
                    $('.nav-list').css('position', $('.nav-list').height()>$(window).height() ? 'absolute':'fixed');   
                });
                $(window).trigger('resize');
            }
        };  
        return NavVer;
    }
})();