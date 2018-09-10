;(function(){    
    var AjaxValidate = function(){};
    if ( typeof define === "function" && define.amd ) {
        define( 'GAjaxValidate', ['require', 'jquery', 'G', 'gValidate', 'gTips'], function(require) {
            factory(require('jquery'), require('G'), require('gValidate'), require('gTips'));
            return AjaxValidate;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('G'), require('gValidate'), require('gTips'));
        module.exports = AjaxValidate;
    }else{
        factory(window.jQuery, window.G, window.gValidate, window.gTips);
    }
    function factory($, G, gValidate, gTips){
        AjaxValidate = function(config){
            this.init(config);
            this.timeoutIndex = 0;
            return this;
        };

        AjaxValidate.prototype = {
            init: function(config){
                this.constData = $.extend({}, {cipher: 1}, config.constData || {});
                this.data = {};
                this.form = config.form || {};
                this.url = config.url || '';
                this.type = config.type || 'get';
                this.dataType = config.dataType || 'json';
                self.ajaxSwitch = false;
                this.validator = {};
                this.enterToSubmit = config.enterToSubmit || false;
                for(var param in config.form){
                    if(!config.form[param].name){
                        config.form[param].name = '';
                    }
                    this.validator[param] = config.form[param].validator;
                }
                config.successTip && (this.successTip = config.successTip);
                config.failTip && (this.failTip = config.failTip);
                config.onComplete && (this.onComplete = config.onComplete);
                this.changeValidate();
            },
            successTip: function(data){
                gTips.success('操作成功');
                if(data.redirectUrl){
                    setTimeout(function(){
                        document.location.href = redirectUrl;
                    }, 0);
                }
            },
            failTip: function(info, el){
                gTips.error(info, el);
            },
            onComplete: function(resultData){
                return ;
            },
            changeValidate: function(){
                var self = this;
                $.each(this.form, function(param, item){
                    var name = item.name;
                    var jValue = $(item.valueArea);
                    var jTip = item.tipArea;
                    var formatter = item.formatter;
                    var validator = item.validator;
                    if(jValue && self.enterToSubmit){
                        jValue.on('keyup', '', function(e){
                            if(e.keyCode === 13 || e.keyCode === 108){
                                self.submit();
                            }
                        });
                    }
                    if(!jValue.hasClass('disabled') && validator && jTip){
                        var res = true;
                        jValue.on('change', '', function(){
                            var tmpValue = jValue.val();
                            if(formatter){
                                tmpValue = formatter(jValue.val());
                            }
                            if(validator instanceof Function){
                                res = validator(tmpValue);
                            }else{
                                res = gValidate.judge(tmpValue, validator);
                            }
                            
                            if(res === true){
                                self.failTip('', jTip);
                            }else if(typeof res === 'string'){
                                self.failTip(name + res, jTip);
                            }else{
                                self.failTip(res[0] + name + res[1], jTip);
                            }
                        });
                    }
                });
            },
            singleValidate: function(param, value){
                if(this.validator[param]){
                    return this.validator[param](value);
                }else{
                    return true;
                }
            },
            submit: function(attachData){
                var self = this;
                this.ajaxSwitch || (this.fontValidate() && this.endValidate(attachData));
            },
            fontValidate: function(){
                var self = this;
                var res = true;
                this.data = {};
                $.each(this.form, function(param, item){
                    var name = item.name;
                    var jValue = $(item.valueArea);
                    var jTip = item.tipArea;
                    var validator = item.validator;
                    var formatter = item.formatter;
                    var preposter = item.preposter;
                    var jValidateArr = item.validateArea;
                    if(formatter){
                        self.data[param] = formatter(jValue.val());
                    }else{
                        self.data[param] = jValue.val();
                    }
                    if(!jValue.hasClass('disabled') && jValue.is(':visible') && validator){
                        if(validator instanceof Function){
                            res = validator(self.data[param]);
                        }else{
                            res = gValidate.judge(self.data[param], validator);
                        }
                        if(res !== true && typeof res === 'string'){
                            self.failTip(name + res, jTip);
                            return false;
                        }else if(res !== true){
                            self.failTip(res[0] + name + res[1], jTip);
                            return false;
                        }
                    }
                    if(preposter){
                        self.data[param] = preposter(self.data[param]);
                    }
                });
                return res === true;
            },
            endValidate: function(attachData){
                var self = this;
                attachData = attachData || {};
                var submitData = $.extend({}, self.constData, attachData, self.data);
                self.ajaxSwitch = true;
                $.ajax({
                    url: self.url,
                    type: self.type,
                    data: submitData,
                    dataType: self.dataType,
                    success: function(result){
                        var info = {};
                        if(G.apiError(result, info)){
                            self.successTip(result.data);
                        }else{
                            self.failTip(info);
                        }
                        if(self.onComplete){
                            self.onComplete((result.data || {}));
                        }
                    },
                    error: function(){
                        self.failTip('服务器异常，请稍后再试！');
                    },
                    complete: function(){
                        self.ajaxSwitch = false;
                    },
                    statusCode: {
                        403: function(){
                            if(AjaxValidate.hook403){
                                AjaxValidate.hook403();
                            }
                        }
                    }
                });
            }
        };
        window.GAjaxValidate = AjaxValidate;
    }
})();