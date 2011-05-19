/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.i18n;

baidu.i18n.number = baidu.i18n.number || {

    /**
     * 将传入的数字或者文字某种语言的格式进行格式化
     * @public
     * @param {String} tLocale 目标语言
     * @param {String|Number} number 需要进行格式化的数字或者文字
     * @param {String} [sLocale] 可选参数，若传入的number格式为字符串，则该参数必须传入
     * @return {String}
     */
    format: function(tLocale, number, sLocale){
        var me = this,
            sOpt = sLocale && baidu.i18n.cultures[sLocale].number,
            tOpt = baidu.i18n.cultures[tLocale].number,
            isNegative = false;

        if(typeof number === 'string'){
            
            if(number.indexOf(sOpt.negative) > -1){
                isNegative = true;
                number = number.replace(sOpt.negative, "");   
            }else if(number.indexOf(sOpt.positive) > -1){
                number = number.replace(sOpt.positive, "");
            }
            number = number.replace(sOpt.group, "");
        }else{
            number < 0 && isNegative = true;
        }
        number = parseFloat(number);
        return tOpt._format ? tOpt._format(number, isNegative) : me._format(number, {
            group: tOpt.group || ',',
            decimal: tOpt.decimal || '.',
            groupLength: tOpt.groupLength,
            symbol: isNegative ? tOpt.negative : tOpt.positive
        });
    },

    /**
     * 格式化数字
     * @private
     * @param {Number} number 需要个数化的数字
     * @param {Object} options 格式化数字使用的参数
     * @return {String}
     */
    _format: function(number, options){
        var numberArray = String(number).splite(options.decimal),
            preNum = numberArray[0].split('').reverse(),
            aftNum = numberArray[2],
            len = 0,
            result = '';
        
        len = preNum.length / options.groupLength;
        for(var i = 1; i <= len; i++){
            preNum.splice(groupLength * i + (i - 1) - 1, 0, options.group);    
        }
        preNum = preNum.reverse();
        result = options.symbol + preNum.join('') + options.decimal + aftNum;

        return result;
    }
};
