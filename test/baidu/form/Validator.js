module("baidu.form.Validator");
//
(function() {
	valid = {
		init : function() {
			QUnit.stop();
			valid.createForm();
			valid.sto = setTimeout(function() {
				QUnit.ok(false, 'test time out');
				QUnit.start();
			}, 1000);
		},
		down : function() {
			TT.dom.remove('test');
			clearTimeout(valid.sto);
			QUnit.start();
		},
		createForm : function(win) {
			var w = win || window;
			var fadiv = w.document.createElement('div');
			fadiv.id = 'test';
			w.document.body.appendChild(fadiv);
			var form = w.document.createElement('form');
			form.id = 'testform';
			form.method = 'get';
//			form.action = '';
			
			form.innerHTML = ("<table>"
					+ "<tr><td>用户名</td><td><input type='text' id='name' name='name'/></td><td><span id='c1'></span></td></tr>"
					+ "<tr><td>密码</td><td><input type='password' id='pwd' name='pwd'/></td><td><span id='c2'></span></td></tr>"
					+ "<tr><td>E-Mail</td><td><input type='text' id='email' name='email'/></td><td><span id='c3'></span></td></tr>"
					+ "<tr><td><input id='btn' type='submit' value='百度一下' /></td></tr>"
					+ "</table>");
			fadiv.appendChild(form);
		}
	}

})();
// validate all true
test("验证构造函数,存在的ID,构建返回true", function() {
	valid.init();
	TT.dom.setAttr('name', 'value', 'new user');
	TT.dom.setAttr('pwd', 'value', 'password');
	TT.dom.setAttr('email', 'value', 'email@baidu.com');
	var validator = new baidu.form.Validator('testform', {
		name : {
			rule : {
				required : {
					param : true
				}
			}
		},
		pwd : {
			rule : {
				required : {
					param : true
				},
				maxlength : {
					param : 10
				}
			}
		},
		email : {
			rule : {
				required : {
					param : true
				},
				minlength : {
					param : 10
				},
				maxlength : {
					param : 30
				},
				email : {
					param : true
				}
			}
		}
	});
	var callback = function(opt) {
		equal(opt, true, 'validate name true');
		validator.dispose();
		valid.down();
	};
	validator.validate(callback);
});
// validate false
test("验证构造函数,存在的ID,构建返回false", function() {
	valid.init();
	// TT.dom.setAttr('name', 'value' ,'new user');
	var validator = new baidu.form.Validator('testform', {
		name : {
			rule : {
				required : {
					param : true
				}
			}
		}
	});
	var callback = function(opt) {
		equal(opt, false, 'validate name fail');
		validator.dispose();
		valid.down();
	};
	validator.validate(callback);
});
// validateField false
test("验证构造函数,feildRule多条 fail", function() {
	valid.init();
	var validator = new baidu.form.Validator('testform', {
		name : {
			rule : {
				required : true,
				maxlength : 4
			}
		},
		pwd : {
			rule : {
				required : {
					param : true
				},
				maxlength : {
					param : 10
				}
			}
		}
	});
	var callback = function(opt) {
		equal(opt, false, 'validate name fail');
		validator.dispose();
		valid.down();
	};
	validator.validateField('name', callback);
});

