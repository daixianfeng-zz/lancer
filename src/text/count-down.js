;(function(){
    var CountDown = {};
    if ( typeof define === "function" && define.amd ) {
        define( 'CountDown', ['require', 'jquery'], function(require) {
            factory(require('jquery'));
            return CountDown;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'));
        module.exports = CountDown;
    }else{
        factory(window.jQuery);
    }
    var countList = {};
    function factory($){
        CountDown = function(el, conf){
            conf = conf ? conf : {};
            this.config = $.extend({}, {
                autoCount: true,
                overText: '00 : 00 : 00',
                onOver: function(){
                    return false;
                },
                format: function(timeObj){
                    var remainStr = '';
                    if(days > 0){
                        remainStr += '<span class="strong">' + timeObj.days + '</span>天 ' + timeObj.hours + ' : ' + timeObj.minutes + ' : ' + timeObj.seconds + ' ';
                    }else{
                        remainStr += '' + timeObj.hours + ' : ' + timeObj.minutes + ' : ' + timeObj.seconds + ' ';
                    }
                }
            }, conf);
            this.initCount(el, this.config);
            if(countList[this.config.id]){
                countList[this.config.id].destory();
            }
            countList[this.config.id] = this;
            return this;
        };
        CountDown.prototype = {
            initCount: function(el, config){
                var self = this;
                this.el = el;
                var remainMs = parseInt(config.remainMs);
                this.remainMs = remainMs;
                var timeLeftStr = this.countDownFormat(remainMs);
                var content = $(el).html(timeLeftStr);
                if(config.autoCount){
                    this.start();
                }
            },
            start: function(){
                var self = this;
                if(this.countIndex || this.remainMs <= 0){
                    self.over();
                    return false;
                }
                this.countIndex = setInterval(function(){
                    self.remainMs -= 1000;
                    if(self.remainMs <= 0){
                        self.over();
                    }else{
                        var timeLeftStr = self.countDownFormat(self.remainMs);
                        $(self.el).html(timeLeftStr);
                    }
                }, 1000);
            },
            pause: function(){
                clearInterval(this.countIndex);
                this.countIndex = null;
            },
            setTimeLeft: function(timeLeft){
                this.remainMs  = remainMs;
            },
            over: function(){
                this.remainMs = -1;
                clearInterval(this.countIndex);
                this.countIndex = null;
                $(this.el).html(this.config.overText);
                this.config.onOver();
            },
            destory: function(){
                clearInterval(this.countIndex);
                this.countIndex = null;
                countList[this.config.id] = null;
            },
            countDownFormat: function(remainMs){
                var remainStr = '';
                var days = 0;
                var hours = 0;
                var minutes = 0;
                var seconds = 0;
                days = Math.floor(remainMs / (1000*3600*24));
                hours = Math.floor(remainMs / (1000*3600)) % 24;
                minutes = Math.floor(remainMs / (1000*60)) % 60;
                seconds = Math.floor(remainMs / (1000)) % 60;
                hours = ('00'+hours).slice(-2);
                minutes = ('00'+minutes).slice(-2);
                seconds = ('00'+seconds).slice(-2);
                remainStr = this.config.format({
                    days: days,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds,
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                });
                return remainStr;
            }
        };
        window.CountDown = CountDown;
    }
})();