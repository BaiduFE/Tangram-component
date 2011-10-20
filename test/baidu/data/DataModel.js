module("baidu.data.DataModel");

(function() {
	function mySetup() {
		var options = {
		        fields:{
		            age : {
		            	data : {},
		            	define : {
		            		defaultValue : 20,
		            		type : 'number'
		            	},
		            	name : 'age',
		            	validation : []
		            }
		        }
		    };
		    te.DM = new baidu.data.DataModel(options);
		    
			var options = {
			        fields:{
			            title : {
			            	data : {},
			            	define : {
			            		defaultValue : '',
			            		type : 'string'
			            	},
			            	name : 'title',
			            	validation : []
			            },
			            author : {
			            	data : {},
			            	define : {
			            		defaultValue : '严歌苓',
			            		type : 'string'
			            	},
			            	name : 'author',
			            	validation : []
			            }
			        }
			    };
			    te.DM1 = new baidu.data.DataModel(options);
		    
		    te.isEmpty = function(obj)
		    {
		    	if(typeof obj == 'undefined')
		    		return false;
		        for (var name in obj)
		        {
		            return false;
		        }
		        return true;
		    };
		    
			te.arrayCompare = function(data, result){
				if(data.length != result.length)
					return false;
				for(var i = 0; i < data.length ; i++){
					if(data[i] != result[i])
						return false;
				}
				return true;
			};
	}
	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		mySetup();
	}
})();

test("create", function() {
	expect(8);
	var DM = te.DM;
	var isEmpty = te.isEmpty;
    
    ok(isEmpty(DM._data), "The _data is right");
    ok(DM._fields.age, "The _field is right");
    ok(isEmpty(DM._fields.age._dataModel._data), "The data is right");
    equals(DM._fields.age.defaultValue, 20, "The defaultvalue is right");
    equals(DM._fields.age._name, 'age', "The name is right");
    equals(DM._fields.age.validation.length, 0, "The validation is right");
    equals(DM._actionQueue.length, 0, "The _lastChangeObject is right");
    equals(DM._index, 0, "The _index is right");
});

test("_setLastAction", function(){
	expect(3);
	var DM = te.DM;
	var isEmpty = te.isEmpty;
	DM._setLastAction('ADD', {}, {});
	
    ok(isEmpty(DM._actionQueue[DM._actionQueue.length - 1].lastChange), "The _lastChangeObject is right");
    ok(isEmpty(DM._actionQueue[DM._actionQueue.length - 1].lastData), "The _lastData is right");
    equals(DM._actionQueue[DM._actionQueue.length - 1].action, 'ADD', "The _lastAction is right");
});

test("_getNewId", function(){
	expect(2);
	var DM = te.DM;
	var index = DM._getNewId();
	
	equals(index, 0, "The index is right");
	equals(DM._index, 1, "The _index is right");
});

test("_getDataByIndex", function(){
	expect(16);
	var DM = te.DM;
	
	DM._data = [{
			title : "小姨多鹤",
			author : "严歌苓"
		}, {
			title : "荷包里的单人床",
			author : "张小娴"
		}, {
			title : "女子有行"
		}];
	
	var all = DM._getDataByIndex("*", [0,1,2]);
	var author = DM._getDataByIndex("author", [0,1,2]);
	var all1 = DM._getDataByIndex("title,author", [0,1,2]);
	var title = DM._getDataByIndex("title", [0,2]);
	
	equals(all[0].title, "小姨多鹤", "The title is right");
	equals(all[0].author, "严歌苓", "The author is right");
	equals(all[1].title, "荷包里的单人床", "The title is right");
	equals(all[1].author, "张小娴", "The author is right");
	equals(all[2].title, "女子有行", "The title is right");
	equals(author[0].author, "严歌苓", "The author is right");
	equals(author[1].author, "张小娴", "The author is right");
	equals(author[0].title, null, "The title is right");
	equals(author[1].title, null, "The title is right");
	equals(all1[0].title, "小姨多鹤", "The title is right");
	equals(all1[0].author, "严歌苓", "The author is right");
	equals(all1[1].title, "荷包里的单人床", "The title is right");
	equals(all1[1].author, "张小娴", "The author is right");
	equals(all1[2].title, "女子有行", "The title is right");
	equals(title[0].title, "小姨多鹤", "The title is right");
	equals(title[2].title, "女子有行", "The title is right");
});

