;(function(){	
	var Verification = function(){};
	if ( typeof define === "function" && define.amd ) {
	    define( 'GVerification', ['require', 'jquery', 'G', 'gValidate', 'gTips'], function(require) {
	        factory(require('jquery'), require('G'), require('gValidate'), require('gTips'));
	        return Verification;
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('G'), require('gValidate'), require('gTips'))
        module.exports = Verification;
    }else{
	    factory(window.jQuery, window.G, window.gValidate, window.gTips);
	}
	function factory($, G, gValidate, gTips){
		var defaultConfig = {
			resendSecond: 60,
			clickStart: true,
			sendUrl: '',
			phoneParam: 'cellphone',
			captchaParam: 'captcha',
			oriText: '点击获取',
			runText: '再次获取 ',
			successTip: '验证码已经发送，请查收！',
			errorTip: '',
			sendData: {},
			isCellphoneJudge: true,
			isCaptchaJudge: false
		}
		Verification = function(config){
			this.config = $.extend({}, defaultConfig, config);
			this.codeInterval = 0;
			this.init();
			return this;
		}
		Verification.prototype = {
			init: function(){
				var self = this;
				self.config.runSecond = self.config.resendSecond;
				self.config.btnArea.on('click', function(){
					self.send();
					return false;
				});
			},
			getData: function(){
				if(this.config.getData instanceof Function){
					return this.config.getData();
				}else{
					return {};
				}
			},
			_send: function(data){
				var self = this;
				if(self.config.btnArea.hasClass('disabled')){
					return false;
				}
				var res = true;
				if(self.config.isCellphoneJudge){
					var cellphone = data[self.config.phoneParam];
					res = gValidate.judgeCellphone(cellphone);
				}
				if(res !== true){
					gTips.error('请输入正确的手机号码', self.config.tipArea);
					return false;
				}
				if(self.config.isCaptchaJudge){
					var captcha = data[self.config.captchaParam];
					if(!captcha){
						res = false;
					}
				}
				if(res !== true){
					gTips.error('请输入图片验证码', self.config.tipArea);
					return false;
				}
				if(res === true){
					self.config.btnArea.addClass('disabled');
					$.ajax({
						url: self.config.sendUrl,
						type: 'post',
						data: data,
						dataType: 'json',
						success: function(result){
							var info = {};
							if(G.apiError(result, info)){
								startTiming(self);
								gTips.success('验证码已经发送，请查收！', self.config.tipArea);
								if(self.config.onSuccess instanceof Function){
									self.config.onSuccess(result.data);
								}
							}else{
								gTips.error(info.message, self.config.tipArea);
								
								self.config.btnArea.removeClass('disabled');
								if(self.config.isCaptchaJudge){
									self.config.refreshCaptcha();
								}
								if(self.config.onError instanceof Function){
									self.config.onError(result.data);
								}
							}
						},
						error: function(){
							self.config.btnArea.removeClass('disabled');
							if(self.config.onError instanceof Function){
								self.config.onError({});
							}
						}
					});
				}
				return false;
			},
			reset: function(){
				this.config.runSecond = 0;
			},
			start: function(){
				this.config.btnArea.addClass('disabled');
				startTiming(this);
			},
			send: function(){
				var self = this;
				if(self.config.isCellphoneJudge){
					var cellphone = self.config.cellphoneArea.val();
					self.config.sendData[self.config.phoneParam] = cellphone;
				}
				if(self.config.isCaptchaJudge){
					var captcha = self.config.captchaArea.val();
					self.config.sendData[self.config.captchaParam] = captcha;
				}
				if(self.getData() === false){
					return false;
				}
				if(self.config.clickStart){
					self._send($.extend({}, self.config.sendData, self.getData()));
				}
			}
		};
		var timeoutIndex = 0;

		function startTiming(codeObj){
			codeObj.config.runSecond = codeObj.config.resendSecond;
			codeObj.config.btnArea.html(codeObj.config.runText + codeObj.config.runSecond +'s');
			clearInterval(codeObj.codeInterval);
			codeObj.codeInterval = setInterval(function(){
				codeObj.config.btnArea.html(codeObj.config.runText + codeObj.config.runSecond + 's');
				codeObj.config.runSecond -= 1;
				if(codeObj.config.runSecond < 0){
					codeObj.config.btnArea.html(codeObj.config.oriText);
					codeObj.config.btnArea.removeClass('disabled');
					codeObj.config.runSecond = codeObj.config.resendSecond;
					clearInterval(codeObj.codeInterval);
				}
			}, 1000);
		}
	    window.GVerification = Verification;
	}
})();