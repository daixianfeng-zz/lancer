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
        var showTips = function(msgObj, el, type){
            var hideDelay = gTips.elConfig.hideTime;
            var lastTick = $(el).data('tick');
            var curTick = null;
            if(lastTick){
                clearTimeout(lastTick);
            }
            if(type === 'success'){
                $(el).removeClass('tips-alert').addClass('tips-success').html(msgObj.message).fadeOut().fadeIn('slow');
            }else{
                $(el).removeClass('tips-success').addClass('tips-alert').html(msgObj.message).fadeOut().fadeIn('slow');
            }
            if(hideDelay && typeof hideDelay === 'number'){
                curTick = setTimeout(function(){
                    $(el).html('');
                }, hideDelay);
                $(el).data('tick', curTick);
            }
        }
        var gSuccessTips = function(msg, el){
            var msgObj = getMessage(msg);
            if(el === 'toast'){
                gToast.success(msgObj.message);
            }else if(el){
                showTips(msgObj, el, 'success');
	        }else if(gTips.type === 'toast'){
                gToast.success(msgObj.message);
            }else{
	        	gDialog.gAlert(msgObj.message, {title: msgObj.title});
	        }
        };
        var gErrorTips = function(msg, el){
            var msgObj = getMessage(msg);
            if(el === 'toast'){
                gToast.error(msgObj.message);
            }else if(el){
	        	showTips(msgObj, el, 'error');
	        }else if(gTips.type === 'toast'){
                gToast.error(msgObj.message);
            }else{
	        	gDialog.gAlert(msgObj.message, {title: msgObj.title});
	        }
        };
        
        gTips = {
            success: gSuccessTips,
            error: gErrorTips,
            type: 'dialog',
            elConfig: {
                hideTime: 5000
            }
        };
        window.gTips = gTips;
    }
})();