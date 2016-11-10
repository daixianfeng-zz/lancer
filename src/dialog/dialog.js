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
                case 'confirm': 
                    if($('#g-confirm').length !== 0){
                        $('#g-confirm').remove();
                    }
                    $(document.body).append(confirmStr);
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