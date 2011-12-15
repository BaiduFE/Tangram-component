module("baidu.data.DataStore");

(function() {
	function mySetup() {
		te.createDM = function(){
			var bookDMDefine = {
			        fields:[{
			            name: 'category'
			        },{
			            name: 'cover'
			        },{
			            name: 'lang',
			            defaultValue: 'en'
			        },{
			            name: 'title'
			        },{
			            name: 'author'
			        },{
			            name: 'year',
			            type: 'number',
			            defaultValue: 2000
			        },{
			            name: 'price',
			            type: 'number',
			            defaultValue: '0'
			        }],
			        validations:[]
			    };
			    baidu.data.ModelManager.defineDM('book', bookDMDefine);
			    var DM = baidu.data.ModelManager.createDM('book');
			    return DM[1];
		};
		  
		te.createDataSource = function(){
			 var url = '../../baidu/data/DataStore/books.xml';
			    var dsOptions = {
			        cache: false,
			        dataType:  baidu.parser.type.XML,
			        transition: function(parser){
			            var books = [],
			            data,length,item;

			            data = parser.query('//book');
			            var category = parser.query('//book/@category');
			            var title = parser.query('//book/title');
			            var year = parser.query('//book/year');
			            var price = parser.query('//book/price');

			            baidu.each(data, function(book, index){
			                item = {};

			                item.category = category[index].nodeValue;
			                item.cover = book.getAttribute('cover') || '';
			                item.lang = title[index].getAttribute('lang');
			                item.title = title[index].childNodes[0].nodeValue;
			                item.year = parseInt(year[index].childNodes[0].nodeValue);
			                item.price = parseInt(price[index].childNodes[0].nodeValue);

			                var authors = parser.query('//book[' + (index + 1) + ']/author');
			                var name = [];
			                baidu.each(authors, function(author){
			                    name.push(author.childNodes[0].nodeValue);
			                });
			                item.author = name.join(',');
			                books.push(item);
			            });

			            return books;
			        }
			    };
			    return  baidu.data.dataSource.ajax(url, dsOptions);
		};
		    
	    te.isEmpty = function(obj)
	    {
	        for (var name in obj)
	        {
	            return false;
	        }
	        return true;
	    };
	}
	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		mySetup();
	}
})();

test("create", function() {
	expect(12);
	stop();
	ua.importsrc('baidu.data.ModelManager,baidu.data.dataSource.ajax,baidu.parser.Xml,baidu.parser.Json', function(){
		var DM = te.createDM();
		var dataSource = te.createDataSource();
		
		var dataStore = new baidu.data.DataStore({
	        'dataModel': DM,
	        'dataSource': dataSource
	    });
		equals(dataStore._dataModel, DM, "The dataModel is right");
		equals(dataStore._dataSource, dataSource, "The dataSource is right");
		equals(dataStore._action, "APPEND", "The _action is right");
		equals(dataStore._mergeFields.length, 0, "The _mergeFields is right");
		equals(dataStore._usingLocal, true, "The _usingLocal is right");
		equals(dataStore._sync, false, "The _sync is right");
		
		var dataStore1 = new baidu.data.DataStore({
	        'dataModel': DM,
	        'dataSource': dataSource,
	        'action' : 'MERGE',
	        'mergeFields' : ['title'],
	        'usingLocal' : false,
	        'sync' : true
	    });
		equals(dataStore1._dataModel, DM, "The dataModel is right");
		equals(dataStore1._dataSource, dataSource, "The dataSource is right");
		equals(dataStore1._action, "MERGE", "The _action is right");
		equals(dataStore1._mergeFields[0], 'title', "The _mergeFields is right");
		equals(dataStore1._usingLocal, false, "The _usingLocal is right");
		equals(dataStore1._sync, true, "The _sync is right");
		start();
	}, 'baidu.data.ModelManager','baidu.data.DataStore');
});

test("setDataModel&getDataModel", function() {
	expect(2);
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	
	var dataStore = new baidu.data.DataStore({});
	dataStore.setDataModel(DM);
	equals(dataStore._dataModel, DM, "The dataModel is right");	
	var dataModel = dataStore.getDataModel();
	equals(dataModel, DM, "The dataModel is right");
});

