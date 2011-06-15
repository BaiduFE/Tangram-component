module("baidu.form.ValidRule");

test("addRule 添加存在的rule，方法被覆盖", function() {
	var vr = new baidu.form.ValidRule();

	vr.match('required', null, function(opt) {
		ok(!opt, "require被覆盖前");
	});

	vr.addRule('required', function() {
		return true;
	})

	vr.match('required', null, function(opt) {
		ok(opt, "require 方法被覆盖");
	});
});

test("addRule 添加不存在的rule", function() {
	var vr = new baidu.form.ValidRule();

	vr.addRule('notexist', function() {
		return true;
	})

	vr.match('notexist', null, function(opt) {
		ok(opt, "notexist方法校验返回");
	});
});

//参数类型修改，2个Kiss作废
//// BUG 当addRule是正则的时候，报错has no method 'test'
test("addRule 添加不存在的rule", function() {
	var vr = new baidu.form.ValidRule();

	vr.addRule('notexist', /^(?:[1-9]\d+|\d)(?:\.\d+)?$/);

	vr.match('notexist', '123', function(opt) {
		ok(opt, "notexist方法校验返回");
	});
});
//
//test("match不存在的name", function() {
//	var vr = new baidu.form.ValidRule();
//	vr.match({
//		1 : 2
//	}, '123', function(opt) {
//		ok(opt, "notexist方法校验返回");
//	});
//});

test("默认类型校验required", function() {
	var vr = new baidu.form.ValidRule();
	vr.match('required', '123', function(opt) {
		equal(opt, true, "required 填写正常值123返回：");
	});
	vr.match('required', '', function(opt) {
		equal(opt, false, "required 填写空串\"\"返回：");
	});
	vr.match('required', 'undefined', function(opt) {
		equal(opt, true, "required 填写\"undefined\"字符串返回：");
	});
	vr.match('required', undefined, function(opt) {
		equal(opt, false, "required 填写undefined返回：");
	});
	vr.match('required', 'null', function(opt) {
		equal(opt, true, "required 填写\'null\'字符串返回：");
	});
	vr.match('required', null, function(opt) {
		equal(opt, false, "required 填写null返回：");
	});
});

test("默认类型校验email", function() {
	var vr = new baidu.form.ValidRule();
	vr.match('email', '123.baidu.com',function(opt){
		equal(opt, false, "填写无@:123.baidu.com");
	});
	vr.match('email', '123.baidu.com@',function(opt){
		equal(opt, false, "填写@结尾:123.baidu.com@");
	});
	vr.match('email', '@baidu.com',function(opt){
		equal(opt, false, "填写@开头:@baidu.com");
	});
	vr.match('email', '@.baidu.com',function(opt){
		equal(opt, false, "填写@.连接使用:@.baidu.com");
	});
	vr.match('email', '.@baidu.com',function(opt){
		equal(opt, false, "填写.@连接使用:.@baidu.com");
	});
	vr.match('email', 'baidu@com',function(opt){
		equal(opt, false, "填写无.:baidu@com");
	});
	vr.match('email', '.123@baidu.com',function(opt){
		equal(opt, false, "填写.开头:.123@baidu.com");
	});
	vr.match('email', '123@baidu.com.',function(opt){
		equal(opt, false, "填写.结尾:123@baidu.com.");
	});
	vr.match('email', '123@baidu.com',function(opt){
		equal(opt, true, "填写正常数据:123@baidu.com");
	});
	vr.match('email', null,function(opt){
		equal(opt, false, "不填写");
	});
});

test("默认类型校验telephone", function() {
	var vr = new baidu.form.ValidRule();
	vr.match('telephone' , 12345678 , function(opt){
		equal(opt, true, "12345678");
	});
	vr.match('telephone' , 12345 , function(opt){
		equal(opt, true, "12345");
	});
	vr.match('telephone' , "12345" , function(opt){
		equal(opt, true, "12345");
	});
	vr.match('telephone' , "010-99999999" , function(opt){
		equal(opt, true, "010-99999999");
	});
	vr.match('telephone' , "010-99999999" , function(opt){
		equal(opt, true, "010-99999999");
	});
	vr.match('telephone' , "10010" , function(opt){
		equal(opt, true, "10010");
	});
	//手机号码改为不支持
//	vr.match('telephone' , 15011112222 , function(opt){
//		equal(opt, true, "15011112222");
//	});
	vr.match('telephone' , "123456F" , function(opt){
		equal(opt, false, "123456F");
	});
	vr.match('telephone' , "+86-10-12345678" , function(opt){
		equal(opt, true, "+86-10-12345678");
	});
	vr.match('telephone' , "+86-010-12345678" , function(opt){
		equal(opt, false, "+86-010-12345678");
	});
	vr.match('telephone' , "+119-10-12345678" , function(opt){
		equal(opt, true, "+119-10-12345678");
	});
	vr.match('telephone' , "0086-10-12345678" , function(opt){
		equal(opt, true, "0086-10-12345678");
	});
});

