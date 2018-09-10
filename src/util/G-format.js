;(function(){
    var gFormat = window.gFormat || {};
    if ( typeof define === "function" && define.amd ) {
        define( 'gFormat', ['require', 'gDate', 'gNum'], function(require, gDate, gNum) {
            factory(gDate, gNum);
            return gFormat;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('gDate'), require('gNum'));
        module.exports = gFormat;
    }else{
        factory(window.gDate, window.gNum);
    }
    function factory(gDate, gNum){
        gFormat.getCharLength = function(str){
            var seatStr = str;
            seatStr = seatStr.replace(/[0-9]/g, 'a'); //数字
            seatStr = seatStr.replace(/[a-zA-Z]/g, 'a'); //英文
            seatStr = seatStr.replace(/[\s]/g, 'a'); //空字符
            seatStr = seatStr.replace(/[\u0000-\u007F]/g, 'a'); //基本控制符
            seatStr = seatStr.replace(/[\u2000-\u206F]/g, 'aa'); // 标点
            seatStr = seatStr.replace(/[\u3000-\u303F]/g, 'aa'); // 标点
            seatStr = seatStr.replace(/[\uFF00-\uFFFF]/g, 'aa'); // 全角
            seatStr = seatStr.replace(/[\u4E00-\u9FBF]/g, 'aa'); // 中文
            return seatStr.length;
        };
        gFormat.limitLength = function(str, num){
            if(typeof str !== 'string'){
                return '';
            }
            if(num > 0 && str.length > num){
                return str.substr(0,num)+'...';
            }else if(num < 0 && str.length > -num){
                return '...'+str.substr(str.length+num,str.length);
            }else{
                return str;
            }
        }
        gFormat.limitCharLength = function(str, num){
            if(typeof str !== 'string'){
                return '';
            }
            var twoCharReg = /[\u2000-\u206F\u3000-\u303F\uFF00-\uFFFF\u4E00-\u9FBF]/;
            var strArray = str.split('');
            var strArrayReverse = str.split('').reverse();
            var tmpCharIndex = 0;
            var tmpIndex = 0;
            num = num * 2;
            if(num > 0){
                for(var i = 0; i < strArray.length; i++){
                    if(twoCharReg.test(strArray[i])){
                        tmpCharIndex += 2;
                    }else{
                        tmpCharIndex += 1;
                    }
                    if(tmpCharIndex > num){
                        break;
                    }else{
                        tmpIndex = i;
                    }
                }
                if(tmpIndex+1 < strArray.length){
                    return strArray.splice(0, tmpIndex+1).join('') + '...';
                }else{
                    return str;
                }
            }else if(num < 0){
                for(var i = 0; i < strArrayReverse.length; i++){
                    if(twoCharReg.test(strArrayReverse[i])){
                        tmpCharIndex += 2;
                    }else{
                        tmpCharIndex += 1;
                    }
                    if(tmpCharIndex > -num){
                        break;
                    }else{
                        tmpIndex = i;
                    }
                }
                if(tmpIndex+1 < strArray.length){
                    return '...' + strArray.splice(strArray.length-tmpIndex-1).join('');
                }else{
                    return str;
                }
            }else{
                return '';
            }
        }
        gFormat.toBankcard = function(str){
            if(typeof str !== 'string'){
                return '';
            }
            return str.replace(/\D/g,'').replace(/....(?!$)/g,'$& ').replace(/\s*$/, '');
        }

        gFormat = Object.assign(gFormat, gDate, gNum);
        window.gFormat = gFormat;
    }
})();