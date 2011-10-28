module("baidu.data.ModelManager");

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

test("define&create common", function() {
	expect(13);
	var DMdefine = {
        fields:[{
            name: 'firstName',
            type: 'string',
            defaultValue: 'my firstName'
        },{
            name: 'lastName',
            type: 'string',
            defaultValue: 'my lastName'
        },{
            name: 'age',
            type: 'number',
            defaultValue: 20
        },{
            name: 'isMarried',
            type: 'boolean',
            defaultValue: false
        }]
    };

    baidu.data.ModelManager.defineDM('user', DMdefine);
    var DMInfo= baidu.data.ModelManager.createDM('user');
    
    equals(DMInfo[0], 0, "The index is right");
    ok(DMInfo[1]._fields.firstName, "The fields are right");
    ok(DMInfo[1]._fields.lastName, "The fields are right");
    ok(DMInfo[1]._fields.age, "The fields are right");
    ok(DMInfo[1]._fields.isMarried, "The fields are right");
    equals(DMInfo[1]._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo[1]._fields.firstName._defaultValue, 'my firstName', "The fields are right");
    equals(DMInfo[1]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo[1]._fields.lastName._defaultValue, 'my lastName', "The fields are right");
    equals(DMInfo[1]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo[1]._fields.age._defaultValue, 20, "The fields are right");
    equals(DMInfo[1]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo[1]._fields.isMarried._defaultValue, false, "The fields are right");
});

test("define&create default", function() {
	expect(13);
	var DMdefine = {
        fields:[{
            name: 'firstName'
        },{
            name: 'lastName'
        },{
            name: 'age',
            type: 'number'
        },{
            name: 'isMarried',
            type: 'boolean'
        }]
    };

    baidu.data.ModelManager.defineDM('user', DMdefine);
    var DMInfo= baidu.data.ModelManager.createDM('user');
    
    equals(DMInfo[0], 1, "The index is right");
    ok(DMInfo[1]._fields.firstName, "The fields are right");
    ok(DMInfo[1]._fields.lastName, "The fields are right");
    ok(DMInfo[1]._fields.age, "The fields are right");
    ok(DMInfo[1]._fields.isMarried, "The fields are right");
    equals(DMInfo[1]._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo[1]._fields.firstName._defaultValue, '', "The fields are right");
    equals(DMInfo[1]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo[1]._fields.lastName._defaultValue, '', "The fields are right");
    equals(DMInfo[1]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo[1]._fields.age._defaultValue, 0, "The fields are right");
    equals(DMInfo[1]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo[1]._fields.isMarried._defaultValue, true, "The fields are right");
});

test("define&create other type", function() {
	expect(19);
	var DMdefine1 = {
        fields:[{
            name: 'Tangram',
            type: 'string',
            defaultValue: 'base'
        }]
    };

    var DMInfo= baidu.data.ModelManager.createDM('user');
    baidu.data.ModelManager.defineDM('project', DMdefine1);
    var DMInfo1= baidu.data.ModelManager.createDM('project');
    var DMInfo2= baidu.data.ModelManager.createDM('user1');
    
    equals(DMInfo[0], 2, "The index is right");
    ok(DMInfo[1]._fields.firstName, "The fields are right");
    ok(DMInfo[1]._fields.lastName, "The fields are right");
    ok(DMInfo[1]._fields.age, "The fields are right");
    ok(DMInfo[1]._fields.isMarried, "The fields are right");
    equals(DMInfo[1]._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo[1]._fields.firstName._defaultValue, '', "The fields are right");
    equals(DMInfo[1]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo[1]._fields.lastName._defaultValue, '', "The fields are right");
    equals(DMInfo[1]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo[1]._fields.age._defaultValue, 0, "The fields are right");
    equals(DMInfo[1]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo[1]._fields.isMarried._defaultValue, true, "The fields are right");
    
    equals(DMInfo1[0], 3, "The index is right");
    ok(DMInfo1[1]._fields.Tangram, "The fields are right");
    equals(DMInfo1[1]._fields.Tangram._name, 'Tangram', "The fields are right");
    equals(DMInfo1[1]._fields.Tangram._defaultValue, 'base', "The fields are right");
    
    equals(DMInfo2[0], 4, "The index is right");
    ok(!DMInfo2[1]._fields.Tangram && !DMInfo2[1]._fields.age, "The fields are right");
});

