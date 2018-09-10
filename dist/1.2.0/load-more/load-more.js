;(function() {
    if (typeof define === 'function' && define.amd) {
        define('GLoadMore', ['require', 'jquery', 'iscroll'], function(require) {
            return factory(require('jquery'), require('iscroll'));
        });
    } else if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(require('jquery'), require('iscroll'))
    } else {
        window.GLoadmore = factory(window.jQuery, window.iscroll);
    }

    function factory($, iScroll) {
        var passiveSupported = false;
        try {
        var options = Object.defineProperty({}, "passive", {
            get: function() {
            passiveSupported = true;
            }
        });

        window.addEventListener("test", null, options);
        } catch(err) {}
    
        var cssObj = {};
        var defaultConfig = {
            pageContent: {
                perpage: '5',
                page: '1'
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
                },
                '5': {
                    status: 4,
                    className: 'all',
                    text: '没有更多了'
                }
            },
            upSpring: true,
            canUp: true,
            canDown: true,
            downFresh: false,
            freshWithClear: true,
            getBlockData: function(el) {
                var innerScroll = '';
                    innerScroll = '<div class="scroller">';
                    innerScroll +=     '<div class="pullDown">';
                    innerScroll +=         '<span class="pullDownIcon"></span>';
                    innerScroll +=         '<span class="pullDownLabel">下拉刷新...</span>';
                    innerScroll +=     '</div>';
                    innerScroll +=     '<div class="init-data"></div>';
                    innerScroll +=     '<div class="pullUp">';
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
            iScrollOpt: {}
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
                this.page = +conf.pageContent.page;
                this.perpage = +conf.pageContent.perpage;
                this.pullDownOffset = $(this.el).find('.pullDown').get(0).offsetHeight;
                this.pullUpOffset = $(this.el).find('.pullUp').get(0).offsetHeight;
                this.pullUpOffsetInner = conf.upOffsetInner || $(this.el).find('.pullUp').get(0).offsetHeight || 50;
                var iScrollOpt = $.extend({}, this.conf.iScrollOpt, {probeType: 3});
                if(conf.canUp && conf.upSpring === false){
                    iScrollOpt.bonuce = false;
                }
                this.myScroll = new iScroll(this.el, iScrollOpt);
                this.pullDownStatus = 1;
                this.pullUpStatus = 1;
                var self = this;
                if(conf.canDown){
                    this.myScroll.on('scroll', function(){ self._onScrollDownEvent(this); });
                    this.myScroll.on('scrollEnd', function(){ self._onScrollEndDownEvent(this); });
                }
                if(conf.canUp && conf.upSpring === false){
                    this.myScroll.on('scroll', function(){ self._onScrollUpEventOnly(this); });
                }else if(conf.canUp){
                    this.myScroll.on('scroll', function(){ self._onScrollUpEvent(this); });
                    this.myScroll.on('scrollEnd', function(){ self._onScrollEndUpEvent(this); });
                }
                conf.getInitData($(this.el).find('.init-data'), function(){
                    self.page += 1;
                    self.myScroll.refresh();    
                });
                this.perventFunc = function(e) {
                    e.preventDefault();
                };
                document.addEventListener('touchmove', this.perventFunc, passiveSupported ? { passive: false } : false);
            },
            destroy: function(){
                this.myScroll.destroy();
                this.myScroll = null;
                document.removeEventListener('touchmove', this.perventFunc, passiveSupported ? { passive: false } : false);
            },
            _onScrollEvent: function(scroll){
                this._onScrollDownEvent(scroll);
                this._onScrollUpEvent(scroll);
            },
            _onScrollDownEvent: function(scroll){
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
            },
            _onScrollUpEvent: function(scroll){
                var self = this;
                if(self.pullUpStatus === 5){
                    return;
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
            _onScrollEndEvent: function(scroll){
                _onScrollEndDownEvent(scroll);
                _onScrollEndUpEvent(scroll);
            },
            _onScrollEndDownEvent: function(scroll){
                var self = this;
                var el = self.el;
                var conf = self.conf;
                if (scroll.y > -1 && scroll.startY > self.pullDownOffset && self.pullDownStatus === 3) {
                    self._setStatus('pullDown', 4);
                    self.pullDownStatus = 4;
                    if(conf.downFresh){
                        self.loadFresh();
                    }else{
                        self.loadDown();
                    }
                } else if (self.pullDownStatus === 3) {
                    self._setStatus('pullDown', 1);
                    self.pullDownStatus = 1;
                }
            },
            _onScrollEndUpEvent: function(scroll){
                var self = this;
                var el = self.el;
                var conf = self.conf;
                if (scroll.y < (scroll.maxScrollY + 1) && scroll.startY < scroll.maxScrollY - self.pullUpOffset && self.pullUpStatus === 3) {
                    self._setStatus('pullUp', 4);
                    self.pullUpStatus = 4;
                    self.loadUp();
                } else if (self.pullUpStatus === 3) {
                    self._setStatus('pullUp', 1);
                    self.pullUpStatus = 1;
                }
            },
            _onScrollUpEventOnly: function(scroll){
                var self = this;
                var el = self.el;
                var conf = self.conf;
                if(self.pullUpStatus === 5){
                    return;
                }
                if (scroll.y > (scroll.maxScrollY + self.pullUpOffsetInner) && self.pullUpStatus <= 2) {
                    self._setStatus('pullUp', 1);
                } else if (scroll.y < (scroll.maxScrollY + self.pullUpOffsetInner) && self.pullUpStatus <= 2) {
                    self._setStatus('pullUp', 4);
                    self.pullUpStatus = 4;
                    self.loadUp();
                } else {
                    return;
                }
            },
            _setStatus: function(direction, state) {
                var conf = this.conf;
                var result = null;
                if (direction === 'pullDown') {
                    result = conf.pullDownState[state];
                    $(this.el).find('.pullDown').attr('class', 'pullDown '+result.className);
                    $(this.el).find('.pullDownLabel').html(result.text);
                    this.pullDownStatus = state;
                } else {
                    result = conf.pullUpState[state];
                    $(this.el).find('.pullUp').attr('class', 'pullUp '+result.className);
                    $(this.el).find('.pullUpLabel').html(result.text);
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
            },
            _pullUpAgain: function(){
                this.page = 1;
                if (this.pullUpStatus === 5) {
                    this._setStatus('pullUp', 0);
                    this.pullUpStatus = 0;
                }
            },
            loadUp: function(callback){
                var self = this;
                var el = self.el;
                var scroll = self.myScroll;
                this.conf.getPullUpData(el, self.page, self.perpage, function(isAll){
                    self._scrollRefresh();
                    scroll.refresh(); 
                    self.page++;
                    if(isAll){
                        self._setStatus('pullUp', 5);
                        self.pullUpStatus = 5;
                    }
                    if(callback){
                        callback();
                    }
                });
            },
            loadDown: function(callback){
                var self = this;
                var el = self.el;
                var scroll = self.myScroll;
                this.conf.getPullDownData($(this.el).find('.init-data'), function(){
                    self._scrollRefresh();
                    scroll.refresh();
                    if(callback){
                        callback();
                    }
                });
            },
            loadFresh: function(callback){
                var self = this;
                var el = self.el;
                var scroll = self.myScroll;
                this.conf.getInitData($(this.el).find('.init-data'), function(){
                    self._scrollRefresh();
                    if(self.conf.freshWithClear){
                        self._pullUpAgain();
                    }
                    scroll.refresh();
                    self.page = 2;
                    if(callback){
                        callback();
                    }
                });
            }
        }
        return LoadMore;
    }
})()