test("setDataSource&getDataSource", function() {
	expect(2);
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	
	var dataStore = new baidu.data.DataStore({});
	dataStore.setDataSource(dataSource);
	equals(dataStore._dataSource, dataSource, "The dataSource is right");	
	var ds = dataStore.getDataSource();
	equals(ds, dataSource, "The dataSource is right");
});

test("setSnyc", function() {
	expect(1);
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	
	var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource,
        'action' : 'MERGE',
        'mergeFields' : ['title'],
        'usingLocal' : false,
        'sync' : true
    });
	dataStore.setSnyc(false);
	equals(dataStore._sync, false, "The _sync is right");
});

test("save", function() {
	expect(1);
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	
	var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource,
        'action' : 'MERGE',
        'mergeFields' : ['title'],
        'usingLocal' : false,
        'sync' : true
    });
	dataStore.save();
	ok(true, "no errors");
});

test("add", function() {
	expect(10);
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	
	var data = [{
		title : "小姨多鹤",
		author : "严歌苓"
	}, {
		title : "继母"
	}];
	
	var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource
    });
	dataStore.addEventListener("onadd", function(event, data){
		equals(data.row, 2, "The row is right");
		equals(data.data[0].author, "严歌苓", "The data is right");
		equals(data.data[0].title, "小姨多鹤", "The data is right");
		equals(data.data[0].price, "0", "The data is right");
		equals(data.data[1].title, "继母", "The data is right");
	});
	var result = dataStore.add(data);
	
	equals(dataStore._dataModel._data[0].author, "严歌苓", "The data is right");
	equals(dataStore._dataModel._data[0].title, "小姨多鹤", "The data is right");
	equals(dataStore._dataModel._data[1].title, "继母", "The data is right");
	equals(result.fail.length, 0, "The result is right");
	equals(result.success.length, 2, "The result is right");
});

test("select", function() {
	expect(6);
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	
	var data = [{
		title : "小姨多鹤",
		author : "严歌苓"
	}, {
		title : "继母"
	}];
	
	var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource
    });
	dataStore.add(data);
	var result = dataStore.select('title', [1]);
	equals(result[1].title, "继母", "The result is right");
	
	result = dataStore.select();
	equals(result[0].title, "小姨多鹤", "The result is right");
	equals(result[0].author, "严歌苓", "The result is right");
	equals(result[1].title, "继母", "The result is right");
	
	result =  dataStore.select('*', 0);
	equals(result[0].title, "小姨多鹤", "The result is right");
	equals(result[0].author, "严歌苓", "The result is right");
});

test("update", function() {
	expect(26);

    var isEmpty = te.isEmpty;

	var DM = te.createDM();
	var dataSource = te.createDataSource();
	
	var data = [{
		title : "小姨多鹤",
		author : "严歌苓"
	}, {
		title : "荷包里的单人床",
		author : "张小娴"
	}, {
		title : "继母"
	}];
	
	var data1 = {
			title : "喜宝",
			author : "亦舒"
		};
	
	var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource
    });
	
	var num = 0;
	dataStore.addEventListener("onupdate", function(event, data){
		num ++;
		if(num == 1){
			equals(data.row, 1, "The row is right");
			equals(data.data[1].title, "喜宝", "The data is right");
			equals(data.data[1].author, "亦舒", "The data is right");
		}
		if(num == 2){
			equals(data.row, 1, "The row is right");
			equals(data.data[0].title, "喜宝", "The data is right");
			equals(data.data[0].author, "亦舒", "The data is right");
		}
		if(num == 3){
			equals(data.row, 0, "The row is right");
			ok(isEmpty(data.data), "The data is right");
		}
	});
	
	dataStore.add(data);
	var result = dataStore.update(data1, [1]);
	equals(result, 1, "The result is right");
	equals(dataStore._dataModel._data[0].title, "小姨多鹤", "The data is right");
	equals(dataStore._dataModel._data[0].author, "严歌苓", "The data is right");
	equals(dataStore._dataModel._data[1].title, "喜宝", "The data is right");
	equals(dataStore._dataModel._data[1].author, "亦舒", "The data is right");
	equals(dataStore._dataModel._data[2].title, "继母", "The data is right");
	
	result =  dataStore.update(data1, 0);
	equals(result, 1, "The result is right");
	equals(dataStore._dataModel._data[0].title, "喜宝", "The data is right");
	equals(dataStore._dataModel._data[0].author, "亦舒", "The data is right");
	equals(dataStore._dataModel._data[1].title, "喜宝", "The data is right");
	equals(dataStore._dataModel._data[1].author, "亦舒", "The data is right");
	equals(dataStore._dataModel._data[2].title, "继母", "The data is right");
	
	result =  dataStore.update();
	equals(result, 0, "The result is right");
	equals(dataStore._dataModel._data[0].title, "喜宝", "The data is right");
	equals(dataStore._dataModel._data[0].author, "亦舒", "The data is right");
	equals(dataStore._dataModel._data[1].title, "喜宝", "The data is right");
	equals(dataStore._dataModel._data[1].author, "亦舒", "The data is right");
	equals(dataStore._dataModel._data[2].title, "继母", "The data is right");

});

