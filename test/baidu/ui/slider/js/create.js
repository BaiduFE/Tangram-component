module('baidu.ui.slider.create');

test('init',function(){
	var div = document.body.appendChild(document.createElement("div"));
	stop();
	setTimeout(function(){
		var s  = baidu.ui.slider.create(div);
		var dd = s.getBody()!='object'&&s.getBody()!='undefined'
		equal(s.getBody().className,"tangram-slider","check body class");
		ok(dd,'check body');
		start(); 
	},30)

});