test("_getDataByFunction", function(){
	expect(13);
	var DM = te.DM;
	var isEmpty = te.isEmpty;
		
	DM._data = [{
			title : "小姨多鹤",
			author : "严歌苓"
		}, {
			title : "荷包里的单人床",
			author : "张小娴"
		}, {
			title : "继母",
			author : "严歌苓"
		}];
	
	var fun = function(data){
		if(data.author == "严歌苓")
			return true;
		else return false;
	};
	var fun1 = function(data){
		return false;
	};
	var all = DM._getDataByFunction("*", fun);
	var title = DM._getDataByFunction("title", fun);
	var all1 = DM._getDataByFunction("title,author", fun);
	var no = DM._getDataByFunction("title,author", fun1);
	
	equals(all[0].title, "小姨多鹤", "The title is right");
	equals(all[0].author, "严歌苓", "The author is right");
	equals(all[2].title, "继母", "The title is right");
	equals(all[2].author, "严歌苓", "The author is right");
	equals(title[0].title, "小姨多鹤", "The title is right");
	equals(title[2].title, "继母", "The title is right");
	equals(title[0].author, null, "The author is right");
	equals(title[2].author, null, "The author is right");
	equals(all1[0].title, "小姨多鹤", "The title is right");
	equals(all1[0].author, "严歌苓", "The author is right");
	equals(all1[2].title, "继母", "The title is right");
	equals(all1[2].author, "严歌苓", "The author is right");
	ok(isEmpty(no), "No datas are selected");
});

test("_getConditionId", function(){
	expect(4);
	var DM = te.DM;
	
	DM._data = [{
			title : "小姨多鹤",
			author : "严歌苓"
		}, {
			title : "荷包里的单人床",
			author : "张小娴"
		}, {
			title : "继母",
			author : "严歌苓"
		}];
	
	var fun = function(data){
		if(data.author == "严歌苓")
			return true;
		else return false;
	};
	var fun1 = function(data){
		if(data.author == "")
			return true;
		else return false;
	};
	var all = DM._getConditionId(fun);
	var no = DM._getConditionId(fun1);
	var arr = DM._getConditionId([0,1,2]);
	var num = DM._getConditionId(2);

	ok(te.arrayCompare(all, [0,2]), "The all is right");
	ok(te.arrayCompare(no, []), "The no is right");
	ok(te.arrayCompare(arr, [0,1,2]), "The arr is right");
	ok(te.arrayCompare(num, [2]), "The num is right");
});

