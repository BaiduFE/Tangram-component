///import baidu.ui;
///import baidu.lang.isString;
///import baidu.lang.instance;
///import baidu.dom.getAttr;
//

/**
 * 获取元素所在的控件
 * @function
 * @grammar baidu.ui.get(element)
 * @param {HTMLElement|string} 要查找的元素，如果是字符串，则查找这个guid为此字符串的控件
 * @param {string} optional  type 匹配查找指定类型的控件【暂未支持】
 * @return {object} ui控件
 */
baidu.ui.get = function(element/*, type*/){
    var buid;

    //如果是string，则按照guid来找
    if(baidu.lang.isString(element)){
        return baidu.lang.instance(element);
    }else{
        /*
         *type = type.toLowerCase();
         */
        do{
            //如果元素是document
        	//加上了!element判断,防止游离节点的父节点为null的情况  rocy@2010-08-05
            if(!element || element.nodeType == 9){
                return null;
            }
            if(buid = baidu.dom.getAttr(element, "data-guid")){
                     return baidu.lang.instance(buid);
                /*
                 *if( !type || buid.toLowerCase().indexOf(type) === 0){
                 *    return baidu.lang.instance(buid);
                 *}
                 */
            }
        }while((element = element.parentNode) != document.body)
    }
};