test("验证构造函数,feildRule fieldName不存在", function() {
	valid.init();
	var validator = new baidu.form.Validator('testform', {
		name : {
			rule : {
				required : true,
				maxl : 4
			}
		}
	});
	var callback = function(opt) {
		equal(opt, false, 'validate name fail');
		validator.dispose();
		valid.down();
	};
	try {
		validator.validateField('name', callback);
	} catch (e) {
		ok(true, 'test error');
		validator.dispose();
		valid.down();
	}
});
// validateField true
test("验证构造函数,feildRule 各种语法糖集合", function() {
	valid.init();
	TT.dom.setAttr('name', 'value', 'new user');
	var validator = new baidu.form.Validator('testform', {
		name : {
			rule : {
				required : true,
				maxlength : 20,
				rangelength : [ 4, 15 ],
				remote : upath + 'request.php?type=on&status=200&valid=true'
			}
		}
	});
	var callback = function(opt) {
		equal(opt, true, '语法糖');
		validator.dispose();
		valid.down();
	};
	validator.validateField('name', callback);
});
//
test("验证构造函数,feildRule required组合测试", function() {
	valid.init();
	TT.dom.setAttr('name', 'value', 'new user');
	TT.dom.setAttr('pwd', 'value', 'newuser');
	var validator = new baidu.form.Validator('testform', {
		name : {
			rule : {
				required : false,
				maxlength : 20,
				rangelength : [ 4, 15 ],
				remote : upath + 'request.php?type=on&status=200&valid=true'
			}
		},
		email : {
			rule : {
				required : false,
				maxlength : 20,
				email : true
			}
		}
	});
	var callback = function(opt) {
		equal(opt, true, '语法糖');
		validator.dispose();
		valid.down();
	};
	validator.validateField('name', callback);
});
//
test("验证构造函数,feildRule 非语法糖集合", function() {
	valid.init();
	TT.dom.setAttr('name', 'value', 'new user');
	var validator = new baidu.form.Validator('testform', {
		name : {
			rule : {
				required : {
					param : true
				},
				maxlength : {
					param : 20
				},
				rangelength : {
					param : [ 4, 20 ]
				},
				remote : {
					url : upath + 'request.php?type=on&status=200&valid=true'
				}
			}
		}
	});
	var callback = function(opt) {
		equal(opt, true, '语法糖');
		validator.dispose();
		valid.down();
	};
	validator.validateField('name', callback);
});
//
test("验证构造函数,feildRule 错误消息队列", function() {
	valid.init();
	TT.dom.setAttr('name', 'value', '123456789012345678901');
	var validator = new baidu.form.Validator('testform', {
		name : {
			rule : {
				required : true,
				remote : upath + 'request.php?type=on&status=200&valid=false',
				maxlength : {
					param : 20,
					message : {
						success : 'success msg',
						failure : 'failure msg'
					}
				},
				rangelength : [ 4, 15 ]
			}
		},
		email : {
			rule : {
				required : true
			}
		}
	});
	var callback = function(opt, msg) {
		equal(opt, false, '错误消息队列');
		equal(msg.length, 4, '错误消息队列大小');
		validator.dispose();
		valid.down();
	};
	validator.validate(callback);
});

//
test("验证构造函数,feildRule eventName校验keyup", function() {
	valid.init();
	expect(2);
	TT.dom.setAttr('name', 'value', '123456789');
	var validator = new baidu.form.Validator('testform', {
		name : {
			rule : {
				required : true,
				rangelength : [ 4, 15 ]
			},
			eventName : 'keyup'
		}
	}, {
		onvalidatefield : function(event) {
			if ('name' == event.field) {
				equal(event.field, 'name', 'validate field是');
				equal(event.resultList.length, 0, '错误消息队列大小');
				validator.dispose();
				valid.down();
			} else {
				ok(false, "onvalidatefield error!");
			}
		}
	});
	// blur失效
	TT.event.fire('name', 'blur');
	// setTimeout(function() {
	TT.event.fire('name', 'keyup');
	// }, 50);
});
//
test("验证构造函数,feildRule eventName校验默认blur", function() {
	valid.init();
	expect(2);
	TT.dom.setAttr('email', 'value', '123456789');
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				required : true
			}
		}
	}, {
		onvalidatefield : function(event) {
			if ('name' == event.field) {
				ok(false);
			} else if ('email' == event.field) {
				equal(event.field, 'email', 'validate field是');
				equal(event.resultList.length, 0, '错误消息队列大小');
			} else {
				ok(false, "onvalidatefield error!");
			}
			validator.dispose();
			valid.down();
		}
	});
	// 校验默认 name blur
	TT.event.fire('email', 'blur');
});
//
test("验证构造函数,feildRule validateEvent设定keyup,event blur", function() {
	valid.init();
	TT.dom.setAttr('email', 'value', '123456789');
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				required : true
			}
		}
	}, {
		validateEvent : 'keyup',
		onvalidatefield : function(event) {
			if ('email' == event.field) {
				equal(event.field, 'email', 'validate field是');
				equal(event.resultList.length, 0, '错误消息队列大小');
			} else {
				ok(false, "onvalidatefield error!");
			}
			validator.dispose();
			valid.down();
		}
	});
	// 校验默认 name blur
	TT.event.fire('email', 'blur');
	setTimeout(function() {
		ok(true, '无事件响应');
		validator.dispose();
		valid.down();
	}, 100);
});

