;(function(){
    var gTips = {};
    if ( typeof define === "function" && define.amd ) {
        define( 'gTips', ['require', 'jquery', 'gDialog', 'gToast'], function(require) {
            factory(require('jquery'), require('gDialog'), require('gToast'));
            return gTips;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('gDialog'), require('gToast'))
        module.exports = gTips;
    }else{
        factory(window.jQuery, window.gDialog, window.gToast);
    }
    function factory($, gDialog, gToast){
        var getMessage = function(msg){
            var result = {};
            if(typeof msg === 'string'){
                result = { message: msg };
            }else if(typeof msg === 'object'){
                result = msg;
            }else{
                result = { message: '' };
            }
            return result;
        };
        var timeoutIndex = 0;
        var gSuccessTips = function(msg, el){
            var msgObj = getMessage(msg);
            if(el){
	        	clearTimeout(timeoutIndex);
	            $(el).removeClass('tips-alert').addClass('tips-success').html(msgObj.message).fadeOut().fadeIn('slow');
	            timeoutIndex = setTimeout(function(){
	               $(el).html('');
	           }, 5000);
	        }else if(gTips.type === 'toast'){
                gToast.success(msgObj.message);
            }else{
	        	gDialog.gAlert(msgObj.message, {title: msgObj.title});
	        }
        };
        var gErrorTips = function(msg, el){
            var msgObj = getMessage(msg);
            if(el){
	        	clearTimeout(timeoutIndex);
	            $(el).removeClass('tips-success').addClass('tips-alert').html(msgObj.message).fadeOut().fadeIn('slow');
	            timeoutIndex = setTimeout(function(){
	               $(el).html('');
	           }, 5000);
	        }else if(gTips.type === 'toast'){
                gToast.error(msgObj.message);
            }else{
	        	gDialog.gAlert(msgObj.message, {title: msgObj.title});
	        }
        };
        
        gTips = {
            success: gSuccessTips,
            error: gErrorTips,
            type: 'dialog'
        };
        window.gTips = gTips;
    }
})();