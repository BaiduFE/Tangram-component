/**
 * check baidu.data.dataSource.sio properties, methods and events
 */
module("baidu.data.dataSource.sio");

//测试sio的get方法
test("get", function(){
    stop();
    var sioSource = baidu.dataSource.sio("http://fe.baidu.com/dev/tangram/assets/test.js", {
        transition: function(){
            return name;
        }
    });
    sioSource.get({
        callByType: "browser",
        onsuccess: function(response){
            equals(response, "Bob,Alice,Eve", "xhr return");
            start();
        }
    });
})
