/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/modal.js
 * author: berg
 * version: 1.0.0
 * date: 2010/07/23
 */

///import baidu.ui;

/**
 * 定义名字空间
 * showing: 按照顺序排列的正在显示的遮罩层，遮罩层是dom单例的
 * instances: 标明每一个modal实例的状态：hide or show
 */
baidu.ui.modal = baidu.ui.modal || {mainId: null, showing : [], instances: {}};
