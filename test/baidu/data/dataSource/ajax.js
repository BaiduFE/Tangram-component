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
	var ajaxSource = baidu.dataSource.ajax(url + '?key=2');
	var cache;
	var check = ua.functionListHelper();

	check.add(function() {
		ajaxSource.get({
			key : 'test',
			ajaxOption : {
				'method' : 'get',
				'onsuccess' : function(xhr, text) {
					//console.log("test");
					ok(/\d+/.test(text), 'reponse matched \\d+: '
							+ text);
					cache = text;
					check.next();
				}
			}
		});
	});
	check.add(function() {// 有cache
		ajaxSource.update({
			'url' : url + '?key=3'
		});// 更换URL，确保不会在ajax请求时被浏览器cache
		ajaxSource.get({
			key : 'test',
			ajaxOption : {
				'method' : 'get',
				'onsuccess' : function(xhr, text) {
					equals(text, cache, "cached");
					check.next();
				}
			}
		});
	});
	check.start();

});