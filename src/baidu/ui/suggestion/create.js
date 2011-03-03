/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 *
 * path: ui/suggestion/create.js
 * author: berg
 * version: 1.0.0
 * date: 2010-06-01
 */

///import baidu.dom.g;

///import baidu.ui.suggestion;
///import baidu.ui.suggestion.Suggestion;

///import baidu.ui.suggestion.Suggestion$data;
///import baidu.ui.suggestion.Suggestion$input;
///import baidu.ui.suggestion.Suggestion$fixWidth;



/**
 * 创建suggetion对象
 * @function
 * @param   {string|HTMLElement}     target             要加suggestion的目标input.
 * @param   {Object}                 [options]          选项.
 * @config  {Function}               onshow             当显示时触发。
 * @config  {Function}               onhide             当隐藏时触发，input或者整个window失去焦点，或者confirm以后会自动隐藏。
 * @config  {Function}               onconfirm          当确认条目时触发，回车后，或者在条目上按鼠标会触发确认操作。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。。
 * @config  {Function}               onbeforepick       使用方向键选中某一行，鼠标点击前触发。
 * @config  {Function}               onpick             使用方向键选中某一行，鼠标点击时触发。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。
 * @config  {Function}               onhighlight        当高亮时触发，使用方向键移过某一行，使用鼠标滑过某一行时会触发高亮。参数是event对象，其中有data属性，包括item和index值。item为当前确认的条目，index是条目索引。
 * @config  {Function}               view               重新定位时，会调用这个方法来获取新的位置，传入的参数中会包括top、 left、width三个值。
 * @config  {Function}               getData            在需要获取数据的时候会调用此函数来获取数据，传入的参数word是用户在input中输入的数据。
 * @config  {String}                 prependHTML        写在下拉框列表前面的html
 * @config  {String}                 appendHTML         写在下拉框列表后面的html
 *
 * @return {baidu.ui.suggetion.Suggestion} suggestion对象.
 */

baidu.ui.suggestion.create = function(target, options) {
    var s = new baidu.ui.suggestion.Suggestion(options);
    s.render(target);
    return s;
};
