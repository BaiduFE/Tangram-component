/*
tangram
{baidu addClass.js}
{baidu extend.js}
{baidu namespace.js}
{baidu on.js}
{baidu removeClass.js}
{baidu sio/get.js}
Q.js


*/


var bdPass = bdPass || {};
bdPass.TemplateItems = bdPass.TemplateItems || {};
bdPass.TemplateItems['length'] = bdPass.TemplateItems['length'] || 0;




(function(){

    var statics = {
	itemCache:[],
	preUrl: 'http://passport.baidu.com/',
	preUrlHttps:'https://passport.baidu.com/',
	preUrlPost: 'https://passport.baidu.com/api/?',
	ctrlVersion: "1,0,0,7",
	regNameValid:true,
	regPwdValid: true,
	templateValue:{//按钮值，表单值
	    'login':['登录','登录'],
	    'reg':['同意以下协议并提交','注册'],
	    'lockmail':['发送验证邮件','设置验证邮箱'],
	    'lockphone':['提交','设置验证手机']
	},
	getVerifyCode: function(el){
	    var time = new Date().getTime();
	    var url = this.preUrl + '?verifypic&t=' + time;
	    if(baidu.G(el)){
		baidu.G(el).src = url;
	    }
	},
	regAgreeUrl : 'https://passport.baidu.com/js/agree.js?v=1.2',
	regAgreeInsert : function(){
	    var area = baidu.G('PassRegAgree');
	    var reg_text = reg_agree_txt || '';
	    if( area && reg_text ){
		area.value = reg_text;
	    }
	},
	logM: function(flag){
	    var tempId = 'PassVerifycode' + bdPass.s.itemCache.shift();
	    if(!baidu.G(tempId)) return;
	    baidu.G(tempId).style.display = +flag?'block':'none';
	},
	regM: function(flag){
	    var tempId = 'PassUsername' + bdPass.s.itemCache.shift();
	    if(!baidu.G(tempId)) return;
	    var noteArea = baidu.Q('pass-valid-note',baidu.G(tempId),'span')[0];
	    var text = '此用户名已被注册，请另换一个。';
	    if(+flag==1){
		bdPass.s.regNameValid = false;
		noteArea.innerHTML = text;
		noteArea.style.display = '';
		baidu.removeClass( noteArea,'pass-note-passed');
		baidu.addClass( noteArea , 'pass-note-failed' );
	    }else if(+flag==2){
		text = "用户名仅可使用汉字、数字、字母和下划线。";
		bdPass.s.regNameValid = false;
		noteArea.innerHTML = text;
		noteArea.style.display = '';
		baidu.removeClass( noteArea,'pass-note-passed');
		baidu.addClass( noteArea , 'pass-note-failed' );
	    }else if(+flag==3){
		text = "此用户名不可使用";
		bdPass.s.regNameValid = false;
		noteArea.innerHTML = text;
		noteArea.style.display = '';
		baidu.removeClass( noteArea,'pass-note-passed');
		baidu.addClass( noteArea , 'pass-note-failed' );
	    }else{
		bdPass.s.regNameValid = true;
		noteArea.innerHTML = '';
		noteArea.style.display = 'none';
		baidu.removeClass( noteArea , 'pass-note-failed'  );
		baidu.addClass( noteArea , 'pass-note-passed' );
	    }			

	},
	regCP: function(flag){
	    var tempId = 'PassLoginpass' + bdPass.s.itemCache.shift();
	    if(!baidu.G(tempId)) return;
	    var noteArea = baidu.Q('pass-valid-note',baidu.G(tempId),'span')[0];
	    var text = '您输入密码结构比较简单，建议您更换更加复杂的密码。';
	    var text2 = '您的密码结构太过简单，不能使用。';
	    if(+flag==1){
		bdPass.s.regPwdValid = true;
		noteArea.innerHTML = text;
		noteArea.style.display = '';
		baidu.removeClass( noteArea,'pass-note-passed');
		baidu.addClass( noteArea , 'pass-note-failed' );
	    }else if(+flag==2){
		bdPass.s.regPwdValid = false;
		noteArea.innerHTML = text2;
		noteArea.style.display = '';
		baidu.removeClass( noteArea,'pass-note-passed');
		baidu.addClass( noteArea , 'pass-note-failed' );
	    } else {
		bdPass.s.regPwdValid = true;
		noteArea.innerHTML = '';
		noteArea.style.display = 'none';
		baidu.removeClass( noteArea , 'pass-note-failed'  );
		baidu.addClass( noteArea , 'pass-note-passed' );
	    }			
	    
	},
	resetSth: function(obj , flag){
	    var el = baidu.G('PassInputPassword'+obj.id);
	    if(el){
		el.value = '';
	    }
	    el = baidu.G('PassInputVerifycode'+obj.id);
	    if(el){
		el.value = '';
		bdPass.s.getVerifyCode('PassVerifypic'+obj.id);
	    }
	    if( obj.type=='login' ){
		el = baidu.G('PassVerifycode'+obj.id);
		var json = obj.targetJson.param_in;
		var i=1;
		while( json['param' + i + '_name' ] ){
		    if( json['param'+ i +'_name'] == 'verifycode' ){
			el.style.display = +json['param'+i+'_value'] ? '':'none';
			obj.showVCode = +json['param'+i+'_value'];
			break;
		    }
		    i++;
		}
	    }
	    if( flag ){
		obj.__initFocus();
	    }
	}
    };

    bdPass.s = statics;


})();


