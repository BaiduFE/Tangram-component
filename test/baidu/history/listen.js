module('baidu.history.listen');

test('basic', function(){
	expect(2);
	var step = 0;
	stop();
	ua.importsrc('baidu.browser,baidu.browser.safari', function(){
		var callback = function(){
			step ++;
			if(step == 1){
			    equals(location.hash, '#1', 'The hash is ' + location.hash);
			    if(baidu.browser.ie){
				    setTimeout(function(){
						window.location.hash = 2;
				    }, 0);
			    }
			    else{
			    	window.location.hash = 2;
			    }
			}
			if(step == 2){
				equals(location.hash, '#2', 'The hash is ' + location.hash);
			    start();
			} 
		};
		baidu.history.listen(callback);
		window.location.hash = 1;
	}, 'baidu.browser','baidu.history.listen');
});

test('prev and next in iframe', function(){
	expect(3);
	stop();
	var step = 0;
	ua.frameExt(function(w, f) {
		var me = this;
		var callback = function(){
			step ++;
			if(step == 1){
			    equals(w.location.hash, '#3', 'The hash is ' + w.location.hash);
			    if(baidu.browser.ie || baidu.browser.safari){
				    setTimeout(function(){
				    	w.location.hash = '';
				    }, 200);
			    }
			    else{
			    	w.history.back();
			    }
			}
			if(step == 2){
				if(baidu.browser.ie)
					equals(w.location.hash, '#' + init_hash, 'The hash is ' + w.location.hash);
				else
					equals(w.location.hash, init_hash, 'The hash is ' + w.location.hash);
			    if(baidu.browser.ie || baidu.browser.safari){
				    setTimeout(function(){
				    	w.location.hash = 3;
				    }, 200);
			    }
			    else{
			    	w.history.go(1);
			    }
			}
			if(step == 3){
				equals(w.location.hash, '#3', 'The hash is ' + w.location.hash);
			    te.dom.push(f);
			    me.finish();
			} 
		};
		var init_hash = w.location.hash;
		w.baidu.history.listen(callback);
		w.location.hash = 3;
    });
});

