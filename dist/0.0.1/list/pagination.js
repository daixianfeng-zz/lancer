;(function(){
    if ( typeof define === "function" && define.amd ) {
        define( 'GPagination', ['require', 'jquery'], function(require) {
            return factory(require('jquery'));
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = factory(require('jquery'));
	}else{
        window.GPagination = factory(window.jQuery);
    }
    function factory($){
    	var defaultConfig = {
            hoverClass: 'page-hover',
            activeClass: 'page-active'
        };
    	var Pagination = function(el, callback, config){
			this.conf = $.extend({}, defaultConfig, config);
			this.callback = callback;
            this.el = el;
            this.init();
            return this;
    	}
		Pagination.prototype = {
			render: function(pageData){
				var el = this.el;
				var conf = this.conf;
				var $pagination = $(el).empty();
				$pagination.attr('data-totalpage', pageData.totalPage);
				$pagination.append(' <a class="page-prev">&lt;</a> ');
				var curPage = +pageData.page;
				var totalPage = +pageData.totalPage;
				(curPage > totalPage) && (curPage = totalPage+1);
				if(curPage > 4){
					$pagination.append(' <a>1</a> ').append(' <a class="space">...</a> ');
					$pagination.append(' <a>'+(curPage-2)+'</a> ').append(' <a>'+(curPage-1)+'</a> ');
				}else{
					for(var i=1;i < curPage; i++){
						$pagination.append('<a>'+i+'</a>');
					}
				}
				$pagination.append(' <a class="active">'+curPage+'</a> ');
				if(curPage < totalPage - 3){
					$pagination.append(' <a>'+(curPage+1)+'</a> ').append(' <a>'+(curPage+2)+'</a> ');
					$pagination.append(' <a class="space">...</a> ').append(' <a>'+totalPage+'</a> ');
				}else{
					for(var i=curPage+1;i <= totalPage; i++){
						$pagination.append(' <a>'+i+'</a> ');
					}
				}
				$pagination.append(' <a class="page-next">&gt;</a> ');
			},
			_event: function(){
				var self = this;
				var el = this.el;
				$(el).on('click', 'a', function(){
					var page = $(el).find('.active').length ? +$(el).find('.active').html() : 1;
					var totalPage = $(el).find('.page-next').prev('a').html();
					totalPage = +totalPage ? +totalPage : 100;
					if($(this).hasClass('active') || $(this).hasClass('space')){
						return false;
					}
					if($(this).hasClass('page-next')){
						page += 1;
					}else if($(this).hasClass('page-prev')){
						page -= 1;
					}else{
						page = +$(this).html();
					}
					if(page !== page || page < 1 || page > totalPage){
						return false;
					}
					self.callback(page);
					return false;
				});
			},
			init: function(){
				$(this.el).addClass('pagination').empty();
				this._event();
			}
		};
		return Pagination;
	}
})(window.jQuery)