test("remove", function() {
	expect(10);
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	
	var data = [{
		title : "小姨多鹤",
		author : "严歌苓"
	}, {
		title : "荷包里的单人床",
		author : "张小娴"
	}, {
		title : "继母"
	}];
	
	var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource
    });
	
	var num = 0;
	dataStore.addEventListener("ondelete", function(event, data){
		num ++;
		if(num == 1){
			equals(data.row, 1, "The row is right");
			equals(data.data[1].title, "荷包里的单人床", "The data is right");
		}
		if(num == 2){
			equals(data.row, 1, "The row is right");
			equals(data.data[0].title, "小姨多鹤", "The data is right");
		}
		if(num == 3){
			equals(data.row, 1, "The row is right");
			equals(data.data[2].title, "继母", "The data is right");
		}
	});
	
	dataStore.add(data);
	var result = dataStore.remove([1]);
	equals(result, 1, "The result is right");
	
	result =  dataStore.remove(0);
	equals(result, 1, "The result is right");
	
	result =  dataStore.remove();
	equals(result, 1, "The result is right");
	
	ok(te.isEmpty(dataStore._dataModel._data), "All removed");
});

test("cancel", function() {
	expect(10);
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	var isEmpty = te.isEmpty;
	
	var data = [{
		title : "小姨多鹤",
		author : "严歌苓"
	}, {
		title : "继母"
	}];
	
	var data1 = {
			title : "喜宝",
			author : "亦舒"
		}
	
	var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource
    });
	
	var num = 0;
	dataStore.addEventListener("oncancel", function(event, data){
		num ++;
		if(num == 1){
			equals(data.cancelAction, "ADD", "The lastAction is right");
			equals(data.row, 2, "The row is right");
			equals(data.lastChange[0].title, '小姨多鹤', "The data is right");
            equals(data.lastChange[1].title, '继母', "The data is right");
		}
		if(num == 2){
			equals(data.cancelAction, "UPDATE", "The lastAction is right");
			equals(data.row, 1, "The row is right");
			equals(data.lastChange[1].title, "喜宝", "The data is right");
		}
		if(num == 3){
			//equals(data.cancelAction, "REMOVE", "The lastAction is right");
			//equals(data.row, 1, "The row is right");
			//equals(data.lastChange[1].title, '小姨多鹤', "The data is right");
            //equals(data.lastChange[2].title, '继母', "The data is right");
		}
	});
	
	dataStore.add(data);
	var result = dataStore.cancel();
	equals(result, 2, "The result is right");
	
	dataStore.add(data);
    dataStore.update(data1, [1]);
	var result = dataStore.cancel();
	equals(result, 1, "The result is right");
	
	dataStore.remove([1]);
	var result = dataStore.cancel();
	equals(result, 1, "The result is right");
});