(function(){

    var validMessage = {
	login: {
	    0 : '登录成功',
	    1 : '用户名格式错误，请重新输入。',
	    2 : '用户不存在',
	    3 : '',
	    4 : '登录密码错误，请重新登录。',
	    5 : '今日登录次数过多',
	    6 : '验证码不匹配，请重新输入验证码。',
	    7 : '登录时发生未知错误，请重新输入。',
	    8 : '登录时发生未知错误，请重新输入。',
	    16 : '对不起，您现在无法登录。',
	    20 : '此帐号已登录人数过多',
	    256: '',
	    257: '请输入验证码',
	    'default': '登录时发生未知错误，请重新输入。'
	},
	reg: {
	    '-1':['error','注册时发生未知错误'],
	    10:['username','请填写用户名'],
	    11:['username','用户名最长不得超过7个汉字，或14个字节(数字，字母和下划线)。'],
	    12:['username' , '用户名仅可使用汉字、数字、字母和下划线。'],
	    13:['error','注册数据格式错误'],
	    14:['username','此用户名已被注册，请另换一个。'],
	    15:['username','此用户名不可使用'],
	    16:['error','注册时发生未知错误'],
	    20:['loginpass','请填写密码'],
	    21:['loginpass','密码最少6个字符，最长不得超过14个字符。'],
	    22:['verifypass','密码与确认密码不一致'],
	    23:['loginpass','密码仅可由数字，字母和下划线组成。'],
	    24:['loginpass','您的密码结构太过简单，请更换更复杂的密码，否则无法注册成功。'],
	    30:['email','请输入邮件地址'],
	    31:['email','邮件格式不正确'],
	    40:['verifycode','请输入验证码'],
	    41:['verifycode','验证码格式错误'],
	    42:['verifycode','验证码错误']
	},
	lockmail:{
	    1:['error','未知错误，请重试。'],
	    2:['error','请先登录'],
	    3:['password','您的密码过于简单，请先<a href="http://passport.baidu.com/passchange" target="_blank">升级密码</a>。'],
	    4:['error','您已设置安全邮箱'],
	    5:['error','今日验证次数过多，请明天再试。'],
	    6:['error','您输入密码错误次数太多'],
	    11:['password','密码错误，请检查是否输入错误，或错按了大小写按键。'],
	    12:['securemail' , '请输入验证邮箱地址'],
	    13:['securemail' , '验证邮箱格式不正确'],
	    14:['securemail','验证邮箱地址过长'],
	    15:['error','校验邮箱格式不正确'],
	    16:['error','此邮箱验证次数过多'],
	    17:['error','此邮箱已被验证过，每个邮箱仅可为一个用户名提供验证，请重新填写。'],
	    20:['error','系统错误']
	},
	lockphone:{
	    1:['error','未知错误，请重试。'],
	    2:['error','请先登录'],
	    3:['password','您的密码过于简单，请先<a href="http://passport.baidu.com/passchange" target="_blank">升级密码</a>。'],
	    4:['error','您已设置安全手机'],
	    5:['error','今日验证次数过多，请明天再试。'],
	    6:['error','您输入密码错误次数太多'],
	    11:['password','密码错误，请检查是否输入错误，或错按了大小写按键。'],
	    12:['securemobile' , '请输入验证手机号码'],
	    13:['securemobile' , '手机格式错误，请检查并重新输入。'],
	    16:['securemobile','手机号码已被验证超过最大次数'],
	    20:['error','系统错误']
	}
 
   };

    bdPass.vm = validMessage;

})();


(function(){

     var errorHash = {
	 login:{
	     '-1': 'no-token'
	 },
	 reg:{
	     '-1': 'no-token'
	 },
	 lockmail:{
	     '1': 'no-token',
	     '2': 'need-login',
	     '20': 'system-error'
	 },
	 lockphone: {
	     '1': 'no-token',
	     '2': 'need-login',
	     '20': 'system-error'
	 }
     };

     bdPass.eh = errorHash;

})();



