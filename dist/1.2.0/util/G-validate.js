;(function(){
    var gValidate = window.gValidate || {};
    if ( typeof define === "function" && define.amd ) {
        define( 'gValidate', ['require'], function(require) {
            factory();
            return gValidate;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory()
        module.exports = gValidate;
    }else{
        factory();
    }
    function factory(){
        gValidate.judgeIdcard = function(idcard){
            var Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ];    // 加权因子   
            var ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];            // 身份证验证位值.10代表X   
            function IdCardValidate(idCard) { 
                idCard = trim(idCard.replace(/ /g, ""));               //去掉字符串头尾空格                     
                if (idCard.length == 15) {   
                    return isValidityBrithBy15IdCard(idCard);       //进行15位身份证的验证    
                } else if (idCard.length == 18) {   
                    var a_idCard = idCard.split("");                // 得到身份证数组   
                    if(isValidityBrithBy18IdCard(idCard)&&isTrueValidateCodeBy18IdCard(a_idCard)){   //进行18位身份证的基本验证和第18位的验证
                        return true;   
                    }else {   
                        return false;   
                    }   
                } else {   
                    return false;   
                }   
            }   
            /**  
             * 判断身份证号码为18位时最后的验证位是否正确  
             * @param a_idCard 身份证号码数组  
             * @return  
             */  
            function isTrueValidateCodeBy18IdCard(a_idCard) {   
                var sum = 0;                             // 声明加权求和变量   
                if (a_idCard[17].toLowerCase() == 'x') {   
                    a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
                }   
                for ( var i = 0; i < 17; i++) {   
                    sum += Wi[i] * a_idCard[i];            // 加权求和   
                }   
                valCodePosition = sum % 11;                // 得到验证码所位置   
                if (a_idCard[17] == ValideCode[valCodePosition]) {   
                    return true;   
                } else {   
                    return false;   
                }   
            }   
            /**  
              * 验证18位数身份证号码中的生日是否是有效生日  
              * @param idCard 18位书身份证字符串  
              * @return  
              */  
            function isValidityBrithBy18IdCard(idCard18){   
                var year =  idCard18.substring(6,10);   
                var month = idCard18.substring(10,12);   
                var day = idCard18.substring(12,14);   
                var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
                // 这里用getFullYear()获取年份，避免千年虫问题   
                if(temp_date.getFullYear()!=parseFloat(year)   
                      ||temp_date.getMonth()!=parseFloat(month)-1   
                      ||temp_date.getDate()!=parseFloat(day)){   
                        return false;   
                }else{   
                    return true;   
                }   
            }   
              /**  
               * 验证15位数身份证号码中的生日是否是有效生日  
               * @param idCard15 15位书身份证字符串  
               * @return  
               */  
              function isValidityBrithBy15IdCard(idCard15){   
                  var year =  idCard15.substring(6,8);   
                  var month = idCard15.substring(8,10);   
                  var day = idCard15.substring(10,12);   
                  var temp_date = new Date(year,parseFloat(month)-1,parseFloat(day));   
                  // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
                  if(temp_date.getYear()!=parseFloat(year)   
                          ||temp_date.getMonth()!=parseFloat(month)-1   
                          ||temp_date.getDate()!=parseFloat(day)){   
                            return false;   
                    }else{   
                        return true;   
                    }   
              }   
            //去掉字符串头尾空格   
            function trim(str) {   
                return str.replace(/(^\s*)|(\s*$)/g, "");   
            }
            /**  
             * 通过身份证判断是男是女  
             * @param idCard 15/18位身份证号码   
             * @return 'female'-女、'male'-男  
             */  
            function maleOrFemalByIdCard(idCard){   
                idCard = trim(idCard.replace(/ /g, ""));        // 对身份证号码做处理。包括字符间有空格。   
                if(idCard.length==15){   
                    if(idCard.substring(14,15)%2==0){   
                        return '女';   
                    }else{   
                        return '男';   
                    }   
                }else if(idCard.length ==18){   
                    if(idCard.substring(14,17)%2==0){   
                        return '女';   
                    }else{   
                        return '男';   
                    }   
                }else{   
                    return null;   
                }   
            }
            return IdCardValidate(idcard);
        };
        gValidate.judgeBankCard = function(bankcard){
            //Luhm校验规则：16位银行卡号（19位通用）:
     
            // 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
            // 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
            // 3.将加法和加上校验位能被 10 整除。
             
            //方法步骤很清晰，易理解，需要在页面引用Jquery.js    
             
             
            //bankno为银行卡号 banknoInfo为显示提示信息的DIV或其他控件
            function luhmCheck(bankno){
                var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
             
                var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
                var newArr=new Array();
                for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
                    newArr.push(first15Num.substr(i,1));
                }
                var arrJiShu=new Array();  //奇数位*2的积 <9
                var arrJiShu2=new Array(); //奇数位*2的积 >9
                 
                var arrOuShu=new Array();  //偶数位数组
                for(var j=0;j<newArr.length;j++){
                    if((j+1)%2==1){//奇数位
                        if(parseInt(newArr[j])*2<9)
                        arrJiShu.push(parseInt(newArr[j])*2);
                        else
                        arrJiShu2.push(parseInt(newArr[j])*2);
                    }
                    else //偶数位
                    arrOuShu.push(newArr[j]);
                }
                 
                var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
                var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
                for(var h=0;h<arrJiShu2.length;h++){
                    jishu_child1.push(parseInt(arrJiShu2[h])%10);
                    jishu_child2.push(parseInt(arrJiShu2[h])/10);
                }        
                 
                var sumJiShu=0; //奇数位*2 < 9 的数组之和
                var sumOuShu=0; //偶数位数组之和
                var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
                var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
                var sumTotal=0;
                for(var m=0;m<arrJiShu.length;m++){
                    sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
                }
                 
                for(var n=0;n<arrOuShu.length;n++){
                    sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
                }
                 
                for(var p=0;p<jishu_child1.length;p++){
                    sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
                    sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
                }      
                //计算总和
                sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
                 
                //计算Luhm值
                var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
                var luhm= 10-k;
                 
                if(lastNum==luhm){
                    return true;
                }
                else{
                    return false;
                }        
            }
            return luhmCheck(bankcard);
        };

        gValidate.judgeMulti = function(money, base){
            var baseMoney = +base;
            if(baseMoney === 0){
                return true;
            }else if(!baseMoney){
                return false;
            }
            var judgeMoney = +money;
            var result = judgeMoney % +baseMoney;
            return (result === 0);
        };
        gValidate.judgeMin = function(money, min){
            var minMoney = +min;
            if(+minMoney === +minMoney && money < minMoney){
                return true;
            }else{
               return false; 
            }
        };
        gValidate.judgeMax = function(money, max){
            var maxMoney = +max;
            if(+maxMoney === +maxMoney && money > maxMoney){
                return true;
            }else{
               return false; 
            }
        };
        gValidate.judgeBetween = function(money, max, min){
            return judgeMin(money, min) && judgeMax(money, max);
        };
        gValidate.judgeFloat = function(number, f){
            if(+number !== +number){
                return false;
            }else{
                return +number.toFixed(f) === +number;
            }
        };

        gValidate.judgeReg = function(reg, val){
            if(!val){
                return false;
            }else if(!(reg.test(val))){
                return false;
            }else{
                return true;
            }
        }
        gValidate.judgeTruename = function(name){
            return gValidate.judgeReg(/([(\u4E00-\u9FBF|·)]+)/, name);
        };
        gValidate.judgeCellphone = function(cellphone){
            cellphone = cellphone.replace(/\D/g,'');
            return gValidate.judgeReg(/^1\d{10}$/, cellphone);
        };
        gValidate.judgeEmail = function(email){
            email = email.replace(/\s/g,'');
            return gValidate.judgeReg(/^[a-z0-9]+([._-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, email);
        };
        gValidate.judgeNormal = function(text){
            return gValidate.judgeReg(/^[a-zA-Z0-9]+$/, text);
        };
        gValidate.judgeChar = function(text){
            return gValidate.judgeReg(/^[0-9a-zA-Z\s\u0000-\u007F\u2000-\u206F\u3000-\u303F\uFF00-\uFFFF\u4E00-\u9FBF]+$/, text);
        };
        gValidate.judgePhone = function(text){
            return gValidate.judgeReg(/^[0-9-_+().\s]+$/, text);
        };
        gValidate.judgeNumber = function(text){
            return gValidate.judgeReg(/^[0-9]+$/, text);
        };
        gValidate.judgeMoney = function(money){
            return gValidate.judgeReg(/^[\d-,]+(.\d{1,2})?$/, money);
        };
        gValidate.judgePassword = function(pwd){
            return gValidate.judgeReg(/^(?![0-9]+$)(?![a-zA-Z]+$)(?![^0-9a-zA-Z]+$).{8,20}$/, pwd);
        };
        gValidate.judgeTrade = function(pwd){
            return gValidate.judgeReg(/^([0-9]){6}$/, pwd);
        };
        gValidate.judgeDate = function(date){
            return gValidate.judgeReg(/^(\d{2,4})-(\d{1,2})(-(\d{1,2}))?$/, date);
        };
        gValidate.judgeDatetime = function(datetime){
            return gValidate.judgeReg(/^((\d{2,4})-(\d{1,2})(-(\d{1,2}))?)?\s{0,1}((\d{1,2}):(\d{1,2})(:(\d{1,2}))?)?$/, datetime);
        };
        gValidate.judgeMaxLength = function(text, length){
            return text.length <= length;
        };
        gValidate.judgeMinLength = function(text, length){
            return text.length >= length;
        };
        gValidate.judgeMaxCharLength = function(text, length){
            return getCharLength(text) <= length*2;
        };
        gValidate.judgeMinCharLength = function(text, length){
            return getCharLength(text) >= length*2;
        };
        gValidate.judgePlus = function(num){
            if(!num){
                return false;
            }else if(+num > 0){
                return true;
            }else{
                return false;
            }
        };
        
        gValidate.judge = function(val, queue){
            var validateArr = (queue instanceof Array) ? queue : [queue];
            var result = true;
            for(var i=0;i<validateArr.length;i++){
                var validate = validateArr[i];
                if(validate instanceof Function){
                    var fnReuslt = validate(val);
                    if(fnReuslt !== true){
                        return fnReuslt;
                    }
                }else{
                    switch(validate){
                        case 'require': if(val!==0 && !val){return ['请填写',''];}break;
                        case 'loginPwd': if((val===0 || val) && !gValidate.judgePassword(val)){return '格式为8-20位数字与字母组合';}break;
                        case 'tradePwd': if((val===0 || val) && !gValidate.judgeTrade(val)){return '格式为6位数字';}break;
                        case 'cellphone': if((val===0 || val) && !gValidate.judgeCellphone(val)){return '格式不正确';}break;
                        case 'bankcard': if((val===0 || val) && !gValidate.judgeBankCard(val)){return '格式不正确';}break;
                        case 'identity': if((val===0 || val) && !gValidate.judgeIdcard(val)){return '格式不正确';}break;
                        case 'truename': if((val===0 || val) && !gValidate.judgeTruename(val)){return '格式不正确';}break;
                        case 'email': if((val===0 || val) && !gValidate.judgeEmail(val)){return '格式不正确';}break;
                        case 'plus': if((val===0 || val) && !gValidate.judgePlus(val)){return '必须大于0';}break;
                        case 'phone': if((val===0 || val) && !gValidate.judgePhone(val)){return '格式不正确';}break;
                        case 'normal': if((val===0 || val) && !gValidate.judgeNormal(val)){return '只能包含字母和数字';}break;
                        case 'char': if((val===0 || val) && !gValidate.judgeChar(val)){return '格式不正确';}break;
                        case 'money': if((val===0 || val) && !gValidate.judgeMoney(val)){return '格式为金融数字格式';}break;
                        case 'number': if((val===0 || val) && !gValidate.judgeNumber(val)){return '格式为纯数字';}break;
                        case 'date': if((val===0 || val) && !gValidate.judgeDate(val)){return '格式不正确';}break;
                        case 'datetime': if((val===0 || val) && !gValidate.judgeDatetime(val)){return '格式不正确';}break;
                        default:  break;
                    }
                    if(+validate === +validate){
                        if(!val){
                            continue;
                        }else if(+validate > 0 && !gValidate.judgeMaxLength(val, +validate)){
                            return '不能超过'+validate+'个字符';
                        }else if(+validate < 0 && !gValidate.judgeMinLength(val, -validate)){
                            return '不能少于'+(-validate)+'个字符';
                        }
                    }else if(/C$/.test(validate)){
                        var validateNum = parseInt(validate);
                        if(!val){
                            continue;
                        }if(validateNum > 0 && !gValidate.judgeMaxCharLength(val, +validateNum)){
                            return '不能超过'+validateNum+'个字节';
                        }else if(validateNum < 0 && !gValidate.judgeMinCharLength(val, -validateNum)){
                            return '不能少于'+(-validateNum)+'个字节';
                        }
                    }
                }
            }
            return result;
        };
        function getCharLength(str){
            var seatStr = str;
            seatStr = seatStr.replace(/[0-9]/g, 'a'); //数字
            seatStr = seatStr.replace(/[a-zA-Z]/g, 'a'); //英文
            seatStr = seatStr.replace(/[\s]/g, 'a'); //空字符
            seatStr = seatStr.replace(/[\u0000-\u007F]/g, 'a'); //基本控制符
            seatStr = seatStr.replace(/[\u2000-\u206F]/g, 'aa'); // 标点
            seatStr = seatStr.replace(/[\u3000-\u303F]/g, 'aa'); // 标点
            seatStr = seatStr.replace(/[\uFF00-\uFFFF]/g, 'aa'); // 全角
            seatStr = seatStr.replace(/[\u4E00-\u9FBF]/g, 'aa'); // 中文
            return seatStr.length;
        };
        window.gValidate = gValidate;
    }
})();