test("load append", function() {
	expect(29);
	stop();
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource
    });
	
    dataStore.load({
        onsuccess: function(data){
        	equals(data.length, 4, "The data is right");
        	ok(!this._dataModel, "not load");
        	
        	dataStore._action = "APPEND";
            dataStore.load({
                onsuccess: function(data){
                	equals(data.success.length, 4, "The data is right");
                	equals(data.fail.length, 0, "The data is right");
                	equals(this._dataModel._index, 4, "the _index is right");
                	equals(this._dataModel._data[0].author, "J K. Rowling", "the _data is right");
                	equals(this._dataModel._data[0].category, "children", "the _data is right");
                	equals(this._dataModel._data[0].cover, "", "the _data is right");
                	equals(this._dataModel._data[0].lang, "en", "the _data is right");
                	equals(this._dataModel._data[0].price, 29, "the _data is right");
                	equals(this._dataModel._data[0].title, "Harry Potter", "the _data is right");
                	equals(this._dataModel._data[0].year, 2005, "the _data is right");	
                	
                    dataStore.load({
                        onsuccess: function(data){
                        	equals(data.success.length, 4, "The data is right");
                        	equals(data.fail.length, 0, "The data is right");
                        	equals(this._dataModel._index, 8, "the _index is right");
                        	equals(this._dataModel._data[0].author, "J K. Rowling", "the _data is right");
                        	equals(this._dataModel._data[0].category, "children", "the _data is right");
                        	equals(this._dataModel._data[0].cover, "", "the _data is right");
                        	equals(this._dataModel._data[0].lang, "en", "the _data is right");
                        	equals(this._dataModel._data[0].price, 29, "the _data is right");
                        	equals(this._dataModel._data[0].title, "Harry Potter", "the _data is right");
                        	equals(this._dataModel._data[0].year, 2005, "the _data is right");	
                        	equals(this._dataModel._data[4].author, "J K. Rowling", "the _data is right");
                        	equals(this._dataModel._data[4].category, "children", "the _data is right");
                        	equals(this._dataModel._data[4].cover, "", "the _data is right");
                        	equals(this._dataModel._data[4].lang, "en", "the _data is right");
                        	equals(this._dataModel._data[4].price, 29, "the _data is right");
                        	equals(this._dataModel._data[4].title, "Harry Potter", "the _data is right");
                        	equals(this._dataModel._data[4].year, 2005, "the _data is right");	
                        	start();
                        },
                        onfailture: function(data){
                        }
                    }, true);
                },
                onfailture: function(data){
                }
            }, true);
        },
        onfailture: function(data){
        }
    });
});

test("load replace", function() {
	expect(24);
	stop();
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource
    });

	dataStore._action = "REPLACE";
    dataStore.load({
        onsuccess: function(data){
        	equals(data.success.length, 4, "The data is right");
        	equals(data.fail.length, 0, "The data is right");
        	equals(this._dataModel._index, 4, "the _index is right");
        	equals(this._dataModel._data[0].author, "J K. Rowling", "the _data is right");
        	equals(this._dataModel._data[0].category, "children", "the _data is right");
        	equals(this._dataModel._data[0].cover, "", "the _data is right");
        	equals(this._dataModel._data[0].lang, "en", "the _data is right");
        	equals(this._dataModel._data[0].price, 29, "the _data is right");
        	equals(this._dataModel._data[0].title, "Harry Potter", "the _data is right");
        	equals(this._dataModel._data[0].year, 2005, "the _data is right");	
        	
        	dataStore._action = "REPLACE";
            dataStore.load({
            	key : '../../baidu/data/DataStore/newbooks.xml',
                onsuccess: function(data){
                	equals(data.success.length, 2, "The data is right");
                	equals(data.fail.length, 0, "The data is right");
                    equals(this._dataModel._index, 6, "the _index is right");
                    equals(typeof this._dataModel._data[0], "undefined", "the _data is right");
                    equals(typeof this._dataModel._data[1], "undefined", "the _data is right");
                    equals(typeof this._dataModel._data[2], "undefined", "the _data is right");
                    equals(typeof this._dataModel._data[3], "undefined", "the _data is right");
                	equals(this._dataModel._data[4].author, "TT", "the _data is right");
                	equals(this._dataModel._data[4].category, "law", "the _data is right");
                	equals(this._dataModel._data[4].cover, "", "the _data is right");
                	equals(this._dataModel._data[4].lang, "en", "the _data is right");
                	equals(this._dataModel._data[4].price, 20, "the _data is right");
                	equals(this._dataModel._data[4].title, "lawyer", "the _data is right");
                	equals(this._dataModel._data[4].year, 2011, "the _data is right");	
                	start();
                },
                onfailture: function(data){
                }
            }, true);
        },
        onfailture: function(data){
        }
    }, true);
    
});

