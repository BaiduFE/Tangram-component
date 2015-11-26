module("baidu.data.Validator.validatorRules");

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
	var result = baidu.data.Validator.validatorRules.email("xxxx");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("xxxx@");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("xxxx@baidu");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("xxxx@baidu.com");
	ok(result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("xxxx@.com");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("@baidu.com");
	ok(!result, "The result is right");
	result = baidu.data.Validator.validatorRules.email("xxxx_com@baidu.com");
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