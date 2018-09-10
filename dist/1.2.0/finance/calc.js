;(function(){
	var CalcProduct = {};
    if ( typeof define === "function" && define.amd ) {
        define( 'CalcProduct', ['require', 'jquery', 'G'], function(require) {
            factory(require('jquery'), require('G'));
            return CalcProduct;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('G'));
        module.exports = CalcProduct;
    }else{
        factory(window.jQuery, window.G);
    }
	var strToDate = function(date){
		if(!date || !date.split){
			return (+new Date());
		}
		var dateArr = date.split('-');
		var now = new Date();
		var dateObj = now;
		if(dateArr[0] && dateArr[1]){
			var year = dateArr[2] ? +dateArr[0] : now.getFullYear();
			var month = dateArr[2] ? +dateArr[1] : +dateArr[0];
			var day = dateArr[2] ? +dateArr[2] : +dateArr[1];
			dateObj = new Date(+year,+month-1,+day);
		}
		return dateObj;
	};
    function factory($, G){
		CalcProduct = function(attrs){
			this.startDate = strToDate(attrs.interestStartDate);
			this.endDate = strToDate(attrs.interestEndDate);
			this.duration = +attrs.duration;
			this.duration = this.duration || (+this.endDate - this.startDate) / 1000 / 3600 / 24;
			this.rate = +attrs.interestRate;
			this.type = attrs.productType;
			this.retainSum = +attrs.retainSum || 0;
			this.totalSum = +attrs.totalSum - this.retainSum;
			this.repayDate = +attrs.repayDate || 20;

			this.monthRate = [];
			this.monthDays = [];
			this.repayTime = [];
			this.monthShouldPayRate = [];
			this.totalShouldPayRate = 0;
			this.totalMonthRate = 1;
			this.init();
			return this;
		};
		CalcProduct.prototype = {
			init: function(){
				amount = this.totalSum;
				if(this.type === 'epiMonth'){
					this.totalRepayPlan = this.calcEpiMonth(amount);
				}else if(this.type === 'epiNormal'){
					this.totalRepayPlan = this.calcEpiNormal(amount);
				}
			},
			calc: function(amount){
				amount = amount || 0;
				if(this.type === 'fixed' || this.type === 'greenHand'){
					return this.calcFixed(amount);
				}
				if(this.type === 'epiMonth'){
					return this.calcApartEpiMonth(amount);
				}
				if(this.type === 'epiNormal'){
					return this.calcApartEpiNormal(amount);
				}
			},
			calcFixed: function(amount){
				return Math.round(this.rate * this.duration * amount / 365 * 100) / 100;
			},
			// 按日息计算的等额本息方式， 固定自然月还款日
			calcEpiMonth: function(amount){
				if(!this.monthRate || this.monthRate.length === 0){
					this.initMonthRate();
				}
				return this.calcMonthPlan(amount);
			},
			calcApartEpiMonth: function(amount){
				if(!this.monthRate || this.monthRate.length === 0){
					this.initMonthRate();
				}
				return this.calcApartMonthPlan(amount);
			},
			initMonthRate: function(){
				var self = this;
				self.firstRepay = new Date(self.startDate.getFullYear(),self.startDate.getMonth() + 1,self.repayDate);
				if(self.firstRepay >= self.endDate){
					self.firstRepay = self.endDate;
				}
				self.repayTime.push(G.dateFormat(self.firstRepay));
				self.lastRepay = self.endDate;
				self.monthDays[0] = (+self.firstRepay - +self.startDate )/3600/24/1000;
				var tmpDate = self.firstRepay;
				var tmpDateNext = self.firstRepay;
				for(var i=0;tmpDateNext<self.lastRepay;i++){
					tmpDate = tmpDateNext;
					tmpDateNext = new Date(tmpDate.getFullYear(), tmpDate.getMonth()+1, tmpDate.getDate());
					if(tmpDateNext<self.lastRepay){
						self.monthDays.push((+tmpDateNext - +tmpDate )/3600/24/1000);
						self.repayTime.push(G.dateFormat(tmpDateNext));
					}else{
						self.monthDays.push((+self.lastRepay - +tmpDate )/3600/24/1000);
						self.repayTime.push(G.dateFormat(self.lastRepay));
					}

				}
				$.each(self.monthDays, function(i, v){
					self.monthRate[i] = 1 + self.rate / 12 / 30 * v; 
				});
				self.totalMonthRate = 1;
				$.each(self.monthRate, function(i, v){
					self.totalMonthRate *= v;
				});
				self.monthShouldPayRate = [1];
				var repayNum = self.monthRate.length;
				for(var i=0;i<repayNum-1;i++){
					self.monthShouldPayRate.push(self.monthRate[repayNum-1-i] * self.monthShouldPayRate[i]);
				}
				self.repayNum = repayNum;
				self.totalShouldPayRate = 0;
				$.each(self.monthShouldPayRate, function(i, v){
					self.totalShouldPayRate += v;
				});
			},
			calcMonthShouldRepay: function(amount){
				return +(amount * this.totalMonthRate / this.totalShouldPayRate).toFixed(2);
			},
			calcMonthPlan: function(amount){
				var self = this;
				var monthShouldRepay = self.calcMonthShouldRepay(amount);
				var monthInterest = [];
				var monthPriciple = [];
				var monthRepay = [];
				var remainAmount = amount;
				var repayAmount = 0;
				var totalInterest = 0;
				for(var i=0;i<self.repayNum-1;i++){
					monthInterest[i] = +((self.monthRate[i]-1) * remainAmount).toFixed(2);
					monthPriciple[i] = +(monthShouldRepay - monthInterest[i]).toFixed(2);
					monthRepay[i] = monthShouldRepay;
					remainAmount -= monthPriciple[i];
					repayAmount += monthPriciple[i];
					totalInterest += monthInterest[i];
				}
				var lastPriciple = +(amount - repayAmount).toFixed(2);
				var lastInterest = +((self.monthRate[self.repayNum-1]-1) * lastPriciple).toFixed(2);
				monthPriciple.push(lastPriciple);
				monthInterest.push(lastInterest);
				monthRepay.push(+(lastPriciple+lastInterest).toFixed(2));
				totalInterest += lastInterest;
				return {
					monthShouldRepay: monthShouldRepay,
					monthRepay: monthRepay,
					monthPriciple: monthPriciple,
					monthInterest: monthInterest,
					totalInterest: +totalInterest.toFixed(2),
					totalRepay: +(amount + totalInterest).toFixed(2),
					repayNum: self.repayNum,
					repayTime: self.repayTime
				};
			},
			calcApartMonthPlan: function(amount){
				var totalPlan = this.totalRepayPlan;
				var apartRate = amount / this.totalSum;
				var apartPlan = {
					repayNum: this.repayNum,
					repayTime: this.repayTime
				};
				apartPlan.monthShouldRepay = moneyFloor(+(totalPlan.monthShouldRepay * apartRate).toFixed(6));
				apartPlan.totalInterest = moneyFloor(+(totalPlan.totalInterest * apartRate).toFixed(6));
				apartPlan.totalRepay = moneyFloor(+(amount + apartPlan.totalInterest).toFixed(6));
				apartPlan.monthRepay = [];
				apartPlan.monthPriciple = [];
				apartPlan.monthInterest = [];
				var priciplePlus = 0;
				var interestPlus = 0;
				for(var i=0;i<this.repayNum - 1;i++){
					apartPlan.monthRepay[i] = moneyFloor(+(totalPlan.monthRepay[i] * apartRate).toFixed(6));
					apartPlan.monthInterest[i] = moneyFloor(+(totalPlan.monthInterest[i] * apartRate).toFixed(6));
					apartPlan.monthPriciple[i] = +(apartPlan.monthRepay[i] - apartPlan.monthInterest[i]).toFixed(2);
					priciplePlus += apartPlan.monthPriciple[i];
					interestPlus += apartPlan.monthInterest[i];
				}
				apartPlan.monthInterest[this.repayNum - 1] = +(apartPlan.totalInterest - interestPlus).toFixed(2);
				apartPlan.monthPriciple[this.repayNum - 1] = +(amount - priciplePlus).toFixed(2);
				apartPlan.monthRepay[this.repayNum - 1] = +(apartPlan.monthInterest[this.repayNum - 1] + apartPlan.monthPriciple[this.repayNum - 1]).toFixed(2);
				return apartPlan;
			},

			// 标准等额本息，按月息计算，起息日与到期日为同一自然月日期
			calcEpiNormal: function(amount){
				if(!this.normalRate || !this.repayNum || this.repayTime.length === 0){
					this.initNormalRate();
				}
				return this.calcNormalPlan(amount);
			},
			calcApartEpiNormal: function(amount){
				if(!this.normalRate || !this.repayNum || this.repayTime.length === 0){
					this.initNormalRate();
				}
				return this.calcApartNormalPlan(amount);
			},
			initNormalRate: function(){
				var self = this;
				self.normalRate = self.rate / 12;
				self.repayNum = 0;
				self.repayTime = [];
				var rapayDate = self.startDate;
				var nextMonthDate = {};
				var nextMonthLast = {};
				while(rapayDate < self.endDate){
					self.repayNum += 1;
                    // 利用了不存在 setMonth 下一个月 和 下两个月 同时出现跳月份情况
					nextMonthDate = new Date(new Date(self.startDate).setMonth(self.startDate.getMonth()+self.repayNum));
					nextMonthLast = new Date(new Date(self.startDate).setMonth(self.startDate.getMonth()+self.repayNum+1));
					nextMonthLast = new Date(nextMonthLast.setDate(0));
					if(nextMonthDate < nextMonthLast){
						rapayDate = nextMonthDate;
					}else{
						rapayDate = nextMonthLast;
					}
					if(rapayDate <= self.endDate){
						self.repayTime.push(G.dateFormat(rapayDate));
					}else{
						self.repayTime.push(G.dateFormat(self.endDate));
					}
				}
			},
			calcMonthRepay: function(amount, repayNum){
				return +(amount * this.normalRate * Math.pow(1 + this.normalRate, repayNum) / (Math.pow(1 + this.normalRate, repayNum) - 1)).toFixed(2);
			},
			calcMonthPrincipal: function(amount, repayNum, turn){
				return +(amount * this.normalRate * Math.pow(1 + this.normalRate, turn - 1) / (Math.pow(1 + this.normalRate, repayNum) - 1)).toFixed(2);
			},
			calcNormalPlan: function(amount){
				var self = this;
				var monthShouldRepay = self.calcMonthRepay(amount, self.repayNum);
				var monthInterest = [];
				var monthPriciple = [];
				var monthRepay = [];
				var remainAmount = amount;
				var repayAmount = 0;
				var totalInterest = 0;
				for(var i=0;i<self.repayNum-1;i++){
					monthInterest[i] = +(monthShouldRepay - self.calcMonthPrincipal(amount, self.repayNum, i+1)).toFixed(2);
					monthPriciple[i] = self.calcMonthPrincipal(amount, self.repayNum, i+1);
					monthRepay[i] = monthShouldRepay;
					remainAmount -= monthPriciple[i];
					repayAmount += monthPriciple[i];
					totalInterest += monthInterest[i];
				}
				var lastPriciple = +(amount - repayAmount).toFixed(2);
				var lastInterest = +(monthShouldRepay - lastPriciple).toFixed(2);
				monthPriciple.push(lastPriciple);
				monthInterest.push(lastInterest);
				monthRepay.push(+monthShouldRepay.toFixed(2));
				totalInterest += lastInterest;
				return {
					monthShouldRepay: monthShouldRepay,
					monthRepay: monthRepay,
					monthPriciple: monthPriciple,
					monthInterest: monthInterest,
					totalInterest: +totalInterest.toFixed(2),
					totalRepay: +(amount + totalInterest).toFixed(2),
					repayNum: self.repayNum,
					repayTime: self.repayTime
				};
			},
			calcApartNormalPlan: function(amount){
				var totalPlan = this.totalRepayPlan;
				var apartRate = amount / this.totalSum;
				var apartPlan = {
					repayNum: this.repayNum,
					repayTime: this.repayTime
				};
				apartPlan.monthShouldRepay = moneyFloor(+(totalPlan.monthShouldRepay * apartRate).toFixed(6));
				apartPlan.totalInterest = moneyFloor(+(totalPlan.totalInterest * apartRate).toFixed(6));
				apartPlan.totalRepay = moneyFloor(+(amount + apartPlan.totalInterest).toFixed(6));
				apartPlan.monthRepay = [];
				apartPlan.monthPriciple = [];
				apartPlan.monthInterest = [];
				var priciplePlus = 0;
				var interestPlus = 0;
				var totalPlus = 0;
				for(var i=0;i<this.repayNum - 1;i++){
					apartPlan.monthRepay[i] = moneyFloor(+(totalPlan.monthRepay[i] * apartRate).toFixed(6));
					apartPlan.monthInterest[i] = moneyFloor(+(totalPlan.monthInterest[i] * apartRate).toFixed(6));
					apartPlan.monthPriciple[i] = +(apartPlan.monthRepay[i] - apartPlan.monthInterest[i]).toFixed(2);
					priciplePlus += apartPlan.monthPriciple[i];
					interestPlus += apartPlan.monthInterest[i];
					totalPlus += apartPlan.monthRepay[i];
				}
				apartPlan.monthRepay[this.repayNum - 1] = +(apartPlan.totalRepay - totalPlus).toFixed(2);
				apartPlan.monthPriciple[this.repayNum - 1] = +(amount - priciplePlus).toFixed(2);
				apartPlan.monthInterest[this.repayNum - 1] = +(apartPlan.monthRepay[this.repayNum - 1] - apartPlan.monthPriciple[this.repayNum - 1]).toFixed(2);
				return apartPlan;
			}
		};
		
		function moneyFloor(num){
			return +(Math.floor(num * 100) / 100).toFixed(2);
		}
		window.CalcProduct = CalcProduct;
    }
})();