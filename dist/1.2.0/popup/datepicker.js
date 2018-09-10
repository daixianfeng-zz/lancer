;(function(){
	var Datepicker = {};
	if ( typeof define === "function" && define.amd ) {
	    define( 'GDatepicker', ['require', 'jquery'], function(require) {
	        factory(require('jquery'));
	        return Datepicker;
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'));
        module.exports = Datepicker;
    }else{
	    factory(window.jQuery);
	}
	function factory($){
		var preZero = function(from){
			return ('00'+from).substr(-2);
		};
		var cssStr = '';
		cssStr += '<style id="g-datepicker-css">';
		cssStr += '.g-datepicker {z-index:9999;position:absolute;top:0;left:0;display:none;}';
		cssStr += '.g-datepicker .g-datepicker-container{width:100%;height:auto;}';
		cssStr += '.g-datepicker .g-datepicker-title {position:relative;width:100%;height:30px;line-height:30px;}';
		cssStr += '.g-datepicker .g-datepicker-header {position:relative;width:100%;height:30px;}';
		cssStr += '.g-datepicker .g-datepicker-header .g-datepicker-day {position:relative;display:inline-block;width:14%;height:30px;text-align:center;line-height:30px;vertical-align:top;}';
		cssStr += '.g-datepicker .g-datepicker-content {position:relative;width:100%;height:auto;}';
		cssStr += '.g-datepicker .g-datepicker-content .g-datepicker-date {position:relative;display:inline-block;width:14%;height:30px;text-align:center;line-height:30px;vertical-align:top;}';
		cssStr += '</style>';
		var datepickerList = [];
		var Datepicker = function(el, opt){
			opt = opt ? opt : {};
			this.config = $.extend({}, {
				days: ['日','一','二','三','四','五','六'],
				months: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
				onClose: function(){
					return false;
				},
				onOpen: function(){
					return false;
				},
				onSelect: function(){
					return false;
				}
			}, opt);
			this.initDatepicker(el, this.config);
			datepickerList.push(this);
			return this;
		};
		Datepicker.prototype = {
			_event: function(){
				var self = this;
				$(self.el).on('click', function(){
					if(self.isOpen()){
						self.close();
					}else{
						self.open();
					}
					return false;
				});
				self.$dateArea.on('click', '.g-datepicker-preyear', function(e){
					self.setDatepicker(self.month, self.year-1);
				});
				self.$dateArea.on('click', '.g-datepicker-premonth', function(e){
					self.setDatepicker(self.month-1, self.year);
				});
				self.$dateArea.on('click', '.g-datepicker-nextyear', function(e){
					self.setDatepicker(self.month, self.year+1);
				});
				self.$dateArea.on('click', '.g-datepicker-nextmonth', function(e){
					self.setDatepicker(self.month+1, self.year);
				});
				self.$dateArea.on('click', '.g-datepicker-date', function(e){
					if($(this).hasClass('disabled')){
						return false;
					}
					var date = $(e.target).html();
					if(date){
						self.config.onSelect();
						self.pick(self.year, self.month, date);
						self.close();
					}
				});
				$(document.body).on('click', function(e){
					if($(e.target).closest('.g-datepicker').length === 0){
						$.each(datepickerList, function(i, v){
							v.close();
						});
					}
				});
				$(window).on('resize', function(){
					self.rePos();
				});
			},
			_initRender: function(){
				var resultStr = '';
				resultStr += '<div class="g-datepicker">';
				resultStr += '	<div class="g-datepicker-container">';
				resultStr += '		<div class="g-datepicker-title">';
				resultStr += '			<span class="g-datepicker-preyear"><i class="fa fa-angle-double-left"></i></span>';
				resultStr += '			<span class="g-datepicker-premonth"><i class="fa fa-angle-left"></i></span>';
				resultStr += '			<span class="g-datepicker-curmonth"></span>';
				resultStr += '			<span class="g-datepicker-curyear"></span>';
				resultStr += '			<span class="g-datepicker-nextmonth"><i class="fa fa-angle-right"></i></span>';
				resultStr += '			<span class="g-datepicker-nextyear"><i class="fa fa-angle-double-right"></i></span>';
				resultStr += '		</div>';
				resultStr += '		<div class="g-datepicker-header">';
				resultStr += this._renderHeader();
				resultStr += '		</div>';
				resultStr += '		<div class="g-datepicker-content">';
				resultStr += '			';
				resultStr += '		</div>';
				resultStr += '	</div>';
				resultStr += '</div>';
				return resultStr;
			},
			_renderHeader: function(){
				var days = this.config.days;
				var daysStr = '';
				for(var i=0;i<days.length;i++){
					daysStr += '<span class="g-datepicker-day">'+this.config.days[i]+'</span>';
				}
				return daysStr;
			},
			_renderPicker: function(year, month, startDay, days){
				this.$dateArea.find('.g-datepicker-content').empty();
				this.year = year;
				this.month = month;
				this.dateTime = new Date(this.year, this.month-1, 1);
				this.$dateArea.find('.g-datepicker-curmonth').html(this.config.months[month-1]);
				this.$dateArea.find('.g-datepicker-curyear').html(year);
				var resultStr = '';
				var dateArr = [];
				for(var i=0;i<startDay;i++){
					dateArr.unshift('');
				}
				for(var k=0;k<days;k++){
					dateArr.push(k+1);
				}
				var renderLength = dateArr.length;
				for(var l=0;l<renderLength;l++){
					if(l !==0 && l%7 === 0){
						resultStr += '<br>';
					}
					var dateClass = '';
					if(this.selectDatetime.getFullYear() === +year && this.selectDatetime.getMonth() === +month-1 && this.selectDatetime.getDate() === +dateArr[l]){
						dateClass += ' active';
					}
					if(this.startCriticalTime && +new Date(this.year,this.month-1,+dateArr[l]) < this.startCriticalTime){
						dateClass += ' disabled';
					}else if(this.endCriticalTime && +new Date(this.year,this.month-1,+dateArr[l]) > this.endCriticalTime){
						dateClass += ' disabled';
					}
					if(dateArr[l]){
						resultStr += '<span class="g-datepicker-date'+dateClass+'">'+preZero(dateArr[l])+'</span>';
					}else{
						resultStr += '<span class="g-datepicker-date empty"></span>';
					}
				}
				this.$dateArea.find('.g-datepicker-content').html(resultStr); 
			},
			initDatepicker: function(el, config){
				this.el = el;
				this.config = config;
				this.year = +config.year === +config.year ? +config.year : (new Date()).getFullYear();
				this.month = +config.month === +config.month ? +config.month : (new Date()).getMonth()+1;
				this.date = +config.date === +config.date ? +config.date : (new Date()).getDate();
				this.dateTime = new Date(this.year, this.month-1, 1);
				this.selectDatetime = new Date(this.year, this.month-1, this.date);

				this.startCriticalTime = config.startCriticalTime || 0;
				this.endCriticalTime = config.endCriticalTime || 0;

				var datepickerStr = this._initRender();

				if($('#g-datepicker-css').length === 0){
					$('body').prepend(cssStr);
				}

				this.$dateArea = $(datepickerStr);
				$('body').append(this.$dateArea);
				this.rePos();
				this._event();
				this.initDate();
			},
			initDate: function(){
				var now = new Date();
				this.setDatepicker(now.getMonth()+1,now.getFullYear());
			},
			setDatepicker: function(month, year){
				year = +year === +year ? +year : this.year;
				month = +month === +month ? +month : this.month;
				var startDate = new Date(year, month-1, 1);
				var endDate = new Date(year, month, 0);
				var startDay = startDate.getDay();
				var days = endDate.getDate();
				year = startDate.getFullYear();
				month = startDate.getMonth()+1;
				this._renderPicker(year, month, startDay, days);
			},
			pick: function(year, month, date){
				this.date = date;
				this.setDatepicker(month, year);
				this.$dateArea.find('.g-datepicker-date').each(function(i, el){
					if(+$(el).html() === +date){
						$(el).addClass('active');
					}else{
						$(el).removeClass('active');
					}
				});
				this.selectDatetime = new Date(this.year, this.month-1, this.date);
				var pick = this.year + '-' + preZero(this.month) + '-' + preZero(date);
				$(this.el).val(pick);
			},
			rePos: function(){
				var elX = $(this.el).offset()['left'];
				var elY = $(this.el).offset()['top'];
				var elHeight = $(this.el).height();
				this.$dateArea.css({
					left: elX,
					top: elY+elHeight+5
				});
			},
			setDisabled: function(startCriticalTime, endCriticalTime){
				if(typeof startCriticalTime === 'string'){
					startCriticalTime = startCriticalTime.replace(/-/g,  "/");
				}
				if(typeof endCriticalTime === 'string'){
					endCriticalTime = endCriticalTime.replace(/-/g,  "/");
				}
				this.startCriticalTime = +new Date(startCriticalTime);
				this.endCriticalTime = +new Date(endCriticalTime);
				this.setDatepicker(this.month, this.year);
			},
			isOpen: function(){
				return this.$dateArea.is(':visible');
			},
			open: function(){
				this.config.onOpen();
				this.rePos();
				this.$dateArea.show();
			},
			close: function(){
				this.config.onClose();
				this.rePos();
				this.$dateArea.hide();
			}
		}
		window.GDatepicker = Datepicker;
	};
})();