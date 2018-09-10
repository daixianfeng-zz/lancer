;(function(){
    var G = window.G || {};
    if ( typeof define === "function" && define.amd ) {
        define( 'G', ['require', 'jquery'], function(require) {
            factory(require('jquery'));
            return G;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'));
        module.exports = G;
    }else{
        factory(window.jQuery);
    }
    function factory($){
        var readyEvent = [];
        G.UA = function(){
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            var isMobile = /Android|webOS|Pad|iPhone|iPod|Windows Phone|BlackBerry|MeeGo/i.test(u);
            return {
                isAndroid: isAndroid,
                isIOS: isIOS,
                isMobile: isMobile
            };
        };
        G.ddpr = function(){
            $(window).on('resize', function(e){
                var sWidth = $(window).width();
                var sFont = sWidth / 375 * 100;
                if(sWidth > 420){
                    $('html').css('fontSize', '112px');
                }else if(sWidth < 320){
                    $('html').css('fontSize', '85.33px');
                }else{
                    $('html').css('fontSize', sFont+'px');
                }
            });
            $(window).trigger('resize');
            $(window).on('orientationchange', function(e){
                e.preventDefault();
            });
        };
        G.getCommonParams = function(CommonParamsPage){
            CommonParamsPage = CommonParamsPage || '/_common_params';
            var getRenderData = function(){
                var renderDataDocument = $('#render-data')[0].contentWindow.document;
                var token = $(renderDataDocument).find("meta[name='_csrf']").attr('content');
                var ajaxHeader = $(renderDataDocument).find("meta[name='_csrf_header']").attr('content');
                var formHeader = $(renderDataDocument).find("meta[name='_csrf_parameter']").attr('content');
                var publicKey = $(renderDataDocument).find("meta[name='_cipher_public']").attr('content');

                $('head').append('<meta name="_csrf" content="'+token+'">');
                $('head').append('<meta name="_csrf_header" content="'+ajaxHeader+'">');
                $('head').append('<meta name="_csrf_parameter" content="'+formHeader+'">');
                $('head').append('<meta name="_cipher_public" content="'+publicKey+'">');
                
                $(document).ajaxSend(function(e, xhr, options){
                    if(ajaxHeader){
                        xhr.setRequestHeader(ajaxHeader, token);
                    }
                });

                $('head').append('<meta name="_render_ready" content="ready">');
                G.onReady();
            };
            var $renderData = $('<iframe id="render-data" src="'+CommonParamsPage+'" frameborder="0" style="width:0;height:0;position:absolute;bottom:0;left:0;border:0;"></iframe>');
            if($renderData[0].attachEvent){
                $renderData[0].attachEvent("onload", function(){
                    getRenderData();
                });
            }else{
                $renderData[0].onload = getRenderData;
            }
            $(document.body).append($renderData);
        };
        G.onReady = function(callback){
            if($("meta[name='_render_ready']").attr('content') === 'ready'){
                $.each(readyEvent, function(i, v){
                    if(v){ v(); }
                });
                if(callback){ callback(); }
                readyEvent = [];
            }else{
                readyEvent.push(callback);
            }
        };

        G.getParams = function(search){
            var querystring = search || document.location.search.replace(/^\?/,'');
            var queryArr = querystring.split('&');
            var paramsObj = {};
            $.each(queryArr, function(i, v){
                var keyValue = v.split('=');
                if(keyValue[0]){
                    paramsObj[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
                }
            });
            return paramsObj;
        };

        G.setUrl = function(params, baseUrl){
            var queryArr = [];
            baseUrl = baseUrl ? baseUrl : '/';
            $.each(params, function(i, v){
                queryArr.push(encodeURIComponent(i)+'='+encodeURIComponent(v));
            });
            return baseUrl+'?'+queryArr.join('&');
        };

        G.setRedirectUrl = function(params, baseUrl){
            var queryArr = [];
            baseUrl = baseUrl ? baseUrl : '/';
            $.each(params, function(i, v){
                if(i.toLowerCase() === 'redirecturl'){
                    baseUrl = decodeURIComponent(v);
                }else{
                    queryArr.push(encodeURIComponent(i)+'='+encodeURIComponent(v));
                }
            });
            return baseUrl+'?'+queryArr.join('&');
        };

        G.apiResult = function(apiData, info){
            if(typeof info !== 'object'){
                info = {};
            }
            if(apiData){
                if(apiData.data === null || typeof apiData.data === 'undefined'){
                    apiData.data = $.extend({}, apiData);
                }
                if(apiData.error === 0 || apiData.error === '0'){
                    info.message = apiData.message;
                    info.error = 0;
                    return true;
                }else{
                    info.message = apiData.message ? apiData.message : '系统异常，请稍后再试';
                    info.error = apiData.error;
                    return false;
                }
            }else{
                info.message = '系统异常，请稍后再试';
                info.msg = apiData.msg;
                info.error = null;
                return false;
            }
        };
        G.apiError = function(apiData, info){
            if(typeof info !== 'object'){
                info = {};
            }
            if(typeof apiData.apiError === 'undefined'){
                return G.apiResult(apiData, info);
            }
            if(apiData && apiData.data){
                if(apiData.apiError === 0 ||
                    apiData.apiError === '0' || 
                    apiData.error === 0 || 
                    apiData.error === '0'){
                    if(typeof apiData.data.error === 'undefined' || 
                        apiData.data.error === '0' || 
                        apiData.data.error === 0 || 
                        apiData.data.result === 'success'){
                        info.message = apiData.data.message;
                        info.redirectUrl = apiData.data.redirectUrl ? apiData.data.redirectUrl : '';
                        info.error = 0;
                        return true;
                    }else{
                        info.message = apiData.data.message ? apiData.data.message : '系统异常，请稍后再试';
                        info.redirectUrl = apiData.data.redirectUrl ? apiData.data.redirectUrl : '';
                        info.error = apiData.data.error;
                        return false;
                    }
                }else{
                    info.message = '系统异常，请稍后再试';
                    info.msg = apiData.msg;
                    info.error = null;
                    return false;
                } 
            }else{
                info.message = '系统异常，请稍后再试';
                info.msg = apiData.msg;
                info.error = null;
                return false;
            }
        };

        (function(){
            var fmMap = {};
            var fmData = function(key, value){
                var keyLine = key.split('.');
                var doData = fmMap;
                var doKey = key;
                for(var i=0;i<keyLine.length;i++){
                    doKey = keyLine[i];
                    if(i !== keyLine.length-1){
                        if(typeof doData[doKey] === 'object'){
                            doData = doData[doKey];
                        }else if(typeof doData[doKey] === 'undefined'){
                            doData[doKey] = {};
                            doData = doData[doKey];
                        }else{
                            return Error('attribute not found');
                        }
                    }
                }
                if(typeof value === 'undefined'){
                    return doData[doKey];
                }else{
                    doData[doKey] = value;
                }
            };
            window.fmData = fmData;
        })();

        window.G = G;
    }
})();