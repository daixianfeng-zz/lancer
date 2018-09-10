;(function(){
    var gDate = window.gDate || {};
    if ( typeof define === "function" && define.amd ) {
        define( 'gDate', ['require'], function(require) {
            factory();
            return gDate;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory();
        module.exports = gDate;
    }else{
        factory();
    }
    function factory(){
		gDate.toDate = function(date){
            if(typeof date === 'number'){
                return new Date(date);
            }else if(!date || !date.match){
				return new Date();
			}

            var now = new Date();
            
            var datetimeReg = /((\d{2,4})-(\d{1,2})-(\d{1,2}))?\s{0,1}((\d{1,2}):(\d{1,2}):(\d{1,2}))?/;
            var dataMatch = date.match(datetimeReg);
            var year = dataMatch[2]? +dataMatch[2] : now.getFullYear();
            var month = dataMatch[3]? +dataMatch[3] : now.getMonth()+1;
            var day = dataMatch[4]? +dataMatch[4] : now.getDate();
            var hour = dataMatch[6]? +dataMatch[6] : 0;
            var minute = dataMatch[7]? +dataMatch[7] : 0;
            var second = dataMatch[8]? +dataMatch[8] : 0;

			var dateObj = now;
            dateObj = new Date(+year,+month-1,+day,+hour,+minute,+second);
			return dateObj;
		};
        gDate.datetimeFormat = function(time, reg, emptyValue){
            emptyValue = emptyValue === undefined ? 0 : emptyValue;
            if((!time && time !== 0) || (time === emptyValue)){
                return '';
            }
            time = gDate.toDate(time);
            var weekHash = ['周日','周一','周二','周三','周四','周五','周六'];
            var fullYear = time.getFullYear();
            var subYear = ('0' + (fullYear % 100)).slice(-2);
            var fullMonth = ('0' + (time.getMonth() + 1)).slice(-2);
            var fullDate = ('0' + time.getDate()).slice(-2);
            var fullHour = ('0' + time.getHours()).slice(-2);
            var fullMinute = ('0' + time.getMinutes()).slice(-2);
            var fullSecond = ('0' + time.getSeconds()).slice(-2);
            var fullDay = weekHash[time.getDay()];
            var beforeStr = '';
            var afterStr = reg || 'YYYY-MM-DD';
            if(reg === 'before'){
                var timeDay = (new Date(time)).setHours(0,0,0,0);
                var now = (new Date()).setHours(0,0,0,0);
                var inter = (+now - timeDay) / 1000 / 3600 / 24;
                if(inter === 1){
                    beforeStr = '昨日 ';
                }else if(inter === 0){
                    beforeStr = '今日 ';
                }
                afterStr = fullHour + ':' + fullMinute + ':' + fullSecond;
            }else if(reg === 'time'){
                return fullHour + ':' + fullMinute + ':' + fullSecond;
            }else{
                afterStr = afterStr.replace('YYYY', fullYear);
                afterStr = afterStr.replace('YY', subYear);
                afterStr = afterStr.replace('MM', fullMonth);
                afterStr = afterStr.replace('DD', fullDate);
                afterStr = afterStr.replace('HH', fullHour);
                afterStr = afterStr.replace('mm', fullMinute);
                afterStr = afterStr.replace('ss', fullSecond);
                afterStr = afterStr.replace('dd', fullDay);
            }
            return beforeStr + afterStr;
        };
        gDate.datetimeBeforeFormat = function(time, earliest, reg, emptyValue){
            emptyValue = emptyValue === undefined ? 0 : emptyValue;
            if((!time && time !== 0) || (time === emptyValue)){
                return '';
            }
            time = gDate.toDate(time);
            var now = new Date();
            var resultStr = '';
            var interYear = Math.floor((+now - time) / 1000 / 3600 / 24 / 365) ;
            var interMonth = Math.floor((+now - time) / 1000 / 3600 / 24 / 30) ;
            var interDay = Math.floor((+now - time) / 1000 / 3600 / 24) ;
            var interHour = Math.floor((+now - time) / 1000 / 3600) ;
            var interMinute = Math.floor((+now - time) / 1000 / 60) ;
            var overTime = false;
            if(interYear > 0){
                resultStr += interYear+'年前';
            }else if(interMonth > 0){
                resultStr += interMonth+'月前';
            }else if(interDay > 0){
                resultStr += interDay+'日前';
            }else if(interHour > 0){
                resultStr += interHour+'小时前';
            }else if(interMinute > 0){
                resultStr += interMinute+'分钟前';
            }else{
                resultStr += '刚刚';
            }
            switch(earliest){
                case 'year': overTime = interYear > 0 ? true : false;break;
                case 'month': overTime = interMonth > 0 ? true : false;break;
                case 'day': overTime = interDay > 0 ? true : false;break;
                case 'hour': overTime = interHour > 0 ? true : false;break;
                case 'minute': overTime = interMinute > 0 ? true : false;break;
                default: overTime = false;break;
            }
            if(overTime){
                resultStr = gDate.datetimeFormat(time, reg);
            }
            return resultStr;
        };

        window.gDate = gDate;
    }
})();