test("add", function(){
	expect(35);
	var DM = te.DM1;
	
	var data = [{
			title : "小姨多鹤",
			author : "严歌苓"
		}, {
			title : "继母"
		}];
	var result = DM.add(data);
	var lastChangeObject = DM._actionQueue[DM._actionQueue.length - 1].lastChange;
	var lastData = DM._actionQueue[DM._actionQueue.length - 1].lastData;
	var lastAction = DM._actionQueue[DM._actionQueue.length - 1].action;
	equals(result.success.length, 2, "The 2 datas success");
	equals(result.fail.length, 0, "The 0 datas fail");
	equals(DM._data[0].title, "小姨多鹤", "The _data is right");
	equals(DM._data[0].author, "严歌苓", "The _data is right");
	equals(DM._data[1].title, "继母", "The _data is right");
	equals(DM._data[1].author, "严歌苓", "The _data is right");
	equals(DM._index, 2, "The _index is right");
	equals(lastAction, "ADD", "The _lastAction is right");
	equals(lastChangeObject[0].title, "小姨多鹤", "The _lastChangeArray is right");
	equals(lastChangeObject[0].author, "严歌苓", "The _lastChangeArray is right");
	equals(lastChangeObject[1].title, "继母", "The _lastChangeArray is right");
	equals(lastChangeObject[1].author, "严歌苓", "The_lastChangeArray is right");
	
	result = DM.add({});
	var lastChangeObject = DM._actionQueue[DM._actionQueue.length - 1].lastChange;
	var lastData = DM._actionQueue[DM._actionQueue.length - 1].lastData;
	var lastAction = DM._actionQueue[DM._actionQueue.length - 1].action;
	equals(result.success.length, 0, "The 0 datas success");
	equals(result.fail.length, 0, "The 0 datas fail");
	equals(DM._data[0].title, "小姨多鹤", "The _data is right");
	equals(DM._data[0].author, "严歌苓", "The _data is right");
	equals(DM._data[1].title, "继母", "The _data is right");
	equals(DM._data[1].author, "严歌苓", "The _data is right");
	equals(DM._index, 2, "The _index is right");
	equals(lastAction, "ADD", "The _lastAction is right");
	equals(lastChangeObject[0].author, "严歌苓", "The _lastChangeArray is right");
	equals(lastChangeObject[1].title, "继母", "The _lastChangeArray is right");
	equals(lastChangeObject[1].author, "严歌苓", "The_lastChangeArray is right");
	
	result = DM.add({
			title : "小姨多鹤",
			author : "严歌苓"
		});
	var lastChangeObject = DM._actionQueue[DM._actionQueue.length - 1].lastChange;
	var lastData = DM._actionQueue[DM._actionQueue.length - 1].lastData;
	var lastAction = DM._actionQueue[DM._actionQueue.length - 1].action;
	equals(result.success.length, 1, "The 1 datas success");
	equals(result.fail.length, 0, "The 0 datas fail");
	equals(DM._data[0].title, "小姨多鹤", "The _data is right");
	equals(DM._data[0].author, "严歌苓", "The _data is right");
	equals(DM._data[1].title, "继母", "The _data is right");
	equals(DM._data[1].author, "严歌苓", "The _data is right");
	equals(DM._data[2].title, "小姨多鹤", "The _data is right");
	equals(DM._data[2].author, "严歌苓", "The _data is right");
	equals(DM._index, 3, "The _index is right");
	equals(lastAction, "ADD", "The _lastAction is right");
	equals(lastChangeObject[2].title, "小姨多鹤", "The _lastChangeArray is right");
	equals(lastChangeObject[2].author, "严歌苓", "The _lastChangeArray is right");
});

test("update", function(){
	expect(45);
	var DM = te.DM1;
	var isEmpty = te.isEmpty;

	DM._data = [{
			title : "小姨多鹤",
			author : "严歌苓"
		}, {
			title : "荷包里的单人床",
			author : "张小娴"
		}, {
			title : "女子有行"
		}];
	
	var fun = function(data){
		if(data.author == "张小娴")
			return true;
		else return false;
	};
	
	var data = {
		title : "继母",
		author : "严歌苓"
	};
	
	result = DM.update({});
	equals(result, 0, "The 0 datas update");
	equals(DM._data[0].title, "小姨多鹤", "The _data is right");
	equals(DM._data[0].author, "严歌苓", "The _data is right");
	equals(DM._data[1].title, "荷包里的单人床", "The _data is right");
	equals(DM._data[1].author, "张小娴", "The _data is right");
	equals(DM._data[2].title, "女子有行", "The _data is right");

	var result = DM.update(data, [0,2]);
	var lastChangeObject = DM._actionQueue[DM._actionQueue.length - 1].lastChange;
	var lastData = DM._actionQueue[DM._actionQueue.length - 1].lastData;
	var lastAction = DM._actionQueue[DM._actionQueue.length - 1].action;
	equals(result, 2, "The 2 datas update");
	equals(DM._data[0].title, "继母", "The _data is right");
	equals(DM._data[0].author, "严歌苓", "The _data is right");
	equals(DM._data[1].title, "荷包里的单人床", "The _data is right");
	equals(DM._data[1].author, "张小娴", "The _data is right");
	equals(DM._data[2].title, "继母", "The _data is right");
	equals(DM._data[2].author, "严歌苓", "The _data is right");
	equals(lastAction, "UPDATE", "The _lastAction is right");
	equals(lastChangeObject[0].title, "继母", "The _lastChangeObject is right");
	equals(lastChangeObject[0].author, "严歌苓", "The _lastChangeObject is right");
	equals(lastChangeObject[2].title, "继母", "The _lastChangeObject is right");
	equals(lastChangeObject[2].author, "严歌苓", "_lastChangeObject is right");
	equals(lastData[0].title, "小姨多鹤", "The _lastData is right");
	equals(lastData[0].author, "严歌苓", "The _lastData is right");
	equals(lastData[2].title, "女子有行", "The _lastData is right");
	
	var data = {
			title : "喜宝",
			author : "亦舒"
		};
	var result = DM.update(data, 2);
	var lastChangeObject = DM._actionQueue[DM._actionQueue.length - 1].lastChange;
	var lastData = DM._actionQueue[DM._actionQueue.length - 1].lastData;
	var lastAction = DM._actionQueue[DM._actionQueue.length - 1].action;
	equals(result, 1, "The 1 datas update");
	equals(DM._data[0].title, "继母", "The _data is right");
	equals(DM._data[0].author, "严歌苓", "The _data is right");
	equals(DM._data[1].title, "荷包里的单人床", "The _data is right");
	equals(DM._data[1].author, "张小娴", "The _data is right");
	equals(DM._data[2].title, "喜宝", "The _data is right");
	equals(DM._data[2].author, "亦舒", "The _data is right");
	equals(lastAction, "UPDATE", "The _lastAction is right");
	equals(lastChangeObject[2].title, "喜宝", "The _lastChangeObject is right");
	equals(lastChangeObject[2].author, "亦舒", "The _lastChangeObject is right");
	equals(lastData[2].title, "继母", "The _lastData is right");
	equals(lastData[2].author, "严歌苓", "The _lastData is right");

	var data = {
			title : "喜宝",
		};
	var result = DM.update(data, fun);
	var lastChangeObject = DM._actionQueue[DM._actionQueue.length - 1].lastChange;
	var lastData = DM._actionQueue[DM._actionQueue.length - 1].lastData;
	var lastAction = DM._actionQueue[DM._actionQueue.length - 1].action;
	equals(result, 1, "The 1 datas update");
	equals(DM._data[0].title, "继母", "The _data is right");
	equals(DM._data[0].author, "严歌苓", "The _data is right");
	equals(DM._data[1].title, "喜宝", "The _data is right");
	equals(DM._data[1].author, "张小娴", "The _data is right");
	equals(DM._data[2].title, "喜宝", "The _data is right");
	equals(DM._data[2].author, "亦舒", "The _data is right");
	equals(lastAction, "UPDATE", "The _lastAction is right");
	equals(lastChangeObject[1].title, "喜宝", "The _lastChangeObject is right");
	equals(lastChangeObject[1].author, "张小娴", "The _lastChangeObject is right");
	equals(lastData[1].title, "荷包里的单人床", "The _lastData is right");
	equals(lastData[1].author, "张小娴", "The _lastData is right");
});

