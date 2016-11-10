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
            getInitData: function(el) {
                $.ajax({
                    url: '/example/json/load_morefirst.json',
                    data: defaultConfig.conditions,
                    dataType: 'json',
                    type: 'get',
                    success: function(result) {
                        var innerContent = '';
                        if (result.data.dataList) {
                            $.each(result.data.dataList, function(index, value) {
                                innerContent += '<li>' + value + '</li>';
                            });
                            innerContent = '<ul>' + innerContent + '</ul>';
                        }
                        var innerScroll = '<div id="scroller">' +
                            '<div id="pullDown">' +
                            '<span class="pullDownIcon"></span>' +
                            '<span class="pullDownLabel">下拉刷新...</span>' +
                            '</div>' +
                            innerContent +
                            '<div id="pullUp">' +
                            '<span class="pullUpIcon"></span>' +
                            '<span class="pullUpLabel">上拉加载更多...</span>' +
                            '</div>'
                        '</div>';
                        $(el).html(innerScroll);
                    }
                });
            },
            getPullDownData: function(el, myScroll, callback) { //下拉刷新
                setTimeout(function() {
                    $.ajax({
                        url: '/example/json/load_more.json',
                        data: defaultConfig.conditions,
                        dataType: 'json',
                        type: 'get',
                        success: function(result) {
                            var info = {};
                            var copy = '';
                            if (G.apiError(result, info)) {
                                $.each(result.data.dataList, function(index, value) {
                                    copy += '<li>' + value + '</li>'
                                });
                                $(el).find('ul').prepend(copy);
                                myScroll.refresh();
                                callback && callback();
                            }
                        }
                    });
                }, 1000);
            },
            getPullUpData: function(el, myScroll, callback) { //上拉加载更多
                setTimeout(function() {
                    $.ajax({
                        url: '/example/json/load_more.json',
                        data: defaultConfig.conditions,
                        dataType: 'json',
                        type: 'get',
                        success: function(result) {
                            var info = {};
                            var copy = '';
                            if (G.apiError(result, info)) {
                                $.each(result.data.dataList, function(index, value) {
                                    copy += '<li>' + value + '</li>'
                                });
                                $(el).find('ul').append(copy);
                                myScroll.refresh();
                                callback && callback();
                            }
                        }
                    });
                }, 1000);
            }
        };
        var LoadMore = function(el, conf) {
            this.el = el;
            this.conf = $.extend({}, defaultConfig, conf);
            this.conf.getInitData(el);
            var self = this;
            setTimeout(function() {
                self.init()
            }, 1000);
            return this;
        }
        LoadMore.prototype = {
            init: function() {
                var page = 1;
                var el = this.el;
                var conf = this.conf;
                conf.conditions.page = 1;
                var loadNum = conf.loadNum;
                var pullDownEl = $('#pullDown');
                var pullDownOffset = pullDownEl.get(0).offsetHeight;
                var pullUpEl = $('#pullUp');
                var pullUpOffset = pullUpEl.get(0).offsetHeight;
                var myScroll = new iScroll('#wrapper', {
                    //mouseWheel: true,
                    probeType: 3
                });
                var self = this;
                this.pullDownStatus = 1;
                this.pullUpStatus = 1;
                var onScrollEvent = function() {
                    if (this.y < 1 && self.pullDownStatus <= 2) {
                        self._setStatus('pullDown', 1);
                    } else if (this.y > 1 && self.pullDownStatus === 1) {
                        self._setStatus('pullDown', 2);
                    } else if (this.y > pullDownOffset && self.pullDownStatus <= 2) {
                        self._setStatus('pullDown', 3);
                    } else if (this.startY < pullDownOffset && self.pullDownStatus === 3) {
                        self._setStatus('pullDown', 2);
                    }
                    if (this.y > (this.maxScrollY - 1) && self.pullUpStatus <= 2) {
                        self._setStatus('pullUp', 1);
                    } else if (this.y < (this.maxScrollY - 1) && self.pullUpStatus === 1) {
                        self._setStatus('pullUp', 2);
                    } else if (this.y < (this.maxScrollY - pullUpOffset) && self.pullUpStatus <= 2) {
                        self._setStatus('pullUp', 3);
                    } else if (this.startY < this.maxScrollY && this.startY > this.maxScrollY - pullUpOffset && self.pullUpStatus === 3) {
                        self._setStatus('pullUp', 2);
                    }
                }
                var scrollEndEvent = function() {
                    if (this.y > -1 && this.startY > pullDownOffset && self.pullDownStatus === 3) {
                        self._setStatus('pullDown', 4);
                        self.pullDownStatus = 4;
                        conf.getPullDownData(el, myScroll, scrollRefresh);
                    } else if (self.pullDownStatus === 3) {
                        self._setStatus('pullDown', 1);
                        self.pullDownStatus = 1;
                    }
                    if (this.y < (this.maxScrollY + 1) && this.startY < this.maxScrollY - pullUpOffset && self.pullUpStatus === 3) {
                        self._setStatus('pullUp', 4);
                        self.pullUpStatus = 4;
                        conf.getPullUpData(el, myScroll, scrollRefresh);
                    } else if (self.pullUpStatus === 3) {
                        self._setStatus('pullUp', 1);
                        self.pullUpStatus = 1;
                    }
                }
                var scrollRefresh = function() {
                    if (self.pullDownStatus === 4) {
                        self._setStatus('pullDown', 0);
                        self.pullDownStatus = 0;
                    } else if (self.pullUpStatus === 4) {
                        self._setStatus('pullUp', 0);
                        self.pullUpStatus = 0;
                    }
                }
                myScroll.on('scroll', onScrollEvent);
                myScroll.on('scrollEnd', scrollEndEvent);
                document.addEventListener('touchmove', function(e) {
                    e.preventDefault();
                }, false);
            },
            _setStatus: function(state, i) {
                var conf = this.conf;
                var result = null;
                if (state === 'pullDown') {
                    result = conf.pullDownState[i];
                    $('#pullDown').attr('class', result.className);
                    $('.pullDownLabel').html(result.text);
                    this.pullDownStatus = i;
                } else {
                    result = conf.pullUpState[i];
                    $('#pullUp').attr('class', result.className);
                    $('.pullUpLabel').html(result.text);
                    this.pullUpStatus = i;
                }
            }
        }
        return LoadMore;
    }
})()