/**
 * 封装ui公用部分
 * render
 * open
 * close
 * update
 * dispose
 * disable
 * enable
 */
 
 function initObject(UI,options){
 	if(options)var ui = new UI(options);
 	else var ui = new UI();
 	return ui;
 };

/**
 * 验证onload事件，main对象创建成功
 */
 function test_render(ui,target){
 	if(!ui.onload&&!ui.load)ui.onload = function(){ok(true,'load is dispatch!');};
 	if(target)ui.render(target);
 	else ui.render();
 	ok(ui.getMain(),'main is render!');
 };
 
 /**
  * 验证onopen事件，验证dom元素是否显示
  * ui:UI对象，param：open参数，beforeEvent：是否有onbeforeopen事件
  */
 function test_open(ui,param,beforeEvent){
 	if(!ui.onopen)ui.onopen = function(){ok(true,'open is dispatch!');};
 	if(beforeEvent&&!ui.onbeforeopen&&!ui.beforeopen)ui.onbeforeopen = function(){ok(true,'onopen is dispatch!');};
 	if(param)ui.open(param);
 	else ui.open();
 	ok(isShown(ui.getMain()),'main is shown!');
 };
 
 /**
  * 验证onclose事件，验证dom元素是否隐藏
  * ui:UI对象，param：close参数，beforeEvent：是否有onbeforeclose事件
  */
 function test_close(ui,param,beforeEvent){
 	if(!ui.onclose)ui.onclose = function(){ok(true,'open is dispatch!');};
 	if(beforeEvent&&!ui.onbeforeclose&&!ui.beforeclose)ui.onbeforeclose = function(){ok(true,'onclose is dispatch!');};
 	if(param)ui.close(param);
 	else ui.close();
 	ok(!isShown(ui.getMain()),'main is hide!');
 };
 
 /**
  * 验证options是否全部复制给me,验证onupdate事件
  */
  function test_update(ui,options){
  	if(!ui.onupdate)ui.onupdate = function(){ok(true,'onupdate is dispatch!');};
  	if(options)ui.update(options);
  	for(var key in options){
  		if(ui.key&&ui.key===options.key)continue;
  		else ok(false,key + ' is not updated!');
  	};
  };
 
 /**
  * dispose验证事件有没被清除，验证main有没被删掉
  */
  function test_dispose(ui){
  	var l1 = baidu.event._listeners.length;
  	if(!isShown(ui.getMain()))ui.render();
  	ui.dispose();
	equal(baidu.dom.g(ui.getId()),null,'disposed');
	ok(!isShown(ui.getMain()), 'main is not shown');
	equals(baidu.event._listeners.length, l1, 'event removed all');
  };
  
  /**
   * 验证disabled变量,验证ondisable事件被触发
   */
   function test_disable(ui){
   	ui.disable();
   	if(!ui.ondisable)ui.ondisable = function(){ok(true,'ondisable is dispatch!');};
   	if(ui.disabled)equal(ui.disabled,true,'check disabled');
   	if(ui.statable){
   		var body = ui.getBody();
   		if(body.className.match('disabled'))ok(true,'disabled class is add!');
   		else if(ui.getMain().className.match('disabled'))ok(true,'disabled class is add!');
   		else ok(false,'disabled class is not add!');
   	}
   };
   
   /**
    * 与disable函数结合使用来测试，验证disabled变量，验证onenable事件
    */
    function test_enable(){
    	ui.disable();
    	ui.enable();
    	if(!ui.onenable)ui.onenable = function(){ok(true,'onenable is dispatch!');};
   	    if(ui.disabled)equal(ui.disabled,false,'check disabled');
   	    if(ui.statable){
	   		var body = ui.getBody();
	   		if(!body.className.match('disabled'))ok(true,'disabled class is remove!');
	   		else if(!ui.getMain().className.match('disabled'))ok(true,'disabled class is remove!');
	   		else ok(false,'disabled class is not remove!');
   	    }
    };
 