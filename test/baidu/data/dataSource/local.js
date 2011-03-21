/**
 * check baidu.data.dataSource.local properties, methods and events
 */

module("baidu.data.dataSource.local");
// 测试local的get方法
test("get", function() {
	var data = [ {
		id : "01",
		name : "john",
		age : 20
	}, {
		id : "02",
		name : "marry",
		age : 21
	} ], localSource = baidu.dataSource.local(data, {});
	equal(localSource.get()[0].name, 'john', "local get success!");
});

// 测试local的transtion 接口
test("transition", function() {
	var data = [ {
		id : "01",
		name : "john",
		age : 20
	}, {
		id : "02",
		name : "marry",
		age : 21
	} ], localSource = baidu.dataSource.local(data, {
		transition : function(source) {
			var arr = [];
			for ( var i in source) {
				var item = source[i];
				arr.push({
					name : item.name,
					id : item.id,
					age : item.age - 5
				});
			}
			return arr;
		}
	}), returnData = localSource.get();
	ok(returnData[0].age == 15, "local transition success!");
});

// 测试local的update方法
test("update", function() {
	var data = [ {
		id : "01",
		name : "john",
		age : 20
	} ], localSource = baidu.dataSource.local(data, {
		cache : true
	});
	localSource.update({
		cache : false
	});
	ok(!localSource.cache, "local update success!");
});
