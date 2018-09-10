;(function(){
	var Swiper = {};
	if ( typeof define === "function" && define.amd ) {
	    define( 'GSwiper', ['require', 'jquery', 'hammer'], function(require) {
	        factory(require('jquery'), require('hammer'));
	        return Swiper;
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('hammer'));
		module.exports = Swiper;
    }else{
	    factory(window.jQuery, window.hammer);
	}
	function factory($, G, hammer){
		Swiper = function(el, opt){
			opt = opt ? opt : {};
			this.el = el;
			this.config = $.extend({}, opt);
			this.initSwiper();
			return this;
		};
		Swiper.prototype = {
			_event: function(){
				var self = this;
				var $leftBtn = this.config.leftBtn;
				var $rightBtn = this.config.rightBtn;
				var $switchBtnArea = this.config.switchBtnArea;
				var $container = this.container;
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
				if(this.config.touchSwitch === true){
					var mc = new hammer($container[0]);
					mc.on("swiperight", function(){
						self.preContainer();
					});
					mc.on("swipeleft", function(){
						self.nextContainer();
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
					if(self.autoSwitch || self.ingSwitch){
						return false;
					}
					self.nextContainer();
				}, self.config.autoNext)
			},
			initSwiper: function(){
				config = this.config;
				this.container = $(this.el);
				this.ingSwitch = false;
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
				this.toContainer(this.swiperIndex - 1);
			},
			nextContainer: function(){
				this.toContainer(this.swiperIndex + 1);
			},
			toContainer: function(containerIndex){
				var self = this;
				if(self.ingSwitch){
					return;
				}
				var toIndex = +containerIndex;
				if(toIndex >= this.swiperNum){
					toIndex %= this.swiperNum;
				}else if(toIndex < 0){
					toIndex %= this.swiperNum;
					toIndex += this.swiperNum;
					toIndex %= this.swiperNum;
				}
				var toContainer = this.container.find('.'+this.config.itemClass+'[data-index='+toIndex+']');
				var curContainer = this.container.find('.'+this.config.itemClass+'[data-index='+this.swiperIndex+']');
				if($.fn.animateCss && containerIndex > self.swiperIndex){
					this.animate('prev');
				}else if($.fn.animateCss && containerIndex < self.swiperIndex){
					this.animate('next');
				}else{
					this.container.find('.'+this.config.itemClass).fadeOut();
					toContainer.fadeIn();
				}
				this.swiperIndex = toIndex;
				if(this.config.switchBtnArea){
					this.config.switchBtnArea.find('.switch-btn').removeClass('active');
					this.config.switchBtnArea.find('.switch-btn'+'[data-index='+toIndex+']').addClass('active');
				}
			},
			animate: function(direction){
				var outAnimate = direction === 'prev' ? 'slideOutLeft' : 'slideOutRight';
				var inAnimate = direction === 'next' ? 'slideInRight' : 'slideInLeft';
				this.ingSwitch = true;
				curContainer.animateCss(outAnimate, function(){
					curContainer.hide();
					this.ingSwitch = false;
				});
				toContainer.show();
				toContainer.animateCss(inAnimate);
			}
		}
		window.GSwiper = Swiper;
	}
})();