test("load merge", function() {
	expect(8);
	stop();
	var DM = te.createDM();
	var dataSource = te.createDataSource();
	var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource,
        'mergeFields' : ['title']
    });

	dataStore._action = "APPEND";
    dataStore.load({
        onsuccess: function(data){
        	dataStore._action = "MERGE";
            dataStore.load({
            	key : '../../baidu/data/DataStore/newbooks.xml',
                onsuccess: function(data){
                	equals(this._dataModel._index, 4, "the _index is right");
                	equals(this._dataModel._data[0].author, "Rowling", "the _data is right");
                	equals(this._dataModel._data[0].category, "young", "the _data is right");
                	equals(this._dataModel._data[0].cover, "", "the _data is right");
                	equals(this._dataModel._data[0].lang, "en", "the _data is right");
                	equals(this._dataModel._data[0].price, 30, "the _data is right");
                	equals(this._dataModel._data[0].title, "Harry Potter", "the _data is right");
                	equals(this._dataModel._data[0].year, 2009, "the _data is right");	
                	start();
                },
                onfailture: function(data){
                }
            }, true);
        },
        onfailture: function(data){
        }
    }, true);
});


test("Json", function() {
	expect(11);
	stop();
    var bookDMDefine = {
            fields:[{
                name: 'title'
            },{
                name: 'isbn'
            },{
                name: 'category'
            },{
                name: 'available',
                type: 'string',
                defaultValue: '0'
            },{
                name: 'chapters',
                type: 'array'
            }],
            validations:[]
        };
    baidu.data.ModelManager.defineDM('lib', bookDMDefine);
    var DM = baidu.data.ModelManager.createDM('lib');
    DM = DM[1];
    
    var url = '../../baidu/data/DataStore/lib.json';
    var dsOptions = {
        cache: false,
        dataType:  baidu.parser.type.JSON,
        transition: function(parser){
            var books = [],
            data,length,item;

            books = parser.query('//books');
            return books;
        }
    };
    var dataSource = baidu.data.dataSource.ajax(url, dsOptions);
    
    var dataStore = new baidu.data.DataStore({
        'dataModel': DM,
        'dataSource': dataSource,
        'action': 'APPEND'
    });

    dataStore.load({
        onsuccess: function(data){
        	equals(this._dataModel._index, 3, "the _index is right");
        	equals(this._dataModel._data[0].title, "Harry Potter", "the _data is right");
        	equals(this._dataModel._data[0].isbn, "1234-1234", "the _data is right");
        	equals(this._dataModel._data[0].category, "Childrens", "the _data is right");
        	equals(this._dataModel._data[0].available, "3", "the _data is right");
        	equals(this._dataModel._data[0].chapters.length, "2", "the _data is right");
        	equals(this._dataModel._data[1].title, "Brief History of time", "the _data is right");
        	equals(this._dataModel._data[1].isbn, "1234-ABCD", "the _data is right");
        	equals(this._dataModel._data[1].category, "Science", "the _data is right");
        	equals(this._dataModel._data[1].available, "0", "the _data is right");
        	equals(this._dataModel._data[1].chapters.length, "2", "the _data is right");
        	start();
        },
        onfailture: function(data){
        }
    }, true);
});

