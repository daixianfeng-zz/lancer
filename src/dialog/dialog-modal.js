;(function(){
    var DialogModal = {};
    if ( typeof define === "function" && define.amd ) {
        define( 'DialogModal', ['require', 'jquery'], function(require) {
            factory(require('jquery'));
            return DialogModal;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'))
        module.exports = DialogModal;
    }else{
        factory(window.jQuery);
    }
    var modalList = {};
    function factory($){
        $.fn.extend({
            animateCss: function (animationName, callback) {
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                    $(this).removeClass('animated ' + animationName);
                    callback && callback();
                });
                return this;
            }
        });
        DialogModal = function(el, opt){
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
        DialogModal.prototype = {
            initModal: function(el, config){
                var self = this;
                var content = $(el).html();
                $(el).empty();

                var modalStr = '<div id="dialog-modal-'+config.id+'" class="g-dialog-modal">';
                modalStr += '<div class="dialog-modal-title">'+config.title+'<i class="dialog-modal-close close-icon-18-18"></i></div>';
                modalStr += '<div  class="dialog-modal-container">'+content+'</div>';
                modalStr += '</div>';

                if($('#s-mask').length === 0){
                    $(document.body).append('<div id="s-mask"></div>');
                }
                $('body').append(modalStr);
                self.el = $('#dialog-modal-'+config.id);
                $('.g-dialog-modal').on('click', '.dialog-modal-close', function(){
                    self.close();
                });
            },
            open: function(){
                $('#s-mask').show();
                this.config.onOpen();
                this.el.show();
            },
            close: function(){
                $('#s-mask').hide();
                this.el.hide();
                this.config.onClose();
            }
        }
        window.DialogModal = DialogModal;
    };
})();