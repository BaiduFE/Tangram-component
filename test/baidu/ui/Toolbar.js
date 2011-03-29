/**
 * check Toolbar properties, methods and events
 * addRaw
 * add ui
 * createItem
 * createcell
 * remove
 * removeall
 * enableAll
 * disableAll
 * getItemByName
 * _itemBehavior
 * getItemByName
 */
module("baidu.ui.Toolbar");

test("render--no argument", function() {
    var options = {
        title:"title",
        width : 200,
        height:100
    };
    var toolbar = new baidu.ui.Toolbar(options);
    toolbar.render();
    ok(isShown(toolbar.getBody()), 'toolbar has been shown');
    equal(toolbar.uiType,'toolbar','check uiType');
    var containerTR = baidu.g(toolbar.getId('tableInner')).rows[0];
    equal(containerTR.cells.length,0,'check cell empty');
    equal(baidu.g(toolbar.getId()).style.width,'200px','check width 0');
    equal(baidu.g(toolbar.getId()).style.height,'100px','check height 0');
    te.obj.push(toolbar);
});


test("createitem", function() {
    stop();
    ua.importsrc('baidu.ui.Button,baidu.ui.Menubar',function(){
    	  var div = document.body.appendChild(document.createElement('div'));
    	  div.id = 'div_test';
          var options = {
            title:"title",
            width : 200,
            height:100,
            items : [
               {
                    type : 'button',
                    config : {
                        name:"test_button",
                        content:"<span class='in' style='width: 60px;'><strong>按钮</strong></span>" ,
                        onclick : function(){
                            ok(true,'button1 is create');
                        }
                    }
               },
               {
                    type : 'button',
                    config : {
                        content:"<span class='in' style='width: 60px;'><strong>按钮2</strong></span>" ,
                        onclick : function(){
                            ok(true,'button2 is create');
                        }
                    }

               },
               {
                    type : 'MENUBAR',
                    config : {
                        name:"test_menubar",
                        data : [ {
                            label: "复制",
                            title: "复制当前单元格",
                            items: [
                                {
                                    label: "复制1"
                                }, 
                                {
                                    label: "复制2"
                                } 
                            ]
                        } ]
                    }
               }
            ]
        };
        var toolbar = new baidu.ui.Toolbar(options);
        toolbar.render(div);
        var test_button = toolbar.getItemByName('test_button'),
            button2 = toolbar.getItemByName('tangram_toolbar_item_0');
        ua.click(test_button.getBody());
        ua.click(button2.getBody());
        var containerTR = baidu.g(toolbar.getId('tableInner')).rows[0];
        equal(containerTR.cells[0],test_button.getMain(),'button1 main is td[0]');
        equal(containerTR.cells[1],button2.getMain(),'button2 main is td[1]');
        equal(containerTR.cells.length,options.items.length,'check td amount');
//      var test_menubar = toolbar.getItemByName('test_menubar');
//      test_menubar.getTarget().innerHTML = "<span class='in' style='width: 60px;'><strong>菜单</strong></span>"
//      test_menubar.open();
//      test_menubar.itemMouseOver('0-0');
//      ok(isShown(test_menubar.getItem('0-0-0')), 'menubar is showon,so create menubar success');
//      te.dom.push(test_menubar.getMain());
        
        te.obj.push(toolbar);
        start();
  },'baidu.ui.Menubar','baidu.ui.Toolbar' );
});

test("direction vertical", function() {//纵向也测一下
  stop();
  ua.importsrc('baidu.ui.Button',function(){
    var options = {
        title:"title",
        width : 200,
        height:100,
        direction: 'vertical',
        items : [
           {
                type : 'button',
                config : {
                    name:"test_button1",
                    content:"<span class='in' style='width: 60px;'><strong>按钮1</strong></span>" 
                }
           },
           {
                type : 'button',
                config : {
                    name:"test_button2",
                    content:"<span class='in' style='width: 60px;'><strong>按钮2</strong></span>" 
                }
           },
           {
                type : 'button',
                config : {
                    name:"test_button3",
                    content:"<span class='in' style='width: 60px;'><strong>按钮3</strong></span>" 
                }
           }
        ]
    };
    var toolbar = new baidu.ui.Toolbar(options);
    var div = document.createElement('div');
    document.body.appendChild(div);
    toolbar.render(div);
    var test_button1 = toolbar.getItemByName('test_button1'),
        test_button2 = toolbar.getItemByName('test_button2'),
        test_button3 = toolbar.getItemByName('test_button3'),
        container = baidu.g(toolbar.getId('tableInner'));
    equal(toolbar.direction,'vertical');
    equal(toolbar.position,'top');        
    ok(isShown(test_button1.getBody()), 'test_button1 created success');    
    ok(isShown(test_button2.getBody()), 'test_button2 created success');  
    ok(isShown(test_button3.getBody()), 'test_button3 created success'); 
    equal(container.rows.length,3);
    
    options = {
           name : 'button',
           content:"<span class='in' style='width: 60px;'><strong>按钮4</strong></span>" 
      }
    var button = new baidu.ui.Button(options);
    toolbar.addRaw(button);
    ok(button==toolbar.getItemByName(options.name),'create a button4');
    te.obj.push(toolbar);
    start();

});

});