(function(){

    var templateName = 'BPT',
    formUrlPre = bdPass.s.preUrl + '?api';

    var validMethods = {
	isEmpty: function(v){
	    return ( (v===null) || (v.length===0) );
	},
	minLength: function(v,opt){
	    return v&& v.length >= opt;
	},
	maxLength: function(v,opt){
	    return v && v.length <= opt;
	},
	regexp: function(v,opt){
	    return opt.test(v);
	}
    };

    var generateHTML = function(name , config){
	var html = [];
	config = config || {};
	for(var i in config){
	    if(config.hasOwnProperty(i)){
		var a = [];
		if( i == 'checked'){
		    if(!!config[i]){
			html[html.length] = 'checked="true"';
		    }
		    continue;
		}
		if( i=='innertext' || i == 'endTag' ){
		    continue;
		}
		a.push(i);
		a.push('"'+config[i]+'"');
		html[html.length] = a.join('=');
	    }
	}
	html = '<'+ name + ' ' + html.join(' ') +'>';
	if( name=='input'||name=='img' ){
	    html = html.slice(0,-1)+'/>';
	    return html;
	}
	if(config.innertext){
	    html += config.innertext;
	}
	if(config.endTag){
	    html += '</'+ name + '>';
	}
	return html;
    };
    var generateCloseTag = function(name){
	return '</'+ name +'>';
    };



    /**
    * Class Template
    * 负责构造模板
    * @param type String reg||login
    * @param uid  Number 唯一的id 递增
    * @param json Object json对象
    * @param target String||HTMLElement 插入的容器id
    * @param customConfig Object 自定义控制量
    */
    var Template = function( type , uid , json , target , customConfig ){
	this.type = type;
	this.id = uid;
	this.name = templateName + uid;
	this.valid = true;
	this.formVisEl = [];
	this.formHidEl = [];
	this.formVisInput = [];
	this.targetJson = json;
	this.oldUname = '';
	this.orivalueCache = {};
	this.showVCode = 0;
	this.renderSuccess = true;

	var url = json.sourceUrl;
	if( url.indexOf('/') == 0 ){
	    url = url.slice(1);
	}
	url = url.replace(/\&amp;/g , '&');
	
	this.sourceUrl =  bdPass.s.preUrl + url;

	var config = {
	    immediate:true,
	    renderSafeflg:false,
	    passedClass:'pass-form-passed',
	    failedClass:'pass-form-failed',
	    passedNoteClass:'pass-note-passed',
	    failedNoteClass:'pass-note-failed',
	    labelName:{},
	    noticeValue:{},
	    buttonValue:null,
	    errorSpecial:{},
	    addHTML:[],
	    onSubmit:function(){},
	    onSuccess:function(){},
	    onFailure:function(){},
	    onAfterRender:function(){},
	    onNotLogin: function(){},
	    onSystemError:function(){}

	};
	baidu.extend(config,customConfig);
	this.config = config;

	if( bdPass.eh[this.type][json.error_no] ){
	    var error_no = bdPass.eh[this.type][json.error_no];

	    switch( error_no ){
		case 'need-login': this.config.onNotLogin(); this.renderSuccess = false; return;
		case 'no-token': this.config.onSystemError(); this.renderSuccess = false; return;
		case 'system-error': this.config.onSystemError(); this.renderSuccess = false; break;
	    }

	}







	this.__init(json);

	var html = this.__packForm();
	this.target = baidu.G(target);
	if(this.target){
	    this.target.innerHTML = html;
	}
	



	this.__bindEventListener();


    };

    
    Template.formElMap = {
	username: [1,'text','用户名：','不超过7个汉字，或14个字节(数字，字母和下划线)。'],//用户名
	password: [1,'password','密码：'],//密码
	loginpass: [1 , 'password' , '设置密码：' , '密码长度6～14位，字母区分大小写。'],//设置密码
	verifypass: [ 1 , 'password' , '确认密码：' ],
	mem_pass: [2,'checkbox','记住我的登录状态'],//记住登录状态
	sex: [3 , 'radio' , '性别：' , '' , [ ['男',true],['女'] ]],
	email: [1 , 'text' , '电子邮件：', '请输入有效的邮件地址，当密码遗失时凭此领取。' ],
	verifycode:[4 , 'text' , '验证码：'],
	safeflg:[5,'text','密码：'],
	securemail: [1 , 'text' , '邮箱地址：'],
	securemobile: [ 1 , 'text' , '需要验证的手机：' ]
    };

    Template.loginFormValidMap = {
	'pv:username':[
	    ['', function(v,obj){
		if( obj.showVCode ){
		    return true;
		}

		var url = bdPass.s.preUrl + '?logcheck&username=' + encodeURIComponent(v) + '&t=' + (new Date().getTime()) + '&callback=bdPass.s.logM&pspcs=utf8';
		bdPass.s.itemCache.push(obj.id);
		baidu.sio.get(url , bdPass.s.logM);
		return true;
	    },true]
	]
    };

    //[提示文字，验证函数 ， 提交时不检查]
    Template.regFormValidMap = {
	'pv:username': [
	    ['请填写用户名' , function(v){
		return  !validMethods.isEmpty(v);
	    }
	    ],	
	    ['用户名最长不得超过7个汉字，或14个字节(数字，字母和下划线)。' , function(v){
		 var len = 0;
		 for(var i = 0; i < v.length; i++){
		     if(v.charCodeAt(i) > 127){
			 len++;
		     }
		     len++;
		 }
		 return len <= 14;

	     } ],
	    ['用户名仅可使用汉字、数字、字母和下划线。', function(v){
		for( var i=0,l=v.length;i<l;i++ ){
		    if( v.charCodeAt(i) < 127 && !v.substr(i,1).match(/^\w+$/ig) ){
			return false;
		    }
		}
		return true;
	    }
	    ],
	    ['此用户名已被注册，请另换一个。', function(v,obj){
		var url = bdPass.s.preUrl + '?ucheck&username=' + encodeURIComponent(v) + '&callback=bdPass.s.regM' + '&t=' + (new Date().getTime())+'&pspcs=utf8';
		bdPass.s.itemCache.push( obj.id );
		baidu.sio.get(url , bdPass.s.regM);
		return bdPass.s.regNameValid;
	    }]
	],
	'pv:loginpass':[
	    ['', function(v , obj){
		if( baidu.G('PassInputVerifypass'+obj.id).value.length ){
		    obj.__getValid(obj,baidu.G('PassInputVerifypass'+ obj.id ));
		}
		return true;
	    }],
	    ['请填写密码', function(v){
		return !validMethods.isEmpty(v);
	    }],
	    ['密码最少6个字符，最长不得超过14个字符。' , function(v){
		return validMethods.minLength(v,6)&&validMethods.maxLength(v,14);
	    }],
	    ['' , function( v , obj ){
		var url = bdPass.s.preUrlHttps + '?weakpasscheck&fromreg=1&username=' + encodeURIComponent(baidu.G('PassInputUsername'+obj.id).value) + '&newpwd=' + baidu.G('PassInputLoginpass'+obj.id).value + '&callback=bdPass.s.regCP' + '&t=' + (new Date()).getTime() + '&pspcs=utf8' ;
		bdPass.s.itemCache.push(obj.id);
		baidu.sio.get(url , bdPass.s.regCP);
		return bdPass.s.regPwdValid;
	    }]
	],
	'pv:verifypass':[
	    ['请填写确认密码' , function(v){
		return  !validMethods.isEmpty(v);
	    }],	
	    ['密码与确认密码不一致。', function(v){
		return v == document.getElementsByName('loginpass')[0].value;
	    }]
	],
	'pv:email':[
	    ['请填写邮箱' , function(v){
		return  !validMethods.isEmpty(v);
	    }],	
	    [ '邮件格式不正确' , function(v){
		return validMethods.regexp(v , /^[\w\.\-]+@([\w\-]+\.)+[a-z]{2,4}$/i);
	    } ]
	],
	'pv:verifycode':[
	    ['请填写验证码' , function(v){
		return !validMethods.isEmpty(v);
	    }]
	]
    };

    Template.lockphoneFormValidMap = {
	'pv:password':[
	    ['请填写登录密码' , function(v){
		return !validMethods.isEmpty(v);
	    } ]
	],
	'pv:securemobile':[
	    ['请填写验证手机' , function(v){
		return !validMethods.isEmpty(v);
	    } ],
	    ['手机格式错误，请检查并重新输入。' , function(v){
		return validMethods.regexp(v ,  /(^13\d{9}$)|(^15[0-9]\d{8}$)|(^18[689]\d{8}$)|(^0[1-9]\d{8,11}$)/ );
	    }]
	]
    };

    Template.lockmailFormValidMap = {
	'pv:password':[
	    ['请填写登录密码' , function(v){
		return !validMethods.isEmpty(v);
	    } ]
	],
	'pv:securemail':[
	    ['请填写验证邮箱' , function(v){
		return !validMethods.isEmpty(v);
	    } ],
	    ['邮箱格式错误，请检查并重新输入。' , function(v){
		return validMethods.regexp(v , /^[\w\.\-]+@([\w\-]+\.)+[a-z]{2,4}$/i);
	    }]
	]
    };

    Template.prototype = {
	
	/**
         *初始化需要插入的元素集合   
        */
	__init: function(json){
	    var formEl = json.param_in;
	    var i=1;
	    while( formEl['param'+i+'_name'] ){
		var key = 'param'+ i + '_name',
		value = 'param' + i + '_value',
		el = formEl[key] ;
		if(el){
		    this.formVisEl.push([el,formEl[value]]);
		}
		i++;
	    }	    

	    formEl = json.param_out;
	    var i=1;
	    while( formEl[ 'param'+i+'_name' ] ){
		this.formHidEl.push([formEl['param'+i+'_name'] , formEl['param'+i+'_contex'] ]);
		i++;
	    }

	    if( this.config.addHTML.length ){
		if( !(this.config.addHTML[0] instanceof Array) ){
		    this.config.addHTML = [this.config.addHTML];
		}
		for( var i=0,l=this.config.addHTML.length;i<l;i++ ){
		    var item = this.config.addHTML[i];
		    switch(item[0]){
		    case 'first':
			this.formVisEl.unshift(item[1]);
			break;
		    case 'last':
			this.formVisEl.push(item[1]);
			break;
		    default:
			this.formVisEl.splice(item[0],0,item[1]);
		    }
		    
		    
		}
	    }

	},
	
	/**
         * 组装插入元素   
        */
	__packForm: function(){
	    var id = this.id;

	    var html = [];
	    html.push( generateHTML( 'div' , {
					 'id':'PassWrapper' + id,
					 'class': 'pass-wrapper'
				     } ) );


	    html.push(generateHTML('form',{
		'id': "PassForm" + this.type,
		'target': "PassIframe" + id,
		'action': bdPass.s.preUrlPost + this.type,
		'method': "post",
		'class':"pass-form",
		'accept-charset':'gb2312'
	    }));

	    html.push(generateHTML('fieldset'));

	    var title = bdPass.s.templateValue[this.type][1];
	    html.push(generateHTML('legend',{
		'innertext':'\u767e\u5ea6\u7528\u6237' + title,
		endTag:true
	    }));
	    html.push(generateHTML('div',{
		'id':"PassFormWapper"+id,
		'class':"pass-form-wapper-"+this.type
	    }));

	    html.push( '<p class="pass-server-error" style="display:none;" id="PassError'+ id +'" >'+ (this.config.errorValue||'') +'</p>' );
	    
	    for( var i=0,l=this.formVisEl.length;i<l;i++ ){
		var item = this.formVisEl[i];
		if(typeof item == 'string'){
		    html.push(item);
		    continue;
		}

		var type = item[0],
		value = item[1] || '',
		formElMap = Template.formElMap,
		formEl = formElMap[type],
		formName = [];

		if( formEl && formEl[0] ){
		    var upperName = type.charAt(0).toUpperCase() + type.slice(1);

		    var pDisplay = '';
		    if(this.type == 'login' && formEl[0]==4 ){
			pDisplay = (+value)?'':'none';
			this.showVCode = +value;
		    }else if(this.type == 'login' && formEl[0]==5){
			pDisplay = 'none';
		    }
		    html.push(generateHTML('p',{
			'id':'Pass'+upperName + id,
			'class':'pass-'+type,
			'style': 'display:'+ pDisplay
		    }));

		    switch(formEl[0]){
		    case 1:
			formName.push("PassInput" + upperName + this.id);

			var maxLen = '';
			if( this.type == 'reg' && type == 'username' ){
			    maxLen = 14;
			}

			html.push(generateHTML('label',{
			    'for': formName[0],
			    'innertext': this.config.labelName[type]||formEl[2],
			    'endTag':true
			}));
			html.push(generateHTML('input',{
			    'id': formName[0],
			    'name': type,
			    'type': formEl[1],
			    'class': 'pv:'+type,
			    'value': decodeURIComponent(value),
			    'maxlength': maxLen
			}));
			break;
		    case 2:
			formName.push("PassInput" + upperName + this.id);
			html.push(generateHTML('input',{
			    'id':formName[0],
			    'name':type,
			    'type':formEl[1],
			    'class':'pv:'+type
			}));
			html.push(generateHTML('label',{
			    'for':formName[0],
			    'innertext':this.config.labelName[type]||formEl[2],
			    'endTag':true
			}));
			break;
		    case 3:
			html.push(generateHTML('label',{
			    'for': 'PassInput'+upperName+this.id,
			    'innertext':this.config.labelName[type]||formEl[2],
			    'endTag':true
			}));

			html.push('<span class="pass-input-group">');
			for( var j=0,k=formEl[4].length ; j<k ; j++ ){
			    formName[j] = ("PassInput" + upperName + this.id + j);

			    html.push(generateHTML('input',{
				'id':formName[j],
				'name':type,
				'type':formEl[1],
				'class':'pv:'+type,
				'value': j+1,
				'checked':formEl[4][j][1]
			    }));


			    html.push(generateHTML('label',{
				'for':formName[j],
				'innertext':formEl[4][j][0],
				'endTag':true
			    }));

			}
			html.push('</span>');
			break;
		    case 4:
			formName.push("PassInput" + upperName + this.id);
			html.push(generateHTML('label',{
			    'for': formName[0],
			    'innertext': this.config.labelName[type]||formEl[2],
			    'endTag':true
			}));
			html.push(generateHTML('input',{
			    'id': formName[0],
			    'name': type,
			    'type': formEl[1],
			    'class': 'pv:'+type,
			    'value': '',
			    'maxlength': 4,
			    'autocomplete': 'off'
			}));
			html.push(generateHTML('img' , {
			    'id': 'PassVerifypic' + this.id,
			    'style': 'border:1px #ccc solid;',
			    'src': bdPass.s.preUrl+'?verifypic' + '&t=' + (new Date().getTime())
			}));
			html.push(generateHTML('a',{
			    'id': 'PassVerifypicChange' + this.id,
			    'href':'#',
			    'innertext':'看不清?',
			    'endTag':true
			}));
			break;
		    case 5:
			formName.push("PassInput" + upperName + this.id);
			html.push( generateHTML( 'label' , {
			    'for': formName[0],
			    'innertext': this.config.labelName[type]||formEl[2],
			    'endTag':true
			} ) );
			var safeHTML = [];
			safeHTML.push('<span id="PassSafeIpt'+ this.id +'" >');
			safeHTML.push('</span>');
			safeHTML.push('<input id="PassSafeHidIpt'+ this.id +'" type="hidden" name="' + type + '" value="'+ value +'" />');
			html.push(safeHTML.join(''));
			break;
		    default:
			break;
		    }
		    

		    var vnoteDisplay = 'none';
		    if( this.config.errorSpecial[type] && this.config.errorSpecial[type].length ){
			vnoteDisplay = '';
		    }
		    html.push(generateHTML('span',{
			'class':'pass-valid-note ' + (this.config.errorSpecial[type]?'pass-note-failed':'') ,
			'endTag':true,
			'innertext':this.config.errorSpecial[type] || '',
			'style':'display:'+vnoteDisplay+';'
		    }));
		    var descDisplay = 'none';
		    if(this.type == 'reg' ){
			if( (this.config.noticeValue[type] && this.config.noticeValue[type].length ) || (formEl[3] && formEl[3].length ) ){
			    descDisplay = '';
			}
		    }
		    html.push(generateHTML('span',{
			'class':'pass-desc' ,
			'innertext': (this.type == 'reg')? (this.config.noticeValue[type]||formEl[3]||''):'',
			'endTag':true,
			'style':'display:'+descDisplay+';'
		    }));


		    this.formVisInput = this.formVisInput.concat(formName);
		    html.push('</p>');
		}else{
		    html.push('<input name="'+type+'" id="Pass'+ type.charAt(0).toUpperCase() + type.slice(1) + this.id +'" type="hidden"/>');
		}
	    }

	    html.push( generateHTML('span',{
					'id':'PassHidIptItems'+this.id,
					'style':'display:none'
				    }) );

	    //token之类的隐藏表单
	    for( var i=0,l=this.formHidEl.length; i<l ; i++ ){
		html.push(generateHTML('input',{
		    'type':'hidden',
		    'name': this.formHidEl[i][0],
		    'value': this.formHidEl[i][1]
		}));
	    }

	    html.push('</span>');
	    
	    //跳转jump页地址
	    if(this.config.jumpUrl){
		html.push(generateHTML('input',{
		    'type':'hidden',
		    'name':'staticpage',
		    'value':this.config.jumpUrl
		}));
	    }


	    //回调
	    html.push(generateHTML('input',{
		'type':'hidden',
		'name':'callback',
		'value':templateName+id
	    }));



	    html.push('</div>');
	    //var submitHTML = '<p><input type="submit" value="'+ (this.config.buttonValue || bdPass.s.templateValue[this.type][0] )+'" /></p>';
	    var submitHTML = '<p class="pass-submit"><button type="submit"><span>'+ (this.config.buttonValue || bdPass.s.templateValue[this.type][0] ) +'</span></button>';
	    
	    if(this.type == 'login'){
		submitHTML += '<a target="_blank" href="'+ this.targetJson.more_ext['ext1_url'] +'">忘记密码</a>';
	    }

	    submitHTML += '</p>';
	    html.push(submitHTML);


	    html.push('</fieldset>');
	    html.push('</form>');
	    html.push('<iframe name="PassIframe'+ id +'" style="display:none;"></iframe>');


	    if( this.type == 'reg' ){
		html.push( '<p class="pass-agree-area"><textarea readonly="true" id="PassRegAgree"></textarea></p>' );
		baidu.sio.get(bdPass.s.regAgreeUrl , bdPass.s.regAgreeInsert , {
		    'charset':'gb2312'
		});
	    }





	    html.push( '</div>' );


	    if( this.type == 'login' && this.config.renderSafeflg ){
		html.push( '<ul id="PassSafeTrigger" class="pass-safe-trigger"><li class="selected" id="PassLoginHideSafe"><b>普通登录</b></li><li id="PassLoginShowSafe"><b>安全登录</b><span>[<a target="_blank" href="http://www.baidu.com/search/passport_help.html#08">?</a>]</span></li></ul>' );
	    }

	    return html.join('');
	},
	

	/* init focus */
	__initFocus: function(){
	    var inputEl = baidu.G('PassFormWapper'+this.id).getElementsByTagName('input');
	    for( var i=0,l=inputEl.length ; i<l ; i++ ){
		if( inputEl[i].value === '' ){
		    try{
			inputEl[i].focus();			    
			this.orivalueCache[inputEl[i].name] = inputEl[i].value || '';
			break;
		    } catch (x) {
			continue;

		    }

		}
	    }
	},
	

	/**
         * 绑定表单事件，login表单直接调过
        */
	__bindEventListener: function(){
	    var me = this;
	    //绑定验证码
	    if(baidu.G('PassVerifypicChange'+me.id)){
		baidu.G('PassVerifypicChange' + me.id ).onclick = function(){
		    bdPass.s.getVerifyCode('PassVerifypic' + me.id);
		    return false;
		};
	    }

	    //安全控件
	    var ts=null;
	    function setstatus(){
		if(baidu.G('safeModPsp') && (baidu.G('safeModPsp').Output1)){
 		    clearInterval(ts);
		    baidu.G("safeModPsp_err") && (baidu.G("safeModPsp_err").style.display="none");
		    baidu.G('safeModPsp').style.display="";
		    baidu.G('safeModPsp').onkeydown = function(e) {
			e = window.event||e;
			var ENTER_KEY_CODE = 13;
			var keyCode = e.which ? e.which : e.keyCode;
			if (ENTER_KEY_CODE==keyCode) {
			    //becarefull，这里需要注意啊。
			    var flg = validForm();
			    if(flg){
				baidu.G('PassForm'+me.type).submit();				
			    }

			}
		    };	
		}
	    }

	    if( me.type == 'login' && me.config.renderSafeflg ){
		if( !baidu.G('safeModPsp') || !baidu.G('safeModPsp').Output1 ){
		    ts = setInterval(setstatus , 600);
		}else{
		    setstatus();
		}

		baidu.G('PassLoginShowSafe').onclick = function(){
		    me.__showSafeInput(me);
		};
		baidu.G('PassLoginHideSafe').onclick = function(){
		    me.__hideSafeInput(me);
		};
	    }



	    var wrapper = baidu.G('PassFormWapper'+this.id);


	    function validFunc(e){
		if( !me.config.immediate ){
		    return;
		}
		e = e||window.event;
		var target = e.target||e.srcElement;
		if( me.failure && ( ( me.orivalueCache[target.name] && me.orivalueCache[target.name] == target.value ) || !target.value ) ){
		    return;
		}
		me.__getValid(me,target,'blur');
	    }


	    function saveOriValue(e){
		if( !me.failure ){
		    return;
		}
		e = e||window.event;
		var target = e.target||e.srcElement;
		var name = target.name, value = target.value;
		me.orivalueCache[name] = value || '' ;
	    }

	    try{
		wrapper.addEventListener('blur' , validFunc , true);
		wrapper.addEventListener( 'focus' , saveOriValue , true );
	    }catch(e){
		wrapper.onfocusout = validFunc;
		wrapper.onfocusin = saveOriValue;
	    }
	    
	    
	    var form = baidu.G('PassForm'+this.type);

	    function checkSafeFlg(){
		if( baidu.G('PassPassword' + me.id).style.display == 'none' ){
		    var el = baidu.G('safeModPsp');
		    if( el && el.Output6 ){
			baidu.G('PassInputPassword'+ me.id).value = el.Output6;
		    }
		    baidu.G('PassSafeHidIpt'+me.id).value = '1';
		}else{
		    baidu.G('PassSafeHidIpt'+me.id).value = '0';
		}
	    }

	    //绑定表单提交的事件
	    function validForm(e){
		e = e||window.event;

		me.valid = true;
		for( var i=0 , l=me.formVisInput.length; i<l ; i++ ){
		    var input = baidu.G(me.formVisInput[i]);
		    if(!input){continue;}
		    me.valid = !!me.__getValid(me,input,'submit') && me.valid;
		}
		me.valid = me.valid && bdPass.s.regNameValid && bdPass.s.regPwdValid ;
		if(me.type=='login'){
		    checkSafeFlg();
		}
		if( me.valid ){
		    if( baidu.G( 'PassInputUsername' + me.id ) ){
			me.oldUname = encodeURIComponent( baidu.G('PassInputUsername'+me.id).value );			
		    }
		    if( document.attachEvent ){//ie
			me.charset = document.charset;
			document.charset = 'gb2312';
			
		    }
		    

		    me.config.onSubmit(me);
		}
		return me.valid;
	    }

	    form.onsubmit = validForm;

	    

	},

	//判断指定表单是否符合要求
	__getValid: function( obj ,  target , trigger ){
	    var methods = target.className.split(' ');
	    var noteArea = baidu.Q('pass-valid-note',target.parentNode,'span')[0];
	    var valid = true;
	    var validMap = Template[obj.type+'FormValidMap'];
	    if( !validMap ){
		return valid;
	    }
	    for( var i=0,l=methods.length ; i<l ; i++ ){
		if( !validMap[methods[i]] ){
		    continue;
		}
		var validMethodItems = validMap[methods[i]];
		var value = target.value;
		if(!(validMethodItems[0] instanceof Array)){
		    validMethodItems = [validMethodItems];
		}
		for( var j=0,k=validMethodItems.length;j<k;j++ ){
		    if( trigger == 'submit' && validMethodItems[j][2] ){
			continue;
		    }

		    var validMethod = validMethodItems[j][1],
		    text = validMethodItems[j][0];

		    if(!validMethod(value , obj)){
			noteArea.innerHTML = text;
			noteArea.style.display = '';
			baidu.removeClass( noteArea, obj.config.passedNoteClass );
			baidu.addClass( noteArea , obj.config.failedNoteClass );
			valid = false;
			break;
		    }else{
			noteArea.innerHTML = '';
			noteArea.style.display = 'none';
			baidu.removeClass( noteArea , obj.config.failedNoteClass  );
			baidu.addClass( noteArea , obj.config.passedNoteClass );
		    }			
		    
		}
	    }
	    return valid;
	},


	__onFailure: function(json){
	    var me = this , json = json;
	    me.failure = true;
	    me.orivalueCache = {};


	    var url = me.sourceUrl + '&t=' + (new Date().getTime());
	    


	    if( me.type == 'login' ){
		url += '&pspcs=utf8&username=' + me.oldUname || '';
	    }

	    var needFocus = false;

	    //错误提示
	    if( bdPass.vm[me.type] ){
		if( bdPass.vm[me.type][+json.error] && bdPass.vm[me.type][+json.error] instanceof Array ){
		    baidu.G('PassError' + me.id).innerHTML = '';
		    baidu.G('PassError' + me.id).style.display = 'none';
		    var error = bdPass.vm[me.type][+json.error];
		    var message = error[1], pos = error[0];
		    var el = 'Pass' + pos.charAt(0).toUpperCase() + pos.slice(1) + me.id;
		    var allNoteArea = baidu.Q('pass-valid-note' , baidu.G('PassFormWapper'+me.id),'span');
		    for( var i = 0,l = allNoteArea.length ; i<l ; i++ ){
			allNoteArea[i].innerHTML = '';
			allNoteArea[i].style.display = 'none';
			baidu.removeClass( allNoteArea[i] , me.config.failedNoteClass );
			baidu.addClass( allNoteArea[i] , me.config.passedNoteClass );
			break;
		    }

		    var noteArea = baidu.Q('pass-valid-note',baidu.G(el),'span')[0];
		    if( !noteArea ){
			if( baidu.G(el) ){
			    baidu.G(el).innerHTML = message;
			    baidu.G(el).style.display = '';
			}
		    }else{
			noteArea.innerHTML = message;
			noteArea.style.display = '';
			baidu.removeClass( noteArea , me.config.passedNoteClass  );
			baidu.addClass( noteArea , me.config.failedNoteClass );
			var ipt = baidu.G(el).getElementsByTagName('input')[0];
			try{
			    ipt.focus();
 			    me.orivalueCache[ipt.name] = ipt.value || '';
			} catch (x) {
			    
			}

		    }
		}else{
		    if( bdPass.vm[me.type][+json.error] || bdPass.vm[me.type][+json.error] === '' ){
			baidu.G('PassError'+me.id).innerHTML = bdPass.vm[me.type][+json.error];
			baidu.G('PassError'+me.id).style.display = bdPass.vm[me.type][+json.error].length?'':'none';
		    }else{
			baidu.G('PassError'+me.id).innerHTML = bdPass.vm[me.type]['default']||'';
			baidu.G('PassError'+me.id).style.display = bdPass.vm[me.type]['default'].length?'':'none';
		    }
		    needFocus = true;
		}
		
	    }
	    var renderCallback = function(){
		//var template = me.type.charAt(0).toUpperCase() + me.type.slice(1) + 'Template';
		//bdPass[template]['render'](me.targetJson , me.target , me.config);
		var paramForReset = me.targetJson.param_out;
		var i=1;
		var html = [];
		while( paramForReset['param'+i+'_name'] ){
		    var name = paramForReset['param'+i+'_name'];
		    var value = paramForReset['param'+i+'_contex'];
		    html.push(generateHTML('input',{
					       'type':'hidden',
					       'name': name,
					       'value': value
					   }));

		    i++;
		}
		baidu.G('PassHidIptItems'+me.id).innerHTML = html.join('');

		bdPass.s.resetSth(me , needFocus);



		me.config.onFailure(me, json);

	    };
	    
	    var callback = function(v){
		if( typeof v == 'string' ){
		    v = eval(v);
		}
		me.targetJson = v;


		if( bdPass.eh[me.type][v.error_no] ){
		    var error_no = bdPass.eh[me.type][v.error_no];

		    switch( error_no ){
		    case 'need-login': me.config.onNotLogin() ;return;
		    case 'no-token': me.config.onSystemError();return;
		    case 'system-error': me.config.onSystemError();break;
		    }

		}






		renderCallback();
	    };

	    
	    baidu.sio.get(url , callback , {
			      'charset':'gb2312'
			  });


	},

	__onSuccess: function(json){
	    this.config.onSuccess(this , json );
	},

	complete: function(isFailed , json){
	    if(document.attachEvent && this.charset){
		document.charset = this.charset;		
	    }

	    (+isFailed || isFailed === '' )? this.__onFailure(json) : this.__onSuccess(json);
	},
	
	__showSafeInput: function(obj){
	    if( obj.config.renderSafeflg &&  !baidu.G('safeModPsp') ){
		var safeHTML = [];
		safeHTML.push('<object id="safeModPsp" name="safeModPsp" data="data:application/x-oleobject;base64,VUKKSDYys0SPJ/oa7KqIRBAHAADYEwAA2BMAAA==" classid="clsid:E0E9F6EF-871B-42AE-89C9-CD6AF7A2E5D3" border="0" value="dddddd" width="120" height="24" codebase="https://www.baifubao.com/download/baiedit.cab#version='+bdPass.s.ctrlVersion+'">');
		safeHTML.push('<param name="Mode" value="0">');
		safeHTML.push('<param name="MaxLength" value="14">');
		safeHTML.push('<param name="Input1" value="9">');
		safeHTML.push('<param name="Input2" value="">');
		safeHTML.push('</object>');
		baidu.G('PassSafeIpt'+obj.id).innerHTML = safeHTML.join('');

		if( !baidu.G('safeModPsp').Output1 ){
		    var msg = !!window.ActiveXObject ? '请点击下载安全控件' : '请使用IE浏览器';
		    baidu.G('safeModPsp') && (baidu.G('safeModPsp').style.display = 'none');
		    var spa = document.createElement('span');
		    spa.className="sc-ns";
		    spa.id="safeModPsp_err";
		    spa.innerHTML='<a href="https://www.baifubao.com/download/baiedit.exe" target="_blank">' +msg+ '</a>';
		    baidu.G("PassSafeIpt" + obj.id).appendChild(spa);
		    
		}


	    }


	    if(baidu.G('PassSafeflg'+obj.id)){
		baidu.G('PassSafeflg'+obj.id).style.display = '';
		baidu.G('PassPassword'+obj.id).style.display = 'none';
		baidu.G('PassInputPassword'+ obj.id).value = '';
		baidu.G('PassLoginHideSafe').className = '';
		baidu.G('PassLoginShowSafe').className = 'selected';
	    }
	},

	__hideSafeInput: function(obj){
	    if(baidu.G('PassSafeflg'+obj.id)){
		baidu.G('PassSafeflg'+obj.id).style.display = 'none';
		baidu.G('PassPassword'+obj.id).style.display = '';
		baidu.G('PassInputPassword'+ obj.id).value = '';
		baidu.G('PassLoginShowSafe').className = '';
		baidu.G('PassLoginHideSafe').className = 'selected';
	    }
	},

	getIptValue: function(el){
	    var id = this.id;
	    el = 'PassInput' + el.charAt(0).toUpperCase() + el.slice(1) + id;
	    if( baidu.G(el) ){
		return baidu.G(el).value;
	    }else if( baidu.G(el) ){
		return baidu.G(el).Output6 || baidu.G(el).value;
	    }
	}

    };

    var templateFactory = function( type,json,target,config ){
	if(!config.jumpUrl){
	    alert('缺少jumpUrl');
	    throw new Error('No jumpUrl');
	}
	var uid = bdPass.TemplateItems['length'];
	var id = templateName + uid;
	var temp = bdPass.TemplateItems[id] = new Template( type, uid ,json,target,config );
	bdPass.TemplateItems['length']++;
	if( temp.renderSuccess ){
	    try{
		temp.config.onAfterRender(temp);
		temp.__initFocus();
	    } catch (x) {
	    }
	}
	return bdPass.TemplateItems[id];
    };


    bdPass.LoginTemplate = function(){
	
	return{
	    render: function(json,target,config){
		return templateFactory( 'login' , json , target,config );
	    }
	};
    }();

    bdPass.RegTemplate = function(){
	
	return{
	    render: function(json,target,config){
		return templateFactory( 'reg' , json , target,config );
	    }
	};
    }();

    bdPass.LockmailTemplate = function(){
	
	return{
	    render: function(json,target,config){
		return templateFactory( 'lockmail' , json , target,config );
	    }
	};
    }();

    bdPass.LockphoneTemplate = function(){
	
	return{
	    render: function(json,target,config){
		return templateFactory( 'lockphone' , json , target,config );
	    }
	};
    }();



})();
