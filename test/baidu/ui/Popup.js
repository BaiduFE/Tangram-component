module('baidu.ui.Popup');

/*******************************************************************************
 * <li>close
 * <li>dispose
 * <li>getBody
 * <li>getString
 * <li>isShown
 * <li>open
 * <li>render
 * <li>update
 ******************************************************************************/

test('events', function() {
	var options = {
		/*用字符串而不是数字setStyles中没有引入baidu.com._styleFilter.px，因此不会对数字修正添加px单位*/
		top : 10,
		left : '20px',
		width : '15px',
		height : '16px',
		modal : false,
		onopen : function() {
			stop();
			var main = this.getMain();
			equal(this.isShown(), true, 'onopen is called');
			equal($(main).css('top'), '10px', 'get top');
			equal($(main).css('left'), '20px', 'get left');
			equal($(main).css('width'), '15px', 'get width');
			equal($(main).css('height'), '16px', 'get height');
		},
		onclose : function() {
			equal(!this.isShown(), true, 'onclose is called');
			start();
		},
		onbeforeclose : function() {
			equal(this.isShown(), true, 'onbeforeclose is called');
		},
		onupdate : function() {
			ok(true, 'onupdate is called');
		}
	};
	var popup = new baidu.ui.Popup(options);
	te.obj.push(popup);
	popup.render();
	popup.open(options);
	popup.close(options);
});


test('dispose',function(){
	stop();
	expect(12);
	var options = {
			top : 10,
			left : 20,
			width : 15,
			height : 16,
			onclose : function() {
				equal(!this.isShown(), true, 'onclose is called');
				start();
			}
		};
		var popup = new baidu.ui.Popup(options);
		popup.render();
		popup.open(options);
		popup.close(options);
		equal(popup["top"],10,'get top before dispose');
		equal(popup["left"],20,'get left before dispose');
		equal(popup["width"],15,'get width before dispose');
		equal(popup["height"],16,'get height before dispose');
		popup.dispose();
		equal(popup["top"],'auto','get top after dispose');
		equal(popup["left"],'auto','get left after dispose');
		equal(popup["width"],'','get width after dispose');
		equal(popup["height"],'','get height after dispose');
		equal(popup["mainId"],undefined,'get mainId after dispose');
		equal(popup['id'],"","no id after dispose");
		equal(popup.getMain(),undefined,'getMain is disposed');
		
});
//
test('getString',function(){
	expect(1);
	var popup = new baidu.ui.Popup();
	te.obj.push(popup);
	popup.render();
	var str = popup.getString();
	equal(str,"<div id="+"'"+popup.getId()+"'"+" class="+"'"+popup.getClass()+"'"+"></div>")
});