test("getDMByIndex", function() {
	expect(40);

    var DMInfo0= baidu.data.ModelManager.getDMByIndex(0);
    var DMInfo1= baidu.data.ModelManager.getDMByIndex(1);
    var DMInfo2= baidu.data.ModelManager.getDMByIndex(2);
    var DMInfo3= baidu.data.ModelManager.getDMByIndex(3);
    var DMInfo4= baidu.data.ModelManager.getDMByIndex(4);

    ok(DMInfo0._fields.firstName, "The fields are right");
    ok(DMInfo0._fields.lastName, "The fields are right");
    ok(DMInfo0._fields.age, "The fields are right");
    ok(DMInfo0._fields.isMarried, "The fields are right");
    equals(DMInfo0._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo0._fields.firstName._defaultValue, 'my firstName', "The fields are right");
    equals(DMInfo0._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo0._fields.lastName._defaultValue, 'my lastName', "The fields are right");
    equals(DMInfo0._fields.age._name, 'age', "The fields are right");
    equals(DMInfo0._fields.age._defaultValue, 20, "The fields are right");
    equals(DMInfo0._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo0._fields.isMarried._defaultValue, false, "The fields are right");

    ok(DMInfo1._fields.firstName, "The fields are right");
    ok(DMInfo1._fields.lastName, "The fields are right");
    ok(DMInfo1._fields.age, "The fields are right");
    ok(DMInfo1._fields.isMarried, "The fields are right");
    equals(DMInfo1._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo1._fields.firstName._defaultValue, '', "The fields are right");
    equals(DMInfo1._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo1._fields.lastName._defaultValue, '', "The fields are right");
    equals(DMInfo1._fields.age._name, 'age', "The fields are right");
    equals(DMInfo1._fields.age._defaultValue, 0, "The fields are right");
    equals(DMInfo1._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo1._fields.isMarried._defaultValue, true, "The fields are right");

    ok(DMInfo2._fields.firstName, "The fields are right");
    ok(DMInfo2._fields.lastName, "The fields are right");
    ok(DMInfo2._fields.age, "The fields are right");
    ok(DMInfo2._fields.isMarried, "The fields are right");
    equals(DMInfo2._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo2._fields.firstName._defaultValue, '', "The fields are right");
    equals(DMInfo2._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo2._fields.lastName._defaultValue, '', "The fields are right");
    equals(DMInfo2._fields.age._name, 'age', "The fields are right");
    equals(DMInfo2._fields.age._defaultValue, 0, "The fields are right");
    equals(DMInfo2._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo2._fields.isMarried._defaultValue, true, "The fields are right");

    ok(DMInfo3._fields.Tangram, "The fields are right");
    equals(DMInfo3._fields.Tangram._name, 'Tangram', "The fields are right");
    equals(DMInfo3._fields.Tangram._defaultValue, 'base', "The fields are right");

    ok(!DMInfo4._fields.Tangram && !DMInfo4._fields.age, "The fields are right");
});

