;(function(){
	var Modal = {};
	if ( typeof define === "function" && define.amd ) {
	    define( 'GModal', ['require', 'jquery', 'G'], function(require) {
	        factory(require('jquery'), require('G'));
	        return Modal;
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
		factory(require('jquery'), require('G'))
		module.exports = Modal;
	}else{
	    factory(window.jQuery, window.G);
	}
	var modalList = {};
	function factory($, G){
		var cssObj = {
			mask: {
				zIndex: '999997',
				position: 'fixed',
				width: '100%',
				height: '100%',
				top: '0',
				left: '0',
				display: 'none',
				background: 'rgba(0,0,0,0.7)'
			},
			modal: {
				zIndex: '999998',
				position: 'fixed',
				width: '100%',
				height: '100%',
				top: '0',
				left: '0',
				backgroundColor: '#999',
				display: 'none'
			},
			closeBtn: {
				zIndex: '999999',
				position: 'fixed',
				bottom: '10%',
				right: '5%',
				color: '#000',
				fontSize: '48px',
				width: '50px',
				height: '50px',
				cursor: 'pointer'
			},
			container: {
				position: 'relative',
				width: '100%',
				height: '100%',
				color: '#fff',
				backgroundColor: '#999',
				display: 'none'
			}
		};

		function initModalGlobal(){
			if($('#s-mask').length === 0){
				$(document.body).append('<div id="s-mask"></div>');
				$('#s-mask').css(cssObj.mask);
			}
			$(document.body).append('<div id="g-modal" class="g-modal""><i id="modal-close" class="modal-close fa fa-angle-double-up"></i></div>');
			$('#g-modal').css(cssObj.modal);
			$('#modal-close').css(cssObj.closeBtn);
			$('#g-modal').on('click', '#modal-close', function(){
				$('#g-modal').slideUp(function(){
					$('#g-modal').find('.modal-container').hide();
				});
			});
		}
		var Modal = function(el, opt){
			opt = opt ? opt : {};
			this.config = $.extend({}, {
				btnClose: '关闭',
				onClose: function(){
					return false;
				},
				onOpen: function(){
					return false;
				}
			}, opt);
			this.initModal(el, this.config);
			modalList[this.config.id] = this;
			return this;
		};
		Modal.prototype = {
			initModal: function(el, config){
				var content = $(el).html();
				$(el).empty();

				var modalStr = '<div id="modal-'+config.id+'" class="modal-container"">'+content+'</div>';

				if($('#g-modal').length === 0){
					initModalGlobal();
				}
				$('#g-modal').append(modalStr);
				$('#modal-'+config.id).css(cssObj.container);
			},
			open: function(){
				this.config.onOpen();
				if($('#g-modal').is(':visible')){
					$('#g-modal').find('.modal-container:visible').hide();
					$('#modal-'+this.config.id).animateCss('slideInRight').show();
				}else{
					$('#modal-'+this.config.id).show();
					$('#g-modal').slideDown();
				}
			},
			close: function(){
				$('#g-modal').slideUp(function(){
					$('#modal-'+this.config.id).hide();
				});
				this.config.onClose();
			}
		}
		window.GModal = Modal;
	};
})();