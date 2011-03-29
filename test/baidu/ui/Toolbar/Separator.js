module("baidu.ui.Toolbar.Separator");

/**
 * baidu.ui.Toolbar.Separator 设置分隔区域，用于两个组件之间
 */
test('render',function(){
	stop();
	ua.importsrc('baidu.ui.Button',function(){
		var div = document.body.appendChild(document.createElement('div'));
		div.id = 'div_test';
		var options = {
			items : [
			   {
	                config:{
	                    name:"test_button",
	                    content:"<span class='in' style='width: 60px;'><strong>按钮</strong></span>"        
	                }
	           },
			   {
			   	   type:"toolbar-separator",
			   	   config : {
			   	   	    name : 'test_separator'
			   	   }
			   },			  
			   {
	                config:{
	                    name:"test_button1",
	                    content:"<span class='in' style='width: 60px;'><strong>按钮1</strong></span>"        
	                }
	           }
			]
		};
		var toolbar  = new baidu.ui.Toolbar(options);
		toolbar.render(div);
		var containerTR = baidu.g(toolbar.getId('tableInner')).rows[0],
		    test_button = toolbar.getItemByName('test_button'),
            separator = toolbar.getItemByName('test_separator'),
            test_button1 = toolbar.getItemByName('test_button1');    
		equal(separator.uiType,'toolbar-separator');
		ok(baidu.dom.getStyle(separator.getBody(),'display')=='block','separator is shown');
		te.obj.push(toolbar);
		start();
	});
});



