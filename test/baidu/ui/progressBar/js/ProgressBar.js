module('baidu.ui.progressBar.ProgressBar');

test('initialize', function() {
	expect(1);
	var pb = new baidu.ui.progressBar.ProgressBar( {
		value : 20
	});
	pb.render(te.dom[0]);
	equal(pb.getValue(), 20);
	pb.dispose();
});

test('dynamic', function() {
	stop();
	expect(22);
	var progress = -10;
	var pb = new baidu.ui.progressBar.ProgressBar( {
		onupdate : function() {
			progress += 10;
			/* getValue() */
			equal(pb.getValue(), progress, 'get value');
			/* _calcPos */
			equal(parseInt(pb.getBar().style.width),200*progress/100,'current progress is '+200*progress/100+'%');
		}
	});
	pb.render(te.dom[0]);
	var handle = setInterval(function() {
		if (pb.getValue() == 100) {
			clearInterval(handle);
			pb.dispose();
			start();
		}
		pb.update( {
			value : pb.getValue() + 10
		});
	}, 20);
});

test('dispose', function() {
	expect(2);
	var pb = new baidu.ui.progressBar.ProgressBar();
	pb.render(te.dom[0]);
	ok(baidu.dom.g(pb.getId()),'created');
	pb.dispose();
	equal(baidu.dom.g(pb.getId()),null,'disposed');
})