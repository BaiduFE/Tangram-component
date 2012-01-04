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
                       url: upath + '../../baidu/data/Validator/remote_get.php?_charset=utf_8',
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
                              url: upath + '../../baidu/data/Validator/remote_post.php',
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
	stop();
	ua.importsrc("baidu.data.Validator.validatorRules", function(){
		var validator = new baidu.data.Validator(te.validations);
		ok(te.isEmpty(validator._rules), "The _rules is right");
		equals(validator._validations, te.validations , "The _validations is right");
		start();
	}, "baidu.data.Validator.validatorRules", "baidu.data.Validator");
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

