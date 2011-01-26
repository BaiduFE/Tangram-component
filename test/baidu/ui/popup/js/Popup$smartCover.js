module('baidu.ui.popup.Popup$smartCover');

test('events',
		function() {
			stop();
			var options = {
				modal : false,
				onclose : function() {
					start();
				}
			};
			var popup = new baidu.ui.popup.Popup(options);
			te.obj.push(popup);
			popup.render();
			var flash = document.createElement('object');
			var select = document.createElement('select');
			document.body.appendChild(flash);
			document.body.appendChild(select);
			popup.open();
			if (baidu.browser.ie) {
				// update
				equal(popup.getMain().lastChild.width,
						popup.getMain().offsetWidth);
				equal(popup.getMain().lastChild.height,
						popup.getMain().offsetHeight);
			}
			// show
			equal($(flash).css('visibility'), 'hidden',
					'flash is hidden by smartCover');
			//close
			popup.close();
			equal(flash.style.visibility, '',
			'flash shows by closing smartCover');
			
			document.body.removeChild(flash);
			document.body.removeChild(select);
		});
