;(function(){
	var GPassword = {};
	if ( typeof define === "function" && define.amd ) {
	    define( 'GPassword', ['require', 'jquery'], function(require) {
	        factory(require('jquery'));
	        return GPassword;
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
		factory(require('jquery'))
		module.exports = GPassword;
	}else{
	    factory(window.jQuery);
	}
	function factory($){
		GPassword = function(el, opt){
			this.el = el;
			opt = opt ? opt : {};
			this.config = $.extend({}, {
				len: 6,
			}, opt);
			this.index = 0;
			$(el).addClass('g-pwd');
			this.init();
			this.unFocus();
		}
		GPassword.prototype = {
			init: function(){
				$(this.el).find('.g-pwd-item').removeClass('active');
				$(this.el).find('.g-pwd-item').eq(this.index).addClass('active');
			},
			setDefault: function(pwd){
				var pwdArr = pwd.split('');
				$(this.el).find('.g-pwd-item').each(function(i, item){
					if(typeof pwdArr[i] === 'undefined'){
						$(item).attr('data-pwd', '').html('');
					}else{
						$(item).attr('data-pwd', pwdArr[i]).html('*');
					}
				});
				this.index = pwdArr.length > this.config.len ? this.config.len : pwdArr.length;
				this.init();
			},
			focus: function(){
				this.init();
			},
			unFocus: function(){
				$(this.el).find('.g-pwd-item').removeClass('active');
			},
			pwdInput: function(pwd){
				$(this.el).find('.g-pwd-item').eq(this.index).attr('data-pwd', pwd).html('*');
				this.index = this.index + 1;
				this.init();
			},
			pwdBack: function(){
				var index = this.index - 1;
				if(index >= this.config.len){
					index = this.config.len - 1;
				}
				if(index <= 0){
					index = 0;
				}
				$(this.el).find('.g-pwd-item').eq(index).attr('data-pwd', '').html('');
				this.index = index;
				this.init();
			},
			getPwd: function(){
				var finalArr = [];
				$(this.el).find('.g-pwd-item').each(function(i, item){
					finalArr.push($(item).attr('data-pwd'));
				});
				return finalArr.join('');
			}
		};

		window.GPassword = GPassword;
	}
})();