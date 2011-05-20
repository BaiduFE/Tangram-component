module('baidu.ui.Carousel.Carousel$cycle');
(function() {
	te.getUI = function(op, norender, target) {
		op = op || {};
		if (!op.contentText) {
			op.contentText = [ {
				content : "item-0"
			}, {
				content : "item-1"
			}, {
				content : "item-2"
			}, {
				content : "item-3"
			} ];
			op.target = target || op.target || te.dom[0];
		}
		var ui = new baidu.ui.Carousel(op);
		!norender && ui.render(op.target);
		te.obj.push(ui);
		return ui;
	};

})();

test('base', function() {
	// 创建一个不带cycle的对象，确认cycle不生效
	// page size默认为3，确认向右滚动2个位置，后当前item
	var c = te.getUI({
		isCycle : false
	});
	equals(c.uiType, 'carousel', 'check uitype');
	equals(c.pageSize, 3, 'check page size');
	equals(c.orientation, 'horizontal', 'check orientation');
	equals(c.getCurrentIndex(), 0);
	equals(c.getItem(3), null, 'item 3 is not shown');
	c.next();
	equals(c.getCurrentIndex(), 1);
	c.next();
	c.next();
	ok(isShown(c.getItem(3)), 'item 3 is shown');
	equals(c.getItem(0), null, 'item 0 is not shown');
	c.next();
	ok(isShown(c.getItem(3)), 'item 3 is shown');
	equals(c.getItem(0), null, 'item 0 is not shown');
	c.dispose();

	// 创建一个带cycle的对象，确认特性可用
	c = te.getUI({
		target : document.body.appendChild(document.createElement("div"))
	});
	equals(c.uiType, 'carousel', 'check uitype');
	equals(c.pageSize, 3, 'check page size');
	equals(c.orientation, 'horizontal', 'check orientation');
	equals(c.getCurrentIndex(), 0);
	equals(c.getItem(3), null, 'item 3 is not shown');
	c.next();
	equals(c.getCurrentIndex(), 1);
	c.next();
	c.next();
	ok(isShown(c.getItem(3)), 'item 3 is shown');
	equals(c.getItem(0), null, 'item 0 is not shown');
	c.next();
	equals(c.getCurrentIndex(), 0);
	equals(c.getItem(1), null, 'item 1 is not shown');

	c.next();
	equals(c.getCurrentIndex(), 1);
	equals(c.getItem(2), null, 'item 1 is not shown');//位置校验应该需要更严格
});

test('dispose', function() {
	if (!baidu.event) {
		ok(false, 'event should be managed by baidu.event');
	} else {
		te.checkUI.dispose(te.getUI());
	}
});
