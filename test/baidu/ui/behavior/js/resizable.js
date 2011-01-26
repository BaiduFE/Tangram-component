(function() {
	module("baidu.ui.behavior.resizable");
	ua.importsrc("baidu.ui.createUI");
	
	test("resizable function",function(){ 
	//	ua.importsrc("baidu.ui.createUI", function() {
	       var div = document.body.appendChild(document.createElement("div"));
	        $(div).css("width", 40).css("height", 40).css("position", "absolute").css(
			        "left", 0).css("top", 0).css("backgroundColor", "red");
		    var resizableUI = baidu.ui.createUI(new Function).extend( {
					resizable : true
			});
			var options = {
				target : div,
				onresizestart : function(){
					ok(true,"execute event onresizestart");
				},
				onresize : function(){
					ok(true,"execute event onresize");
				},
				onresizeend : function(){
					ok(true,"execute event onresizeend");
				}
			}
			var instance = new resizableUI();
			instance.resizeUpdate(options);
			stop();
			ua.mousemove(document.body, {
				clientX : 40,
				clientY : 40
			});
			var ehandle = div.lastChild;
			setTimeout(function() {
				ua.mousedown(ehandle, {
					clientX : 40,
					clientY : 40
				});
				setTimeout(function() {
					ua.mousemove(ehandle, {
						clientX : 50,
						clientY : 50
					});
					setTimeout(function() {				
						ua.mouseup(ehandle, {
							clientX : 50,
							clientY : 50
					    });
						setTimeout(function(){
							equals(parseInt($(div).css("width")), 50, "se拖动后，宽度变化");
							equals(parseInt($(div).css("height")), 50, "se拖动后，宽度变化");
							$(div).remove();
							start();					
						}, 40);
					}, 40);
				}, 40);
			}, 40);
		});
//	});
	
})()