/*
 * 针对container的情况进行测试，1、默认container;2、无container;3、随意创建container
 */
test("add", function() {
    stop();
    ua.importsrc('baidu.ui.Button',function(){
     var options = {
            title:"title",
            width : 200,
            height:100,
            items : [
               {
                    type : 'button',
                    config : {
                        name:"test_button",
                        content:"<span class='in' style='width: 60px;'><strong>按钮</strong></span>" 
                    }
               }
            ]
        };
        var toolbar = new baidu.ui.Toolbar(options);
        toolbar.render();
        var containerTR = baidu.g(toolbar.getId('tableInner')).rows[0];
        var test_button = toolbar.getItemByName('test_button');
        ok(isShown(test_button.getBody()), 'test_button created success');
        options = {
            type : 'button',
            config : {
                name:"test_button2",
                content:"<span class='in' style='width: 60px;'><strong>按钮2</strong></span>" 
            }
        };
        toolbar.add(options);
        test_button = toolbar.getItemByName('test_button2');
        ok(isShown(test_button.getBody()), 'test_button2 created success');
        equal(test_button.getBody().parentNode,containerTR.cells[1],'check test_button2 position');
        
        var div = document.body.appendChild(document.createElement('div'));
        div.id = 'div_button3';
        options = {
            type : 'button',
            config : {
                name:"test_button3",
                content:"<span class='in' style='width: 60px;'><strong>按钮3</strong></span>"
            }
        };
        toolbar.add(options,div);
        test_button = toolbar.getItemByName('test_button3');
        ok(isShown(test_button.getBody()), 'test_button3 created success');    
        equal(test_button.getBody().parentNode,div,'check test_button2 position');
        te.dom.push(div);
        te.obj.push(toolbar);
        start();
    });

});
  
