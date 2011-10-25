module("baidu.data.Validator");

(function() {
	te.validations = {
               "isName": [
                   {rule: "length", conf: {len: 7}}
               ],
               "isSchools": [
                   {rule: "array" }
               ],
               "isNick": [
                   {rule: "remote", conf: {
                       url: '../../baidu/data/Validator/remote_get.php?_charset=utf_8',
                       key: 'nick',
                       method: 'get',
                       onsuccess: function(value, xhr, responseText){
                    	   if(responseText == 'yangyang')
                    		   ok(true, "The remote is rihgt : yangyang");
                    	   start();
                       },
                       onfailure: function(xhr){
                       }
                   }},
                    {rule: "equalTo", conf: {refer: 'yangyang'}},
                    {rule: "length", conf: {len: 8}}
                    
               ],
               "isNickPost": [
                          {rule: "remote", conf: {
                              url: '../../baidu/data/Validator/remote_post.php',
                              key: 'nick',
                              method: 'post',
                              callback: function(value, xhr, responseText){
                           	   if(responseText == 'yangyang')
                           		   ok(true, "The remote is rihgt : yangyang");
                           	   start();
                              }
                          }}
                      ],
               "isDate": [
                   {rule: "date"}
               ]
           };
	
    te.isEmpty = function(obj)
    {
        for (var name in obj)
        {
            return false;
        }
        return true;
    };
})();

test("create", function(){
	expect(2);
	var validator = new baidu.data.Validator(te.validations);
	ok(te.isEmpty(validator._rules), "The _rules is right");
	equals(validator._validations, te.validations , "The _validations is right");
});

test("validate, no params", function(){
	expect(1);
	var validator = new baidu.data.Validator(te.validations);
	validator.validate([]);
	ok(true, "No errors");
});

test("validate, success", function(){
	expect(2);
	var validator = new baidu.data.Validator(te.validations);
	var feedback = validator.validate([
		                    ["chengyn", "isName"], 
		                    [[1,2,3], "isSchools"]
	                    ]);
	equals(feedback.result, 'success', "The result is right");
	equals(feedback.detail.length, 0, "The detail is right");
});

test("validate, failure", function(){
	expect(6);
	var validator = new baidu.data.Validator(te.validations);
	var feedback = validator.validate([
		                    ["chengyn", "isName"], 
		                    [[1,2,3], "isSchools"], 
		                    ["jianling", "isNick"], 
		                    ["chengyang", "inexistence"]
	                    ]);
	equals(feedback.result, 'failure', "The result is right");
	equals(feedback.detail.length, 2, "The detail is right");
	equals(feedback.detail[0].index, 2, "The detail is right");
	equals(feedback.detail[0].rule, "equalTo", "The detail is right");
	equals(feedback.detail[1].index, 3, "The detail is right");
	equals(feedback.detail[1].rule, "inexistence", "The detail is right");
});

test("validate, successwithoutremote", function(){
	stop();
	expect(5);
	var validator = new baidu.data.Validator(te.validations);
	var feedback = validator.validate([
		                    ["chengyn", "isName"], 
		                    [[1,2,3], "isSchools"], 
		                    ["yangyang", "isNick"]
	                    ]);
	equals(feedback.result, 'successwithoutremote', "The result is right");
	equals(feedback.detail.length, 1, "The detail is right");
	equals(feedback.detail[0].index, 2, "The detail is right");
	equals(feedback.detail[0].rule, "remote", "The detail is right");
});

test("validate, post", function(){
	stop();
	expect(5);
	var validator = new baidu.data.Validator(te.validations);
	var feedback = validator.validate([
		                    ["yangyang", "isNickPost"]
	                    ]);
	equals(feedback.result, 'successwithoutremote', "The result is right");
	equals(feedback.detail.length, 1, "The detail is right");
	equals(feedback.detail[0].index, 0, "The detail is right");
	equals(feedback.detail[0].rule, "remote", "The detail is right");
});

test("test", function(){
	expect(5);
	var validator = new baidu.data.Validator(te.validations);
	var feedback = validator.test("chengyn", "length", {len: 7});
	ok(feedback.result, "The feedback is right");
	var feedback = validator.test("chengyang", "length", {len: 7});
	ok(!feedback.result, "The feedback is right");
	var feedback = validator.test("chengyn", "norule", {len: 7});
	ok(!feedback.result, "The feedback is right");
	var feedback = validator.test("chengyn", "isName", {len: 7});
	ok(feedback.result, "The feedback is right");
	var feedback = validator.test("chengyang", "isName", {len: 7});
	ok(!feedback.result, "The feedback is right");
});

