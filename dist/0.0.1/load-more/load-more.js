;(function(){
    if ( typeof define === 'function' && define.amd ){
        define( 'GLoadMore', ['require', 'jquery', 'G'], function(require){
            return factory(require('jquery'),require('G'));
        });
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(require('jquery'), require('G'))
    }else{
        window.GLoadmore = factory(window.jQuery,window.G);
    }
    function factory($ ,G){
        var cssObj = {};
        var defaultConfig = {
            conditions: {'perpage':5, 'page':1},
            scrollView: {'element': 'window', 'height':100},//document/window
            getData: function(conditions, callback){
                $.ajax({
                    url: '/loadmore/loadmore.json',
                    data: conditions,
                    dataType: 'json',
                    type: 'post',
                    success: function(result){
                        var info = {};
                        if(G.apiError(result, info)){
                            callback(result.data.dataList);                                                           
                        }                      
                    }     
                });
            },
            render: function(el, dataList){
                var copy = '';
                $.each(dataList, function(index, value){
                    copy += '<li>'+value+'</li>'
                }); 
                $(el).append(copy);    
            }
        };
        var LoadMore = function(btn, el, conf){
            this.btn = btn;
            this.el = el;
            this.conf = $.extend({}, defaultConfig, conf);
            this.init();
            return this;
        }
        LoadMore.prototype = {
            init: function(){
                var page = 1;
                var el = this.el;
                var btn = this.btn;
                var conf = this.conf;
                conf.conditions.page = 1;
                var loadNum = conf.loadNum;
                this._chooseViewElement(btn, el, conf);       
            },
            _chooseViewElement: function(btn, el, conf){
                var viewElement =  conf.scrollView.element ? conf.scrollView.element : 'window'; 
                var innerElement = (viewElement == 'window') ? document : el; 
                if(viewElement != 'window'){
                    $(viewElement).css({'height': conf.scrollView.height ,'overflow-y': 'scroll'});
                }else {
                    viewElement = window;  
                }
                this._event(btn, el, conf, viewElement,innerElement);   
            },
            _event: function(btn, el, conf, viewElement, innerElement){
                $(btn).on('click', function(){  
                    conf.getData(conf.conditions,function(resultList){
                        conf.render(el, resultList);
                        conf.conditions.page ++;
                    });          
                    return false;
                });
                var eventSwitch = false;
                $(viewElement).on('scroll', function(){
                    var changeHeight = $(viewElement).height() +　$(viewElement).scrollTop();
                    if($(innerElement).height() - changeHeight <= 5 ){
                        if(eventSwitch){ 
                            return false;
                        } 
                        eventSwitch = true;
                        conf.getData(conf.conditions,function(resultList){                             
                            conf.render(el, resultList);
                            conf.conditions.page ++;
                            eventSwitch = false;
                        }); 
                    } 
                });
                $(viewElement).trigger('scroll');
            }
        } 
        return LoadMore;
    }
})()