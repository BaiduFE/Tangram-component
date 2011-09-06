/**
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 */

///import baidu.array.each;

///import baidu.object.extend;
///import baidu.object.each;
///import baidu.object.values;
///import baidu.object.keys;

///import baidu.lang.isArray;
///import baidu.lang.isObject;

///import baidu.data;
///import baidu.data.Field;

baidu.data.DataModel = baidu.data.DataModel || (function(){

    var index = 0;

    /**
     * 创建Field实例
     * @private
     * @param {Object} fields config
     */
    function _createField(fields, fieldsItem, fieldsDefaultValue){
        var fields = fields || {};

        baidu.object.each(fields, function(config, fieldName){
            fieldsItem[fieldName] = new baidu.data.Field(config);
            fieldsDefaultValue[fieldName] = config.define.defaultValue;
        });
    };

    /**
     * 返回唯一的递增id
     * @private
     * @return {Number}
     */
    function _getNewId(){
        return index++;
    };

    /**
     * 删除垃圾数据
     * @private
     * @param {Number} id
     * @param {Array} fields 
     */
    function _clearGarbage(id, fields){
        if(typeof id == 'undefined') return;

        baidu.object.each(fields, function(item){
            item.remove(id);
        });
    };
   
    /**
     * DataModel实体类
     * @public
     * @param {Object} options 设置项
     * @config {Object} options.fields 通过ModalManager.defineDM定义的数据结构
     * @config {baid.data.dataSource.DataSource} options.dataSource 数据源
     * @config {Array} options.data 传入的数据，可选
     */
    var dataModel = function(options){

        var me = this,
            options = options || {};

        createField(options.fields || {}, me.fieldsItem, me.fieldsDefaultValue);
        me.dataSource = options.dataSource || me.dataSource;
        me.fieldsArray = options.fieldsArray || me.fieldsArray;
    };

    dataModel.prototype = {
        
        /**
         *  @lends baidu.data.DataModel.prototype
         */
        
        isEmpty: true,
        fields: {},
        dataSource: null,
        fieldsItem:[],
        fieldsDefaultValue: {},
        ids:[],

        /**
         * 添加新数据
         * @public
         * @param {Object|Array} 数据值，可以为名值对JSON,或者与field定义顺序相同的Array数组
         * @return {Boolean} 数据是否添加成功
         */
        add: function(data){
            var data = data || {},
                me = this,
                tmpData = {},
                id = _getNewId(),
                result = true;
            
            if(baidu.lang.isArray(data)){
               baidu.each(data, function(item, index){
                    tmpData[me.fieldsArray[index]] = item;
               });
            }else if(baidu.lang.isObject(data)){
                tmpData = baidu.extend(me.fieldsDefaultValue,data);
            }

            //这种方式很有可能出现数据冗余
            //但是只有设置成功才会将id放置到me.ids中，所以冗余数据对外时不可见的
            baidu.object.each(tmpData, function(item, key){
                result = me.fields[key].set(id, item);
                return result;
            });

            result ? me.ids.push(id) : _clearGarbage(id);

            return result;
        },

        /**
         * 按条件查找并返回数据
         * @public
         * @param {Object} condition 查找数据所依赖的条件,{find,where}
         * @return {Array} 找到的数据
         */
        get: function(condition){
            var me = this,
                ids = [],
                result = [],
                cond,name;

            /**
             * condition:{find:[],where:{}};
             * TODO:如何优化查找,使用怎样的key做缓存
             * TODO;支持排序
             */
            if(!condition['where']){
                baidu.each(me.ids, function(id){
                    baidu.each(condition.find, function(field){
                        tmp[field] = baidu.object.values(me.fields[field].get(id));
                    });
                    result.push(tmp);
                });
                return result;
            }
           
            ids = me._getIds(condition['where']); 
            result = new Array(ids.length);
            baidu.each(condition.find, function(name){
                baidu.each(ids, function(id, index){
                    !result[index] && (result[index] = {});
                    result[index][name] = me.fields[name].get(id);
                });
            });
             
            return result; 
        },

        /**
         * {field: function, field:function}
         * */
        _getIds: function(condition){
            var where = [],
                cond,name,tmp,ids,
                me = this;

            baidu.object.each(condition, function(name,fn){
                 where.push({
                    name:fn
                 });
            });

            cond = where.shift();
            name = cond.name;
            tmp[name] = me.fields[name].get(cond.fn);
            ids = baidu.object.keys(tmp[name]);

            /**
             * TODO：不许要保存value值
             */
            baidu.each(where, function(cond){
                var t = [];
                tmp[cond.name] = {};
                baidu.each(ids, function(id){
                    var d = me.fields[cond.name].get(id);
                    if(cond.fn(d)){
                        t.push(id);
                        tmp[cond.name][id] = d; 
                    }
                }); 
                ids = t;
            });

            return ids;
        };

        /**
         * 根据条件设置filed的值
         * @public
         * @param {object} condition, {value,where}
         * @return {Boolean} 设置是否成功
         */
        set: function(condition){
            var me = this,
                ids = me._getIds(condition['where'] || {}),
                field;

            baidu.object.each(condition['value'] || {}, function(name, value){
                field = me.fields[name];
                baidu.each(ids, function(key){
                    field.set(key, value);
                });
            });
        },

        /**
         * 删除数据
         * @public
         * @param {Object} condition 删除数据所依赖的条件
         * @return {Array} 被删除的数据
         */
        remove: function(condition){
            var me = this,
                ids = me._getIds(condition),
                result = [];

            baidu.each(ids.function(key, index){
                result.push[{}];
                baidu.object.each(me.fields, function(item, name){
                    result[index][name] = item.remove(key);
                }); 
            });
            
            return result;
        }
    };

    return dataModel;
})();
