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
            tableTextAlign: 'left',
            theadTextAlign: 'left',
            nowrap: true,
            filterActiveClass: 'active',
            // filterItem:[{name:"全部", conditions:{start:1022,end:1099}},{name:"待起息",conditions:{}},{name:"起息",conditions:{value:1}},{name:"代付款",conditions:{value:3}}],
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
                $(el).append('<div class="filter-content"></div><div class="filter-table-container"><table class="filter-table"></table></div>');
                var theadTh = '';
                var filterContent = '';
                $.each(conf.col, function(index, item){
                    var orderIcon = '';            
                    if(item.order){
                        orderIcon = '<i class="order-icon"></i>';   
                    }               
                    theadTh += '<th style="width:'+item.width+';" data-num='+(index+1)+'>'+item.thead+orderIcon+'</th>';            
                });
                $.each(conf.filterItem, function(index, item){
                    filterContent += '<a data-index="'+index+'" class="filter-item" href="javascript.void(0)">'+item.name+'</a>';
                });
                $(el).find('.filter-table').append('<thead class="filter-thead"><tr>'+theadTh+'</tr></thead><tbody class="filter-tbody"></tbody>');
                $(el).find('.filter-content').append(filterContent);
            },
            _event: function(){
                var el = this.el;
                var conf = this.conf;
                var self = this;
                $(el).find('.filter-item').on('click', function(){
                    toggleFilterClass($(this), conf.filterActiveClass);
                    var index = $(this).attr('data-index');
                    self._getData(conf.filterItem[index].conditions, function(result, pageData){
                        self.conditions = conf.filterItem[index].conditions;
                    });
                    return false;
                });
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
                $(el).find('.filter-table').css(cssObj.tableNowrap);
                if(conf.nowrap){
                    this.setNowrap(); 
                }
                if(conf.page){
                    self.pagination = new GPagination(conf.page, function(page){
                        self._getData($.extend({},self.conditions,{page: page}));
                    }, {});
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
                $(el).find('.filter-table').css('textAlign', conf.tableTextAlign);
                $(el).find('.filter-table th').css('textAlign', conf.theadTextAlign);
                $.each(conf.col, function(index ,item){
                    $(el).find('.filter-table td[data-order="'+(index+1)+'"]').css('textAlign', item.textAlign);
                });
            },
            renderData: function(data){
                var el = this.el;
                var conf = this.conf;
                var info = {};
                var trStr = '';
                var tbodyTr = '';
                $.each(data ,function(index, item){
                    $.each(conf.col, function(i, value){
                        var output = value.dataName;                        
                        trStr += '<td data-order="'+(i+1)+'">'+item[output]+'</td>';
                    });
                    tbodyTr += '<tr>'+ trStr +'</tr>';
                    trStr = '';
                });                                          
                $(el).find('.filter-tbody tr').remove();
                $(el).find('.filter-tbody').append(tbodyTr);
                tbodyTr = '';
                if(conf.nowrap){
                    this.setNowrap(); 
                }
                this.specialCol();
            }
        };
        function toggleFilterClass(el, className){
            el.addClass(className);
            el.siblings('.filter-item').removeClass(className);    
        }

        return FilterTable;
    }
})();