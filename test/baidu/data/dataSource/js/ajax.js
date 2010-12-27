/**
 * check baidu.data.dataSource.ajax properties, methods and events
 */

module("baidu.data.dataSource.ajax");

//测试ajax的get方法
test("get", function(){
    stop();
    var ajaxSource = baidu.dataSource.ajax(upath||""+"get.php", {
        transition: function(source){
            return source;
        }
    });
    ajaxSource.get({
        onsuccess: function(response){
            equals(response, "ajax!", "xhr return");
            start();
        }
    });
})
