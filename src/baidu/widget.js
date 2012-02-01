/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu;

/**
 * widget机制, 用于模块化开发.
 * @namespace baidu.widget
 * @remark
 *     widget是指一个包含它依赖信息的完整功能块. 
 * widget机制是通过一些api封装,解决widget的依赖管理,通信机制以及部署支持.
 * 依赖管理通过声明方式配置, 详见 baidu.widget.create方法.
 * 通信机制是指widget对其他widget的调用,对于所依赖widget,可以直接调用; 与非依赖widget的通信则通过事件机制实现.详见 baidu.widget.create方法.
 * 开发状态下,可以通过默认的路径配置规则对应代码,部署时可以工具配置baidu.widget._pathInfo.详见 baidu.widget.getPath方法.
 * @author rocy 
 * @see baidu.widget.create, baidu.widget.getPath
 */
baidu.widget = baidu.widget || {
    _pathInfo : {},
    /**
     * widget url查找的根路径, 相对根路径或绝对根路径皆可.
     */
    _basePath : '',
    _widgetAll : {},
    _widgetLoading : {},
    _defaultContext : {}
};
