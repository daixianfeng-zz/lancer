;(function(){
	var G = window.G || {};
	if ( typeof define === "function" && define.amd ) {
		define( 'G', ['require', 'jquery'], function(require) {
			factory(require('jquery'));
			return G;
		} );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
		factory(require('jquery'))
		module.exports = G;
	}else{
		factory(window.jQuery);
	}
	function factory($){
		var readyEvent = [];
		G.onReady = function(callback){
			if($("meta[name='_render_ready']").attr('content') === 'ready'){
				$.each(readyEvent, function(i, v){
					v && v();
				});
				callback && callback();
				readyEvent = [];
			}else{
				readyEvent.push(callback);
			}
		};
		G.numberToMoney = function(number, f){
			if(+number === +number){
				var moneyNumber = +number;
				f = f >= 0 && f <= 10 ? f : 2; 
				moneyNumber = parseFloat((moneyNumber + '').replace(/[^\d\.-]/g, '')).toFixed(f) + ''; 
				var intArea = moneyNumber.split('.')[0].split('').reverse();
				var floatArea = moneyNumber.split('.')[1];
				money = ''; 
				for (var i = 0; i < intArea.length; i++) { 
					money += intArea[i] + ((i + 1) % 3 == 0 && (i + 1) != intArea.length ? ',' : ''); 
				}
				var floatArea = floatArea ? '.' + floatArea : '';
				return money.split('').reverse().join('') + floatArea;
			}else if(typeof number === 'undefined'){
				return '';
			}else{
				return number + '';
			}
		};

		G.moneyToNumber = function(money){
			if(money !== 0 && !money){
				return NaN;
			}
			var number =  parseFloat((''+money).replace(/[^\d\.-]/g, ""));
			return +number;
		};

		G.moneyToMoney = function(money, f){
			var number = G.moneyToNumber(money);
			if(number === number){
				var newMoney = G.numberToMoney(number, f);
				return newMoney;
			}else{
				return money;
			}
		}

		G.moneyAdd = function(moneyArr){
			var result = 0;
			for(var i=0; i<moneyArr.length; i++){
				var moneyCur = G.moneyToNumber(money.moneyArr[i]);
				if(moneyCur === moneyCur){
					result += moneyCur;
				}
			}
			return G.numberToMoney(result);
		};

		G.moneyMunis = function(money){
			return G.numberToMoney(-G.moneyToNumber(money));
		};

		G.moneyMulti = function(money, multi){
			var multi = +multi === +multi ? +multi : 1;
			return G.numberToMoney(G.moneyToNumber(money) * multi);
		};

		G.moneyAve = function(money, ave){
			var ave = +ave === +ave ? +ave : 1;
			return G.numberToMoney(G.moneyToNumber(money) / ave);
		};

		G.toPercent = function(number, f){
			var percentNumber = +number;
			f = f >= 0 && f <= 10 ? f : 2;
			percentNumber = parseFloat((percentNumber*100 + "").replace(/[^\d\.-]/g, "")).toFixed(f) + ""; 
			return percentNumber;
		};
		G.percentToNumber = function(percent, f){
			var percentNumber = +percent;
			f = f >= 0 && f <= 10 ? f : 2;
			percentNumber = parseFloat((percentNumber/100 + "").replace(/[^\d\.-]/g, "")).toFixed(f) + ""; 
			return percentNumber;
		};

		G.getParams = function(){
			var querystring = document.location.search.replace(/^\?/,'');
			var queryArr = querystring.split('&');
			var paramsObj = {};
			$.each(queryArr, function(i, v){
				var keyValue = v.split('=');
				if(keyValue[0]){
					paramsObj[keyValue[0]] = keyValue[1];
				}
			});
			return paramsObj;
		};

		G.setUrl = function(params, baseUrl){
			var queryArr = [];
			baseUrl = baseUrl ? baseUrl : '/';
			$.each(params, function(i, v){
				queryArr.push(i+'='+v);
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
					queryArr.push(i+'='+v);
				}
			});
			return baseUrl+'?'+queryArr.join('&');
		};

		G.dateFormat = function(date, reg){
			var date = date ? new Date(date) : new Date();
			var fullYear = date.getFullYear();
			var fullMonth = ('0' + (date.getMonth() + 1)).substr(-2);
			var fullDate = ('0' + date.getDate()).substr(-2);
			return fullYear + '-' + fullMonth + '-' + fullDate;
		};
		G.timeFormat = function(time, reg){
			var time = time ? new Date(time) : new Date();
			var fullHour = ('0' + time.getHours()).substr(-2);
			var fullMinute = ('0' + time.getMinutes()).substr(-2);
			var fullSecond = ('0' + time.getSeconds()).substr(-2);
			return fullHour + ':' + fullMinute + ':' + fullSecond;
		};
		G.timestampFormat = function(date, reg){
			if(!date || !date.split){
				return (+new Date());
			}
			var dateArr = date.split('-');
			var now = new Date();
			var timeStamp = +now;
			if(dateArr[0] && dateArr[1]){
				var year = dateArr[2] ? +dateArr[0] : now.getFullYear();
				var month = dateArr[2] ? +dateArr[1] : +dateArr[0];
				var day = dateArr[2] ? +dateArr[2] : +dateArr[1];
				timeStamp = +new Date(year,month-1,day);
			}
			return timeStamp;
		};

		G.benifitCalc = function(base, rate, howlong, type){

		};
		var staticPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRzXbucFpvRdNkmbewx52YxyJSdykmR5a6yZV8AYEWmvYrQRGltPksZZEODtX6zCdgHdp/8AaINuAiF9z9bsZ9caqyq37GU2hBiQ8ltMRUhtyjGcDDlriS2ja1ZQithrbrRuISLUR/3Ost68zqBz+qOG4MU5J2dTaIFuxraCIb/QIDAQAB';
		G.getCipher = function(text, publicKey){
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
		G.apiError = function(apiData, info){
			if(typeof info !== 'object'){
				info = {};
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
			}
			window.fmData = fmData;
		})();

		window.G = G;
	}
})();