;(function(){
	var gToast = {};
	if ( typeof define === "function" && define.amd ) {
	    define( 'gToast', ['require', 'jquery'], function(require) {
	        factory(require('jquery'));
	        return gToast;
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
		factory(require('jquery'));
	}else{
	    factory(window.jQuery);
	}
	function factory($){
		var defaultConfig = {
			"closeBtn": false,
			"position": "center-middle",
			"transition": 'fade',
			"hideAfter": 2400,
			onBeforeClose: function(el){ return; }
		};
		
		gToast = {
			timer: 0,
			options: {},
			_addToDom: function(str, type){
				var styleCss = this.conf.position.indexOf('full') !== -1 ? 'toast-full-wrap' : 'toast-wrap';
				var iconBtn = this.conf.closeBtn ? '<span class="icon-close"></span>': '';				
				var contentMsg = str ? str : '';
				if(typeof contentMsg === 'string'){
					contentMsg = '<span>'+contentMsg+'</span>';
				}else {
					contentMsg = $(contentMsg).html();
					$(contentMsg).empty();
				}
				var innerContent = '<div class="inner-wrap '+type+'-wrap">'+contentMsg+iconBtn+'</div>';
				this.toastEl = $('<div style="display:none" class="outer-wrap '+styleCss +' '+ this.conf.position+'">'+innerContent+'</div>');
				$('body').append(this.toastEl);
			},
			_showToast: function(conf){
				if(this.conf.transition === 'fade'){
					this.toastEl.fadeIn();
				}else if(this.conf.transition === 'slide'){
					this.toastEl.slideDown();
				}
				var self = this;
				this.timer = setTimeout(function(){
					self.close()
				}, self.conf.hideAfter);
			},
			_bindToast: function(conf){
				var self = this;
				$('.outer-wrap').find('.icon-close').on('click', function(){
					self.close();
					return false;
				});
			},
			init: function(str, type){
				this.conf = $.extend({}, defaultConfig, this.options);
				$('.outer-wrap').remove();
				clearTimeout(this.timer);
				this._addToDom(str, type);
				this._showToast();
				this._bindToast();
			},
			close: function(){
				var self = this;
				this.conf.onBeforeClose && this.conf.onBeforeClose(this.toastEl);
				if(self.conf.transition === 'fade'){
					self.toastEl.fadeOut(function(){
						$(this).remove();
					});
				}else if(self.conf.transition === 'slide'){
					self.toastEl.slideUp(function(){
						$(this).remove();
					});
				}
			},
			success: function(str){ this.init(str, 'success'); },
			warn: function(str){ this.init(str, 'warn'); },
			info: function(str){ this.init(str, 'info'); },
			error: function(str){ this.init(str, 'error'); }
		};
		window.gToast = gToast;
	}
})();