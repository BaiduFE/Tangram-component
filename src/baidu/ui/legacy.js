///import baidu.ui.Dialog;
/**
 * 应用实现 confirm
 * @function
 * @param  {String|DOMElement}  content               内容或者内容对应的元素
 * @param  {Object}             [options]             选项参数
 * @config {DOMElement}         content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config {String}             contentText           dialog中的内容
 * @config {String|Number}      width                 内容区域的宽度，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config {String|Number}      height                内容区域的高度
 * @config {String|Number}      top                   dialog距离页面上方的距离
 * @config {String|Number}      left                  dialog距离页面左方的距离
 * @config {String}             titleText             dialog标题文字
 * @config {String}             classPrefix           dialog样式的前缀
 * @config {Number}             zIndex                dialog的zIndex值
 * @config {Object}             buttons               配置button选项。
 * @config {Function}           onopen                dialog打开时触发
 * @config {Function}           onclose               dialog关闭时触发
 * @config {Function}           onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config {Function}           onupdate              dialog更新内容时触发
 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @config {Boolean}            [autoOpen]            是否一开始就打开，默认为true
 * @config {Boolean}            submitOnEnter         是否监听回车键
 */

baidu.ui.Dialog.confirm = function(content,options){
    var options,
        dialogInstance; 

    options = baidu.extend({autoRender:true,type:'confirm'},options);

    if (baidu.isString(content)) {
        options.contentText = content;
    } else {
        options.content = content;
    }

    dialogInstance = new baidu.ui.Dialog(options);
    return dialogInstance;
}

/**
 * 应用实现 alert
 * @function
 * @param  {String|DOMElement}  content               内容或者内容对应的元素
 * @param  {Object}             [options]             选项参数
 * @config {DOMElement}         content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config {String}             contentText           dialog中的内容
 * @config {String|Number}      width                 内容区域的宽度，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config {String|Number}      height                内容区域的高度
 * @config {String|Number}      top                   dialog距离页面上方的距离
 * @config {String|Number}      left                  dialog距离页面左方的距离
 * @config {String}             titleText             dialog标题文字
 * @config {String}             classPrefix           dialog样式的前缀
 * @config {Number}             zIndex                dialog的zIndex值
 * @config {Object}             buttons               配置button选项。
 * @config {Function}           onopen                dialog打开时触发
 * @config {Function}           onclose               dialog关闭时触发
 * @config {Function}           onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config {Function}           onupdate              dialog更新内容时触发
 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @config {Boolean}            [autoOpen]            是否一开始就打开，默认为true
 * @config {Boolean}            submitOnEnter         是否监听回车键
 */

baidu.ui.Dialog.alert = function(content,options){
    var options,
        dialogInstance; 

    options = baidu.extend({autoRender:true,type:'alert'},options);

    if (baidu.isString(content)) {
        options.contentText = content;
    } else {
        options.content = content;
    }

    dialogInstance = new baidu.ui.Dialog(options);
    return dialogInstance;
}

/**
 * 应用实现 iframe
 * @function
 * @param  {String}             iframeSrc             iframe的url
 * @param  {Object}             options optional      选项参数
 * @config {DOMElement}         content               要放到dialog中的元素，如果传此参数时同时传contentText，则忽略contentText。
 * @config {String}             contentText           dialog中的内容
 * @config {String|Number}      width                 内容区域的宽度，注意，这里的内容区域指getContent()得到元素的区域，不包含title和footer。
 * @config {String|Number}      height                内容区域的高度
 * @config {String|Number}      top                   dialog距离页面上方的距离
 * @config {String|Number}      left                  dialog距离页面左方的距离
 * @config {String}             titleText             dialog标题文字
 * @config {String}             classPrefix           dialog样式的前缀
 * @config {Number}             zIndex                dialog的zIndex值
 * @config {Function}           onopen                dialog打开时触发
 * @config {Function}           onclose               dialog关闭时触发
 * @config {Function}           onbeforeclose         dialog关闭前触发，如果此函数返回false，则组织dialog关闭。
 * @config {Function}           onupdate              dialog更新内容时触发
 * @config {Boolean}            closeOnEscape         keyboardSupport模块提供支持，当esc键按下时关闭dialog。
 * @config {String}             closeText             closeButton模块提供支持，关闭按钮上的title。
 * @config {Boolean}            modal                 modal模块支持，是否显示遮罩
 * @config {String}             modalColor            modal模块支持，遮罩的颜色
 * @config {Number}             modalOpacity          modal模块支持，遮罩的透明度
 * @config {Number}             modalZIndex           modal模块支持，遮罩的zIndex值
 * @config {Boolean}            draggable             draggable模块支持，是否支持拖拽
 * @config {Function}           ondragstart           draggable模块支持，当拖拽开始时触发
 * @config {Function}           ondrag                draggable模块支持，拖拽过程中触发
 * @config {Function}           ondragend             draggable模块支持，拖拽结束时触发
 * @config {Boolean}            [autoOpen]            是否一开始就打开，默认为true
 */

baidu.ui.Dialog.iframe = function(iframeSrc, options) {
    options = baidu.extend({
        iframeSrc:iframeSrc,
        type:"iframe"
    },options || {});
    var dialog = new baidu.ui.Dialog(options);
    return dialog;
};