test("select", function(){
	expect(14);
	var DM = te.DM1;

	DM._data = [{
			title : "小姨多鹤",
			author : "严歌苓"
		}, {
			title : "荷包里的单人床",
			author : "张小娴"
		}, {
			title : "女子有行"
		}];
	
	var fun = function(data){
		if(data.author == "严歌苓")
			return true;
		else return false;
	};
	
	var arr1 = DM.select("title,author", [0,2]);
	var arr2 = DM.select("*", [0,2]);
	var num1 = DM.select("title,author", 0);
	var num2 = DM.select("*", 0);
	var fun1= DM.select("title,author", fun);
	var fun2 = DM.select("*", fun);
	
	equals(arr1[0].title, "小姨多鹤", "The title is right");
	equals(arr1[0].author, "严歌苓", "The title is right");
	equals(arr1[2].title, "女子有行", "The title is right");
	equals(arr2[0].title, "小姨多鹤", "The title is right");
	equals(arr2[0].author, "严歌苓", "The title is right");
	equals(arr2[2].title, "女子有行", "The title is right");
	
	equals(num1[0].title, "小姨多鹤", "The title is right");
	equals(num1[0].author, "严歌苓", "The title is right");
	equals(num2[0].title, "小姨多鹤", "The title is right");
	equals(num2[0].author, "严歌苓", "The title is right");
	
	equals(fun1[0].title, "小姨多鹤", "The title is right");
	equals(fun1[0].author, "严歌苓", "The title is right");
	equals(fun2[0].title, "小姨多鹤", "The title is right");
	equals(fun2[0].author, "严歌苓", "The title is right");
});

