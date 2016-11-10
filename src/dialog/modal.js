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
        function initModalGlobal(){
            if($('#s-mask').length === 0){
                $(document.body).append('<div id="s-mask"></div>');
            }
            $(document.body).append('<div id="g-modal" class="g-modal""><i id="modal-close" class="modal-close fa fa-angle-double-up"></i></div>');
            $('#g-modal').on('click', '#modal-close', function(){
                $('#g-modal').slideUp(function(){
                    $('#g-modal').find('.modal-container').hide();
                });
            });
        }
        Modal = function(el, opt){
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