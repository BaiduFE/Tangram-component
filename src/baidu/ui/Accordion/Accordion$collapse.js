/**
 * @author linlingyu
 */

///import baidu.ui.Accordion;
baidu.object.extend(baidu.ui.Accordion.prototype, {
    collapse: function(){
        var me = this;
        if(me.dispatchEvent('beforecollapse')){
            if(me.getCurrentHead()){
                me._switch(null);
                me.setCurrentHead(null);
            }
        }
    }
});