test("addValidation", function(){
	expect(2);
	var validator = new baidu.data.Validator(te.validations);
	validator.addValidation("new", [{rule: "equalTo", conf: {refer : "tt"}}]);
	var feedback = validator.test("tt", "new");
	ok(feedback.result, "The feedback is right");
	var feedback = validator.test("tti", "new");
	ok(!feedback.result, "The feedback is right");
});

test("addRule", function(){
	expect(2);
	var validator = new baidu.data.Validator(te.validations);
	validator.addRule("empty", function(value){
		if(value.length == 0)
			return true;
		else return false;
	});
	var feedback = validator.test([], "empty");
	ok(feedback.result, "The feedback is right");
	var feedback = validator.test([1,2], "empty");
	ok(!feedback.result, "The feedback is right");
});

test("require", function(){
	expect(4);
	var result = baidu.data.Validator.validatorRules.require("cxzv");
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.require("");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.require([]);
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.require([1,2,3]);
	ok(result, "The result is right");
});

test("length", function(){
	expect(4);
	var result = baidu.data.Validator.validatorRules.length("cxzv", {len: 4});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.length([1,2,3], {len: 3});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.length("cxzv", {len: 5});
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.length([1,2,3], {len: 2});
	ok(!result, "The result is right");
});

test("equalTo", function(){
	expect(6);
	var result = baidu.data.Validator.validatorRules.equalTo("cxzv", {refer: "fdsa"});
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.equalTo([1,2,3], {refer: [1,2,3]});
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.equalTo(0, {refer: 0});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.equalTo(0, {refer: false});
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.equalTo(false, {refer: false});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.equalTo(true, {refer: false});
	ok(!result, "The result is right");
});

test("lengthRange", function(){
	expect(7);
	var result = baidu.data.Validator.validatorRules.lengthRange("cxzv", {min: 4, max : 4});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.lengthRange("cxzv", {min: 7, max : 2});
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.lengthRange("cxzv", {min: 0, max : 5});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.lengthRange("cxzv", {min: 0, max : 3});
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.lengthRange("cxzv", {max : 5});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.lengthRange("cxzv", {min: 3});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.lengthRange([1,2,3,4,5], {min: 4, max : 6});
	ok(result, "The result is right");
});

test("numberRange", function(){
	expect(6);
	var result = baidu.data.Validator.validatorRules.numberRange(4, {min: 4, max : 4});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.numberRange(4, {min: 7, max : 2});
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.numberRange(4, {min: 0, max : 5});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.numberRange(4, {min: 0, max : 3});
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.numberRange(4, {max : 5});
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.numberRange(4, {min: 3});
	ok(result, "The result is right");
});

test("email", function(){
	expect(7);
	var result = baidu.data.Validator.validatorRules.email("tianlili");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("tianlili@");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("tianlili@baidu");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("tianlili@baidu.com");
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("tianlili@.com");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("@baidu.com");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("tianili_com@baidu.com");
	ok(result, "The result is right");
});

test("url", function(){
	expect(9);
	var result = baidu.data.Validator.validatorRules.url("http://www");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.url("http://www.baidu.com");
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.url("http://out.bitunion.org");
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.url("http://localhost");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.url("http://www.google.com/custom?hl=zh-CN");
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.url("http://www.google.com/custom?hl=zh-CN&newwindow=1");
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.url("http://baike.baidu.com/view/1.htm#1");
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.url("https://github.com");
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.url("ftp://ftp.gimp.org");
	ok(result, "The result is right");
});

test("other", function(){
	expect(7);
	equals(baidu.data.Validator.validatorRules.array, baidu.lang.isArray, "The array");
	equals(baidu.data.Validator.validatorRules.boolean, baidu.lang.isBoolean, "The boolean");
	equals(baidu.data.Validator.validatorRules.date, baidu.lang.isDate, "The date");
	equals(baidu.data.Validator.validatorRules['function'], baidu.lang.isFunction, "The function");
	equals(baidu.data.Validator.validatorRules.number, baidu.lang.isNumber, "The number");
	equals(baidu.data.Validator.validatorRules.object, baidu.lang.isObject, "The object");
	equals(baidu.data.Validator.validatorRules.string, baidu.lang.isString, "The string");
});