/**
 * @author linlingyu
 */
///import baidu.ui.ScrollBar;
///import baidu.dom.g;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.dom._styleFixer.float;
///import baidu.dom.remove;

/**
 * 创建一个panel来作为滚动条的容器
 * @name baidu.ui.ScrollPanel
 * @grammar baidu.ui.ScrollPanel(options)
 * @param {Object} options 创建ScrollPanel的自定义参数.
 * @param {String} options.overflow 取得'overflow-y':创建竖向滚动, 'overflow-x':创建横向滚动条, 'auto':创建滚动条(默认)
 * @param {Number} options.container 需要被滚动条管理的容器对象
* @return {baidu.ui.ScrollPanel} ScrollPanel类.
 * @author linlingyu
 */
baidu.ui.ScrollPanel = baidu.ui.createUI(function(options){
    var me = this;
//    me._oriValues = {};//用来保存target的初始值，在dispose时再还原给target
//    me._yScrollbar = null;
//    me._xScrollbar = null;
}).extend({
    uiType: 'scrollpanel',
    tplDOM: '<div id="#{id}" class="#{class}">#{body}</div>',
    overflow: 'auto',
    _yVisible: true,//用来标示竖向滚动条的隐藏显示状态
    _xVisible: true,//用来标示横向滚动条的隐藏显示状态
    _axis: {
        y: {
            unSize: 'width',
            scrollSize: 'scrollHeight',
            clientSize: 'clientHeight',
            unClientSize: 'clientWidth',
            unOffsetSize: 'offsetWidth'
        },
        x: {
            unSize: 'height',
            scrollSize: 'scrollWidth',
            clientSize: 'clientWidth',
            unClientSize: 'clientHeight',
            unOffsetSize: 'offsetHeight'
        }
    },
    
    /**
     * 取得panel所需要body字符串
     */
    getString: function(){
        var me = this,
            str = baidu.string.format(me.tplDOM, {
                id: me.getId('panel'),
                'class': me.getClass('panel')
            });
        str = baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class': me.getClass(),
            body: str
        });
        return baidu.string.format(me.tplDOM, {
            id: me.getId('main'),
            'class': me.getClass('main'),
            body: str
        });
    },
    
    /**
     * 渲染ScrollPanel到页面中
     * @param {htmlElement|String} target ScrollPanel依附于target来渲染
     */
    render: function(target){
        this.target = target;
        if(!target){return;}
        var me = this,
            target = me.getTarget();
        baidu.dom.insertHTML(target, 'afterEnd', me.getString());
        me.renderMain(me.getId('main'));
        me._renderUI();
    },
    
    /**
     * 根据参数渲染ScrollBar到容器中
     */
    _renderUI: function(){
        var me = this,
            main = me.getMain(),
            panel = me.getPanel(),
            target = me.getTarget(),
            skin = me.skin || '';
        main.style.width = target.offsetWidth + 'px';
        main.style.height = target.offsetHeight + 'px';
        panel.appendChild(target);
        function scrollbar(pos){
            var track = me.getId('overflow-' + pos),
                axis = me._axis[pos],
                panel = me.getPanel(),
                bar;
            baidu.dom.insertHTML(panel,
                (pos == 'y' ? 'afterEnd' : 'beforeEnd'),
                baidu.string.format(me.tplDOM, {
                    id: track,
                    'class': me.getClass('overflow-' + pos)
                }));
            track = baidu.dom.g(track);
            if('y'== pos){
                
                baidu.dom.setStyle(panel, 'float', 'left');
                baidu.dom.setStyle(track, 'float', 'left');
            }
            //
            bar = me['_' + pos + 'Scrollbar'] = new baidu.ui.ScrollBar({
                skin: skin + 'scrollbar' + '-' + pos,
                orientation: pos == 'y' ? 'vertical' : 'horizontal',
                container: me.container,
                element: track,
                autoRender: true
            });
            track.style[axis.unSize] = bar.getSize()[axis.unSize] + 'px';
            bar.setVisible(false);
        }
        if(me.overflow == 'overflow-y'
            || me.overflow == 'auto'){
            scrollbar('y');
        }
        if(me.overflow == 'overflow-x'
            || me.overflow == 'auto'){
            scrollbar('x');
        }
        me._smartVisible();
    },
    
    /**
     * 根据内容智能运算容器是需要显示滚动条还是隐藏滚动条
     */
    _smartVisible: function(){
//        var me = this,
//            target = me.getTarget(),
//            container = me.getContainer(),
//            ybar = me._yScrollbar,
//            xbar = me._xScrollbar,
//            yVisible = me._yVisible,
//            xVisible = me._xVisible,
//            yshow = false,//是否显示yscrollbar
//            xshow = false;//是否显示xscrollbar
//        if(!container){return;}
//        //
//        function isShow(pos){
//            var bar = me['_' + pos + 'Scrollbar'],
//                axis = me._axis[pos],
//                show = container[axis.scrollSize] > container[axis.clientSize];
//            if(show){
//                container.style[axis.unSize] = container[axis.unClientSize]
//                    - bar.getSize()[axis.unSize] + 'px';
//            }
//            return show;
//        }
//        //
//        function visible(pos){
//            var axis = me._axis[pos],
//                bar = me['_' + pos + 'Scrollbar'],
//                val = false;
//            if(bar && me['_' + pos + 'Visible']){
//                bar.isVisible() && (container.style[axis.unSize] = parseInt(container.style[axis.unSize])
//                    + bar.getMain()[axis.unOffsetSize] + 'px');
//                bar.setVisible(true);
//                val = isShow(pos);
//            }
//            return val;
//        }
//        yshow = visible('y');
//        xshow = visible('x');
//        //当存在两个滚动条时，需要再次较正值
//        if(me.overflow == 'auto' && yshow != xshow && yVisible && xVisible){
//            if(yshow){
//                xshow = isShow('x');
//            }
//            if(xshow){
//                yshow = isShow('y');
//            }
//        }
//        //调整scrollbar
//        if(ybar && yVisible){
//            yshow && (ybar.getMain().style.height = container.offsetHeight + 'px');
//            ybar.setVisible(yshow);
//            ybar.update();
//        }
//        if(xbar && xVisible){
//            xshow && (xbar.getMain().style.width = container.offsetWidth + 'px');
//            xbar.setVisible(xshow);
//            xbar.update();
//        }
        var me = this,
            container = me.getContainer(),
            yScrollbar = me._yScrollbar,
            xScrollbar = me._xScrollbar;
            
        if(!container){return};
        
        
        
        
        
        
    },
    
    /**
     * 设置滚动条的隐藏或是显示状态
     * @param {Boolean} val 必选，true:显示, false:隐藏
     * @param {String} pos 可选，当有两个滚动条时可以指定只隐藏其中之一，取值'x'或'y'，不传该参数隐藏或显示全部
     */
    setVisible: function(val, pos){
        var me = this,
            bar = pos ? [me['_' + pos + 'Scrollbar']] : me.getScrollBar(),
            key = pos ? [pos] : ['y', 'x'];
            size = bar.length,
            i = 0;
        for(; i < size; i++){
            if(bar[i]){
                bar[i].setVisible(val);
                me['_' + pos + 'Visible'] = val;
            }
        }
    },
    
    /**
     * 取得滚动条的隐藏或显示状态
     * @param {String} pos 取值'x'或是'y'来选择要取得哪个滚动条的隐藏或是显示状态
     * @return {Boolean} 返回布尔值来标示当前的隐藏或是显示状态
     */
    isVisible: function(pos){
        var me = this;
        return me['_' + pos + 'Visible'];
    },
    
    /**
     * 取得滚动条对象
     * @param {String} pos 取值'x'或是'y'来标示需取得哪个滚动条，当不传该参数则返回所有滚动条
     * @return {ScrollBar|Array} 返回滚动条对象或数组
     */
    getScrollBar: function(pos){
        var me = this;
        return pos ? me['_' + pos + 'Scrollbar'] : [me._yScrollbar, me._xScrollbar];
    },
    
    /**
     * 更新所有滚动条的外观
     * @param {Object} options 参数请参考构造函数参数
     */
    update: function(options){
        var me = this;
        baidu.object.extend(me, options);
        me._smartVisible();
    },
    
    /**
     * 取得panel的dom节点
     * @return {htmlElement}
     */
    getPanel: function(){
        return baidu.dom.g(this.getId('panel'));
    },
    
    /**
     * 取得用户传入的目标对象
     * @return {htmlElement}
     */
    getTarget: function(){
        return baidu.dom.g(this.target);
    },
    
    /**
     * 取得用户传入的container对象
     * @return {htmlElement}
     */
    getContainer: function(){
        return baidu.dom.g(this.container);
    },
    
    /**
     * 销毁对象
     */
    dispose: function(){
        var me = this,
            ybar = me._yScrollbar,
            xbar = me._xScrollbar;
        me.dispatchEvent('dispose');
        me.getMain().parentNode.appendChild(me.getTarget());
        if(ybar){ybar.dispose();}
        if(xbar){xbar.dispose();}
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});