test("validator, default validations", function() {
	expect(9);
	stop();
	ua.importsrc("baidu.data.Validator.validatorRules", function(){
	    var bookDMDefine = {
	            fields:[{
	                name: 'title'
	            },{
	                name: 'isbn'
	            },{
	                name: 'category'
	            },{
	                name: 'available',
	                type: 'string',
	                defaultValue: '0'
	            },{
	                name: 'chapters',
	                type: 'array'
	            }],
	            validations:[]
	        };
	   
	    baidu.data.ModelManager.defineDM('lib', bookDMDefine);
	    var validator = new baidu.data.Validator();
	    baidu.data.ModelManager.setValidator(validator);
	    var DM = baidu.data.ModelManager.createDM('lib');
	    DM = DM[1];
	    
	    var url = '../../baidu/data/DataStore/newlib.json';
	    var dsOptions = {
	        cache: false,
	        dataType:  baidu.parser.type.JSON,
	        transition: function(parser){
	            var books = [],
	            data,length,item;
	
	            books = parser.query('//books');
	            return books;
	        }
	    };
	    var dataSource = baidu.data.dataSource.ajax(url, dsOptions);
	    
	    var dataStore = new baidu.data.DataStore({
	        'dataModel': DM,
	        'dataSource': dataSource,
	        'action': 'APPEND'
	    });
	
	    dataStore.load({
	        onsuccess: function(data){
	        	equals(this._dataModel._fields.title._validation[0].rule, 'string', "The validation is right");
	        	equals(this._dataModel._fields.isbn._validation[0].rule, 'string', "The validation is right");
	        	equals(this._dataModel._fields.category._validation[0].rule, 'string', "The validation is right");
	        	equals(this._dataModel._fields.available._validation[0].rule, 'string', "The validation is right");
	        	equals(this._dataModel._fields.chapters._validation[0].rule, 'array', "The validation is right");
	        	
	        	equals(this._dataModel._index, 3, "the _index is right");
	        	equals(this._dataModel._data[0].title, "Harry Potter", "the _data is right");
	        	equals(this._dataModel._data[1].title, "Brief History of time", "the _data is right");
	        	equals(this._dataModel._data[2].title, "Lord of the Rings", "the _data is right");
	        	start();
	        },
	        onfailture: function(data){
	        }
	    }, true);
	}, "baidu.data.Validator", "baidu.data.DataStore");
});

test("validator, validations and setValidator", function() {
	expect(11);
	stop();
	    var bookDMDefine = {
	            fields:[{
	                name: 'title'
	            },{
	                name: 'isbn'
	            },{
	                name: 'category'
	            },{
	                name: 'available',
	                type: 'string',
	                defaultValue: '3'
	            },{
	                name: 'chapters',
	                type: 'array'
	            }],
	            validations:[
	                        {field:'title',val:[{rule:'new'}, {rule:'lengthRange', conf:{min:0, max:20}}]},
	                        {field:'available',val:[{rule:'equalTo', conf:{refer : '3'}}]}
	            ]
	        };
	    
	    var validations = {
	            "new": [
	                {rule: "require"}
	            ]
	        };
	    
	    baidu.data.ModelManager.defineDM('lib', bookDMDefine);
	    var validator = new baidu.data.Validator(validations);
	    baidu.data.ModelManager.setValidator(validator);
	    var DM = baidu.data.ModelManager.createDM('lib');
	    DM = DM[1];
	    
	    var url = '../../baidu/data/DataStore/newlib.json';
	    var dsOptions = {
	        cache: false,
	        dataType:  baidu.parser.type.JSON,
	        transition: function(parser){
	            var books = [],
	            data,length,item;
	
	            books = parser.query('//books');
	            return books;
	        }
	    };
	    var dataSource = baidu.data.dataSource.ajax(url, dsOptions);
	    
	    var dataStore = new baidu.data.DataStore({
	        'dataModel': DM,
	        'dataSource': dataSource,
	        'action': 'APPEND'
	    });
	
	    dataStore.load({
	        onsuccess: function(data){
	        	equals(this._dataModel._fields.title._validation[0].rule, 'new', "The validation is right");
	        	equals(this._dataModel._fields.title._validation[1].rule, 'lengthRange', "The validation is right");
	        	equals(this._dataModel._fields.title._validation[2].rule, 'string', "The validation is right");
	        	equals(this._dataModel._fields.isbn._validation[0].rule, 'string', "The validation is right");
	        	equals(this._dataModel._fields.category._validation[0].rule, 'string', "The validation is right");
	        	equals(this._dataModel._fields.available._validation[0].rule, 'equalTo', "The validation is right");
	        	equals(this._dataModel._fields.available._validation[1].rule, 'string', "The validation is right");
	        	equals(this._dataModel._fields.chapters._validation[0].rule, 'array', "The validation is right");
	        	
	        	equals(this._dataModel._index, 2, "the _index is right");
	        	equals(this._dataModel._data[0].title, "Harry Potter", "the _data is right");
	        	equals(this._dataModel._data[1].title, "Lord of the Rings", "the _data is right");
	        	start();
	        },
	        onfailture: function(data){
	        }
	    }, true);
});