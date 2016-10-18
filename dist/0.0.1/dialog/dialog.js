;(function(){
	var gDialog = {};
	if ( typeof define === "function" && define.amd ) {
	    define( 'gDialog', ['require', 'jquery', 'G'], function(require) {
	        factory(require('jquery'), require('G'));
	        return gDialog;
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
		factory(require('jquery'), require('G'))
		module.exports = gDialog;
	}else{
	    factory(window.jQuery, window.G);
	}
	function factory($, G){
		var cssObj = {
			mask: {
				zIndex: '999998',
				position: 'fixed',
				width: '100%',
				height: '100%',
				top: '0',
				left: '0',
				display: 'none',
				background: 'rgba(0,0,0,0.7)'
			},
			dialog: {
				zIndex: '999999',
				position: 'fixed',
				top: '50%',
				left: '50%',
				backgroundColor: '#fff',
				display: 'none'
			},
			dialogContent: {
				position: 'relative',
				padding: '0.15rem 0.12rem 0.6rem 0.12rem',
				textAlign: 'center',
				fontSize: '0.14rem',
				color: '#353535',
				wordBreak: 'break-all'
			},
			dialogBottom: {
				position: 'absolute',
				left: '0',
				bottom: '0',
				width: '100%',
				height: '0.45rem',
				textAlign: 'center',
				lineHeight: '0.45rem',
				color: '#353535',
				fontSize: '0.16rem',
				borderTop: '1px solid #b6b6b6'
			},
			closeBtn: {
				display: 'inline-block',
				width: '100%',
				height: '100%'
			},
			cancelBtn: {
				display: 'inline-block',
				width: '49%',
				height: '100%',
				borderRight: '1px solid #b6b6b6',
				color: '#999'
			},
			okBtn: {
				display: 'inline-block',
				width: '49%',
				height: '100%'
			}
		}
		var initDialog = function(msg, type, config){
			var contentMsg = msg ? msg : '';
			if(typeof contentMsg === 'string'){
				contentMsg = '<span>'+contentMsg+'</span>';
			}else{
				contentMsg = $(contentMsg).html();
				$(contentMsg).empty();
			}
			if($('#s-mask').length === 0){
				$(document.body).append('<div id="s-mask"></div>');
				$('#s-mask').css(cssObj.mask);
			}
			var alertStr = '<div id="g-alert" class="g-alert">'+
								'<div class="g-content">'+contentMsg+'</div>'+
								'<div class="g-bottom"><a class="g-close btn-long">'+config.btnClose+'</a></div>'+
							'</div>';
			var confirmStr = '<div id="g-confirm" class="g-confirm">'+
							'<div class="g-content">'+contentMsg+'</div>'+
							'<div class="g-bottom"><a class="g-cancel btn-half">'+config.btnCancel+'</a><a class="g-ok btn-half">'+config.btnOk+'</a></div>'+
						'</div>';

			switch(type){
				case 'alert': 
					if($('#g-alert').length !== 0){
						$('#g-alert').remove();
					}
					$(document.body).append(alertStr);
					$('#g-alert').css(cssObj.dialog).css({
						width: '3.16rem',
						minHeight: '1rem',
						marginTop: '-1rem',
						marginLeft: '-1.63rem',
						borderRadius: '0.1rem',
						background: '#fff'
					});
					$('#g-alert').find('.g-content').css(cssObj.dialogContent);
					$('#g-alert').find('.g-bottom').css(cssObj.dialogBottom);
					$('#g-alert').find('.g-close').css(cssObj.closeBtn);
				case 'confirm': 
					if($('#g-confirm').length !== 0){
						$('#g-confirm').remove();
					}
					$(document.body).append(confirmStr);
					$('#g-confirm').css(cssObj.dialog).css({
						width: '3.16rem',
						minHeight: '1rem',
						marginTop: '-1rem',
						marginLeft: '-1.63rem',
						borderRadius: '0.1rem',
						background: '#fff'
					});
					$('#g-confirm').find('.g-content').css(cssObj.dialogContent);
					$('#g-confirm').find('.g-bottom').css(cssObj.dialogBottom);
					$('#g-confirm').find('.g-cancel').css(cssObj.cancelBtn);
					$('#g-confirm').find('.g-ok').css(cssObj.okBtn);
				default: break
			}
		}
		var gAlertPlugin = function(msg, opt){
			opt = opt ? opt : {};
			var config = $.extend({}, {
				btnClose: '关闭',
				onClose: function(){
					return false;
				},
				onOpen: function(){
					return false;
				}
			}, opt);
			initDialog(msg, 'alert', config);
			$('#g-alert').find('.g-close').one('click', function(){
				config.onClose();
				$('#g-alert').hide();
				$('#s-mask').hide();
			});
			config.onOpen();
			$('#s-mask').show();
			$('#g-alert').show();
		}
		var gConfirmPlugin = function(msg, opt){
			opt = opt ? opt : {};
			var config = $.extend({}, {
				btnCancel: '取消',
				btnOk: '确认',
				onClose: function(){
					return false;
				},
				onOpen: function(){
					return false;
				},
				onCancel: function(){
					return false;
				},
				onOk: function(){
					return false;
				}
			}, opt);
			initDialog(msg, 'confirm', config);
			$('#g-confirm').find('.g-cancel').one('click', function(){
				config.onCancel();
				config.onClose();
				$('#g-confirm').hide();
				$('#s-mask').hide();
			});
			$('#g-confirm').find('.g-ok').one('click', function(){
				config.onOk();
				config.onClose();
				$('#g-confirm').hide();
				$('#s-mask').hide();
			});
			config.onOpen();
			$('#s-mask').show();
			$('#g-confirm').show();
		}
		gDialog = {
			gAlert: gAlertPlugin,
			gConfirm: gConfirmPlugin
		}
		window.gDialog = gDialog;
	}
})();