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
            activeClass: 'page-active',
            wrapper: '<a>${page}</a>'
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
				var $tmpPage = $();
				var $pagination = $(el).empty();
				$pagination.attr('data-totalpage', pageData.totalPage);
				$tmpPage = $(conf.wrapper.replace('${page}', '&lt;')).addClass('page-item').addClass('page-prev');
				$pagination.append($tmpPage);
				var curPage = +pageData.page;
				var totalPage = +pageData.totalPage;
				(curPage > totalPage) && (curPage = totalPage+1);
				if(curPage > 4){
					$tmpPage = $(conf.wrapper.replace('${page}', '1')).addClass('page-item').attr('data-page', '1');
					$pagination.append($tmpPage);
					$tmpPage = $(conf.wrapper.replace('${page}', '...')).addClass('page-item').addClass('space');
					$pagination.append($tmpPage);

					$tmpPage = $(conf.wrapper.replace('${page}', curPage-2)).attr('data-page', curPage-2).addClass('page-item');
					$pagination.append($tmpPage);
					$tmpPage = $(conf.wrapper.replace('${page}', curPage-1)).attr('data-page', curPage-1).addClass('page-item');
					$pagination.append($tmpPage);
				}else{
					for(var i=1;i < curPage; i++){
						$tmpPage = $(conf.wrapper.replace('${page}', i)).addClass('page-item').attr('data-page', i);
						$pagination.append($tmpPage);
					}
				}
				$tmpPage = $(conf.wrapper.replace('${page}', curPage)).addClass('page-item').attr('data-page', curPage).addClass('active');
				$pagination.append($tmpPage);
				if(curPage < totalPage - 3){
					$tmpPage = $(conf.wrapper.replace('${page}', curPage+1)).addClass('page-item').attr('data-page', curPage+1);
					$pagination.append($tmpPage);
					$tmpPage = $(conf.wrapper.replace('${page}', curPage+2)).addClass('page-item').attr('data-page', curPage+2);
					$pagination.append($tmpPage);

					$tmpPage = $(conf.wrapper.replace('${page}', '...')).addClass('page-item').addClass('space');
					$pagination.append($tmpPage);
					$tmpPage = $(conf.wrapper.replace('${page}', totalPage)).addClass('page-item').attr('data-page', totalPage);
					$pagination.append($tmpPage);
				}else{
					for(var i=curPage+1;i <= totalPage; i++){
						$tmpPage = $(conf.wrapper.replace('${page}', i)).addClass('page-item').attr('data-page', i);
						$pagination.append($tmpPage);
					}
				}
				$tmpPage = $(conf.wrapper.replace('${page}', '&gt;')).addClass('page-item').addClass('page-next');
				$pagination.append($tmpPage);
			},
			_event: function(){
				var self = this;
				var el = this.el;
				$(el).on('click', '.page-item', function(){
					var page = $(el).find('.active').length ? +$(el).find('.active').attr('data-page') : 1;
					var totalPage = $(el).attr('data-totalpage');
					totalPage = +totalPage ? +totalPage : 100;
					if($(this).hasClass('active') || $(this).hasClass('space')){
						return false;
					}
					if($(this).hasClass('page-next')){
						page += 1;
					}else if($(this).hasClass('page-prev')){
						page -= 1;
					}else{
						page = +$(this).attr('data-page');
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