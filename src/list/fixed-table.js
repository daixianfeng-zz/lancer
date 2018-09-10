;(function(){
    if ( typeof define === "function" && define.amd ) {
        define( 'FixedTable', ['require', 'jquery'], function(require) {
            return factory(require('jquery'));
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = factory(require('jquery'));
	}else{
        window.FixedTable = factory(window.jQuery);
    }
    function factory($){
    	var defaultConfig = {
			id: 'table-'+(Math.random()*10000).toFixed(0),
			fixedSide: 'top',
			tableClass: 'table table-hover',
			hoverClass: 'tr-hover',
			topHead: [],
			leftHeadCells: 0,
			bgColor: '#393f4f',
			renderContent: function(data, $tbody){
				return;
			},
			renderFixed: function(data, $tbody){
				return;
			},
			renderScroll: function(data, $tbody){
				return;
			}
        };
    	var FixedTable = function(el, config){
			this.conf = $.extend({}, defaultConfig, config);
            this.el = el;
			this.init();
            return this;
    	}
		FixedTable.prototype = {
			renderTop: function(topHead){
				if(!topHead){
					return;
				}
				var topHeadStr = '';
				var topColStr = '';
				topHeadStr += '<thead>';
				topHeadStr += '	<tr>';
				for(var i=0; i<topHead.length; i++){
					topHeadStr += '	<th style="'+topHead[i].style+'">'+topHead[i].title+'</th>';
					topColStr += '<col width="'+(topHead[i].width||'')+'" />';
				}
				topHeadStr += '	</tr>';
				topHeadStr += '</thead>';
				var $top = $(this.el).find('.table-top-area');
				var $innerTop = $(this.el).find('.table-inner-area');
				$top.append('<table class="'+this.conf.tableClass+'">'+topHeadStr+'</table>');
				$innerTop.append('<table class="'+this.conf.tableClass+'">'+topColStr+topHeadStr+'<tbody></tbody></table>');
			},
			renderLeft: function(leftHeadCells, topHead){
				if(!leftHeadCells){
					return;
				}
				var leftHeadFirstStr = '';
				leftHeadFirstStr += '<thead>';
				leftHeadFirstStr += '	<tr>';
				for(var i=0;i<leftHeadCells;i++){
					leftHeadFirstStr += '		<th style="'+topHead[i].style+'">'+topHead[i].title+'</th>';
				}
				leftHeadFirstStr += '	</tr>';
				leftHeadFirstStr += '</thead>';
				var leftHeadStr = '';
				leftHeadStr += '<tbody>';
				leftHeadStr += '</tbody>';
				var $left = $(this.el).find('.table-left-area');
				$left.append('<table class="'+this.conf.tableClass+'">'+leftHeadFirstStr+leftHeadStr+'</table>');
			},
			renderInner: function(list){
				if(this.conf.fixedSide === 'top'){
					this.conf.renderContent(list, $(this.el).find('.table-inner-area tbody'));
				}else{
					this.conf.renderFixed(list, $(this.el).find('.table-left-area tbody'));
					this.conf.renderScroll(list, $(this.el).find('.table-inner-area tbody'));
				}
				this.resize();
			},
			init: function(){
				var containerStr = '';
				containerStr += '<div id="'+this.conf.id+'" class="table-contain">';
				containerStr += '	<div class="table-top-area"></div>';
				containerStr += '	<div class="table-left-area"></div>';
				containerStr += '	<div class="table-inner-area"></div>';
				containerStr += '</div>';
				$(this.el).html(containerStr);
				this.renderTop(this.conf.topHead);
				this.renderLeft(this.conf.leftHeadCells, this.conf.topHead);
				if(this.conf.fixedSide === 'left'){
					$(this.el).find('.table-inner-area').css('overflowX', 'scroll');
				}else{
					$(this.el).find('.table-inner-area').css('overflowY', 'scroll');
				}
				$(this.el).find('.table-top-area').css('backgroundColor', this.conf.bgColor);
				$(this.el).find('.table-left-area').css('backgroundColor', this.conf.bgColor);
				this._event();
				this.resize();
			},
			resize: function(){
				var self = this;
				var tableWidth = $(this.el).find('.table-inner-area table').outerWidth();
				var tableHeight = $(this.el).find('.table-inner-area table').outerHeight();
				var topHeight = $(this.el).find('.table-top-area').outerHeight();
				var leftWidth = 0;
				var fixedLeftCount = this.conf.leftHeadCells;
				$(this.el).find('.table-inner-area thead tr:first th').each(function(i, el){
					if(i<fixedLeftCount){
						leftWidth += $(el).outerWidth();
					}
					$(self.el).find('.table-top-area thead tr:first th').eq(i).css('width', $(el).outerWidth()).css('minWidth', $(el).outerWidth());
				});
				$(this.el).find('.table-inner-area tbody tr').each(function(i, el){
					$(self.el).find('.table-left-area tbody tr').eq(i).css('height', $(el).outerHeight()).css('minHeight', $(el).outerHeight());
				});
				$(this.el).find('.table-top-area table').css('width', 'auto');
				$(this.el).find('.table-top-area').css('height', topHeight).css('maxWidth', '100%');
				$(this.el).find('.table-left-area').css('width', leftWidth).css('maxHeight', '100%');
				$(this.el).find('.table-left-area table').css('height', 'auto');
			},
			_event: function(){
				var self = this;
				$(this.el).find('.table-inner-area').on('scroll', function(){
					var scrollLeft = $(this).scrollLeft();
					var scrollTop = $(this).scrollTop();
					$(self.el).find('.table-left-area table').css('transform', 'translateY('+(-scrollTop)+'px)');
					$(self.el).find('.table-top-area table').css('transform', 'translateX('+(-scrollLeft)+'px)');
				});
				$(this.el).find('.table-inner-area').on('mouseenter', 'tbody tr', function(){
					var trIndex = $(this).index();
					$(self.el).find('.table-left-area tbody').find('tr').eq(trIndex).addClass(self.conf.hoverClass);
				}).on('mouseleave', 'tbody tr', function(){
					var trIndex = $(this).index();
					$(self.el).find('.table-left-area tbody').find('tr').eq(trIndex).removeClass(self.conf.hoverClass);
				});
				$(this.el).find('.table-left-area').on('mouseenter', 'tbody tr', function(){
					var trIndex = $(this).index();
					$(self.el).find('.table-inner-area tbody').find('tr').eq(trIndex).addClass(self.conf.hoverClass);
				}).on('mouseleave', 'tbody tr', function(){
					var trIndex = $(this).index();
					$(self.el).find('.table-inner-area tbody').find('tr').eq(trIndex).removeClass(self.conf.hoverClass);
				});
				$(window).on('resize', function(){
					self.resize();
				});
			},
			syncClass: function(className, trIndex){
				var innerTr = $(this.el).find('.table-inner-area tbody').find('tr').eq(trIndex);
				innerTr.addClass(className).siblings('tr').removeClass(className);
				var leftTr = $(this.el).find('.table-left-area tbody').find('tr').eq(trIndex);
				leftTr.addClass(className).siblings('tr').removeClass(className);
			}
		};
		return FixedTable;
	}
})(window.jQuery)