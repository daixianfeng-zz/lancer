;(function(){
	if ( typeof define === "function" && define.amd ) {
	    define( 'gTab', ['require', 'jquery', 'G'], function(require) {
	        factory(require('jquery'), require('G'));
	    } );
	}else if ( typeof module === "object" && typeof module.exports === "object" ) {
		factory(require('jquery'), require('G'));
	}else{
	    factory(window.jQuery, window.G);
	}
	function factory($, G){
		var defaultConfig = {
			itemActiveClass: 'g-tab-item-active',
			itemHoverClass: 'g-tab-item-hover',
			blockActiveClass: 'g-tab-block-active',
			initActive: ''
		};
		$.fn.gTab = function(tabConfig){
			var tabItems = $(this).find('.g-tab-item');
			var tabBlocksSel = [];
			var config = $.extend({}, defaultConfig, tabConfig);
			tabItems.each(function(i, el){
				var blockId = $(el).attr('data-tab-block');
				tabBlocksSel.push('#'+blockId);
			});
			var tabBlocks = $(tabBlocksSel.join(','));
			$(this).on('click', '.g-tab-item', function(e){
				var selectItem = $(this);
				var selectBlock = $('#'+$(this).attr('data-tab-block'));
				tabItems.removeClass(config.itemActiveClass);
				tabBlocks.removeClass(config.blockActiveClass);
				selectItem.addClass(config.itemActiveClass);
				selectBlock.addClass(config.blockActiveClass);
			});
			$(this).on('mouseenter', '.g-tab-item', function(){
				$(this).addClass(config.itemHoverClass);
			}).on('mouseleave', '.g-tab-item', function(){
				$(this).removeClass(config.itemHoverClass);
			});
			if(config.initActive){
				$('#'+config.initActive).trigger('click');
			}else{
				tabItems.first().trigger('click');
			}
		}
	};
})();