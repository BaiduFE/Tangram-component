/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 */

///import baidu.object.extend;

///import baidu.data.Validator;


baidu.data.Validator.register(function(me){
    /**
     * 用于存储返回值的枚举类
     */
    baidu.data.Validator.validatorResultTypes = {
        'SUCCESS': 'success',   //表示所有值都验证通过
        'FAILURE': 'failure',   //表示存在验证不通过的值
        'SUCCESSWITHOUTREMOTE': 'successwithoutremote' //表示除了使用remote方式验证的值，其他的都验证通过
    };
});