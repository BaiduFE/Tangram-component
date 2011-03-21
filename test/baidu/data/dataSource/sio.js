/**
 * check baidu.data.dataSource.sio properties, methods and events
 */
module("baidu.data.dataSource.sio");

//测试sio的get方法
test("get", function(){
    stop();
    var sioSource = baidu.dataSource.sio(upath+"exist.js", {
        transition: function(){
            return name;
        }
    });
    sioSource.get({
        callByType: "browser",
        onsuccess: function(response){
        	equals(window.fromBrowser, '百度');
            start();
        }
    });
});
