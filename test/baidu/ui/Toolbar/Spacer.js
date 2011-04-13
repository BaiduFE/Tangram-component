module("baidu.ui.Toolbar.Spacer");

/**
 * baidu.ui.Toolbar.Spacer作用是设置间隔区域，用于组件之间，主要作用是调整外观
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
			   	   type:"toolbar-spacer",
			   	   config : {
			   	   	    name : 'toolbar-spacer',
			   	   	    height:"50px"
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
            spacer = toolbar.getItemByName('toolbar-spacer'),
            test_button1 = toolbar.getItemByName('test_button1');
        $(spacer.getBody()).css('background-color','red');  
		equal(spacer.uiType,'toolbar-spacer');
		equal(spacer.getBody().style.height,'50px','toolbar-spacer height');
		te.obj.push(toolbar);
		start();
	});
});