test("验证构造函数,feildRule options设定keyup,event keyup", function() {
	valid.init();
	// 无响应
	expect(2);
	TT.dom.setAttr('email', 'value', '123456789');
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				required : true
			}
		}
	}, {
		validateEvent : 'keyup',
		onvalidatefield : function(event) {
			if ('email' == event.field) {
				equal(event.field, 'email', 'validate field是');
				equal(event.resultList.length, 0, '错误消息队列大小');
			} else {
				ok(false, "onvalidatefield error!");
			}
			validator.dispose();
			valid.down();
		}
	});
	// 校验默认 name blur
	TT.event.fire('email', 'keyup');
});
//
test("验证构造函数,feildRule options设定validateOnSubmit默认true", function() {
	// 无响应
	expect(2);
	ua.frameExt(function(w, f) {
		var me = this;
		valid.createForm(w);
		w.document.getElementById('email').value = '1baidu.com';
		var validator = new w.baidu.form.Validator('testform', {
			email : {
				rule : {
					required : true
				}
			}
		}, {
			onvalidate : function(event) {
				ok(true, 'do onvalidate');
			}
		});
		
		w.document.getElementById('btn').click();
		setTimeout(function() {
			equal(w.location.search, "?name=&pwd=&email=1baidu.com", 'form url : ');
			me.finish();
		}, 1000);
	});
});
// validateOnSubmit false
test("验证构造函数,feildRule options设定validateOnSubmit false", function() {
	// 无响应
	expect(1);
	ua.frameExt(function(w, f) {
		var me = this;
		valid.createForm(w);
		var validator = new w.baidu.form.Validator('testform', {
			email : {
				rule : {
					required : true
				}
			}
		}, {
			validateOnSubmit : false,
			onvalidate : function(event) {
				ok(false, 'do onvalidate');

			}
		});
		w.document.getElementById('btn').click();
//		ua.click(w.document.getElementById('btn'));
		setTimeout(function() {
			equal(w.location.search,"?name=&pwd=&email=", 'form url : ');
			me.finish();
		}, 1000);
	});
});
//
test("验证构造函数,addRule 成功", function() {
	valid.init();
	TT.dom.setAttr('email', 'value', '1');
	// 无响应
	expect(1);
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				test : true
			}
		}
	});
	validator.addRule('test', function() {
		return false;
	});
	var callback = function(opt) {
		equal(opt, false, 'validate email false');
		validator.dispose();
		valid.down();
	};
	// 校验默认 name blur
	validator.validateField('email', callback);
});
// dispose
test("dispose方法", function() {
	valid.init();
	TT.dom.setAttr('email', 'value', '1');
	expect(1);
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				test : true
			}
		}
	});
	validator.dispose();
	var callback = function(opt) {
		equal(opt, false, 'validate email false');
		valid.down();
	};
	// 校验默认 name blur
	try {
		validator.validateField('email', callback);
	} catch (e) {
		QUnit.ok(true, 'can\'t validate email');
		valid.down();
	}
});
