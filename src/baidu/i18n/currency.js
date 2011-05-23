/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.i18n;
///import baidu.i18n.number;

baidu.i18n.currency = baidu.i18n.currency || {
    
    /**
     * 将传入的数字或者文字某种语言的货币格式进行格式化
     * @public
     * @param {String} tLocale 目标语言
     * @param {String|Number} number 需要进行格式化的数字或者文字
     * @param {String} [sLocale] 可选参数，若传入的number格式为字符串，则该参数必须传入
     * @return {String}
     */
    format: function(tLocale, number, sLocale){
        var me = this,
            sOpt = sLocale && baidu.i18n.cultures[sLocale].currency,
            tOpt = baidu.i18n.cultures[tLocale].currency,
            result;

        if(typeof number === "string"){
            number = number.replace(sOpt.symbol);
        }
        
        return tOpt.symbol + this._format(tLocale, number, sLocale);
    },

    /**
     * 按照语言的数字格式进行格式化
     * @private 
     * @param {String} tLocale 目标语言
     * @param {Number | Number} number 数字
     * @param {String} [sLocale] 可选参数，若传入的number格式为字符串，则该参数必须传入
     * @return {String}
     */
    _format: function(tLocale, number, sLocale){
        return baidu.i18n.number.format(tLocale, number, sLocale); 
    }
};
