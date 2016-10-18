;(function(){
    if ( typeof define === "function" && define.amd ) {
        define( 'GNav', ['require', 'jquery'], function(require) {
            return factory(require('jquery'));
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(require('jquery'))
    }else{
        window.GNav = factory(window.jQuery);
    }
    function factory($){
        var cssObj = {
            // 每个a的样式
            listItem: {
                display: 'block',
                position: 'relative'
            },
            navListLi: {
                position: 'relative',
                float: 'left'
            },
            // 图标样式
            brandImg :{
                float: 'left'
            },
            navListUlRight: {
                float: 'right'
            },
            //最外层包含框不吸顶
            navListContainerStatic: {
                position: 'relative'
            },
            // 最外层包含框--吸顶
            navListContainerFixed: {
                position: 'fixed'
            },
            //下拉列表三角图标
            dropIcon: {
                display: 'inline-block',
                width: '0',
                height: '0',
                border: '6px solid transparent',
                borderTop: '6px solid #0f0'
            },

            //子列表样式
            //UL
            subNavListUl: {
                display: 'none',
                position: 'absolute',
                top: '0',
                left: '0',
                padding: '0'
            },
            subNavListUlLink: {
                display: 'block',
                padding: '5px 10px'
            }
        };

        var defaultConfig = {
            imgUrl: ' aaa ',
            listItemHoverClass: 'g-nav-hover',
            ceilingFixed: 'false',
            ceilingConfig: { position:'top', distance:'20'},
            // content: [
            //     {title: '光合', link: 'javascript.void(0)', sub:[{title:'列表一'}, {title:'列表二'}], icon: ''},
            //     {title: '关于我们', link: 'javascript.void(0)', sub: null, icon: ''},
            //     {title: '帮助中心', link: 'javascript.void(0)', sub: null, icon: ''}
            // ]
        };
        var Nav = function(el, config){
            this.conf = $.extend({}, defaultConfig, config);
            this.el = el;
            this.initNav();
            return this;
        };
        Nav.prototype = {
            _render: function(content, imgUrl){
                var conf = this.conf;
                var el = this.el;
                if(!conf.imgUrl){
                    $(el).append('<div class="nav-list-container"><ul class="nav-list"></ul></div>');
                }else {
                    $(el).append('<div class="nav-list-container"><div class="brand-img"><img src="'+conf.imgUrl+'"/></div><ul class="nav-list"></ul></div>');    
                    $('.nav-list').css(cssObj.navListUlRight);
                    $('.brand-img').css(cssObj.brandImg);
                }
                var navList = '';
                $.each(conf.content, function(index, item){
                    var iconHtml = '';
                    var subList= '';
                    var subIconHtml = '';
                    var subListHtml = '';
                    if(item.icon){
                        iconHtml = '<i class="icon"></i>'; 
                    }
                    if(item.sub){
        
                        $.each(item.sub, function(i, subItem){
                            subList += '<li><a class="inner-link" href="'+subItem.link+'">'+subItem.title+'</a></li>';
                        });
                        subIconHtml = '<strong class="drop-icon"></strong>';
                        subListHtml = '<ul class="sub-nav-list">'+subList+'</ul>'
                    }
                    navList += '<li class="nav-list-li"><a class="outer-link" href="'+item.link+'">'+iconHtml+item.title+subIconHtml+'</a>'+subListHtml+'</li>'; 
                });

                $('.nav-list').append(navList);
            },
            _event: function(){
                var el = this.el;
                var conf = this.conf;
                $('.nav-list-li').on('mouseenter', function(){
                    $(this).children('.outer-link').addClass('active');
                    if($(this).find('.sub-nav-list').length == 1){
                        $('.sub-nav-list').show();
                    }
                }).on('mouseleave', function(){    
                    if($(this).find('.sub-nav-list').length == 1){
                       $('.sub-nav-list').hide();  
                    }else{
                        $(this).children('.outer-link').removeClass('active');
                    } 
                    $(this).children('.outer-link').removeClass('active');
                });
                $('.sub-nav-list').on('mouseenter', function(){
                    $(this).closest('.nav-list-li').find('.outer-link').addClass(conf.listItemHoverClass);
                    $('.sub-nav-list').show();   
                }).on('mouseleave', function(){
                    $('.sub-nav-list').hide();
                    $(this).closest('.nav-list-li').find('.outer-link').removeClass(conf.listItemHoverClass);  
                });
            },
            _bindFixed: function(){
                var el = this.el;
                var conf = this.conf;
                if(conf.ceilingFixed == 'true'){
                    if(conf.ceilingConfig.position === 'top'){
                        $(window).on('scroll', function(){
                            if($(el).offset().top - $(window).scrollTop() <= conf.ceilingConfig.distance ){
                                $(el).css(cssObj.navListContainerFixed);
                                $(el).css('top', conf.ceilingConfig.distance + 'px');
                                $('.sub-nav-list').css('top', $('.nav-list-li').height()); 
                                var emptyHeight = $(el).height();
                                if($('#support-block').length === 0){
                                    $(el).append('<div id="support-block"></div>').css('height',emptyHeight);                            
                                }
                            }else {
                                $('#support-block').remove();
                                $(el).css(cssObj.navListContainerStatic);
                                $(el).css('top', 0); 
                            }        
                        }) 
                    }else if(conf.ceilingConfig.position === 'bottom'){
                        $(el).css(cssObj.navListContainerFixed);
                        $(el).css('bottom' ,conf.ceilingConfig.distance + 'px');
                        $('.sub-nav-list').css('top', -$('.sub-nav-list').height());               
                    }
                } 
            },
            initNav: function(){
                var el = this.el;
                var conf = this.conf;
                if(conf.content) {
                    this._render(conf.content, conf.imgUrl);
                }else {
                    $(el+' > div').addClass('nav-list-container');
                    $('.nav-list-container > ul').addClass('nav-list');
                    if($(el).find('.brand-img').length > 0){   
                        $('.nav-list').css(cssObj.navListUlRight);
                        $('.brand-img').css(cssObj.brandImg);        
                    };
                    $('.nav-list >li').addClass('nav-list-li');
                    $('.nav-list-li>a').addClass('outer-link');
                    $('.nav-list-li>ul').addClass('sub-nav-list');
                    $('.sub-nav-list>li>a').addClass('inner-link');
                    $('.outer-link>i').addClass('icon');
                    $('.outer-link>strong').addClass('drop-icon');
                };
                
                this._event();
                this.rePosition();
                this._bindFixed();
            },
            rePosition: function(){
                var el = this.el;
                $('.nav-list-container').css(cssObj.navListContainerStatic);
                $(window).on('resize', function(){
                   $('.nav-list-container').css('width',$(el).width());
                });
                $(window).trigger('resize'); 
                $('.nav-list-li').css(cssObj.navListLi);       
                $('.nav-list .outer-link').css(cssObj.listItem);
                $('.drop-icon').css(cssObj.dropIcon);  
                $('.sub-nav-list').css(cssObj.subNavListUl);  
                $('.inner-link').css(cssObj.subNavListUlLink);   
                $('.sub-nav-list').css('top', $('.nav-list-li').height()); 
                $('.sub-nav-list').css('width', $('.sub-nav-list').closest('.nav-list-li').width());
            }
        };
        return Nav;
    }
})();