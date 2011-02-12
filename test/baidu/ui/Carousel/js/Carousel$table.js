module('baidu.ui.carousel.Carousle$table');

/**
 * <li>addTableItem
 * <li>removeTableItem
 * 
 * **/

test('addTableItem',function(){
	stop();
	setTimeout(function(){
		var data = new Array(1,2,3,4,5,6,7,8,89,66,555,'ee','r');
		var options = {
			data : data,
			target : te.dom[0]
//			layout : {row:2,col:4}
		}
		var car = new baidu.ui.Carousel(options);
		
		car.render();	
		var count = car.totalCount;
		var addData = new Array(30,50,55,88,555,7777);
		car.addTableItem(addData);
		equal(car.totalCount,count+1,'add tableItem');
		car.addTableItem([3,46,77,88,99]);
		equal(car.totalCount,count+2,'add tableItem');
		car.addTableItem(['ggg','ttt',477,'d',799]);
		equal(car.totalCount,count+3,'add tableItem');
		start();
	},100);
	
});


test('addTableItem with index',function(){
	stop();
	setTimeout(function(){
		var data = new Array(1,2,3,4,5,6,7,8,89,0,555,'ee','r');
		var options = {
			data : data,
			target : te.dom[2],
			contentText : [ {
				content : "item-0"
			}, {
				content : "item-1"
			}, {
				content : "item-2"
			}, {
				content : "item-3"
			}, {
				content : "item-4"
			}, {
				content : "item-5"
			} ]
		}
		var car = new baidu.ui.Carousel(options);
		car.render();
		var count = car.totalCount;
		var addData = new Array('add','add2');
		car.addTableItem(addData,1);
		same(car.getTable(1).data[0].content,['add','add2','&nbsp;'] );//在index=1处检查插入的元素是否正确
		equal(car.totalCount,count+1,'add tableItems');
		start();
	},100);
	});

test('removeTableItem',function(){
	stop();
	setTimeout(function(){
		var data = new Array(1,2,3,4,5,6,7,8,89,0,555,'ee','r');
		var options = {
			data : data,
			gridLayout : {row:2,col:4},
			target : te.dom[2],
			contentText : [ {
				content : "item-0"
			}, {
				content : "item-1"
			}, {
				content : "item-2"
			}, {
				content : "item-3"
			}, {
				content : "item-4"
			}, {
				content : "item-5"
			} ]
		}
		var car = new baidu.ui.Carousel(options);
		car.render();
		var count = car.totalCount;
		car.removeTableItem(1);
		equal(car.totalCount,count-1,'remove tableItems');
		same(car.getTable(1),undefined );
		equal(car.getTable(0).data.length,2);//2行4列，则一共2个data，每个大小为4
		equal(car.getTable(0).data[0].content[0],1,'first element is 1');
		equal(car.getTable(0).data[1].content[0],5,'second row is 5');
		start();
	},100);
		
});
