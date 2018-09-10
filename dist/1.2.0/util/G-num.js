;(function(){
    var gNum = window.gNum || {};
    if ( typeof define === "function" && define.amd ) {
        define( 'gNum', ['require'], function(require) {
            factory();
            return gNum;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory();
        module.exports = gNum;
    }else{
        factory();
    }
    function factory(){
        /** 浮点数加减乘除 */
        gNum.multi = function(a, b) {
            var c = 0, d = a.toString(), e = b.toString();
            try { c += d.split(".")[1].length; } catch (f) {}
            try { c += e.split(".")[1].length; } catch (f) {}
            return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
        }
        
        gNum.divide = function(a, b) {
            var c, d, e = 0, f = 0;
            try { e = a.toString().split(".")[1].length; } catch (g) {}
            try { f = b.toString().split(".")[1].length; } catch (g) {}
            return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), gNum.multi(c / d, Math.pow(10, f - e));
        }

        gNum.add = function(a, b) {
            var c, d, e;
            try { c = a.toString().split(".")[1].length; } catch (f) { c = 0; }
            try { d = b.toString().split(".")[1].length; } catch (f) { d = 0; }
            return e = Math.pow(10, Math.max(c, d)), (gNum.multi(a, e) + gNum.multi(b, e)) / e;
        }
        
        gNum.minus = function(a, b) {
            var c, d, e;
            try { c = a.toString().split(".")[1].length; } catch (f) { c = 0; }
            try { d = b.toString().split(".")[1].length; } catch (f) { d = 0; }
            return e = Math.pow(10, Math.max(c, d)), (gNum.multi(a, e) - gNum.multi(b, e)) / e;
        }

        gNum.numberToMoney = function(number, f){
            if(+number === +number){
                var moneyNumber = +number;
                f = f >= 0 && f <= 10 ? f : 2; 
                moneyNumber = parseFloat((moneyNumber + '').replace(/[^\d\.-]/g, '')).toFixed(f) + ''; 
                var intArea = moneyNumber.split('.')[0].split('').reverse();
                var floatArea = moneyNumber.split('.')[1];
                var money = ''; 
                for (var i = 0; i < intArea.length; i++) { 
                    money += intArea[i] + ((i + 1) % 3 === 0 && (i + 1) !== intArea.length && intArea[i+1] !== '-' ? ',' : ''); 
                }
                floatArea = floatArea ? '.' + floatArea : '';
                return money.split('').reverse().join('') + floatArea;
            }else if(typeof number === 'undefined' || number !== number){
                return '';
            }else{
                return number + '';
            }
        };
        gNum.moneyToNumber = function(money){
            if(money !== 0 && !money){
                return NaN;
            }else if(+money === +money){
                return +money;
            }
            var number =  parseFloat((''+money).replace(/[^\d\.-]/g, ""));
            return +number;
        };
        gNum.moneyToMoney = function(money, f){
            var number = gNum.moneyToNumber(money);
            if(number === number){
                var newMoney = gNum.numberToMoney(number, f);
                return newMoney;
            }else{
                return money;
            }
        };
        gNum.numberToWan = function(number, f){
            if(+number === +number){
                return gNum.numberToMoney(+number / 10000, f); 
            }else if(typeof number === 'undefined'){
                return '';
            }else{
                return number + '';
            }
        };
        gNum.numberToYi = function(number, f){
            if(+number === +number){
                return gNum.numberToMoney(+number / 100000000, f); 
            }else if(typeof number === 'undefined'){
                return '';
            }else{
                return number + '';
            }
        };
        gNum.baiToNumber = function(money){
            return gNum.multi(gNum.moneyToNumber(money), 100); 
        };
        gNum.wanToNumber = function(money){
            return gNum.multi(gNum.moneyToNumber(money), 10000); 
        };
        gNum.yiToNumber = function(money){
            return gNum.multi(gNum.moneyToNumber(money), 100000000); 
        };
        gNum.toPercent = function(number, f){
            var percentNumber = +number;
            f = f >= 0 && f <= 10 ? f : 2;
            percentNumber = parseFloat((percentNumber*100 + "").replace(/[^\d\.-]/g, "")).toFixed(f) + ""; 
            return percentNumber;
        };
        gNum.percentToNumber = function(percent, f){
            var percentNumber = parseFloat(percent);
            f = f >= 0 && f <= 10 ? f : 4;
            percentNumber = parseFloat((percentNumber/100 + "").replace(/[^\d\.-]/g, "")).toFixed(f) + ""; 
            return percentNumber;
        };
        gNum.toNumber = function(text){
            text = (''+text).replace(/^[\s]+([^\s]*)[\s]+$/, '$1');
            if(/%$/.test(text)){
                return gNum.divide(parseFloat(text), 100);
            }else if(/万$/.test(text)){
                return gNum.wanToNumber(text.replace(/万$/, ''));
            }else if(/亿$/.test(text)){
                return gNum.yiToNumber(text.replace(/亿$/, ''));
            }else{
                return gNum.moneyToNumber(text);
            }
        };
        gNum.toWan = function(number, f){
            var wan = gNum.numberToWan(number, f);
            if(wan && typeof wan === 'string' && wan.indexOf('.') !== -1){
                return wan.replace(/(\.?0*)$/, '');
            }else{
                return wan;
            }
        };

        window.gNum = gNum;
    }
})();