test("getDMByType", function() {
	expect(40);

    var DMInfo2= baidu.data.ModelManager.getDMByType('user');
    var DMInfo3= baidu.data.ModelManager.getDMByType('project');
    var DMInfo4= baidu.data.ModelManager.getDMByType('user1');
    
    ok(DMInfo2[0]._fields.firstName, "The fields are right");
    ok(DMInfo2[0]._fields.lastName, "The fields are right");
    ok(DMInfo2[0]._fields.age, "The fields are right");
    ok(DMInfo2[0]._fields.isMarried, "The fields are right");
    equals(DMInfo2[0]._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo2[0]._fields.firstName._defaultValue, 'my firstName', "The fields are right");
    equals(DMInfo2[0]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo2[0]._fields.lastName._defaultValue, 'my lastName', "The fields are right");
    equals(DMInfo2[0]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo2[0]._fields.age._defaultValue, 20, "The fields are right");
    equals(DMInfo2[0]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo2[0]._fields.isMarried._defaultValue, false, "The fields are right");

    ok(DMInfo2[1]._fields.firstName, "The fields are right");
    ok(DMInfo2[1]._fields.lastName, "The fields are right");
    ok(DMInfo2[1]._fields.age, "The fields are right");
    ok(DMInfo2[1]._fields.isMarried, "The fields are right");
    equals(DMInfo2[1]._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo2[1]._fields.firstName._defaultValue, '', "The fields are right");
    equals(DMInfo2[1]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo2[1]._fields.lastName._defaultValue, '', "The fields are right");
    equals(DMInfo2[1]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo2[1]._fields.age._defaultValue, 0, "The fields are right");
    equals(DMInfo2[1]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo2[1]._fields.isMarried._defaultValue, true, "The fields are right");

    ok(DMInfo2[2]._fields.firstName, "The fields are right");
    ok(DMInfo2[2]._fields.lastName, "The fields are right");
    ok(DMInfo2[2]._fields.age, "The fields are right");
    ok(DMInfo2[2]._fields.isMarried, "The fields are right");
    equals(DMInfo2[2]._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo2[2]._fields.firstName._defaultValue, '', "The fields are right");
    equals(DMInfo2[2]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo2[2]._fields.lastName._defaultValue, '', "The fields are right");
    equals(DMInfo2[2]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo2[2]._fields.age._defaultValue, 0, "The fields are right");
    equals(DMInfo2[2]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo2[2]._fields.isMarried._defaultValue, true, "The fields are right");

    ok(DMInfo3[3]._fields.Tangram, "The fields are right");
    equals(DMInfo3[3]._fields.Tangram._name, 'Tangram', "The fields are right");
    equals(DMInfo3[3]._fields.Tangram._defaultValue, 'base', "The fields are right");

    ok(!DMInfo4[4]._fields.Tangram && !DMInfo4[4]._fields.age, "The fields are right");
});

test("setValidator", function() {
	expect(1);
	stop();
	ua.importsrc("baidu.data.Validator", function(){
		var DMdefine = {
	        fields:[{
	            name: 'firstName',
	            type: 'string',
	            defaultValue: 'my firstName'
	        },{
	            name: 'lastName',
	            type: 'string',
	            defaultValue: 'my lastName'
	        },{
	            name: 'age',
	            type: 'number',
	            defaultValue: 20
	        },{
	            name: 'isMarried',
	            type: 'boolean',
	            defaultValue: false
	        }]
	    };
	
	    baidu.data.ModelManager.defineDM('user', DMdefine);
	    var validator = new baidu.data.Validator(te.validations);
	    baidu.data.ModelManager.setValidator(validator);
	    var DMInfo= baidu.data.ModelManager.createDM('user');
	    
	    equals(DMInfo[1]._validator, validator, "The _validator is right");
	    start();
	}, "baidu.data.Validator", "baidu.data.ModelManager");
});

test("create with validator", function() {
	expect(1);
	var DMdefine = {
        fields:[{
            name: 'firstName',
            type: 'string',
            defaultValue: 'my firstName'
        },{
            name: 'lastName',
            type: 'string',
            defaultValue: 'my lastName'
        },{
            name: 'age',
            type: 'number',
            defaultValue: 20
        },{
            name: 'isMarried',
            type: 'boolean',
            defaultValue: false
        }]
    };

	var validations = {
           "isNew": [
               {rule: "length", conf: {len: 10}}
           ]
       };
    baidu.data.ModelManager.defineDM('user', DMdefine);
    var validator = new baidu.data.Validator(validations);
    var DMInfo= baidu.data.ModelManager.createDM('user', {
    	validator : validator
    });
    
    equals(DMInfo[1]._validator, validator, "The _validator is right");
});