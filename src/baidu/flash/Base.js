/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu;
///import baidu.flash;
///import baidu.flash.Base;

baidu.flash.Base = baidu.flash.Base || {
   
    id: '',

    /**
     * 返回当前实例的flash对象
     * @private
     * @return {Object}
     */
    _getFlash: function(){
              
    },
    
    /**
     * 创建Flash Container
     * @private
     * @return {HTMLElement}
     * 
     */
    _createContainer: function(){
          
    },

    /**
     * 创建flash
     * @private
     * @param {String} url flash的url地址
     * @param {String} id 所创建的flash的id值
     * @param {String|HTMLElement} [container] flash的容器，如不存在则创建一个容器放到body的最下面
     * @return {Null}
     */
    _createFlash: function(options, container){
                 
    },

    /**
     * 删除当前实例中的flash
     */
    _deleteFlash: function(){
                  
    },

    /**
     * 创建可以让flash进行毁掉的函数
     * @private
     * @param {String|Function} function 以存在函数的函数名或者回掉函数体
     * @return {String} 函数名
     */
    _createFunction: function(){
                     
    },

    /**
     * 销毁当前实例
     * @public
     * @return {Null}
     */
    dispose: function(){}
};
