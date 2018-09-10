;(function(){
    var gMoney = window.gMoney || {};
    if ( typeof define === "function" && define.amd ) {
        define( 'gMoney', ['require'], function(require) {
            factory();
            return gMoney;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory();
        module.exports = gMoney;
    }else{
        factory();
    }
    function factory(){
        gMoney.numberToMoney = function(number, f){
            if(+number === +number){
                var moneyNumber = +number;
                f = f >= 0 && f <= 10 ? f : 2; 
                moneyNumber = parseFloat((moneyNumber + '').replace(/[^\d\.-]/g, '')).toFixed(f) + ''; 
                var intArea = moneyNumber.split('.')[0].split('').reverse();
                var floatArea = moneyNumber.split('.')[1];
                var money = ''; 
                for (var i = 0; i < intArea.length; i++) { 
                    money += intArea[i] + ((i + 1) % 3 === 0 && (i + 1) !== intArea.length ? ',' : ''); 
                }
                floatArea = floatArea ? '.' + floatArea : '';
                return money.split('').reverse().join('') + floatArea;
            }else if(typeof number === 'undefined'){
                return '';
            }else{
                return number + '';
            }
        };
        gMoney.moneyToNumber = function(money){
            if(money !== 0 && !money){
                return NaN;
            }else if(+money === +money){
                return +money;
            }
            var number =  parseFloat((''+money).replace(/[^\d\.-]/g, ""));
            return +number;
        };
        gMoney.moneyToMoney = function(money, f){
            var number = gMoney.moneyToNumber(money);
            if(number === number){
                var newMoney = gMoney.numberToMoney(number, f);
                return newMoney;
            }else{
                return money;
            }
        };
        gMoney.numberToWan = function(number, f){
            if(+number === +number){
                return gMoney.numberToMoney(+number / 10000, f); 
            }else if(typeof number === 'undefined'){
                return '';
            }else{
                return number + '';
            }
        };
        gMoney.wanToNumber = function(money){
            return gMoney.moneyToNumber(money) * 10000; 
        };
        gMoney.toPercent = function(number, f){
            var percentNumber = +number;
            f = f >= 0 && f <= 10 ? f : 2;
            percentNumber = parseFloat((percentNumber*100 + "").replace(/[^\d\.-]/g, "")).toFixed(f) + ""; 
            return percentNumber;
        };
        gMoney.percentToNumber = function(percent, f){
            var percentNumber = parseFloat(percent);
            f = f >= 0 && f <= 10 ? f : 2;
            percentNumber = parseFloat((percentNumber/100 + "").replace(/[^\d\.-]/g, "")).toFixed(f) + ""; 
            return percentNumber;
        };

        window.gMoney = gMoney;
    }
})();