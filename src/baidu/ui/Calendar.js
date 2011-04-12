/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 */

///import baidu.ui.createUI;
///import baidu.ui.behavior.statable;
///import baidu.dom.insertHTML;
///import baidu.string.format;
///import baidu.ui.Button.Button$poll;
///import baidu.date.format;
///import baidu.lang.guid;
///import baidu.array.each;
///import baidu.array.indexOf;
///import baidu.array.some;
///import baidu.lang.isDate;

/**
 * 创建一个简单的日历对象
 * @param {Object} options config参数
 * @config {String} weekStart 定义周的第一天，取值:'monday'|'tuesday'|'wednesday'|'thursday'|'fraiday'|'saturday'|'sunday'，默认值'sunday'
 * @config {Date} initDate 以某个本地日期打开日历，默认值是当前日期
 * @config {Array} highlightDates 设定需要高亮显示的某几个日期或日期区间，格式:[date, {start:date, end:date}, date, date...]
 * @config {Array} disableDates 设定不可使用的某几个日期或日期区间，格式:[date, {start:date, end:date}, date, date...]
 * @config {function} onclickdate 当点击某个日期的某天时触发该事件
 * @author linlingyu
 */
baidu.ui.Calendar = baidu.ui.createUI(function(options){
    var me = this;
    me.addEventListener('click', function(evt){
        var ele = evt.element,
            date = me._dates[ele],
            beforeElement = baidu.dom.g(me._currElementId);
        //移除之前的样
        beforeElement && baidu.dom.removeClass(beforeElement, me.getClass('date-current'));
        me._currElementId = ele;
        me._currLocalDate = date;
        //添加现在的样式
        baidu.dom.addClass(baidu.dom.g(ele), me.getClass('date-current'));
        me.dispatchEvent('clickdate', {date: date});
    });
}).extend({
    uiType: 'calendar',
    weekStart: 'sunday',//
    statable: true,
    
    tplDOM: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplTable: '<table border="1" class="#{class}"><thead class="#{headClass}">#{head}</thead><tbody class="#{bodyClass}">#{body}</tbody></table>',
    tplDateCell: '<td id="#{id}" class="#{class}" #{handler}>#{content}</td>',
    
    /**
     * 对initDate, highlight, disableDates, weekStart等参数进行初始化为本地时间
     */
    _initialize: function(){
        var me = this;
        function initDate(array){
            var arr = [];
            //格式:[date, {start:date, end:date}, date, date...]
            baidu.array.each(array, function(item){
                arr.push(baidu.lang.isDate(item) ? me._toLocalDate(item)
                    : {start: me._toLocalDate(item.start), end: me._toLocalDate(item.end)});
            });
            return arr;
        }
        me._highlightDates = initDate(me.highlightDates || []);
        me._disableDates = initDate(me.disableDates || []);
        me._currLocalDate = me._toLocalDate(me.initDate || new Date());//
        me.weekStart = me.weekStart.toLowerCase();
    },
    
    /**
     * 
     */
    _getDateJson: function(date){
        var me = this,
            guid = baidu.lang.guid(),
            curr = me._currLocalDate,
            css = [],
            disabled;
        function compare(srcDate, compDate){
            return new Date(srcDate.getFullYear(),
                srcDate.getMonth(),
                srcDate.getDate()).getTime() == compDate.getTime();
        }
        function contains(array, date){
            var time = date.getTime();
            return baidu.array.some(array, function(item){
                if(baidu.lang.isDate(item)){
                    return item.getTime() == time;
                }else{
                    return time >= item.start.getTime()
                        && time <= item.end.getTime();
                }
            });
        }
        //设置非本月的日期的css
        date.getMonth() != curr.getMonth() && css.push(me.getClass('date-other'));
        //设置highlight的css
        contains(me._highlightDates, date) && css.push(me.getClass('date-highlight'));
        //设置初始化日期的css
        if(compare(curr, date)){
            css.push(me.getClass('date-current'));
            me._currElementId = me.getId(guid);
        }
        //设置当天的css
        compare(me._toLocalDate(new Date()), date) && css.push(me.getClass('date-today'));
        //设置disabled disabled优先级最高，出现disable将清除上面所有的css运算
        disabled = contains(me._disableDates, date) && (css = []);
        return {
            id: me.getId(guid),
            'class': css.join('\x20'),//\x20－space
            handler: me._getStateHandlerString('', guid),
            date: date,
            disabled: disabled
        };
    },
    
    /**
     * 取得参数日期对象所对月份的长度
     */
    _getMonthCount: function(year, month){
        var monthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return 1 == month && !(year % 4)
            && (year % 100 != 0 || year % 400 == 0) ? 29 : monthArr[month];
    },
    
    /**
     * 
     */
    _getDateTableString: function(){
        var me = this,
            calendar = baidu.i18n.culture.calendar,
            dayArr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'fraiday', 'saturday'],//day index
            curr = me._currLocalDate,
            year = curr.getFullYear(),
            month = curr.getMonth(),
            day = new Date(year, month, 1).getDay(),//取得当前第一天用来计算第一天是星期几，这里不需要转化为本地时间
            weekIndex = 0,//记录wekStart在day数组中的索引
            headArr = [],
            bodyArr = [],
            weekArray = [],
            disabledIds = me._disabledIds = [],
            i = j = 0,
            len = dayArr.length,
            count,
            date;
        
        //运算星期标题
        for(; i < len; i++){
            dayArr[i] == me.weekStart && (weekIndex = i);
            (weekIndex > 0 ? headArr : weekArray).push('<td>', calendar.dayNames[dayArr[i]], '</td>');
        }
        headArr = headArr.concat(weekArray);
        headArr.unshift('<tr>');
        headArr.push('</tr>');
        //运算日期
        day = (day < weekIndex ? day + 7 : day) - weekIndex;//当月月初的填补天数
        count = Math.ceil((me._getMonthCount(year, month) + day) / len);
        me._dates = {};//用来存入td对象和date的对应关系在click时通过id取出date对象
        for(i = 0; i < count; i++){
            bodyArr.push('<tr>');
            for(j = 0; j < len; j++){
                date = me._getDateJson(new Date(year, month, i * len + j + 1 - day));//这里也不需要转化为本地时间
                //把被列为disable的日期先存到me._disabledIds中是为了在渲染后调用setState来管理
                me._dates[date.id] = date.date;
                date.disabled && disabledIds.push(date['id']);
                bodyArr.push(baidu.string.format(me.tplDateCell, {
                    id: date['id'],
                    'class': date['class'],
                    handler: date['handler'],
                    content: date['date'].getDate()
                }));
            }
            bodyArr.push('</tr>');
        }
        return baidu.string.format(me.tplTable, {
            'class': me.getClass('table'),
            headClass: me.getClass('week'),
            bodyClass: me.getClass('date'),
            head: headArr.join(''),
            body: bodyArr.join('')
        });
    },
    
    /**
     * 
     */
    getString: function(){
        var me = this,
            str;
        str = baidu.string.format(me.tplDOM, {
            id: me.getId('title'),
            'class': me.getClass('title'),
            content: baidu.string.format(me.tplDOM, {
                id: me.getId('label'),
                'class': me.getClass('label')
            })
        });
        str += baidu.string.format(me.tplDOM, {
            id: me.getId('content'),
            'class': me.getClass('content')
        });
        return baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class': me.getClass(),
            content: str
        });
    },
    
    /**
     * 
     */
    _toLocalDate: function(date){//很多地方都需要使用到转化，为避免总是需要写一长串i18n特地做成方法吧
        return date ? baidu.i18n.culture.calendar.toLocalDate(date)
            : date;
    },
    
    /**
     * 
     */
    _renderDate: function(){
        var me = this;
        baidu.dom.g(me.getId('label')).innerHTML = baidu.date.format(me._currLocalDate, 'yyyy-MM-dd');
        baidu.dom.g(me.getId('content')).innerHTML = me._getDateTableString();
        //渲染后对disabled的日期进行setState管理
        baidu.array.each(me._disabledIds, function(item){
            me.setState('disabled', item);
        });
    },
    
    /**
     * 
     */
    _onMouseDown: function(pos){
        var me = this,
            curr = me._currLocalDate,
            month = curr.getMonth() + (pos == 'prev' ? -1 : 1),
            year = curr.getFullYear() + (month < 0 ? -1 : (month > 11 ? 1 : 0));
        month = month < 0 ? 12 : (month > 11 ? 0 : month);
        curr.setYear(year);
        me.gotoMonth(month);
    },
    
    /**
      渲染日期组件到参数指定的容器中
     * @param {HTMLElement} target
     */
    render: function(target){
        var me = this,
            skin = me.skin;
        if(!target || me.getMain()){return;}
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me.getString());
        function getOptions(pos){
            return {
                classPrefix: me.classPrefix + '-' + pos,
                skin: me.skin ? me.skin + '-' + pos : '',
                content: pos == 'prev'? '<' : '>',
                poll: {time: 4},
                element: me.getId('title'),
                autoRender: true,
                onmousedown: function(){
                    me._onMouseDown(pos);
                }
            };
        }
        me._prev = new baidu.ui.Button(getOptions('prev'));
        me._next = new baidu.ui.Button(getOptions('next'));
        me._initialize();
        me._renderDate();
        baidu.dom.g(me.getId('content')).style.height = me.getBody().clientHeight
            - baidu.dom.g(me.getId('title')).offsetHeight + 'px';
        me.dispatchEvent('load');
    },
    
    /**
     * 更新日期的参数
     * @param {Object} options
     */
    update: function(options){
        var me = this;
        baidu.object.extend(me, options || {});
        me._initialize();
        me._renderDate();
        me.dispatchEvent('update');
    },
    
    /**
     * 
     */
    gotoDate: function(date){
        var me = this;
        me.initDate = date;
        me._currLocalDate = me._toLocalDate(date);
        me._renderDate();
    },
    
    /**
     * 跳转到某一年
     * @param {Number} year 年份
     */
    gotoYear: function(year){
        var me = this,
            curr = me._currLocalDate,
            month = curr.getMonth(),
            date = curr.getDate(),
            count;
        if(1 == month){//如果是二月份
            count = me._getMonthCount(year, month);
            date > count && curr.setDate(count);
        }
        curr.setFullYear(year);
        me._renderDate();
    },
    
    /**
     * 跳转到当前年份的某个月份
     * @param {Number} month 月份，取值(0, 11)
     */
    gotoMonth: function(month){
        var me = this,
            curr = me._currLocalDate,
            month = Math.min(Math.max(month, 0), 11),
            date = curr.getDate(),
            count = me._getMonthCount(curr.getFullYear(), month);
        date > count && curr.setDate(count);
        curr.setMonth(month);
        me._renderDate();
    },
    
    /**
     * 
     */
    getToday: function(){
        return me._toLocalDate(new Date());
    },
    
    /**
     * 返回一个当前选中的当地日期对象
     */
    getDate: function(){
        return new Date(this._currLocalDate.getTime());
    },
    
    /**
     * 
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('dispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});