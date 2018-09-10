;(function(){
    var gDialog = {};
    if ( typeof define === "function" && define.amd ) {
        define( 'gDialog', ['require', 'jquery'], function(require) {
            factory(require('jquery'));
            return gDialog;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'))
        module.exports = gDialog;
    }else{
        factory(window.jQuery);
    }
    function factory($){
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
            }

            var cancelStr = '<a class="g-cancel btn-half">'+config.btnCancel+'</a>';
            var okStr = '<a class="g-ok btn-half">'+config.btnOk+'</a>';
            var btnStr = config.okLeft === true ? okStr + cancelStr : cancelStr + okStr;
            var titleStr = config.title ? '<div class="g-title">'+config.title+'<i class="g-shut"></i></div>' : '';

            switch(type){
                case 'alert': 
                    if($('#g-alert').length !== 0){
                        $('#g-alert').remove();
                    }
                    var alertStr = '';
                    alertStr += '<div id="g-alert" class="g-alert">';
                    alertStr += titleStr;
                    alertStr += '   <div class="g-content">'+contentMsg+'</div>';
                    alertStr += '   <div class="g-bottom"><a class="g-close btn-long">'+config.btnClose+'</a></div>';
                    alertStr += '</div>';
                    $(document.body).append(alertStr);
                    break;
                case 'confirm': 
                    if($('#g-confirm').length !== 0){
                        $('#g-confirm').remove();
                    }
                    var confirmStr = '';
                    confirmStr += '<div id="g-confirm" class="g-confirm">';
                    confirmStr += titleStr;
                    confirmStr += ' <div class="g-content">'+contentMsg+'</div>';
                    confirmStr += ' <div class="g-bottom">'+btnStr+'</div>';
                    confirmStr += '</div>';
                    $(document.body).append(confirmStr);
                    break;
                default: break
            }
        }
        var gAlertPlugin = function(msg, opt){
            opt = opt ? opt : {};
            var config = $.extend({}, {
                btnClose: '关闭',
                title: gDialog.alertTitle,
                onClose: function(){ return false; },
                onOpen: function(){ return false; }
            }, opt);
            initDialog(msg, 'alert', config);
			$('#g-alert').find('.g-shut,.g-close').off('click');
            $('#g-alert').find('.g-shut,.g-close').one('click', function(){
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
                title: gDialog.confirmTitle,
                onClose: function(){ return false; },
                onOpen: function(){ return false; },
                onCancel: function(){ return false; },
                onOk: function(){ return false; }
            }, opt);
            initDialog(msg, 'confirm', config);
			$('#g-confirm').find('.g-shut,.g-cancel,.g-ok').off('click');
            $('#g-confirm').find('.g-shut').one('click', function(){
				config.onClose();
				$('#g-confirm').hide();
				$('#s-mask').hide();
			});
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
            gConfirm: gConfirmPlugin,
            alertTitle: '',
            confirmTitle: ''
        }
        window.gDialog = gDialog;
    }
})();