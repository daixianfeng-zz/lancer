;(function(){
	var Swiper = {};
	if ( typeof define === "function" && define.amd ) {
	    define( 'GSwiper', ['require', 'jquery', 'G'], function(require) {
	        factory(require('jquery'), require('G'));
	        return Swiper;
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('G'));
		module.exports = Swiper;
    }else{
	    factory(window.jQuery, window.G);
	}
	function factory($, G){
		var Swiper = function(el, opt){
			opt = opt ? opt : {};
			this.config = $.extend({}, {}, opt);
			this.initSwiper(el, this.config);
			return this;
		};
		Swiper.prototype = {
			_event: function(){
				var self = this;
				var $leftBtn = this.config.leftBtn;
				var $rightBtn = this.config.rightBtn;
				var $switchBtnArea = this.config.switchBtnArea;
				if($leftBtn){
					$leftBtn.on('click', function(){
						self.preContainer();
					});
				}
				if($rightBtn){
					$rightBtn.on('click', function(){
						self.nextContainer();
					});
				}
				if($switchBtnArea){
					$switchBtnArea.on('click', '.switch-btn:not(.active)', function(){
						var containerIndex = $(this).attr('data-index');
						self.toContainer(containerIndex);
					});
				}
			},
			_autoNext: function(){
				var self = this;
				self.autoSwitch = false;
				$(this.container).on('mouseenter', function(){
					self.autoSwitch = true;
				}).on('mouseleave', function(){
					self.autoSwitch = false;
				});
				if(self.config.switchBtnArea){
					self.config.switchBtnArea.on('mouseenter', function(){
						self.autoSwitch = true;
					}).on('mouseleave', function(){
						self.autoSwitch = false;
					});
				}
				setInterval(function(){
					if(self.autoSwitch){
						return false;
					}
					self.nextContainer();
				}, self.config.autoNext)
			},
			initSwiper: function(el, config){
				this.container = $(el);
				this.swiperIndex = 0;
				this.swiperNum = this.container.find('.'+config.itemClass).length;
				this.container.find('.'+config.itemClass).each(function(i, v){
					$(v).attr('data-index', i);
					if(i !== 0){
						$(v).hide();
					}else {
						$(v).show();
					}
					if(config.switchBtnArea){
						var switchClass = '';
						if(i === 0){
							switchClass = ' active';
						}
						$(config.switchBtnArea).append('<i class="switch-btn'+switchClass+'" data-index="'+i+'"></i>')
					}
				});
				this._event();
				if(config.autoNext){
					this._autoNext();
				}
			},
			preContainer: function(){
				var preIndex = this.swiperIndex - 1;
				if(preIndex < 0){
					preIndex %= this.swiperNum;
					preIndex += this.swiperNum;
					preIndex %= this.swiperNum;
				}
				var preContainer = this.container.find('.'+this.config.itemClass+'[data-index='+preIndex+']');
				this.container.find('.'+this.config.itemClass).fadeOut();
				preContainer.fadeIn();
				this.swiperIndex = preIndex;
				if(this.config.switchBtnArea){
					this.config.switchBtnArea.find('.switch-btn').removeClass('active');
					this.config.switchBtnArea.find('.switch-btn'+'[data-index='+preIndex+']').addClass('active');
				}
			},
			nextContainer: function(){
				var nextIndex = this.swiperIndex + 1;
				if(nextIndex >= this.swiperNum){
					nextIndex %= this.swiperNum;
				}
				var nextContainer = this.container.find('.'+this.config.itemClass+'[data-index='+nextIndex+']');
				this.container.find('.'+this.config.itemClass).fadeOut();
				nextContainer.fadeIn();
				this.swiperIndex = nextIndex;
				if(this.config.switchBtnArea){
					this.config.switchBtnArea.find('.switch-btn').removeClass('active');
					this.config.switchBtnArea.find('.switch-btn'+'[data-index='+nextIndex+']').addClass('active');
				}
			},
			toContainer: function(containerIndex){
				var toIndex = +containerIndex;
				if(toIndex >= this.swiperNum){
					toIndex %= this.swiperNum;
				}else if(toIndex < 0){
					toIndex %= this.swiperNum;
					toIndex += this.swiperNum;
					preIndex %= this.swiperNum;
				}
				var toContainer = this.container.find('.'+this.config.itemClass+'[data-index='+toIndex+']');
				this.container.find('.'+this.config.itemClass).fadeOut();
				toContainer.fadeIn();
				this.swiperIndex = toIndex;
				if(this.config.switchBtnArea){
					this.config.switchBtnArea.find('.switch-btn').removeClass('active');
					this.config.switchBtnArea.find('.switch-btn'+'[data-index='+toIndex+']').addClass('active');
				}
			}
		}
		window.GSwiper = Swiper;
	}
})();