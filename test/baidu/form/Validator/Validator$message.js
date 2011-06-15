module("baidu.form.Validator.Validator$message");
//
(function() {
	function _createForm() {
		var fadiv = TT.dom.create('div');
		fadiv.id = 'test';
		document.body.appendChild(fadiv);
		var form = document.createElement('form');
		form.id = 'testform';
		form.innerHTML = ("<table>"
				+ "<tr><td>用户名</td><td><input type='text' id='name' name='name'/></td><td><span id='c1'></span></td></tr>"
				+ "<tr><td>密码</td><td><input type='password' id='pwd' name='pwd'/></td><td><span id='c2'></span></td></tr>"
				+ "<tr><td>E-Mail</td><td><input type='text' id='email' name='email'/></td><td><span id='c3'></span></td></tr>"
				+
				// "<tr><td><input type='submit' value='百度一下' /></td></tr>" +
				"</table>");
		fadiv.appendChild(form);
	}
	;
	var s = QUnit.testStart;
	QUnit.testStart = function() {
		s.apply(this, arguments);
		QUnit.stop();
		_createForm();
		te.sto = setTimeout(function() {
			QUnit.ok(false, 'test time out');
			QUnit.start();
		}, 500);
	};
	var stop = QUnit.testDone;
	QUnit.testDone = function() {
		TT.dom.remove('test');
		s.apply(this, arguments);
	}
})();
//
test('验证getMessageContainer true', function() {
	// TT.dom.setAttr('email', 'value', 'email@baidu.com');
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				required : true,
				minlength : 3,
				maxlength : 20,
				email : true
			},
			messageContainer : 'c3'
		}
	});
	var callback = function(opt) {
		equal(opt, false, 'validate email');
		var container = validator.getMessageContainer('email');
		ok(container.parentNode.id == 'c3',
				'getMessageConainer parent node : c3')
		clearTimeout(te.sto);
		start();
	};
	validator.validate(callback);
});
// //
// test('验证getMessageContainer null', function() {
// // TT.dom.setAttr('email', 'value', 'email@baidu.com');
// var validator = new baidu.form.Validator('testform', {
// email : {
// rule : {
// required : true,
// minlength : 3,
// maxlength : 20,
// email : true
// }
// }
// });
// var callback = function(opt) {
// equal(opt, false, 'validate email');
// var container = validator.getMessageContainer('email');
// ok(container == null, 'getMessageContainer');
// clearTimeout(te.sto);
// start();
// };
// validator.validate(callback);
// });

test('验证默认Message', function() {
	// TT.dom.setAttr('email', 'value', 'email@baidu.com');
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				required : true,
				minlength : 3,
				maxlength : 20,
				email : true
			}
		}
	});
	var callback = function(opt) {
		equal(opt, false, 'validate email');
		var container = validator.getMessageContainer('email');
		equal(container.innerHTML, 'This field is required.', '校验内容');
		clearTimeout(te.sto);
		start();
	};
	validator.validate(callback);
});
//
test('验证定义 failure Message', function() {
	// TT.dom.setAttr('email', 'value', 'email@baidu.com');
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				required : {
					param : true,
					message : 'failure message.'
				},
				minlength : 3,
				maxlength : 20,
				email : true
			}
		}
	});
	var callback = function(opt) {
		equal(opt, false, 'validate email');
		var container = validator.getMessageContainer('email');
		equal(container.innerHTML, 'failure message.', '校验内容');
		clearTimeout(te.sto);
		start();
	};
	validator.validateField('email', callback);
});
//
test('验证定义 success Message', function() {
	TT.dom.setAttr('email', 'value', 'email@baidu.com');
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				required : {
					param : true,
					message : {
						success : 'success message.',
						failure : 'faiure message.'
					}
				}
			// minlength : 3,
			// maxlength : 20,
			// email : true
			}
		}
	});
	var callback = function(opt) {
		equal(opt, true, 'validate email');
		var container = validator.getMessageContainer('email');
		equal(container.innerHTML, 'success message.', '校验内容');
		clearTimeout(te.sto);
		start();
	};
	validator.validateField('email', callback);
});
// 多个success message 会去返回返回最后一条正确的message 该正确message在2期可能会提供一个success message接口
test('验证定义 success Message返回最后一条', function() {
	TT.dom.setAttr('email', 'value', 'email@baidu.com');
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				required : {
					param : true,
					message : {
						success : 'success message.',
						failure : 'faiure message.'
					}
				},
				test : {
					message : {
						success : 'last success message.',
						failrue : 'last failure message.'
					}

				}
			// email : true
			}
		}
	});
	validator.addRule('test', function() {
		return true;
	});
	var callback = function(opt) {
		equal(opt, true, 'validate email');
		var container = validator.getMessageContainer('email');
		equal(container.innerHTML, 'last success message.', '校验内容');
		clearTimeout(te.sto);
		start();
	};
	validator.validateField('email', callback);
});
// 多条验证
test('验证多条 success Message', function() {
	TT.dom.setAttr('name', 'value', 'name');
	TT.dom.setAttr('email', 'value', 'email@baidu.com');
	var validator = new baidu.form.Validator('testform', {
		email : {
			rule : {
				required : {
					param : true,
					message : {
						success : 'success message.',
						failure : 'faiure message.'
					}
				},
				test : {
					message : {
						success : 'last success message.',
						failrue : 'last failure message.'
					}

				}
			}
		},
		name : {
			rule : {
				required : {
					param : true,
					message : {
						success : 'name required true',
						failure : 'failure'
					}
				}
			}
		}
	});
	validator.addRule('test', function() {
		return true;
	});
	var callback = function(opt) {
		equal(validator.getMessageContainer('name').innerHTML,
				'name required true', '校验name');
		equal(validator.getMessageContainer('email').innerHTML,
				'last success message.', '校验email');
		clearTimeout(te.sto);
		start();
	};
	validator.validate(callback);
});
//
