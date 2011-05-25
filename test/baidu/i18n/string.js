module("baidu.i18n.string");

test('trim', function(){
	stop();
	ua.importsrc('baidu.i18n.cultures.en-US,baidu.i18n.cultures.zh-CN', function(){
		equals(baidu.i18n.string.trim('zh-CN', ''), '', 'check ""');
		equals(baidu.i18n.string.trim('zh-CN',' '), '', 'check " "');
		equals(baidu.i18n.string.trim('zh-CN','    1fsdgs   '), '1fsdgs', 'check "1fsdgs"');
		equals(baidu.i18n.string.trim('zh-CN','1fsdgs '), '1fsdgs', 'check "1fsdgs"');
		equals(baidu.i18n.string.trim('zh-CN',' 1fsdgs'), '1fsdgs', 'check "1fsdgs"');
		equals(baidu.i18n.string.trim('en-US', ''), '', 'check ""');
		equals(baidu.i18n.string.trim('en-US',' '), '', 'check " "');
		equals(baidu.i18n.string.trim('en-US','   1fsdgs   '), '1fsdgs', 'check "1fsdgs"');
		equals(baidu.i18n.string.trim('en-US','1fsdgs '), '1fsdgs', 'check "1fsdgs"');
		equals(baidu.i18n.string.trim('en-US',' 1fsdgs'), '1fsdgs', 'check "1fsdgs"');
		start();
	}, 'baidu.i18n.cultures.en-US','baidu.i18n.string');
});

test('translation', function(){
	equals(baidu.i18n.string.translation('zh-CN', 'ok'), '确定', 'en-US to zh-CN');
	equals(baidu.i18n.string.translation('zh-CN', 'cancel'), '取消', 'en-US to zh-CN');
	equals(baidu.i18n.string.translation('zh-CN', 'signin'), '注册', 'en-US to zh-CN');
	equals(baidu.i18n.string.translation('zh-CN', 'signup'), '登录', 'en-US to zh-CN');
	equals(baidu.i18n.string.translation('en-US', 'ok'), 'ok', 'en-US to en-US');
	equals(baidu.i18n.string.translation('en-US', 'cancel'), 'cancel', 'en-US to en-US');
	equals(baidu.i18n.string.translation('en-US', 'signin'), 'signin', 'en-US to en-US');
	equals(baidu.i18n.string.translation('en-US', 'signup'), 'signup', 'en-US to en-US');
});

test('custom language', function(){
	equals(baidu.i18n.string.trim('en-CA', ''), '', 'check ""');
	equals(baidu.i18n.string.trim('en-CA',' '), '', 'check " "');
	equals(baidu.i18n.string.trim('en-CA','   1fsdgs   '), '1fsdgs', 'check "1fsdgs"');
	equals(baidu.i18n.string.trim('en-CA','1fsdgs '), '1fsdgs', 'check "1fsdgs"');
	equals(baidu.i18n.string.trim('en-CA',' 1fsdgs'), '1fsdgs', 'check "1fsdgs"');
	equals(baidu.i18n.string.translation('en-CA', 'ok'), 'ok', 'en-CA to en-CA');
	equals(baidu.i18n.string.translation('en-CA', 'cancel'), 'cancel', 'en-CA to en-CA');
	equals(baidu.i18n.string.translation('en-CA', 'signin'), 'signin', 'en-CA to en-CA');
	equals(baidu.i18n.string.translation('en-CA', 'signup'), 'signup', 'en-CA to en-CA');
});