test("remove", function(){
	expect(16);
	var DM = te.DM1;
	
	DM._data = [{
			title : "小姨多鹤",
			author : "严歌苓"
		}, {
			title : "荷包里的单人床",
			author : "张小娴"
		}, {
			title : "继母",
			author : "严歌苓"
		}, {
			title : "喜宝",
			author : "亦舒"
		}, {
			title : "圆舞",
			author : "亦舒"
		}, {
			title : "女子有行"
		}];
	
	var fun = function(data){
		if(data.author == "严歌苓")
			return true;
		else return false;
	};
	
	var re1 = DM.remove([3,4]);
	var re2 = DM.remove(fun);
	var re3 = DM.remove(1);
	var re4 = DM.remove(fun);
	var lastChangeObject = DM._actionQueue[DM._actionQueue.length - 1].lastChange;
	var lastData = DM._actionQueue[DM._actionQueue.length - 1].lastData;
	var lastAction = DM._actionQueue[DM._actionQueue.length - 1].action;
	
	equals(re1, 2, "The result is right");
	equals(re2, 2, "The result is right");
	equals(re3, 1, "The result is right");
	equals(re4, 0, "The result is right");
	equals(typeof DM._data[0], 'undefined', "The _data is right");
	equals(typeof DM._data[1], 'undefined', "The _data is right");
	equals(typeof DM._data[2], 'undefined', "The _data is right");
	equals(typeof DM._data[3], 'undefined', "The _data is right");
	equals(typeof DM._data[4], 'undefined', "The _data is right");
	equals(typeof DM._data[5], 'object', "The _data is right");
	equals(DM._index, 0, "The _index is right");
	equals(lastAction, "REMOVE", "The _lastAction is right");
	equals(lastChangeObject[1].title, "荷包里的单人床", "The _lastChangeArray is right");
	equals(lastChangeObject[1].author, "张小娴", "The_lastChangeArray is right");
	equals(lastData[1].title, "荷包里的单人床", "The _lastData is right");
	equals(lastData[1].author, "张小娴", "The _lastData is right");
});

test("cancel", function(){
	expect(18);
	var DM = te.DM1;
	var isEmpty = te.isEmpty;
	
	var data = [{
			title : "小姨多鹤",
			author : "严歌苓"
		}];
	var data1 =  {
		title : "喜宝",
		author : "亦舒"
	};
	DM.add(data);
	DM.cancel();

    ok(isEmpty(DM._data), "The _data is right");
    equals(DM._actionQueue.length, 0, "The _actionQueue is right");
    
    DM.add(data);
    DM.update(data1, [1]);
    DM.cancel();
	var lastChangeObject = DM._actionQueue[DM._actionQueue.length - 1].lastChange;
	var lastData = DM._actionQueue[DM._actionQueue.length - 1].lastData;
	var lastAction = DM._actionQueue[DM._actionQueue.length - 1].action;

    equals(DM._data[1].title, "小姨多鹤", "The _data is right");
    equals(DM._data[1].author, "严歌苓", "The _data is right");
    equals(DM._actionQueue.length, 1, "The _lastChangeObject is right");
    equals(lastChangeObject[1].author, "严歌苓", "The _lastChangeObject is right");
    equals(lastData[1], 'undefined', "The _lastData is right");
    equals(DM._index, 2, "The _index is right");
    equals(lastAction, 'ADD', "The _lastAction is right");
    
    DM.remove([1]);
    DM.cancel();
	var lastChangeObject = DM._actionQueue[DM._actionQueue.length - 1].lastChange;
	var lastData = DM._actionQueue[DM._actionQueue.length - 1].lastData;
	var lastAction = DM._actionQueue[DM._actionQueue.length - 1].action;
   
    equals(DM._data[1].title, "小姨多鹤", "The _data is right");
    equals(DM._data[1].author, "严歌苓", "The _data is right");
    equals(DM._actionQueue.length, 1, "The _lastChangeObject is right");
    equals(lastChangeObject[1].author, "严歌苓", "The _lastChangeObject is right");
    equals(lastData[1], 'undefined', "The _lastData is right");
    equals(DM._index, 2, "The _index is right");
    equals(lastAction, 'ADD', "The _lastAction is right");
    
    DM.select("*");
    DM.cancel();

    ok(isEmpty(DM._data), "The _data is right");
    equals(DM._actionQueue.length, 0, "The _actionQueue is right");
});

test("getLastChange", function(){
	expect(2);
	var DM = te.DM1;
	
	DM._data = [{
			title : "小姨多鹤",
			author : "严歌苓"
		}];
	
	DM.remove(0);
	var result = DM.getLastChange();
	equals(result[0].title, "小姨多鹤", "The result is right");
	equals(result[0].author, "严歌苓", "The result is right");
});
