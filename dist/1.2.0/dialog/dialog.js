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
        var Dialog = function(msg, type, opt){
            this.config = {};
            var contentMsg = msg ? msg : '';
            if(typeof contentMsg === 'string'){
                contentMsg = '<span>'+contentMsg+'</span>';
            }else{
                contentMsg = $(contentMsg).html();
                $(contentMsg).empty();
            }
            this.msg = contentMsg;
            switch(type){
                case 'alert': this.config = $.extend({}, {
                        btnClose: '关闭',
                        title: gDialog.alertTitle,
                        onClose: function(){ return false; },
                        onOpen: function(){ return false; }
                    }, opt);
                    this.initAlert();
                    this.addAlertEvent();
                    break;
                case 'confirm': this.config = $.extend({}, {
                        btnCancel: '取消',
                        btnOk: '确认',
                        title: gDialog.confirmTitle,
                        onClose: function(){ return false; },
                        onOpen: function(){ return false; },
                        onCancel: function(){ return false; },
                        onOk: function(){ return false; }
                    }, opt);
                    this.initConfirm();
                    this.addConfirmEvent();
                    break;
            }
            return this;
        };
        Dialog.prototype = {
            initAlert: function(){
                var titleStr = this.config.title ? '<div class="g-title">'+this.config.title+'<i class="g-shut"></i></div>' : '';

                if($('#g-alert').length !== 0){
                    $('#g-alert').remove();
                }
                var alertStr = '';
                alertStr += '<div id="g-alert" class="g-alert"><div id="g-alert-inner">';
                alertStr += titleStr;
                alertStr += '   <div class="g-content">'+this.msg+'</div>';
                alertStr += '   <div class="g-bottom"><a class="g-close btn-long">'+this.config.btnClose+'</a></div>';
                alertStr += '</div></div>';
                $(document.body).append(alertStr);
                $('#g-alert').show();
                this.config.onOpen();
            },
            initConfirm: function(){
                var cancelStr = '<a class="g-cancel btn-half">'+this.config.btnCancel+'</a>';
                var okStr = '<a class="g-ok btn-half">'+this.config.btnOk+'</a>';
                var btnStr = this.config.okLeft === true ? okStr + cancelStr : cancelStr + okStr;
                var titleStr = this.config.title ? '<div class="g-title">'+this.config.title+'<i class="g-shut"></i></div>' : '';

                if($('#g-confirm').length !== 0){
                    $('#g-confirm').remove();
                }
                var confirmStr = '';
                confirmStr += '<div id="g-confirm" class="g-confirm"><div id="g-confirm-inner">';
                confirmStr += titleStr;
                confirmStr += ' <div class="g-content">'+this.msg+'</div>';
                confirmStr += ' <div class="g-bottom">'+btnStr+'</div>';
                confirmStr += '</div></div>';
                $(document.body).append(confirmStr);
                $('#g-confirm').show();
                this.config.onOpen();
            },
            addAlertEvent: function(){
                var self = this;
                $('#g-alert').find('.g-shut,.g-close').off('click');
                $('#g-alert').find('.g-shut,.g-close').one('click', function(){
                    self.config.onClose();
                    $('#g-alert').hide();
                });
                if(+self.config.closeDelay){
                    setTimeout(function(){
                        self.config.onClose();
                        $('#g-alert').hide();
                    }, +config.closeDelay);
                }
            },
            addConfirmEvent: function(){
                var self = this;
                $('#g-confirm').find('.g-shut,.g-cancel,.g-ok').off('click');
                $('#g-confirm').find('.g-shut').one('click', function(){
                    self.config.onClose();
                    $('#g-confirm').hide();
                });
                $('#g-confirm').find('.g-cancel').one('click', function(){
                    self.config.onCancel();
                    self.config.onClose();
                    $('#g-confirm').hide();
                });
                $('#g-confirm').find('.g-ok').one('click', function(){
                    self.config.onOk();
                    self.config.onClose();
                    $('#g-confirm').hide();
                });
            },
            close: function(){
                $('#g-alert').find('.g-shut').trigger('click');
                $('#g-confirm').find('.g-shut').trigger('click');
            }
        };

        var gAlertPlugin = function(msg, opt){
            return new Dialog(msg, 'alert', opt);
        }
        var gConfirmPlugin = function(msg, opt){
            return new Dialog(msg, 'confirm', opt);
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