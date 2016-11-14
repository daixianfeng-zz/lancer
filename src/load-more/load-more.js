;
(function() {
    if (typeof define === 'function' && define.amd) {
        define('GLoadMore', ['require', 'jquery', 'G', 'iscroll'], function(require) {
            return factory(require('jquery'), require('G'), require('iscroll'));
        });
    } else if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(require('jquery'), require('G'), require('iscroll'))
    } else {
        window.GLoadmore = factory(window.jQuery, window.G, window.iscroll);
    }

    function factory($, G, iScroll) {
        var cssObj = {};
        var defaultConfig = {
            pageContent: {
                perpage: '5',
                page: '1'
            },
            conditions: {
                'perpage': 5,
                'page': 1
            },
            pullDownState: {
                '0': {
                    status: 0,
                    className: 'success',
                    text: '刷新成功'
                },
                '1': {
                    status: 1,
                    className: '',
                    text: '下拉刷新...'
                },
                '2': {
                    status: 2,
                    className: '',
                    text: '继续下拉刷新...'
                },
                '3': {
                    status: 3,
                    className: 'flip',
                    text: '松手开始更新...'
                },
                '4': {
                    status: 4,
                    className: 'loading',
                    text: '加载中...'
                }
            },
            pullUpState: {
                '0': {
                    status: 0,
                    className: 'success',
                    text: '加载成功'
                },
                '1': {
                    status: 1,
                    className: '',
                    text: '上拉加载更多...'
                },
                '2': {
                    status: 2,
                    className: '',
                    text: '继续上拉加载更多...'
                },
                '3': {
                    status: 3,
                    className: 'flip',
                    text: '松手加载更多...'
                },
                '4': {
                    status: 4,
                    className: 'loading',
                    text: '加载中...'
                }
            },
            getBlockData: function(el) {
                var innerScroll = '';
                var innerScroll = '<div id="scroller">';
                    innerScroll +=     '<div id="pullDown">';
                    innerScroll +=         '<span class="pullDownIcon"></span>';
                    innerScroll +=         '<span class="pullDownLabel">下拉刷新...</span>';
                    innerScroll +=     '</div>';
                    innerScroll +=     '<div class="init-data"></div>';
                    innerScroll +=     '<div id="pullUp">';
                    innerScroll +=         '<span class="pullUpIcon"></span>';
                    innerScroll +=         '<span class="pullUpLabel">上拉加载更多...</span>';
                    innerScroll +=     '</div>'
                    innerScroll += '</div>';
                $(el).html(innerScroll);
            },
            getInitData: function(){
                var innerContent = '';
                return innerContent;
            },
        };
        var LoadMore = function(el, conf) {
            this.el = el;
            this.conf = $.extend({}, defaultConfig, conf);
            this.conf.getBlockData(this.el);
            this.init();
            return this;
        }
        LoadMore.prototype = {
            init: function() {
                var conf = this.conf;
                this.page = conf.pageContent.page;
                this.perpage = conf.pageContent.perpage;
                this.pullDownOffset = $('#pullDown').get(0).offsetHeight;
                this.pullUpOffset = $('#pullUp').get(0).offsetHeight;
                this.myScroll = new iScroll('#wrapper', {
                    probeType: 3
                });
                this.pullDownStatus = 1;
                this.pullUpStatus = 1;
                var self = this;
                this.myScroll.on('scroll', function(){ self._onScrollEvent(this); });
                this.myScroll.on('scrollEnd', function(){ self._onscrollEndEvent(this); });
                conf.getInitData($('.init-data'), function(){
                    self.myScroll.refresh();    
                });
                document.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                }, false);
            },
            _onScrollEvent: function(scroll){
                var self = this;
                if (scroll.y < 1 && self.pullDownStatus <= 2) {
                    self._setStatus('pullDown', 1);
                } else if (scroll.y > 1 && self.pullDownStatus === 1) {
                    self._setStatus('pullDown', 2);
                } else if (scroll.y > self.pullDownOffset && self.pullDownStatus <= 2) {
                    self._setStatus('pullDown', 3);
                } else if (scroll.startY < self.pullDownOffset && self.pullDownStatus === 3) {
                    self._setStatus('pullDown', 2);
                }
                if (scroll.y > (scroll.maxScrollY - 1) && self.pullUpStatus <= 2) {
                    self._setStatus('pullUp', 1);
                } else if (scroll.y < (scroll.maxScrollY - 1) && self.pullUpStatus === 1) {
                    self._setStatus('pullUp', 2);
                } else if (scroll.y < (scroll.maxScrollY - self.pullUpOffset) && self.pullUpStatus <= 2) {
                    self._setStatus('pullUp', 3);
                } else if (scroll.startY < scroll.maxScrollY && scroll.startY > scroll.maxScrollY - self.pullUpOffset && self.pullUpStatus === 3) {
                    self._setStatus('pullUp', 2);
                }
            },
            _onscrollEndEvent: function(scroll){
                var self = this;
                var el = self.el;
                var conf = self.conf;
                if (scroll.y > -1 && scroll.startY > self.pullDownOffset && self.pullDownStatus === 3) {
                    self._setStatus('pullDown', 4);
                    self.pullDownStatus = 4;
                    conf.getPullDownData(el, function(){
                        self._scrollRefresh();
                        scroll.refresh();
                    });
                } else if (self.pullDownStatus === 3) {
                    self._setStatus('pullDown', 1);
                    self.pullDownStatus = 1;
                }
                if (scroll.y < (scroll.maxScrollY + 1) && scroll.startY < scroll.maxScrollY - self.pullUpOffset && self.pullUpStatus === 3) {
                    self._setStatus('pullUp', 4);
                    self.pullUpStatus = 4;
                    self._scrollRefresh();
                    conf.getPullUpData(el, self.page, self.perpage, function(){
                        self._scrollRefresh();
                        scroll.refresh(); 
                        self.page++;  
                    });
                } else if (self.pullUpStatus === 3) {
                    self._setStatus('pullUp', 1);
                    self.pullUpStatus = 1;
                }
            },
            _setStatus: function(direction, state) {
                var conf = this.conf;
                var result = null;
                if (direction === 'pullDown') {
                    result = conf.pullDownState[state];
                    $('#pullDown').attr('class', result.className);
                    $('.pullDownLabel').html(result.text);
                    this.pullDownStatus = state;
                } else {
                    result = conf.pullUpState[state];
                    $('#pullUp').attr('class', result.className);
                    $('.pullUpLabel').html(result.text);
                    this.pullUpStatus = state;
                }
            },
            _scrollRefresh: function(){
                if (this.pullDownStatus === 4) {
                    this._setStatus('pullDown', 0);
                    this.pullDownStatus = 0;
                } else if (this.pullUpStatus === 4) {
                    this._setStatus('pullUp', 0);
                    this.pullUpStatus = 0;
                }    
            }
        }
        return LoadMore;
    }
})()