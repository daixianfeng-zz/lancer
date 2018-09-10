;(function(){
    var RSA = window.RSA || {};
    if ( typeof define === "function" && define.amd ) {
        define( 'RSA', ['require', 'jquery', 'JSEncrypt'], function(require) {
            factory(require('jquery'), require('JSEncrypt'));
            return RSA;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('JSEncrypt'));
        module.exports = RSA;
    }else{
        factory(window.jQuery, window.JSEncrypt);
    }
    function factory($, JSEncrypt){
        var staticPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRzXbucFpvRdNkmbewx52YxyJSdykmR5a6yZV8AYEWmvYrQRGltPksZZEODtX6zCdgHdp/8AaINuAiF9z9bsZ9caqyq37GU2hBiQ8ltMRUhtyjGcDDlriS2ja1ZQithrbrRuISLUR/3Ost68zqBz+qOG4MU5J2dTaIFuxraCIb/QIDAQAB';
        RSA.encode = function(text, publicKey){
            var curPublicKey = $("meta[name='_cipher_public']").attr('content');
            publicKey = publicKey || curPublicKey || staticPublicKey;
            if(typeof JSEncrypt !== 'undefined' && publicKey){
                var enc = new JSEncrypt();
                enc.setPublicKey(publicKey);
                var cipher = enc.encrypt(text);
                return cipher;
            }else{
                return false;
            }
        };
        
        RSA.getSalt = function(token){
            var curToken = $("meta[name='_csrf']").attr('content');
            token = token || curToken || '';
            return RSA.encode(token);
        };

        window.RSA = RSA;
    }
})();