test("默认类型校验equal", function() {
	var vr = new baidu.form.ValidRule();
	vr.match('equal' , 'test' ,function(opt){
		equal(opt, true, 'test == test');
	} , {param:'test'});
	vr.match('equal' , 'tttt' ,function(opt){
		equal(opt, false, 'test != tttt');
	} , {param:'test'});
	vr.match('equal' , '' ,function(opt){
		equal(opt, false, 'test != \'\'');
	} , {param:'test'});
	vr.match('equal' , null ,function(opt){
		equal(opt, false, 'test != null');
	} , {param:'test'});
});
test("默认类型校验maxlength", function() {
	var vr = new baidu.form.ValidRule();
	vr.match('maxlength' , '1234567890' ,function(opt){
		equal(opt, true, '1234567890');
	} , {param:10});
	vr.match('maxlength' , '12345678901' ,function(opt){
		equal(opt, false, '12345678901');
	} , {param:10});
	vr.match('maxlength' , '12345678901' ,function(opt){
		equal(opt, true, '12345678901');
	} , {param:'111'});
	vr.match('maxlength' , '12345678901' ,function(opt){
		equal(opt, false, '12345678901');
	} , {param:'-1'});
});
test("默认类型校验minlength", function() {
	var vr = new baidu.form.ValidRule();
	vr.match('minlength' , '12345' ,function(opt){
		equal(opt, true, '12345');
	} , {param:5});
	vr.match('minlength' , '1234' ,function(opt){
		equal(opt, false, '1234');
	} , {param:5});
	vr.match('minlength' , '' ,function(opt){
		equal(opt, false, '\'\'');
	} , {param:5});
	
	// null或者undefined不校验 不属于String类型
//	vr.match('minlength' , null ,function(opt){
//		equal(opt, false, '');
//	} , {param:5});
	vr.match('minlength' , '12345' ,function(opt){
		equal(opt, true, '12345');
	} , {param:'5'});
	vr.match('minlength' , '' ,function(opt){
		equal(opt, true, '\'\'');
	} , {param:'-1'});
});
test("默认类型校验rangelength" ,function() {
	var vr = new baidu.form.ValidRule();
	vr.match('rangelength', '123' ,function(opt) {
		equal(opt, false, '123');
	}, {param:[4,10]});
	vr.match('rangelength', '1234' ,function(opt) {
		equal(opt, true, '1234');
	}, {param:[4,10]});
	vr.match('rangelength', '1234567890' ,function(opt) {
		equal(opt, true, '1234567890');
	}, {param:[4,10]});
	vr.match('rangelength', '12345678901' ,function(opt) {
		equal(opt, false, '12345678901');
	}, {param:[4,10]});
	vr.match('rangelength', '' ,function(opt) {
		equal(opt, false, '12345678901');
	}, {param:[4,10]});
});
test("默认类型校验number", function(){
	var vr = new baidu.form.ValidRule();
	vr.match('number', 123 ,function(opt) {
		equal(opt, true, '123');
	});
	vr.match('number', '123' ,function(opt) {
		equal(opt, true, '\'123\'');
	});
	vr.match('number', 'tt' ,function(opt) {
		equal(opt, false, 'tt');
	});
	vr.match('number', '' ,function(opt) {
		equal(opt, false, '\'\'');
	});
	vr.match('number', null ,function(opt) {
		equal(opt, false, 'null');
	});
	vr.match('number', undefined ,function(opt) {
		equal(opt, false, 'undefined');
	});
});
test("默认类型校验remote 404", function(){
	stop();
	var vr = new baidu.form.ValidRule();
	vr.match('remote', '',function(opt) {
		equal(opt ,false ,'undefined');
		clearTimeout(t);
		start();
	} , {param:upath+'notexits.php'})
	var t = setTimeout(function(){
		ok(false, 'timeout');
		start();
	},500);
});
test("默认类型校验remote 500", function(){
	stop();
	var vr = new baidu.form.ValidRule();
	vr.match('remote', '',function(opt) {
		equal(opt ,false ,'undefined');
		clearTimeout(t);
		start();
	} , {param:upath+'request.php?type=on&status=500'})
	var t = setTimeout(function(){
		ok(false, 'timeout');
		start();
	},500);
});
test("默认类型校验remote 200 true", function(){
	stop();
	var vr = new baidu.form.ValidRule();
	vr.match('remote', '',function(opt) {
		equal(opt ,true ,'undefined');
		clearTimeout(t);
		start();
	} , {param:upath+'request.php?type=on&status=200&valid=true'})
	var t = setTimeout(function(){
		ok(false, 'timeout');
		start();
	},500);
});
test("默认类型校验remote 200 false", function(){
	stop();
	var vr = new baidu.form.ValidRule();
	vr.match('remote', '',function(opt) {
		equal(opt ,false ,'200 false');
		clearTimeout(t);
		start();
	} , {param:upath+'request.php?type=on&status=200&valid=false'})
	var t = setTimeout(function(){
		ok(false, 'timeout');
		start();
	},500);
});