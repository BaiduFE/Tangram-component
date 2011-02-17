module('baidu.ui.ProgressBar');


(function() {
	/**
	 * create a div for test start
	 * <li>create div
	 * <li>set id <b>div_test</b>
	 * <li>set type text
	 * 
	 * @return div@type text
	 */
	function _testStart() {
		var id = "div_test";
		var div = document.createElement("div");
		div.id = id;
		$(div).css('width', '200px').css('height', '20px').css('border', 'solid')
		.css('color', 'black').css('position', 'absolute');
		var link = document.createElement('link');
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href",
				'../../baidu/ui/ProgressBar/style.css');
		document.getElementsByTagName("head")[0].appendChild(link);
		document.body.appendChild(div);
		div.style.position = 'absolute';
		te.dom.push(div);
		te.dom.push(link);
	}

	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);;
		_testStart();
	}
})();

test('initialize', function() {
	expect(1);
	var pb = new baidu.ui.ProgressBar( {
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
	var pb = new baidu.ui.ProgressBar( {
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
	var pb = new baidu.ui.ProgressBar();
	pb.render(te.dom[0]);
	ok(baidu.dom.g(pb.getId()),'created');
	pb.dispose();
	equal(baidu.dom.g(pb.getId()),null,'disposed');
})