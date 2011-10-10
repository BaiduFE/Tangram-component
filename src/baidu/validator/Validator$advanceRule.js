/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.Object.extend;

///import baidu;
///import baidu.validator;

baidu.extend(baidu.validator.Rule,{
    
    required: function(val){
        return !!(val && !/^(?:\s|\u3000)+$/.test(val));
    },
    
    remote: function(xhr, val){
        return !!(val && val.toLowerCase() == 'true');
    },

    email: /^[\w!#\$%'\*\+\-\/=\?\^`{}\|~]+([.][\w!#\$%'\*\+\-\/=\?\^`{}\|~]+)*@[-a-z0-9]{1,20}[.][a-z0-9]{1,10}([.][a-z]{2})?$/i,
    
    number: /^(?:[1-9]\d+|\d)(?:\.\d+)?$/,
    
    maxlength: function(val, opt){
        return val.length <= opt;
    },
    
    minlength: function(val, opt){
        return val.length >= opt;
    },
    
    rangelength: function(val, opt){
        return val.length >= opt[0] && val.length <= opt[1];
    },
    
    equal: function(val, opt){
        return val === (baidu.lang.isFunction(opt) ? opt() : opt);
    },
    
    telephone: /^(((?:[\+0]\d{1,3}-[1-9]\d{1,2})|\d{3,4})-)?\d{5,8}$/
});
