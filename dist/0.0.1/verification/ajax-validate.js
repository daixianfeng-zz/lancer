;(function(){    
    var AjaxValidate = function(){};
    if ( typeof define === "function" && define.amd ) {
        define( 'GAjaxValidate', ['require', 'jquery', 'G', 'gValidate', 'gDialog', 'gWebDialog'], function(require) {
            factory(require('jquery'), require('G'), require('gValidate'), require('gDialog'), require('gWebDialog'));
            return AjaxValidate;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('G'), require('gValidate'), require('gDialog'), require('gWebDialog'));
        module.exports = AjaxValidate;
    }else{
        factory(window.jQuery, window.G, window.gValidate, window.gDialog, window.gWebDialog);
    }
    function factory($, G, gValidate, gDialog, gWebDialog){
        if(!G.UA()['isMobile']){
            gDialog = gWebDialog;
        }
        AjaxValidate = function(config){
            this.init(config);
            this.timeoutIndex = 0;
            return this;
        };

        AjaxValidate.prototype = {
            init: function(config){
                this.constData = $.extend({}, {cipher: 1}, config.constData || {});
                this.data = {};
                this.form = config.form;
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
                gDialog.gAlert('操作成功');
                if(data.redirectUrl){
                    setTimeout(function(){
                        document.location.href = redirectUrl;
                    }, 0);
                }
            },
            failTip: function(info, el){
                var errorInfo = {};
                if(typeof info === 'object'){
                    errorInfo = info;
                }else{
                    errorInfo.message = info;
                }
                if(el){
                    clearTimeout(this.timeoutIndex);
                    $(el).removeClass('tips-success').addClass('tips-alert').html(errorInfo.message).fadeOut().fadeIn('slow');
                    this.timeoutIndex = setTimeout(function(){
                       $(el).html('');
                   }, 5000);
                }else{
                    gDialog.gAlert(errorInfo.message);
                }
            },
            onComplete: function(resultData){
                return ;
            },
            changeValidate: function(){
                var self = this;
                for(var param in this.form){
                    var name = this.form[param].name;
                    var jValue = $(this.form[param].valueArea);
                    var jTip = this.form[param].tipArea;
                    var formatter = this.form[param].formatter;
                    var validator = this.form[param].validator;
                    if(!jValue.hasClass('disabled')){
                        (function(validator, formatter, jValue, jTip){
                            if(jValue && self.enterToSubmit){
                                jValue.on('keyup', '', function(e){
                                    if(e.keyCode === 13 || e.keyCode === 108){
                                        self.submit();
                                    }
                                });
                            }
                            if(validator && jTip){
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
                                        jTip.removeClass('alert').html('');
                                    }else if(typeof res === 'string'){
                                        jTip.addClass('alert').html(name + res);
                                    }else{
                                        jTip.addClass('alert').html(res[0] + name + res[1]);
                                    }
                                });
                            }
                        })(validator, formatter, jValue, jTip)
                    }
                }
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
                this.ajaxSwitch || (this.fontValidate() && this.endValidate(attachData, self.successTip));
            },
            fontValidate: function(){
                var res = true;
                this.data = {};
                for(var param in this.form){
                    var name = this.form[param].name;
                    var jValue = $(this.form[param].valueArea);
                    var jTip = this.form[param].tipArea;
                    var validator = this.form[param].validator;
                    var formatter = this.form[param].formatter;
                    var preposter = this.form[param].preposter;
                    var jValidateArr = this.form[param].validateArea;
                    if(formatter){
                        this.data[param] = formatter(jValue.val());
                    }else{
                        this.data[param] = jValue.val();
                    }
                    if(!jValue.hasClass('disabled') && jValue.is(':visible')){
                        if(validator){
                            if(validator instanceof Function){
                                res = validator(this.data[param]);
                            }else{
                                res = gValidate.judge(this.data[param], validator);
                            }
                            if(res !== true && typeof res === 'string'){
                                this.failTip(name + res, jTip);
                                return false;
                            }else if(res !== true){
                                this.failTip(res[0] + name + res[1], jTip);
                                return false;
                            }
                        }
                    }
                    if(preposter){
                        this.data[param] = preposter(this.data[param]);
                    }
                }
                return true;
            },
            endValidate: function(attachData, callback){
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
                            if(callback){
                                callback(result.data);
                            }
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
                    }
                });
            }
        };
        window.GAjaxValidate = AjaxValidate;
    }
})();