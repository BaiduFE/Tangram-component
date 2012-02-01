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
///import baidu.dom.g;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.remove;
///import baidu.lang.isNumber;

///import baidu.i18n;
///import baidu.i18n.cultures.zh-CN;
///import baidu.i18n.date;

/**
 * 创建一个简单的日历对象
 * @name baidu.ui.Calendar
 * @class
 * @grammar new baidu.ui.Calendar(options)
 * @param {Object} options config参数
 * @config {String} weekStart 定义周的第一天，取值:'Mon'|'Tue'|'Web'|'Thu'|'Fri'|'Sat'|'Sun'，默认值'Sun'
 * @config {Date} initDate 以某个本地日期打开日历，默认值是当前日期
 * @config {Array} highlightDates 设定需要高亮显示的某几个日期或日期区间，格式:[date, {start:date, end:date}, date, date...]
 * @config {Array} disableDates 设定不可使用的某几个日期或日期区间，格式:[date, {start:date, end:date}, date, date...]
 * @config {Object} flipContent 设置翻转月份按钮的内容，格式{prev: '', next: ''}
 * @config {string} language 日历显示的语言，默认为中文 
 * @config {function} onclickdate 当点击某个日期的某天时触发该事件
 * @author linlingyu
 */
baidu.ui.Calendar = baidu.ui.createUI(function(options){
    var me = this;
    me.flipContent = baidu.object.extend({prev: '&lt;', next: '&gt;'},
        me.flipContent);
    me.addEventListener('mouseup', function(evt){
        var ele = evt.element,
            date = me._dates[ele],
            beforeElement = baidu.dom.g(me._currElementId);
        //移除之前的样子
        beforeElement && baidu.dom.removeClass(beforeElement, me.getClass('date-current'));
        me._currElementId = ele;
        me._initDate = date;
        //添加现在的样式
        baidu.dom.addClass(baidu.dom.g(ele), me.getClass('date-current'));
        me.dispatchEvent('clickdate', {date: date});
    });
}).extend(
/**
 *  @lends baidu.ui.Calendar.prototype
 */
{
    uiType: 'calendar',
    weekStart: 'Sun',//定义周的第一天
    statable: true,
    language: 'zh-CN',
    
    tplDOM: '<div id="#{id}" class="#{class}">#{content}</div>',
    tplTable: '<table border="0" cellpadding="0" cellspacing="1" class="#{class}"><thead class="#{headClass}">#{head}</thead><tbody class="#{bodyClass}">#{body}</tbody></table>',
    tplDateCell: '<td id="#{id}" class="#{class}" #{handler}>#{content}</td>',
    tplTitle: '<div id="#{id}" class="#{class}"><div id="#{labelId}" class="#{labelClass}">#{text}</div><div id="#{prevId}" class="#{prevClass}"></div><div id="#{nextId}" class="#{nextClass}"></div></div>',
    
    /**
     * 对initDate, highlight, disableDates, weekStart等参数进行初始化为本地时间
     * @private
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
        me._initDate = me._toLocalDate(me.initDate || new Date());//这个就是css中的current
        me._currDate = new Date(me._initDate.getTime());//这个是用于随时跳转的决定页面显示什么日历的重要date
        me.weekStart = me.weekStart.toLowerCase();
    },
    
    /**
     * 根据参数取得单个日子的json
     * @param {Date} date 一个日期对象
     * @return 返回格式{id:'', 'class': '', handler:'', date: '', disable:''}
     * @private
     */
    _getDateJson: function(date){
        var me = this,
            guid = baidu.lang.guid(),
            curr = me._currDate,
            css = [],
            disabled;
        function compare(srcDate, compDate){//比较是否同一天
            //不能用毫秒数除以一天毫秒数来比较(2011/1/1 0:0:0 2011/1/1 23:59:59)
            //不能用compDate - srcDate和一天的毫秒数来比较(2011/1/1 12:0:0 2011/1/2/ 0:0:0)
            return srcDate.getDate() == compDate.getDate()
                && Math.abs(srcDate.getTime() - compDate.getTime()) < 24 * 60 * 60 * 1000;
        }
        function contains(array, date){
            var time = date.getTime();
            return baidu.array.some(array, function(item){
                if(baidu.lang.isDate(item)){
                    return compare(item, date);
                }else{
                    return compare(item.start, date)
                        || time > item.start.getTime()
                        && time <= item.end.getTime();
                }
            });
        }
        //设置非本月的日期的css
        date.getMonth() != curr.getMonth() && css.push(me.getClass('date-other'));
        //设置highlight的css
        contains(me._highlightDates, date) && css.push(me.getClass('date-highlight'));
        //设置初始化日期的css
        if(compare(me._initDate, date)){
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
     * 取得参数日期对象所对月份的天数
     * @param {Number} year 年份
     * @param {Number} month 月份
     * @private
     */
    _getMonthCount: function(year, month){
        var invoke = baidu.i18n.date.getDaysInMonth,
            monthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            count;
        invoke && (count = invoke(year, month));
        if(!baidu.lang.isNumber(count)){
            count = 1 == month && (year % 4)
                && (year % 100 != 0 || year % 400 == 0) ? 29 : monthArr[month];
        }
        return count;
    },
    
    /**
     * 生成日期表格的字符串用于渲染日期表
     * @private
     */
    _getDateTableString: function(){
        var me = this,
            calendar = baidu.i18n.cultures[me.language].calendar,
            dayArr = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],//day index
//            curr = me._currLocalDate,//_currentLocalDate
            curr = me._currDate,
            year = curr.getFullYear(),
            month = curr.getMonth(),
            day = new Date(year, month, 1).getDay(),//取得当前第一天用来计算第一天是星期几，这里不需要转化为本地时间
            weekIndex = 0,//记录wekStart在day数组中的索引
            headArr = [],
            bodyArr = [],
            weekArray = [],
            disabledIds = me._disabledIds = [],
            i = 0,
            j = 0,
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
     * 生成日期容器的字符串
     * @private
     */
    getString: function(){
        var me = this;
        return baidu.string.format(me.tplDOM, {
            id: me.getId(),
            'class': me.getClass(),
            content: baidu.string.format(me.tplDOM, {
                id: me.getId('content'),
                'class': me.getClass('content')
            })
        });
    },
    
    /**
     * 将一个非本地化的日期转化为本地化的日期对象
     * @param {Date} date 一个非本地化的日期对象
     * @private
     */
    _toLocalDate: function(date){//很多地方都需要使用到转化，为避免总是需要写一长串i18n特地做成方法吧
        return date ? baidu.i18n.date.toLocaleDate(date, null, this.language)
            : date;
    },
    
    /**
     * 渲染日期表到容器中
     * @private
     */
    _renderDate: function(){
        var me = this;
        baidu.dom.g(me.getId('content')).innerHTML = me._getDateTableString();
        //渲染后对disabled的日期进行setState管理
        baidu.array.each(me._disabledIds, function(item){
            me.setState('disabled', item);
        });
    },
    
    /**
     * 左右翻页跳转月份的基础函数
     * @param {String} pos 方向 prev || next
     * @private
     */
    _basicFlipMonth: function(pos){
        var me = this,
            curr = me._currDate,
            month = curr.getMonth() + (pos == 'prev' ? -1 : 1),
            year = curr.getFullYear() + (month < 0 ? -1 : (month > 11 ? 1 : 0));
        month = month < 0 ? 12 : (month > 11 ? 0 : month);
        curr.setYear(year);
        me.gotoMonth(month);
        me.dispatchEvent(pos + 'month', {date: new Date(curr.getTime())});
    },
    
    /**
     * 渲染日历表的标题说明，如果对标题说明有特列要求，可以覆盖方法来实现
     */
    renderTitle: function(){
        var me = this, prev, next,
            curr = me._currDate,
            calendar = baidu.i18n.cultures[me.language].calendar,
            ele = baidu.dom.g(me.getId('label')),
            txt = baidu.string.format(calendar.titleNames, {
                yyyy: curr.getFullYear(),
                MM: calendar.monthNames[curr.getMonth()],
                dd: curr.getDate()
            });
        if(ele){
            ele.innerHTML = txt;
            return;
        }
        baidu.dom.insertHTML(me.getBody(),
            'afterBegin',
            baidu.string.format(me.tplTitle, {
                id: me.getId('title'),
                'class': me.getClass('title'),
                labelId: me.getId('label'),
                labelClass: me.getClass('label'),
                text: txt,
                prevId: me.getId('prev'),
                prevClass: me.getClass('prev'),
                nextId: me.getId('next'),
                nextClass: me.getClass('next')
            })
        );
        function getOptions(pos){
            return {
                classPrefix: me.classPrefix + '-' + pos + 'btn',
                skin: me.skin ? me.skin + '-' + pos : '',
                content: me.flipContent[pos],
                poll: {time: 4},
                element: me.getId(pos),
                autoRender: true,
                onmousedown: function(){
                    me._basicFlipMonth(pos);
                }
            };
        }
        prev = new baidu.ui.Button(getOptions('prev'));
        next = new baidu.ui.Button(getOptions('next'));
        me.addEventListener('ondispose', function(){
            prev.dispose();
            next.dispose();
        });
    },
    
    /**
     * 渲染日期组件到参数指定的容器中
     * @param {HTMLElement} target 一个用来存放组件的容器对象
     */
    render: function(target){
        var me = this,
            skin = me.skin;
        if(!target || me.getMain()){return;}
        baidu.dom.insertHTML(me.renderMain(target), 'beforeEnd', me.getString());
        me._initialize();
        me.renderTitle();
        me._renderDate();
        baidu.dom.g(me.getId('content')).style.height = 
            (me.getBody().clientHeight || me.getBody().offsetHeight)
            - baidu.dom.g(me.getId('title')).offsetHeight + 'px';
        me.dispatchEvent('onload');
    },
    
    /**
     * 更新日期的参数
     * @param {Object} options 参数，具体请参照构造中的options
     */
    update: function(options){
        var me = this;
        baidu.object.extend(me, options || {});
        me._initialize();
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('onupdate');
    },
    
    /**
     * 跳转到某一天
     * @param {Date} date 一个非本地化的日期对象
     */
    gotoDate: function(date){
        var me = this;
        me._currDate = me._toLocalDate(date);
        me._initDate = me._toLocalDate(date);
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('ongotodate');
    },
    
    /**
     * 跳转到某一年
     * @param {Number} year 年份
     */
    gotoYear: function(year){
        var me = this,
            curr = me._currDate,
            month = curr.getMonth(),
            date = curr.getDate(),
            count;
        if(1 == month){//如果是二月份
            count = me._getMonthCount(year, month);
            date > count && curr.setDate(count);
        }
        curr.setFullYear(year);
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('ongotoyear');
    },
    
    /**
     * 跳转到当前年份的某个月份
     * @param {Number} month 月份，取值(0, 11)
     */
    gotoMonth: function(month){
        var me = this,
            curr = me._currDate,
            month = Math.min(Math.max(month, 0), 11),
            date = curr.getDate(),
            count = me._getMonthCount(curr.getFullYear(), month);
        date > count && curr.setDate(count);
        curr.setMonth(month);
        me.renderTitle();
        me._renderDate();
        me.dispatchEvent('ongotomonth');
    },
    
    /**
     * 取得一个本地化的当天的日期
     * @return {Date} 返回一个本地当天的时间
     */
    getToday: function(){
        return this._toLocalDate(new Date());
    },
    
    /**
     * 返回一个当前选中的当地日期对象
     * @return {Date} 返回一个本地日期对象
     */
    getDate: function(){
        return new Date(this._initDate.getTime());
    },
    
    /**
     * 用一个本地化的日期设置当前的显示日期
     * @param {Date} date 一个当地的日期对象
     */
    setDate: function(date){
        if(baidu.lang.isDate(date)){
            var me = this;
            me._initDate = date;
            me._currDate = date;
        }
    },
    
    /**
     * 翻页到上一个月份，当在年初时会翻到上一年的最后一个月份
     */
    prevMonth: function(){
        this._basicFlipMonth('prev');
    },
    
    /**
     * 翻页到下一个月份，当在年末时会翻到下一年的第一个月份
     */
    nextMonth: function(){
        this._basicFlipMonth('next');
    },
        
    /**
     * 析构函数
     */
    dispose: function(){
        var me = this;
        me.dispatchEvent('dispose');
        baidu.dom.remove(me.getMain());
        baidu.lang.Class.prototype.dispose.call(me);
    }
});
