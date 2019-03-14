;(function(){
    var gThird = window.gThird || {};
    var url = window.url || {};
    if ( typeof define === "function" && define.amd ) {
        define( 'gThird', ['require', 'jquery', 'G', 'url'], function(require) {
            factory(require('jquery'), require('G'), require('url'));
            return gThird;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('G'), require('url'))
        module.exports = gThird;
    }else{
        factory(window.jQuery, window.G, window.url);
    }
    function factory($, G, url){
        var params = G.getParams();
        var thirdHash = {};
        gThird.setThirdHash = function(thirdHash){
            thirdHash = $.extend({},thirdHash);
        };
        /*
        *   200: 验证登录信息
        *   201: 验证登录信息并在本域设置登录状态    
        */
    	gThird._get_oc = function(callback){
    		if(params['oc']){
                return +params['oc'];
            }else{
                return 200;
            }
    	};
        gThird._get_rsd = function(){
            if(params['rsd']){
                return params['rsd'];
            }else{
                return '';
            }
        }
        gThird._get_ru = function(){
            if(params['ru']){
                return decodeURIComponent(params['ru']);
            }else{
                return (document.location.origin + '/mobile/index');
            }
        }
    	
        gThird.getDomain = function(ru){
            ru = ru || gThird._get_ru();
            return url('hostname', ru) || '/';
        }

        gThird.isRightDomain = function(rsd, ru){
            rsd = rsd || gThird._get_rsd();
            ru = ru || gThird._get_ru();
            var ruDomain = gThird.getDomain(ru);
            if(ruDomain === ''){
                return true;
            }
            var rIndex = -1;
            if(thirdHash[rsd]){
                rIndex = $.inArray(ruDomain, thirdHash[rsd]);
                return (rIndex !== -1);
            }else{
                return false;
            }
        }

        gThird.getPassportUrl = function(rsd, oc){
            rsd = rsd || gThird._get_rsd();
            oc = oc || gThird._get_oc();
            var passportUrl = '';
            return passportUrl;
        }
        gThird.successOpt = function(rsd, oc, data, callback){
            rsd = rsd || gThird._get_rsd();
            oc = oc || gThird._get_oc();
            var ru = gThird._get_ru();
            if(rsd === 'souhuibao'){
                if(oc === 200){
                    var ruBaseUrl = url('protocol', ru) +'://'+ url('hostname', ru) +':'+ url('port', ru) + url('path', ru);
                    var ruParams = url('?', ru) || {};
                    var addParams = {telephone: data.telephone, sign: data.sign};
                    var redirectUrl = G.setUrl($.extend({}, ruParams, addParams), ruBaseUrl);
                    setTimeout(function(){
                        document.location.href = redirectUrl;
                    }, 0);
                }
            }
            if(callback){
                callback();
            }
        }
    }
})();