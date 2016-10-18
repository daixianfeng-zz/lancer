;(function(){
	var gLineChart = {};
	if ( typeof define === "function" && define.amd ) {
	    define( 'gLineChart', ['require', 'jquery', 'G', 'echarts'], function(require) {
	        factory(require('jquery'), require('G'), require('echarts'));
	        return gLineChart;
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
		factory(require('jquery'), require('G'), require('echarts'))
		module.exports = gLineChart;
	}else{
	    factory(window.jQuery, window.G, window.echarts);
	}
	function factory($, G){
		var getRgbaByHex = function(color, opacity){
			color = color.replace('#','');
			var colorArr = [];
			var resultArr = [];
			var resultStr = '';
			if(color.length === 3){
				colorArr[0] = color[0];
				colorArr[1] = color[1];
				colorArr[2] = color[2];
			}else if(color.length === 6){
				colorArr[0] = color[0] + color[1];
				colorArr[1] = color[2] + color[3];
				colorArr[2] = color[4] + color[5];
			}else{
				return 'transparent';
			}
			$.each(colorArr, function(i, v){
				var num = parseInt(v, 16);
				resultArr.push(num);
			});
			resultArr.push(opacity);
			return 'rgba('+resultArr.join(',')+')';
		};
		var gLineChart = function(el, data, graphColor, valueFormat){
			var xData = [];
			var yData = [];
			valueFormat = valueFormat || function(params){ return (params.name ? params.value : params[0].value); };
			$.each(data, function(i, v){
				xData.push(v.x);
				yData.push(v.y); 
			});
			// 基于准备好的dom，初始化echarts实例
	        var lineChart = echarts.init($(el)[0]);

	        // 指定图表的配置项和数据
	        var option = {
			    tooltip: {
			        trigger: 'item',
			        formatter: valueFormat,
			        position: 'top',
			        padding: 5,
			        backgroundColor: graphColor,
			        transitionDuration: 0,
			        textStyle: {
			        	color: '#fff',
			        	fontSize: 14
			        }
			    },
			    grid: {
					top: 20,
					left: 50,
					right: 70,
					bottom: 52
			    },
			    xAxis:  {
			        type: 'category',
			        boundaryGap: false,
			        data: xData,
			        axisLabel: {
			        	margin: 12,
			            textStyle: {
			            	color: '#999'
			            }
			        },
			        axisTick: {
			        	inside: true
			        },
			        axisLine: {
			        	lineStyle: {
			        		color: '#ccc'
			        	}
			        }
			    },
			    yAxis: {
			        type: 'value',
			        min: 0,
			        axisLabel: {
			            formatter: valueFormat,
			            show: false,
			        },
			        axisTick: {
			        	inside: true
			        },
			        axisLine: {
			        	lineStyle: {
			        		color: '#ccc'
			        	}
			        },
			        splitLine: {
			        	show: false
			        }
			    },
			    series: [
			        {
			            name:'收益率',
			            type:'line',
			            data: yData,
			            symbolSize: 6,
			            itemStyle: {
			            	normal: {
			            		color: graphColor
			            	},
			            	emphasis:{
			            		borderColor: new echarts.graphic.RadialGradient(0.5, 0.5, 0.5, [{
								  offset: 0, color: 'transparent' 
								},{
								  offset: 0.33, color: 'transparent' 
								},{
								  offset: 0.33, color: graphColor 
								}, {
								  offset: 0.70, color: graphColor 
								}, {
								  offset: 0.70, color: getRgbaByHex(graphColor,0.3)
								}, {
								  offset: 1, color: getRgbaByHex(graphColor,0.3) 
								}], false),
			            		borderWidth: 12
			            	}
			            }
			        }
			    ]
			};

	        // 使用刚指定的配置项和数据显示图表。
	        lineChart.setOption(option);
	        return lineChart;
		};
		window.gLineChart = gLineChart;
	};
})();