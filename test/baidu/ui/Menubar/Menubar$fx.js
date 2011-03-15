module('baidu.ui.Menubar.Menubar$fx');

test('Open a common Menubar(expand) and'
		+ ' close a common Menubar(collapse)', function() {
	expect(2);
 	var options = {
 			data : [ {
 				content : 'm11'
 		        }, {
 				content : 'm12'
 			} ],
			target : testingElement.dom[0]
		   };
    var menu = new baidu.ui.Menubar(options);
    testingElement.obj.push(menu);
	menu.render(menu.target);
	menu.open();
	var a = menu.getBody().getAttribute('att_baidu_fx_expand_collapse');
	ok(!!a, 'The menubar expand');
	menu.close();
	var b = menu.getBody().getAttribute('att_baidu_fx_expand_collapse');
	ok( b!= a, 'The menubar collapse');
	menu.dispose();
});

test('Open a common Menubar(fadeIn) ' 
		+'and close a common Menubar(fadeOut)', function() {
	expect(6);
 	stop();
 	var check = function (){
 	    var options = {
 			    data : [ {
 				    content : 'm11'
 			    }, {
 				    content : 'm12'
 			    } ],
			    target : testingElement.dom[0],
			    showFx : baidu.fx.fadeIn,
			    hideFx : baidu.fx.fadeOut,
			    showFxOptions : {
			    	onbeforestart : function() {
		        		ok(true, 'The manubar fadeIn with '
		        				+'a custom onbeforestart function');
		        	},
		        	onafterfinish : function() {
		        		ok(true, 'The manubar fadeIn with '
		        				+'a custom onafterfinish function');
		        	}
		    	},
		    	hideFxOptions : {
		    		onbeforestart : function() {
		        		ok(true, 'The manubar fadeOut with '
		        				+'a custom onbeforestart function');
		        	},
		    		onafterfinish : function() {
		        		ok(true, 'The manubar fadeOut with '
		        				+'a custom onafterfinish function');
		        	}
		    	}
		    };
      var menu = new baidu.ui.Menubar(options);
      testingElement.obj.push(menu);
	    menu.render(menu.target);
	    menu.open();
	    var a = $(menu.getBody()).css('opacity');
	    equal(a, 0, 'After the manubar fadeIn, the opacity is');
	    menu.close();
	    a = $(menu.getBody()).css('opacity');
	    equal(a, 1, 'After the manubar fadeOut, the opacity is');
	    menu.dispose();
	    start();
 	};
 	ua.importsrc('baidu.fx.fadeIn,baidu.fx.fadeOut', check ,
 			'baidu.fx.fadeIn', 'baidu.ui.Menubar.Menubar$fx');
});


