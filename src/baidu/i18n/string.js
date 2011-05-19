/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */
///import baidu.i18n;
baidu.i18n.string = baidu.i18n.string || {
    
    trim: function(locale, source){
        var pat = baidu.i18n.cultures[locale].whitespace;
        return String(source).replace(pat,"");
    }

};
