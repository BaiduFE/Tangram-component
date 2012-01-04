module('baidu.ui.Tooltip.Tooltip$fx');


test('Open a common tooltip(fadeIn) and '
		+'close a common tooltip(fadeOut)', function() {
 	expect(2);
 	stop();
	var check = function() {
		var div = testingElement.dom[0];
		var div1 = document.createElement("div");
		document.body.appendChild(div1);
		var tp = new baidu.ui.Tooltip({
			target : div1,
			showFxOptions : {
    	    	onafterfinish : function() {
    	    		var len = baidu.fx.current(tp.getMain()).length;
    				equal(baidu.fx.current(tp.getMain())[len-1]['__type'], 
    						'baidu.fx.fadeIn', 'The tooltip fadeIn');
    				tp.close();
    	    	}
    		},
    	    hideFxOptions : {
    	    	onafterfinish : function() {
    	    		var len = baidu.fx.current(tp.getMain()).length;
    			    equal(baidu.fx.current(tp.getMain())[len-1]['__type'], 
    						'baidu.fx.fadeOut', 'The tooltip fadeOut');
    			    start();
    	    	}
    		}
		});
		tp.render(div);
	    tp.open(div1);
	    te.obj.push(tp);
	};
	ua.importsrc('baidu.fx.current', 
			check ,'baidu.fx.current', 'baidu.ui.Tooltip.Tooltip$fx');
});

test('Open a common tooltip(expand) and '
		+'close a common tooltip(collapse)', function() {
	expect(2);
	stop();
	var check = function() {
		var div = testingElement.dom[0];
		var div1 = document.createElement("div");
		document.body.appendChild(div1);
	    var tp = new baidu.ui.Tooltip({
			target : div1,
		    showFx : baidu.fx.expand,
		    hideFx : baidu.fx.collapse,
			showFxOptions : {
    	    	onafterfinish : function() {
    	    		var len = baidu.fx.current(tp.getMain()).length;
    			    var len = baidu.fx.current(tp.getMain()).length;
    			    var fx = baidu.fx.current(tp.getMain())[len-1]['__type'];
    			    var guid = baidu.fx.current(tp.getMain())[len-1]['guid'];
    			    ok(fx == 'baidu.fx.expand_collapse', 'The tooltip expand');
    			    tp.close();
    	    	}
    		},
    	    hideFxOptions : {
    	    	onafterfinish : function() {
    	    		var len = baidu.fx.current(tp.getMain()).length;
    			    var fx = baidu.fx.current(tp.getMain())[len-1]['__type'];
    			    var guid = baidu.fx.current(tp.getMain())[len-1]['guid'];
    		    	ok((fx == 'baidu.fx.expand_collapse') &&
    			    		guid != baidu.fx.current(tp.getMain())[len-1]['_guid'],
    			    		'The tooltip collapse');
    			    start();
    	    	}
    		}
		});
		
	    tp.render(div);
	    tp.open(div1);
	    te.obj.push(tp);
    };
	ua.importsrc('baidu.fx.expand,baidu.fx.collapse', 
			check ,'baidu.fx.expand', 'baidu.ui.Tooltip.Tooltip$fx');
});

test('Open a common tooltip(fadeIn) and '
		+'close a common tooltip(fadeOut) with options', function() {
 	expect(4);
	var div = testingElement.dom[0];
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
    var tp = new baidu.ui.Tooltip({
    	target : div1,
        showFxOptions : {
    			onbeforestart : function() {
    	    		ok(true, 'The tooltip fadeIn '
    	    				+'with a custom onbeforestart function');
    	    	},
    	    	onafterfinish : function() {
    	    		ok(true, 'The tooltip fadeIn '
    	    				+'with a custom onafterfinish function');
    	    		tp.close();
    	    	}
    		},
    	hideFxOptions : {
    			onbeforestart : function() {
    	    		ok(true, 'The tooltip fadeOut '
    	    				+'with a custom onbeforestart function');
    	    	},
    	    	onafterfinish : function() {
    	    		ok(true, 'The tooltip fadeOut '
    	    				+'with a custom onafterfinish function');
    	    		start();
    	    	}
    		}
    });
 	stop();
	tp.render(div);
    tp.open(div1);
    te.obj.push(tp);
});

test('Test the dispose() PUBLICGE-368 ', function() {
 	expect(3);
	stop();
	var div = testingElement.dom[0];
	var div1 = document.createElement("div");
	document.body.appendChild(div1);
	var ie = baidu.event._listeners.length;
	var tp = new baidu.ui.Tooltip({
		target : div1,
        showFxOptions : {
    	    	onafterfinish : function() {
    	    		tp.close();
    	    	}
    		},
    	hideFxOptions : {
    	    	onafterfinish : function() {
    	    		setTimeout(function(){
    	    			tp.dispose();
    	    		    ok(tp.getBody()==null,"element is removed");
    	    		    var ic = baidu.event._listeners.length;
    	    		    equals(ic, ie , 'event is lose');
	    			    start();
    	    		}, 0);
    	    	}
    		}
	});
	tp.addEventListener('ondispose', function(){
		setTimeout(function(){
			equals(baidu.fx.current(tp.getMain()), null , 'fx is end');
		}, 0);
	});
	tp.render(div);
    tp.open(div1);
}); 