test('addRow',function(){
      var toolbar = new baidu.ui.Toolbar({title:"title"});
      toolbar.render();
      var options = {
           name : 'button',
           content:"<span class='in' style='width: 60px;'><strong>按钮</strong></span>" 
      }
      var div = document.createElement('div');
      document.body.appendChild(div);
      var button = new baidu.ui.Button(options);
      toolbar.addRaw(button,div);
      te.dom.push(button.getMain());
      ok(button==toolbar.getItemByName(options.name),'create a button');
      options = {
           name : 'button1',
           content:"<span class='in' style='width: 60px;'><strong>按钮2</strong></span>" 
      };
      button = new baidu.ui.Button(options);
      toolbar.addRaw(button);//html形式，在td里添加
      ok(button==toolbar.getItemByName(options.name),'create a button2');
      te.obj.push(toolbar);
  });
  
  test('remove removeAll',function(){
  	stop();
    ua.importsrc('baidu.ui.Button',function(){
        var options = {
            title:"title",
            width : 200,
            height:100,
            items : [
               {
                    type : 'button',
                    config : {
                        name:"test_button",
                        content:"<span class='in' style='width: 60px;'><strong>按钮</strong></span>" 
                    }
               },
               {
                    type : 'button',
                    config : {
                        name:"test_button2",
                        content:"<span class='in' style='width: 60px;'><strong>按钮2</strong></span>" 
                    }
               },
               {
                    type : 'button',
                    config : {
                        name:"test_button3",
                        content:"<span class='in' style='width: 60px;'><strong>按钮3</strong></span>" 
                    }
               }
            ]
        };
        var toolbar = new baidu.ui.Toolbar(options);
        toolbar.render();
        var test_button = toolbar.getItemByName('test_button'),
            test_button2 = toolbar.getItemByName('test_button2'),
            test_button3 = toolbar.getItemByName('test_button3'),
            containerTR = baidu.g(toolbar.getId('tableInner')).rows[0];
        ok(isShown(test_button.getBody()), 'test_button created success');    
        ok(isShown(test_button2.getBody()), 'test_button2 created success');  
        ok(isShown(test_button3.getBody()), 'test_button3 created success'); 
        
        toolbar.remove('test_button');
        ok(!isShown(test_button.getBody()), 'test_button is removed success');  
        ok(!baidu._g('tangram-toolbar--TANGRAM__1-cell-0'),'td[0] is removed');
        ok(!toolbar._itemObject['test_button'],'_itemObject[test_button] is removed');
        toolbar.removeAll();
        
        ok(!isShown(test_button2.getBody()), 'test_button2 is removed success');  
        ok(!isShown(test_button3.getBody()), 'test_button3 is removed success');  
        ok(!containerTR.cells[1],'td[1] is removed');
        ok(!containerTR.cells[2],'td[2] is removed');
        ok(!toolbar._itemObject['test_button2'],'_itemObject[test_button2] is removed');
        ok(!toolbar._itemObject['test_button3'],'_itemObject[test_button3] is removed');
        te.obj.push(toolbar);
        start();
    });
  });
  
  test('enable disable enableAll disableAll',function(){
        var options = {
            title:"title",
            width : 200,
            height:100,
            items : [
               {
                    type : 'button',
                    config : {
                        name:"test_button1",
                        content:"<span class='in' style='width: 60px;'><strong>按钮1</strong></span>" 
                    }
               },
               {
                    type : 'button',
                    config : {
                        name:"test_button2",
                        content:"<span class='in' style='width: 60px;'><strong>按钮2</strong></span>" 
                    }
               },
               {
                    type : 'button',
                    config : {
                        name:"test_button3",
                        content:"<span class='in' style='width: 60px;'><strong>按钮3</strong></span>" 
                    }
               }
            ]
        };
        var toolbar = new baidu.ui.Toolbar(options);
        toolbar.render();
        var test_button = toolbar.getItemByName('test_button1'),
            test_button2 = toolbar.getItemByName('test_button2'),
            test_button3 = toolbar.getItemByName('test_button3'),
            containerTR = baidu.g(toolbar.getId('tableInner')).rows[0];
        ok(isShown(test_button.getBody()), 'test_button created success');    
        ok(isShown(test_button2.getBody()), 'test_button2 created success');  
        ok(isShown(test_button3.getBody()), 'test_button3 created success'); 
        toolbar.disable('test_button1');
        ok(test_button.getBody().className.match('disabled'), 'button1 is disable');  
        toolbar.enable('test_button1');
        ok(!test_button.getBody().className.match('disabled'), 'button1 is enable');  
        toolbar.disableAll();
        ok(test_button.getBody().className.match('disabled'), 'button1 is disable');  
        ok(test_button2.getBody().className.match('disabled'), 'button2 is disable');  
        ok(test_button3.getBody().className.match('disabled'), 'button3 is disable');  
        toolbar.enableAll('test_button');
        ok(!test_button.getBody().className.match('disabled'), 'button1 is disable');    
        ok(!test_button2.getBody().className.match('disabled'), 'button2 is disable');   
        ok(!test_button3.getBody().className.match('disabled'), 'button3 is disable');  
        te.obj.push(toolbar);
  });
  
 test('setHighLight cancelHighLight',function(){
      var options = {
            title:"title",
            items : [
               {
                    type : 'button',
                    config : {
                        name:"test_button1",
                        content:"<span class='in' style='width: 60px;'><strong>按钮1</strong></span>" ,
                        onhighlight : function(){
                             ok(test_button1.getBody().className.match('tangram-button-highlight'),'button is highlight');
                        },
                        oncancelhighlight : function(){
                            ok(!test_button1.getBody().className.match('tangram-button-highlight'),'button is cancelhighlight');
                        }
                    }
               }
            ]
        };
        var toolbar = new baidu.ui.Toolbar(options);
        toolbar.render();
        var test_button1 = toolbar.getItemByName('test_button1'),
            containerTR = baidu.g(toolbar.getId('tableInner')).rows[0];
        ok(isShown(test_button1.getBody()), 'test_button created success');    
        test_button1.setHighLight();
        test_button1.cancelHighLight();
        te.obj.push(toolbar);
       
 });
 
 test('dispose',function(){
	var l1 = baidu.event._listeners.length;
	var t = new baidu.ui.Toolbar();
	t.render(te.dom[0]);
	ok(baidu.dom.g(t.getId()),'created');
	t.dispose();
	equal(baidu.dom.g(t.getId()),null,'disposed');
	equals(baidu.event._listeners.length, l1, 'event removed all');
});
