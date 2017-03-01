;(function(){
    if ( typeof define === "function" && define.amd ) {
        define( 'GFilterTable', ['require', 'jquery', 'G', 'GPagination'], function(require) {
            return factory(require('jquery'), require('G'), require('GPagination'));
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(require('jquery'), require('G'), require('GPagination'));
    }else{
        window.FilterTable = factory(window.jQuery, window.G);
    }
    function factory($, G, GPagination){
        var cssObj = {
            //显示省略号设置
            tableNowrap: {
                tableLayout: 'fixed',
                width: '100%'
            },
            tableTdNowrap: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }
        };
        var configDefault = {
            tableClass: '',
            tableTextAlign: 'left',
            theadTextAlign: 'left',
            nowrap: true,
            filterItem: false,
            filterContainer: '#filter-content',
            filterItemClass: 'filter-item',
            filterActiveClass: 'active',
            pageConfig: {},
            // col: [{thead:"购买日期", order: true, textAlign:'left', dataName:'buyDate'},{thead:"起购金额", order: false, textAlign:'left', dataName:'buyMoney'},{thead:"开始日期", order: false, textAlign:'left',dataName:'createTime'},{thead:"结束日期", order: false, textAlign:'left', dataName:'endDate'},{thead:"投资编号", order: true, textAlign:'left', dataName:'investmentId'},{thead:"剩余时间", order: true, textAlign:'left', dataName:'leftTime'},{thead:"订单编号", order: false, textAlign:'left', dataName:'orderId'},{thead:"产品编号", order: false, textAlign:'left', dataName:'productId'},{thead:"产品名称", order: false, textAlign:'left', dataName:'productName'},{thead:"产品名称", order: false, textAlign:'left', dataName:'productTitle'},{thead:"产品类型", order: false, textAlign:'left', dataName:'productType'},{thead:"产品收益", order: false, textAlign:'left', dataName:'received'},{thead:"产品状态", order: false, textAlign:'left', dataName:'status'}],
            // getData: function(conditions, callback){
            //     $.ajax({
            //         url: '/filtertable/filtertable.json',
            //         data: conditions,
            //         type: 'post',
            //         dataType: 'json',
            //         success: function(result){
            //             var info = {};
            //             if(G.apiError(result, info)){
            //                 callback(result.data.dataList);    
            //             }      
            //         }
            //     });    
            // }
        };
        var FilterTable = function(el, config){
            this.el = el;
            this.conf = $.extend({}, configDefault, config);
            this.init();
            return this;
        };
        FilterTable.prototype = {
            _getData: function(conditions, callback){
                var conf = this.conf;
                var self = this;
                conf.getData(conditions, function(result, pageData){
                    self.renderData(result);
                    if(pageData){
                        self.pagination.render(pageData);
                    }
                    if(callback){
                        callback(result, pageData);
                    }
                });
            },
            _render: function(){
                var el = this.el;
                var conf = this.conf;
                $(el).addClass('filter-table');
                var theadTh = '';
                $.each(conf.col, function(index, item){
                    var orderIcon = '';            
                    if(item.order){
                        orderIcon = '<i class="order-icon"></i>';   
                    }               
                    theadTh += '<th style="width:'+item.width+';" data-num='+(index+1)+'>'+item.thead+orderIcon+'</th>';            
                });
                $(el).append('<thead class="filter-thead"><tr>'+theadTh+'</tr></thead><tbody class="filter-tbody"></tbody>');
            },
            _event: function(){
                var el = this.el;
                var conf = this.conf;
                var self = this;
                if(conf.filterItem){
                    $(conf.filterContainer).find('.'+conf.filterItemClass).on('click', function(){
                        $(this).addClass(conf.filterActiveClass);
                        $(this).siblings('.'+conf.filterItemClass).removeClass(conf.filterActiveClass); 
                        var filter = $(this).attr('data-filter');
                        self._getData(conf.filterItem[filter].conditions, function(result, pageData){
                            self.conditions = conf.filterItem[filter].conditions;
                        });
                        return false;
                    });
                }
                
                var isSort = 0;
                $(el).find('.filter-thead').on('click','th', function(){
                    if($(this).find('.order-icon').length === 1){
                        var num = $(this).attr('data-num');
                        var sortList = [];
                        var sortText = [];
                        $(el).find('.filter-tbody').find('td[data-order="'+num+'"]').each(function(){ 
                            sortList.push($(this).closest('tr')); 
                            sortText.push($(this).text());                      
                        });
                        if(isSort == 0){
                            self._sortTable(sortList, sortText);
                            isSort =1;
                        }else if(isSort == 1){
                            self._sortTable(sortList, sortText).reverse();
                            isSort =0;    
                        } 
                        $(el).find('.filter-tbody tr').remove();
                        $(el).find('.filter-tbody').append(sortList);
                    }
                });  
            },
            _sortTable: function(sortList,sortText){
                for(var i=0;i<sortList.length-1;i++){
                    for(var j=0,temp=0,temp2=0;j<sortList.length-1-i;j++){
                        if(sortText[j] > sortText[j+1]){
                            temp = sortList[j];
                            temp2 = sortText[j];
                            sortList[j] = sortList[j+1];
                            sortText[j] = sortText[j+1];
                            sortList[j+1] = temp;     
                            sortText[j+1] = temp2;     
                        }
                    }
                }
                return sortList;
            },
            init: function(){
                var el = this.el;
                var self = this;
                var conf = this.conf;
                this._render();
                $(el).css(cssObj.tableNowrap);
                if(conf.nowrap){
                    this.setNowrap(); 
                }
                if(conf.page){
                    self.pagination = new GPagination(conf.page, function(page){
                        self._getData($.extend({},self.conditions,{page: page}));
                    }, conf.pageConfig);
                }
                this.specialCol();
                this._event();
                if($(el).find('.filter-item').length > 0){
                    $(el).find('.filter-item').first().trigger('click');
                }else{
                    self._getData({});
                }
                
            },
            setNowrap: function(){
                var el = this.el;
                $(el).find('.filter-thead th').css(cssObj.tableTdNowrap);
                $(el).find('.filter-tbody td').css(cssObj.tableTdNowrap); 
            },
            specialCol: function(){
                var conf = this.conf;
                var el =this.el;
                conf.col.textAlign = conf.col.textAlign ? conf.col.textAlign : conf.tableTextAlign;
                $(el).css('textAlign', conf.tableTextAlign);
                $(el).find('.filter-thead th').css('textAlign', conf.theadTextAlign);
                $.each(conf.col, function(index ,item){
                    $(el).find('td[data-order="'+(index+1)+'"]').css('textAlign', item.textAlign);
                });
            },
            renderData: function(data){
                var el = this.el;
                var conf = this.conf;
                var info = {};
                var trStr = '';
                var tbodyTr = '';    
                $(el).find('.filter-tbody tr').remove();
                if(this.conf.format){
                    data = this.conf.format(data);
                }
                $.each(data ,function(index, item){
                    $.each(conf.col, function(i, value){
                        var output = value.dataName;                        
                        trStr += '<td data-order="'+(i+1)+'">'+item[output]+'</td>';
                    });
                    tbodyTr = '<tr>'+ trStr +'</tr>';
                    $(tbodyTr).data('tr-data', item).appendTo($(el).find('.filter-tbody'));
                    trStr = '';
                });
                tbodyTr = '';
                if(conf.nowrap){
                    this.setNowrap(); 
                }
                this.specialCol();
            }
        };

        return FilterTable;
    }
})();