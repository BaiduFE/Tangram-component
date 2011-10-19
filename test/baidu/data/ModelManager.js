module("baidu.data.ModelManager");

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
    equals(DMInfo[1]._fields.firstName.defaultValue, 'my firstName', "The fields are right");
    equals(DMInfo[1]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo[1]._fields.lastName.defaultValue, 'my lastName', "The fields are right");
    equals(DMInfo[1]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo[1]._fields.age.defaultValue, 20, "The fields are right");
    equals(DMInfo[1]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo[1]._fields.isMarried.defaultValue, false, "The fields are right");
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
    equals(DMInfo[1]._fields.firstName.defaultValue, '', "The fields are right");
    equals(DMInfo[1]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo[1]._fields.lastName.defaultValue, '', "The fields are right");
    equals(DMInfo[1]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo[1]._fields.age.defaultValue, 0, "The fields are right");
    equals(DMInfo[1]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo[1]._fields.isMarried.defaultValue, true, "The fields are right");
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
    equals(DMInfo[1]._fields.firstName.defaultValue, '', "The fields are right");
    equals(DMInfo[1]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo[1]._fields.lastName.defaultValue, '', "The fields are right");
    equals(DMInfo[1]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo[1]._fields.age.defaultValue, 0, "The fields are right");
    equals(DMInfo[1]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo[1]._fields.isMarried.defaultValue, true, "The fields are right");
    
    equals(DMInfo1[0], 3, "The index is right");
    ok(DMInfo1[1]._fields.Tangram, "The fields are right");
    equals(DMInfo1[1]._fields.Tangram._name, 'Tangram', "The fields are right");
    equals(DMInfo1[1]._fields.Tangram.defaultValue, 'base', "The fields are right");
    
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
    equals(DMInfo0._fields.firstName.defaultValue, 'my firstName', "The fields are right");
    equals(DMInfo0._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo0._fields.lastName.defaultValue, 'my lastName', "The fields are right");
    equals(DMInfo0._fields.age._name, 'age', "The fields are right");
    equals(DMInfo0._fields.age.defaultValue, 20, "The fields are right");
    equals(DMInfo0._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo0._fields.isMarried.defaultValue, false, "The fields are right");

    ok(DMInfo1._fields.firstName, "The fields are right");
    ok(DMInfo1._fields.lastName, "The fields are right");
    ok(DMInfo1._fields.age, "The fields are right");
    ok(DMInfo1._fields.isMarried, "The fields are right");
    equals(DMInfo1._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo1._fields.firstName.defaultValue, '', "The fields are right");
    equals(DMInfo1._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo1._fields.lastName.defaultValue, '', "The fields are right");
    equals(DMInfo1._fields.age._name, 'age', "The fields are right");
    equals(DMInfo1._fields.age.defaultValue, 0, "The fields are right");
    equals(DMInfo1._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo1._fields.isMarried.defaultValue, true, "The fields are right");

    ok(DMInfo2._fields.firstName, "The fields are right");
    ok(DMInfo2._fields.lastName, "The fields are right");
    ok(DMInfo2._fields.age, "The fields are right");
    ok(DMInfo2._fields.isMarried, "The fields are right");
    equals(DMInfo2._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo2._fields.firstName.defaultValue, '', "The fields are right");
    equals(DMInfo2._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo2._fields.lastName.defaultValue, '', "The fields are right");
    equals(DMInfo2._fields.age._name, 'age', "The fields are right");
    equals(DMInfo2._fields.age.defaultValue, 0, "The fields are right");
    equals(DMInfo2._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo2._fields.isMarried.defaultValue, true, "The fields are right");

    ok(DMInfo3._fields.Tangram, "The fields are right");
    equals(DMInfo3._fields.Tangram._name, 'Tangram', "The fields are right");
    equals(DMInfo3._fields.Tangram.defaultValue, 'base', "The fields are right");

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
    equals(DMInfo2[0]._fields.firstName.defaultValue, 'my firstName', "The fields are right");
    equals(DMInfo2[0]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo2[0]._fields.lastName.defaultValue, 'my lastName', "The fields are right");
    equals(DMInfo2[0]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo2[0]._fields.age.defaultValue, 20, "The fields are right");
    equals(DMInfo2[0]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo2[0]._fields.isMarried.defaultValue, false, "The fields are right");

    ok(DMInfo2[1]._fields.firstName, "The fields are right");
    ok(DMInfo2[1]._fields.lastName, "The fields are right");
    ok(DMInfo2[1]._fields.age, "The fields are right");
    ok(DMInfo2[1]._fields.isMarried, "The fields are right");
    equals(DMInfo2[1]._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo2[1]._fields.firstName.defaultValue, '', "The fields are right");
    equals(DMInfo2[1]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo2[1]._fields.lastName.defaultValue, '', "The fields are right");
    equals(DMInfo2[1]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo2[1]._fields.age.defaultValue, 0, "The fields are right");
    equals(DMInfo2[1]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo2[1]._fields.isMarried.defaultValue, true, "The fields are right");

    ok(DMInfo2[2]._fields.firstName, "The fields are right");
    ok(DMInfo2[2]._fields.lastName, "The fields are right");
    ok(DMInfo2[2]._fields.age, "The fields are right");
    ok(DMInfo2[2]._fields.isMarried, "The fields are right");
    equals(DMInfo2[2]._fields.firstName._name, 'firstName', "The fields are right");
    equals(DMInfo2[2]._fields.firstName.defaultValue, '', "The fields are right");
    equals(DMInfo2[2]._fields.lastName._name, 'lastName', "The fields are right");
    equals(DMInfo2[2]._fields.lastName.defaultValue, '', "The fields are right");
    equals(DMInfo2[2]._fields.age._name, 'age', "The fields are right");
    equals(DMInfo2[2]._fields.age.defaultValue, 0, "The fields are right");
    equals(DMInfo2[2]._fields.isMarried._name, 'isMarried', "The fields are right");
    equals(DMInfo2[2]._fields.isMarried.defaultValue, true, "The fields are right");

    ok(DMInfo3[3]._fields.Tangram, "The fields are right");
    equals(DMInfo3[3]._fields.Tangram._name, 'Tangram', "The fields are right");
    equals(DMInfo3[3]._fields.Tangram.defaultValue, 'base', "The fields are right");

    ok(!DMInfo4[4]._fields.Tangram && !DMInfo4[4]._fields.age, "The fields are right");
});