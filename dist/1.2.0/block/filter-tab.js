;(function(){
    if ( typeof define === "function" && define.amd ) {
        define( 'gFilterTab', ['require', 'jquery'], function(require) {
            factory(require('jquery'));
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'));
    }else{
        factory(window.jQuery);
    }
    function factory($){
        var defaultConfig = {
            itemActiveClass: 'g-ft-item-active',
            listActiveClass: 'g-ft-list-active',
            itemSelectClass: 'g-ft-list-selected',
            cellSelectedClass: 'g-ft-cell-selected'
        };
        $.fn.gFilterTab = function(tabConfig){
            var tabItems = $(this).children('.g-ft-item');
            var tabListsArr = [];
            var config = $.extend({}, defaultConfig, tabConfig);
            tabItems.each(function(i, el){
                var listId = $(el).attr('data-ft-list');
                tabListsArr.push('#'+listId);
            });
            var tabLists = $(tabListsArr.join(','));
            $(this).data('ft', {
                tabItems: tabItems,
                tabLists: tabLists,
                config: config
            })
            $(this).on('click', '.g-ft-item', function(e){
                var selectItem = $(this);
                var selectList = $('#'+$(this).attr('data-ft-list'));
                var prevSelectList = tabLists.filter(config.listActiveClass);
                tabItems.removeClass(config.itemActiveClass);
                tabLists.removeClass(config.listActiveClass);
                selectItem.addClass(config.itemActiveClass);
                selectList.addClass(config.listActiveClass);
                if($('#s-ft-mask').length === 0){
                    $(document.body).append('<div id="s-ft-mask"></div>');
                }
                $('#s-ft-mask').show();
                prevSelectList.trigger('gFilterTabHide');
                selectList.trigger('gFilterTabShow');
            });
            tabLists.on('click', '.g-ft-cell', function(e){
                var selectCell = $(this);
                var selectList = $(this).closest('.g-ft-list');
                var selectItem = $('#'+selectList.attr('data-ft-item'));
                selectItem.removeClass(config.itemActiveClass);
                selectItem.addClass(config.itemSelectClass);
                selectList.removeClass(config.listActiveClass);
                selectList.find('.g-ft-cell').removeClass(config.cellSelectedClass);
                selectCell.addClass(config.cellSelectedClass);
                var selectText = selectCell.attr('data-ft-text') || selectCell.text();
                selectText = selectCell.hasClass('select-all') ? selectItem.attr('data-ft-title') : selectText;
                selectItem.find('.g-ft-title-text').html(selectText);
                $('#s-ft-mask').hide();
                selectList.trigger('gFilterTabHide');
                selectCell.trigger('gFilterTabSelect');
            });
            $(window).on('click', '', function(e){
                if($(e.target).closest('.g-ft-list,.g-ft-item').length > 0){
                    return false;
                }else{
                    var prevSelectList = tabLists.filter(config.listActiveClass);
                    tabItems.removeClass(config.itemActiveClass);
                    tabLists.removeClass(config.listActiveClass);
                    $('#s-ft-mask').hide();
                    prevSelectList.trigger('gFilterTabHide');
                }
            });
        }
    }
})();