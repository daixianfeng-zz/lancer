;(function(){
    var gUser = window.gUser || {};
    if ( typeof define === "function" && define.amd ) {
        define( 'gUser', ['require', 'jquery', 'G'], function(require) {
            factory(require('jquery'), require('G'));
            return gUser;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('G'))
        module.exports = gUser;
    }else{
        factory(window.jQuery, window.G);
    }
    function factory($, G){
    	gUser.getUserInfo = function(callback){
    		$.ajax({
    			url: '/portal/userInfo.json',
                type: 'post',
                data: {},
                dataType: 'json',
                success: function(result){
                    if(G.apiError(result)){
                    	if(!+result.data.isLogin){
    						callback({isLogin: 0});
                    	}else if(result.data.user){
                    		callback($.extend({isLogin: 1},result.data.user));
                    	}else{
                    		callback({isLogin: 0});
                    	}
                    }else{
                    	callback({isLogin: 0});
                    }
                },
                error: function(){
    				callback({isLogin: 0});
                }
    		})
    	};
    	gUser.getAccountInfo = function(callback){
    		$.ajax({
    			url: '/account/getAccountInfo.json',
                type: 'post',
                data: {},
                dataType: 'json',
                success: function(result){
                    if(G.apiError(result)){
                    	if(result.data.accountInfo){
                    		callback(result.data.accountInfo);
                    	}else{
    						callback({});
                    	}
                    }else{
                		callback({});
                    }
                },
                error: function(){
                	callback({});
                }
    		});
    	}

        window.gUser = gUser;
    }
})();