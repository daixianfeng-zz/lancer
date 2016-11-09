;
(function() {
	var Keyboard = {};
	if (typeof define === "function" && define.amd) {
		define('GKeyboard', ['require', 'jquery'], function(require) {
			factory(require('jquery'));
			return Keyboard;
		});
	} else if (typeof module === "object" && typeof module.exports === "object") {
		factory(require('jquery'));
		module.exports = Keyboard;
	} else {
		factory(window.jQuery);
	}

	function factory($, G) {
		var keyboardList = [];
		Keyboard = function(el, opt) {
			opt = opt ? opt : {};
			this.el = el;
			this.config = $.extend({}, {
				numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
				random: false,
				titleDisplay: 'none',
				btnClose: '关闭',
				btnBack: '后退',
				output: function(num) {
					console.log(num);
					return false;
				},
				back: function() {
					console.log('back');
					return false;
				},
				onClose: function() {
					return false;
				},
				onOpen: function() {
					return false;
				}
			}, opt);
			$(el).addClass('g-keyboard-outer');
			this.init(el, this.config);
			keyboardList.push(this);
			return this;
		};
		Keyboard.prototype = {
			_event: function() {
				var self = this;
				$(self.el).on('click', '.g-keyboard-num', function() {
					var num = $(this).attr('data-num');
					if (num) {
						self.config.output(num);
					} else if ($(this).hasClass('g-keyboard-back')) {
						self.config.back();
					} else if ($(this).hasClass('g-keyboard-close')) {
						self.close();
					}
					return false;
				});
				$(window).on('resize', function(){
					self.rePos();
				});
			},
			init: function() {
				var resultStr = '';
				resultStr += '<div class="g-keyboard">';
				resultStr += '	<div class="g-keyboard-container">';
				resultStr += '		<div class="g-keyboard-title" style="display:' + this.config.titleDisplay + ';">';
				resultStr += this.config.title;
				resultStr += '		</div>';
				resultStr += '		<div class="g-keyboard-content">';
				resultStr += this._renderKeyboard();
				resultStr += '		</div>';
				resultStr += '	</div>';
				resultStr += '</div>';
				$(this.el).html(resultStr);
				this._event();
			},
			_renderKeyboard: function() {
				var numbers = [];
				if (this.config.random) {
					numbers = this.reSort(this.config.numbers);
				} else {
					numbers = this.config.numbers;
				}
				var numbersStr = '';
				for (var i = 0; i < numbers.length; i++) {
					if (i < numbers.length - 1) {
						numbersStr += '<span class="g-keyboard-num" data-num="' + numbers[i] + '">' + numbers[i] + '</span>';
					} else {
						numbersStr += '<span class="g-keyboard-num g-keyboard-last"' + numbers[i] + '>' + numbers[i] + '</span>';
					}
				}
				numbersStr += '<span class="g-keyboard-num g-keyboard-close">' + this.config.btnClose + '</span>';
				numbersStr += '<span class="g-keyboard-num g-keyboard-back">' + this.config.btnBack + '</span>';
				numbersStr += '<span class="clear"></span>';
				return numbersStr;
			},
			reSort: function(arr){
				var randomSort = function(a, b) {
					return Math.random() > 0.79 ? -1 : 1;
				}
				var finalArr = arr.sort(randomSort);
				return finalArr;
			},
			rePos: function(){
				var keyboardHeight = $(this.el).find('.g-keyboard').outerHeight();
				$(this.el).css('paddingBottom',keyboardHeight+'px');
			},
			open: function() {
				$(this.el).show();
				this.rePos();
				this.config.onOpen();
			},
			close: function() {
				$(this.el).hide();
				$(this.el).css('paddingBottom','0');
				this.config.onClose();
			}
		}
		window.GKeyboard = Keyboard;
	};
})();