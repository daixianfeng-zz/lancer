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
				if($('#g-toast-wrap').length > 0){
					$('#g-toast-wrap').append(innerContent);
				}else{
					this.toastEl = $('<div id="g-toast-wrap" class="outer-wrap '+styleCss +' '+ this.conf.position+'">'+innerContent+'</div>');
					$('body').append(this.toastEl);
				}
			},
			_showToast: function(conf){
				var lastToast = this.toastEl.find('.inner-wrap').not('.animating').last();
				lastToast.addClass('animating');
				lastToast.fadeIn(function(){
					lastToast.removeClass('animating');
				});
				var self = this;
				this.timer = setTimeout(function(){
					self.close(lastToast);
				}, self.conf.hideAfter);
			},
			_bindToast: function(conf){
				var self = this;
				if($('#g-toast-wrap').length > 0){
					return;
				}else{
					$('#g-toast-wrap').on('click', '.icon-close', function(){
						self.close($(this).closest('.inner-wrap'));
						return false;
					});
				}
			},
			init: function(str, type){
				this.conf = $.extend({}, defaultConfig, this.options);
				this._addToDom(str, type);
				this._showToast();
				this._bindToast();
			},
			close: function(inner){
				var self = this;
				var closeEl = inner || $('#g-toast-wrap').find('.inner-wrap').not('.animating').first();
				this.conf.onBeforeClose && this.conf.onBeforeClose(closeEl);
				closeEl.fadeOut(function(){
					$(closeEl).remove();
					if($('#g-toast-wrap').find('.inner-wrap').length === 0){
						$('#g-toast-wrap').remove();
					}
				});
			},
			success: function(str){ this.init(str, 'success'); },
			warn: function(str){ this.init(str, 'warn'); },
			info: function(str){ this.init(str, 'info'); },
			error: function(str){ this.init(str, 'error'); }
		};
		window.gToast = gToast;
	}
})();