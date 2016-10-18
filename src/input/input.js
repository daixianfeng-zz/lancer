;(function(){
	var gInput = {};
	if ( typeof define === "function" && define.amd ) {
	    define( 'gInput', ['require', 'jquery', 'G'], function(require) {
	        factory(require('jquery'), require('G'));
	        return gInput;
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
		factory(require('jquery'), require('G'))
		module.exports = gInput;
	}else{
	    factory(window.jQuery, window.G);
	}
	function factory($, G){
		var gInputPlugin = function(opt){
			opt = opt ? opt : {};
			var config = $.extend({}, {
				parentSelector: '.form-row',
				clearSelector: '.txt-clear',
				pwdToggleSelector: '.txt-toggle',
				maxLength: 30
			}, opt);
			this.each(function(i, el){
				var self = el;
				var $row = $(self).closest(config.parentSelector);
				var $clearBtn = $row.find(config.clearSelector);
				var $pwdToggleBtn = $row.find(config.pwdToggleSelector);
				$(self).on('keyup', function(e){
					if($(self).val().length > 0){
						$clearBtn.show();
					}else{
						$clearBtn.hide();
					}
					if($(self).val().length > config.maxLength){
						var cutText = $(self).val().substr(0, config.maxLength);
						$(self).val(cutText);
					}
				});
				$clearBtn.on('click', function(){
					if(!$(self).hasClass('disabled') || !$(self).attr('disabled')){
						$(self).val('');
						$clearBtn.hide();
						$(self).trigger('change');
						$(self).focus();
					}
				});
				$pwdToggleBtn.on('click', function(){
					if($(this).hasClass('txt-hide')){
						$pwdToggleBtn.addClass('txt-show').removeClass('txt-hide');
						$(self).attr('type', 'text');
					}else{
						$pwdToggleBtn.addClass('txt-hide').removeClass('txt-show');
						$(self).attr('type', 'password');
					}
				});
			});
			this.trigger('keyup');
		}
		var onMoneyInput = function(jInput, checkFn, inputFn){
			jInput.on('keydown', function(e){
				// not main-num && small-num && del && back && arrow
				if(!(e.keyCode <= 57 && e.keyCode >= 48) &&
				 !(e.keyCode <= 105 && e.keyCode >= 96) &&
				 !(e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 110 || e.keyCode === 190) &&
				 !(e.keyCode <=40 && e.keyCode >= 37)){
					return false;	
				}
			});
			jInput.on('keyup', function(e){
				var self = this;
				if(e.keyCode <=40 && e.keyCode >= 37){
					return true;	
				}
				var inputValue = G.moneyToNumber($(self).val());
				inputValue = inputValue ? inputValue : 0;
				inputFn && inputFn(inputValue);
			});
			jInput.on('change', function(e){
				var self = this;
				var tmpValue = G.moneyToNumber($(self).val());
				tmpValue = tmpValue ? tmpValue : 0;
				checkFn && checkFn(tmpValue);
				
				var tmpMoney = G.numberToMoney(tmpValue, 2);
				$(self).val(tmpMoney);
				$(this).trigger('keyup');
			});
			jInput.on('focus', function(e){
				this.focused = true;
				jInput.select();
				// safari mobile hack
				this.setSelectionRange && this.setSelectionRange(0, 9999);
				return false;
			});
			// safari hack
			jInput.on('mouseup touchend', function(e){
				if(this.focused){
					this.focused=false;
					return false;
				}
			});
		};
		var onBankcardInput = function(jInput, checkFn, inputFn){
			jInput.on('keyup', function(e){
				var self = this;
				$(self).val($(self).val().replace(/\D/g,'').replace(/....(?!$)/g,'$& '));
				var inputValue = $(self).val().replace(/\s/g, '');
				inputFn && inputFn(inputValue);
			});
			jInput.on('change', function(){
				var self = this;
				$(self).val($(self).val().replace(/\D/g,'').replace(/....(?!$)/g,'$& '));
				var inputValue = $(self).val().replace(/\s/g, '');
				checkFn && checkFn(inputValue);
			});
		};
		$.fn.extend({
			'gInput': gInputPlugin
		});
		gInput = {
			'onMoneyInput': onMoneyInput,
			'onBankcardInput': onBankcardInput
		};

		window.gInput = gInput;
	}
})();