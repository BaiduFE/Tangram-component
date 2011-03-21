/**
 * check baidu.data.dataSource.ajax properties, methods and events
 */

module("baidu.data.dataSource.ajax");

// 测试ajax的get方法
test("get", function() {
	stop();
	var ajaxSource = baidu.dataSource.ajax((upath || "") + "get.php", {
		transition : function(source) {
			return source;
		}
	});
	ajaxSource.get({
		onsuccess : function(response) {
			equals(response, "ajax!", "xhr return");
			start();
		}
	});
});

/**
 * 测试ajax的get方法key参数
 */
test("key和cache", function() {
	stop();
	var url = (upath || "") + "get.php";
	var ajaxSource = baidu.dataSource.ajax(url + '?key=0');
	var cache;
	var check = ua.functionListHelper();

	check.add(function() {
		ajaxSource.get({
			key : 'test',
			onsuccess : function(response) {
				ok(/\d+/.test(response), 'reponse matched \\d+: ' + response);
				cache = response;
				check.next(20);
			}
		});
	});
	check.add(function() {// 有cache
		ajaxSource.update({
			'url' : url + '?key=1'
		});// 更换URL，确保不会在ajax请求时被浏览器cache
		ajaxSource.get({
			key : 'test',
			onsuccess : function(response) {
				equals(response, cache, "cached");
				check.next(20);
			}
		});
	});
	check.start();
});

// 测试ajaxOption对dataSource影响
test('ajaxOption', function() {
	stop();
	var url = (upath || "") + "get.php";
	var ajaxSource = baidu.dataSource.ajax(url, {
		ajaxOption : {
			'method' : 'post',
			data : 'm=post',
			'onsuccess' : function(xhr, text) {
				equals(text, 'POST', 'method post');
				start();
			}
		}
	});
	ajaxSource.get({
		key : 'post'
	});
});

// FIXME 这个事件是否对外公开？？？？
// test('onbeforeget', function() {
// stop();
// expect(2);
// var as = baidu.dataSource.ajax(upath + 'get.php', {
// onbeforeget : function() {
// ok(true, 'onbeforeget return false');
// return false;
// }
// });
// as.get({
// key : 'get',
// onsuccess : function() {
// ok(false, 'onsuccess should not trigger');
// }
// });
//
// as.update({
// onbeforeget : function() {
// ok(true, 'onbeforeget return null');
// }
// });
// as.get({
// key : 'get',
// onsuccess : function() {
// ok(false, 'onsuccess should not trigger');
// }
// });
//	
// as.update({
// onbeforeget : function() {
// ok(true, 'onbeforeget return null');
// return true;
// }
// });
// as.get({
// key : 'get123',
// onsuccess : function() {
// ok(false, 'onsuccess should not trigger');
// start();
// }
// });
// });

test('onfailure', function() {
	expect(1);
	stop();
	// 502, 404
	var as = baidu.dataSource.ajax(upath + 'noneexist.php');
	as.get({
		key : 'onfailure 404',
		onfailure : function(xhr) {
			equals(xhr.status, 404, 'onfailure');
			start();
		}
//	,//FIXME 404为啥没出来？
//		on404 : function(xhr){
//			equals(xhr.status, 404, 'on404');
//			start();
//		}
	});
});