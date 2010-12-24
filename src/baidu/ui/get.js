///import baidu.ui;
///import baidu.lang.isString;
///import baidu.lang.instance;
///import baidu.dom.getAttr;
//

/**
 * 获取元素所在的控件
 * @param {HTMLElement|string} 要查找的元素，如果是字符串，则查找这个guid为此字符串的控件.
 * @return {object|null} ui控件.
 */
baidu.ui.get = function(element) {
    var buid;

    //如果是string，则按照guid来找
    if (baidu.lang.isString(element)) {
        return baidu.lang.instance(element);
    }else {
        do {
            // 如果元素是document
            // 加上了!element判断,防止游离节点的父节点为null的情况  rocy@2010-08-05
            if (!element || element.nodeType == 9) {
                return null;
            }
            if (buid = baidu.dom.getAttr(element, 'data-guid')) {
                return baidu.lang.instance(buid);
            }
        }while ((element = element.parentNode) != document.body);
    }
};
