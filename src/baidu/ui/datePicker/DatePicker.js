/*
 * Tangram
 * Copyright 2010 Baidu Inc. All rights reserved.
 * 
 * path: ui/datePicker/DatePicker.js
 * author: meizz
 * version: 1.0.0
 * date: 2010-05-18
 */


///import baidu.lang.guid;
///import baidu.array.each;
///import baidu.array.indexOf;
///import baidu.date.format;
///import baidu.string.format;
///import baidu.lang.Event;
///import baidu.lang.createClass;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.browser.ie;
///import baidu.browser.chrome;

///import baidu.fx.zoomIn;
///import baidu.fx.zoomOut;
///import baidu.ui.createPopup;

///import baidu.ui.datePicker;
/**
 * 日期选择输入控件
 * 
 *
 * @config  {JSON}      lang        语言包
 * @config  {String}    format      最后输出的日期格式字符串
 * @config  {Date}      minDate     可选的最小日期
 * @config  {Date}      maxDate     可选的最大日期
 * @config  {Array}     dateList    指定日期的列表
 * @config  {Number}    duration    动画效果的时长(单位：毫秒)
 * @config  {String}    position    指定日历显示的位置 top
 * @config  {Date}      appointedDate   指定日期
 * @config  {Array}     specificallyList特定的日期列表
 */
baidu.ui.datePicker.DatePicker = baidu.lang.createClass(function(options){
    var lang = {
	        sunday      : "\u65e5"
	        ,monday     : "\u4e00"
	        ,tuesday    : "\u4e8c"
	        ,wednesday  : "\u4e09"
	        ,thursday   : "\u56db"
	        ,friday     : "\u4e94"
	        ,saturday   : "\u516d"
	
	        ,january    : "\u4e00\u6708"
	        ,february   : "\u4e8c\u6708"
	        ,march      : "\u4e09\u6708"
	        ,april      : "\u56db\u6708"
	        ,may        : "\u4e94\u6708"
	        ,june       : "\u516d\u6708"
	        ,july       : "\u4e03\u6708"
	        ,august     : "\u516b\u6708"
	        ,september  : "\u4e5d\u6708"
	        ,october    : "\u5341\u6708"
	        ,november   : "\u5341\u4e00\u6708"
	        ,december   : "\u5341\u4e8c\u6708"
	
	        ,titleToday : "\u4eca\u5929\u662fyyyy\u5e74MM\u6708dd\u65e5"
	        ,titleYear  : "yyyy\u5e74"
	        ,titleYearMonth : "yyyy\u5e74MM\u6708"
	    },
	    config = {
	         prevHTML:"<input type='button' style='height:18px; width:100%; border:none; background-color:transparent' value='&lt;'>"
	        ,nextHTML:"<input type='button' style='height:18px; width:100%; border:none; background-color:transparent' value='&gt;'>"
	    };
    if ((navigator.platform == "Win32" || navigator.platform == "Windows") && (baidu.browser.ie || baidu.browser.chrome)) {
        config.prevHTML = "<input type='button' style='font-family:Webdings; height:18px; width:100%; border:none; background-color:transparent' value='3'>"
        config.nextHTML = "<input type='button' style='font-family:Webdings; height:18px; width:100%; border:none; background-color:transparent' value='4'>"
    }
    var me = this;
    
    // 用户可以指定某些日期，高亮显示之
    me.dateList = [/* Date */];

    baidu.object.extend(me, baidu.ui.datePicker.DatePicker.options);
    baidu.object.extend(me, options);

    // 可以单独指定某个语言项
    me.lang = baidu.object.extend(baidu.object.extend({}, lang), me.lang);
    me.config = baidu.object.extend(baidu.object.extend({}, config), me.config);

    // 下面两句代码有循环引用之嫌，在析构的时候破之
    me.Class = baidu.ui.datePicker.DatePicker;
    me.Class.instance = me;

    // 当前操作的层名 year|month|date
    me.currentWorkLayerName;

    // 在层隐藏的时候析构，释放资源
    me.Class.popup.onhide = function(){
        me.stopPrev();
        me.stopNext();
        me.Class.instance = null;
        me.Class = null;
        me.dispose();
    };

}, {options:{
    format : "yyyy-MM-dd"
    ,minDate : new Date(-8640000000000000)
    ,maxDate : new Date( 8640000000000000)
    ,duration : 365 // ms
    ,pauseTime : 240
    ,appointedDate : false
},  className:"baidu.ui.datePicker.DatePicker"}).extend({

    render : function(){
        var me = this;
        me.dispatchEvent("onready");
        me.min = me.minDate.getTime();
        me.max = me.maxDate.getTime();
        me.g("prev").innerHTML = me.config.prevHTML;
        me.g("next").innerHTML = me.config.nextHTML;
        me.g("header").innerHTML = baidu.date.format(new Date(), me.lang.titleToday);

        // dateList 预处理，以便后期快速比对
        me["\x06dateList"] = [];
        for (var i=0, n=me.dateList.length; i<n; i++) {
            var x = me.dateList[i];
            me["\x06dateList"][i] = new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
        }

        // 填充日层
        var now = new Date();
        var ddd = me.currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        me.appointedDate ? me.currentDate = me.appointedDate : me.appointedDate = ddd;

        var y = me.currentDate.getFullYear(),
            m = me.currentDate.getMonth(),
            ths1 = me.g("date1").rows[0].cells,
            ths2 = me.g("date2").rows[0].cells;
        for (var i=0, n=me.Class.weeks.length; i<n; i++) {
            ths1[i].innerHTML = ths2[i].innerHTML = me.lang[me.Class.weeks[i]];
        }
        me.currentWorkLayerName = "date";
        baidu.dom.show(me.renderDate());
        me.title(baidu.date.format(me.currentDate, me.lang.titleYearMonth));
    }
    // 渲染日期层
    ,renderDate : function(options, retractive) {
        var me      = this
            ,mcd    = me.currentDate
            ,year   = mcd.getFullYear()
            ,month  = mcd.getMonth()
            ,layer  = me.getWorkLayer("date")
            ,md     = me.Class.dateOfMonth[month];
        1==month && 0==year%4 && (0!=year%100 || 0==year%400) && (md = 29);

        var fdm = new Date(year,month, 1)   // first date in month
            ,sn  = 1 - fdm.getDay()
            ,now = new Date()
            ,ny  = now.getFullYear()
            ,nm  = now.getMonth()
            ,nd  = now.getDate()
            ,tds = layer.getElementsByTagName("TD");
        for (var i=0, n=tds.length; i<n; i++) {
            var D   = new Date(year, month, sn + i)
                ,td = tds[i]
                ,ms = D.getTime()
                ,y  = D.getFullYear()
                ,m  = D.getMonth()
                ,d  = D.getDate()
                ,cn = "", s = d;
            ms>me.max || ms<me.min && (s = " ");
            cn = me.Class.weeks[D.getDay()%7];
            m!=month && (cn +=" other");
            if (s != " ") {
                D.getTime() == me.appointedDate.getTime() && (cn += " current");
                baidu.array.indexOf(me["\x06dateList"], D.getTime())>-1 && (cn += " appointed");
                y==ny && m==nm && d==nd && (cn += " today");
            }

            td.setAttribute("data-year", y, 0);
            td.setAttribute("data-month", m, 0);
            td.setAttribute("data-date", d, 0);
            td.innerHTML = s;
            td.className = cn;
        }

        return (me.currentLayer = layer);
    }
    // 渲染月份层(一月至十二月是固定的)
    ,renderMonth : function(retractive) {
        var me     = this
            ,mcd   = me.currentDate
            ,cy    = mcd.getFullYear()
            ,cm    = mcd.getMonth()
            ,layer = me.getWorkLayer("month")
            ,tds   = layer.getElementsByTagName("TD");

        for (var i=0, n=tds.length; i<n; i++) {
            var td = tds[i];
            var s = me.lang[me.Class.monthes[i]];
            new Date(cy, i + 1, 1).getTime() < me.min && (s = " ");
            new Date(cy, i, 1).getTime() > me.max && (s = " ");
            td.innerHTML = s;
            td.setAttribute("data-year", cy, 0);
            td.setAttribute("data-month", i, 0);
            td.className = i==mcd.getMonth() && s!=" " ? "current" : "";
        }

        return (me.currentLayer = layer);
    }
    // 10年一屏，便于用户定位
    ,renderYear : function() {
        var me      = this, cn = ""
            ,cy     = me.currentDate.getFullYear()
            ,sn     = cy - cy % 10 - 1
            ,layer  = me.getWorkLayer("year")
            ,tds    = layer.getElementsByTagName("TD");
        layer.setAttribute("data-ytype", "singleYear", 0);

        for (var i=0, n=tds.length; i<n; i++) {
            var td = tds[i], y = sn + i, s = y;
            td.setAttribute("data-year", y, 0);
            cn = (i==0 || i>10) ? "other" : "";
            cn = y == cy ? cn +" current" : cn; // currentDate
            y < me.minDate.getFullYear() && (s = " ");
            y > me.maxDate.getFullYear() && (s = " ");
            td.className = s==" " ? "" : cn;
            td.innerHTML = s;
        }

        return (me.currentLayer = layer);
    }
    // 多年图层，100年一屏
    ,renderMultiyear : function(options, retractive) {
        var me      = this, cn = ""
            ,cy     = me.currentDate.getFullYear()
            ,sn     = cy - cy % 100 - 10
            ,layer  = me.getWorkLayer("year")
            ,tds    = layer.getElementsByTagName("TD");
        layer.setAttribute("data-ytype", "multiyear", 0);

        for (var i=0, n=tds.length; i<n; i++) {
            var td = tds[i], y = sn + i * 10;
            td.setAttribute("data-ystart", y, 0);
            td.setAttribute("data-yend", y + 9, 0);
            cn = (i==0 || i>10) ? "other" : "";
            cn = cy >= y && cy <= y+9 ? cn +" current" : cn;
            var s = y +"-<wbr>"+ (y + 9);
            y + 9 < me.minDate.getFullYear() && (s = " ");
            y > me.maxDate.getFullYear() && (s = " ");
            td.className = s==" " ? "" : cn;
            td.innerHTML = s;
        }

        return (me.currentLayer = layer);
    }
    
    /**
     * 动画效果展现指定层
     * @param   {String}        command 动画效果名 zoomIn|zoomOut
     * @param   {HTMLElement}   layer   层
     * @param   {String}        text    current显示的文本
     * @param   {String}        position    动画配置参数
     */
    ,zoomLayer : function(command, layer, text, position) {
        if (!layer) return;

        var me = this, i = parseInt(layer.style.zIndex);
        command == "zoomOut" && (layer.style.zIndex = i + 2);

        baidu.fx[command](layer, {
            duration:me.duration
            ,transformOrigin:position || "50% top"
            ,onafterfinish:function(){
                if (command == "zoomOut") {layer.style.zIndex = i;}
                else {me.Class && me.title(text);}
            }
        });
    }

    /**
     * 设置 title
     * @param   {String}    text    文本
     */
    ,title : function(text) {this.g("current").innerHTML =  text;}

    /**
     * popup.document.getElementById
     */
    ,g : function(id) {return this.Class.popup.document.getElementById(id);}

    /**
     * 显示日历层
     */
    ,show : function(){
        this.popup.bind(this.trigger, 178, 164, this.position);
    }

    /**
     * 选中某个日期作为返回值
     */
    ,pick : function(date) {
        if (!this.dispatchEvent(new baidu.lang.Event("onpick", date))) return;

        var str = baidu.date.format(date, this.format);
        if (/input/i.test(this.trigger.tagName)) {
            this.trigger.value = str;
        } else {
            this.trigger.innerHTML = str;
        }
        this.popup.hide();
    }

    /**
     * 得到被操作的层
     * @param   {String}    name    year|month|date 被操作的层代号
     */
    ,getWorkLayer : function(name) {
        var me = this,
            maxz = 60000,
            n  = me.Class.zIndex,
            a = [me.g(name +"1").style.zIndex, me.g(name +"2").style.zIndex];

        // zindex 超限后回归到原始值
        if (n > maxz + 10) {
            baidu.array.each(["year1", "year2", "month1", "month2", "date1", "date2"], function(x){
                var z = parseInt(me.g(x).style.zIndex);
                me.g(x).style.zIndex = z - maxz;
            });
            baidu.ui.datePicker.DatePicker.zIndex -= maxz;
        }

        var layer = me.g(name += (parseInt(a[0]) <= parseInt(a[1]) ? "1" : "2"));
        layer.style.zIndex = ++ baidu.ui.datePicker.DatePicker.zIndex;
        return layer;
    }

    // [Interface method]
    // 实现连续翻动的效果
    ,startPrev : function() {
        var me  = this
            ,n  = new Date().getTime();

        if (!me.startPrev.time
            || n - me.startPrev.time > me.duration + me.pauseTime) me.prev();

        me.startPrev.time = n;

        me.startPrev.timer = setTimeout(function(){me.startPrev()}, me.duration + me.pauseTime);
    }
    ,stopPrev : function(){clearTimeout(this.startPrev.timer);}

    // 过去
    ,prev : function(){
        var me = this
            ,m = me.currentDate.getMonth()
            ,y = me.currentDate.getFullYear()
            ,minm = me.minDate.getMonth()
            ,miny = me.minDate.getFullYear();

        switch (me.currentWorkLayerName) {
        case "date" :
            if (y==miny && m-1<minm) return;
            me.currentDate.setMonth(m - 1);
            var s = baidu.date.format(me.currentDate, me.lang.titleYearMonth);
            me.zoomLayer("zoomIn", me.renderDate(), s, "5% top");;
            break;
        case "month" :
            if (y-1<miny) return;
            me.currentDate.setFullYear(y - 1);
            var s = baidu.date.format(me.currentDate, me.lang.titleYear);
            me.zoomLayer("zoomIn", me.renderMonth(), s, "5% top");;
            break;
        case "year" :
            if (y-y%10<miny) return;
            me.currentDate.setFullYear(y - 10);
            var n = y - 10 - y % 10;
            me.zoomLayer("zoomIn", me.renderYear(), n +"-"+ (n + 9), "5% top");
            break;
        case "multiyear" :
            if (y-y%100<miny) return;
            me.currentDate.setFullYear(y - 100);
            var n = y - 100 - y % 100;
            me.zoomLayer("zoomIn", me.renderMultiyear(), n +"-"+ (n + 99), "5% top");
            break;
        }
    }

    // 现在
    ,now : function(){
        var me = this
            ,y = me.currentDate.getFullYear()
            , oldLayer = me.currentLayer;

        switch (me.currentWorkLayerName) {
        case "date" :   // 隐藏日层，显示月层
            me.currentWorkLayerName = "month";
            baidu.dom.show(me.renderMonth());
            me.title(baidu.date.format(me.currentDate, me.lang.titleYear));
            me.zoomLayer("zoomOut", oldLayer);
            break;
        case "month" :  // 隐藏月层，显示年层
            me.currentWorkLayerName = "year";
            baidu.dom.show(me.renderYear());
            var n = y - y % 10;
            me.title(n +"-"+ (n + 9));
            me.zoomLayer("zoomOut", oldLayer);
            break;
        case "year" :   // 隐藏年层，显示多年层
            me.currentWorkLayerName = "multiyear";
            me.renderMultiyear();
            var n = y - y % 100;
            me.title(n +"-"+ (n + 99));
            me.zoomLayer("zoomOut", oldLayer);
            break;
        }
    }

    // 实现连续翻动的效果
    ,startNext : function() {
        var me  = this
            ,n  = new Date().getTime();

        if (!me.startNext.time
            || n - me.startNext.time > me.duration + me.pauseTime) me.next();

        me.startNext.time = n;

        me.startNext.timer = setTimeout(function(){me.startNext()}, me.duration + me.pauseTime);
    }
    ,stopNext : function(){clearTimeout(this.startNext.timer);}

    // 将来
    ,next : function(){
        var me = this
            ,m = me.currentDate.getMonth()
            ,y = me.currentDate.getFullYear()
            ,maxm = me.maxDate.getMonth()
            ,maxy = me.maxDate.getFullYear();

        switch (me.currentWorkLayerName) {
        case "date" :
            if (y==maxy && m+1>maxm) return;
            me.currentDate.setMonth(m + 1);
            var s = baidu.date.format(me.currentDate, me.lang.titleYearMonth);
            me.zoomLayer("zoomIn", me.renderDate(), s, "95% top");
            break;
        case "month" :
            if (y+1>maxy) return;
            me.currentDate.setFullYear(y + 1);
            var s = baidu.date.format(me.currentDate, me.lang.titleYear);
            me.zoomLayer("zoomIn", me.renderMonth(), s, "95% top");
            break;
        case "year" :
            if (y+10>maxy) return;
            me.currentDate.setFullYear(y + 10);
            var n = y + 10 - y % 10;
            me.zoomLayer("zoomIn", me.renderYear(), n +"-"+ (n + 9), "95% top");
            break;
        case "multiyear" :
            if (y+100>maxy) return;
            me.currentDate.setFullYear(y + 100);
            var n = y + 100 - y % 100;
            me.zoomLayer("zoomIn", me.renderMultiyear(), n +"-"+ (n + 99), "95% top");
            break;
        }
    }

    // 内容区单击
    ,click: function(table, td){
        // 这个值若为空则表示超出用户设计的日期范围
        if (/^\s+$/.test(td.innerHTML)) return;

        var me      = this
            ,year   = td.getAttribute("data-year")
            ,month  = td.getAttribute("data-month")
            ,date   = td.getAttribute("data-date")
            ,ystart = td.getAttribute("data-ystart")
            ,yend   = td.getAttribute("data-yend")
            ,position   = (td.cellIndex+0.5)*25+"% "+ (td.parentNode.rowIndex+0.5)*34+"%";

        // 点击在 date layer 上，选中日期
        if (table.id.indexOf("date") == 0) {
            me.pick(new Date(year, month, date));
        }
        // 点击在 month layer 上，展现该月对应的 date
        else if (table.id.indexOf("month") == 0) {
            me.currentDate= new Date(parseInt(year), parseInt(month), 1);
            me.currentWorkLayerName = "date";
            var s =  baidu.date.format(me.currentDate, me.lang.titleYearMonth);
            me.zoomLayer("zoomIn", me.renderDate(), s, position);
        }
        // 点击在 year layer 上
        else if (table.id.indexOf("year") == 0) {
            var ytype = table.getAttribute("data-ytype");

            // 多年点击，展现此年段的年份列表
            if (ytype && ytype == "multiyear") {
                me.currentDate.setFullYear(parseInt(ystart));
                me.currentWorkLayerName = "year";
                me.zoomLayer("zoomIn", me.renderYear(), ystart +"-"+ yend, position);
            }
            // 单年点击，展现该年对应的 month
            else {
                me.currentDate.setFullYear(parseInt(year));
                me.currentWorkLayerName = "month";
                var s = baidu.date.format(me.currentDate, me.lang.titleYear);
                me.zoomLayer("zoomIn", me.renderMonth(), s, position);
            }
        }
    }

    // 单击今天
    ,today: function(){this.pick(new Date());}
});





/*
 * 日历选择器是单例的，在这里统一生成一个日历容器
 */
(function(){
    var dp = baidu.ui.datePicker.DatePicker;
    window[baidu.guid]._instances[(dp.guid = baidu.lang.guid())] = dp;

    dp.popup = baidu.ui.createPopup();
    dp.zIndex = 3;
    dp.dateOfMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    dp.weeks = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    dp.monthes = ["january","february","march","april","may","june","july","august","september","october","november","december"];
    dp.popup.onready = function(){

        var sa = this.styleSheet.addRule;
        sa("td", "text-align:center; cursor:default; vertical-align:middle;");
        sa("table", 'font-size:12px; background-color:#FFFFFF;font-family:simsun, "sans-serif"');
        sa("#wrapper", "height:164px; width:178px; border:5px solid #EEEEEE;");
        sa("#header", "height:20px; line-height:18px; cursor:pointer; text-align:center; background-color:#EEEEEE;");
        sa("#nav", "height:20px; width:100%; border:1px solid #E7E7E7");
        sa("#container", "position:relative; z-index:1; width:168px; height:114px; background-color:yellow;");
        sa("#container table", "width:168px; height:114px; position:absolute; top:0px; left:0px; z-index:1;");
        sa("#container td", "width:25%; height:38px; border:1px solid #FAFAFA;");
        sa("#container th", "width:24px; height:18px; background-color:#EEEEEE;");
        sa("#container td.mover", "border:1px solid blue; background-color:#F7F7F7;");
        sa("#container #date1 td", "width:24px; height:16px;");
        sa("#container #date2 td", "width:24px; height:16px;");
        sa("#container td.other", "color:#AAAAAA;");
        sa("#container td.appointed", "border:1px solid blue;");
        sa("#container td.current", "border: 1px solid blue;");
        sa("#container td.today", "border: 1px solid #A00000;");
        sa(".saturday", "background-color:#FCFCFC; color:#800000");
        sa(".sunday", "background-color:#FCFCFC; color:#A00000");

        var s = [], pm = "parent[\""+ baidu.guid +"\"]._instances[\""+ dp.guid +"\"]";

        s.push("<table cellpadding='0' cellspacing='0' id='wrapper'>");
        s.push("<tr><td style='vertical-align:top'>");

        s.push("<div id='header' onclick='#{0}.drive(\"today\")'></div>");
        s.push("<table id='nav' cellpadding='0' cellspacing='0'><tr>");
            s.push("<td style='width:10%' id='prev' onmousedown='#{0}.drive(\"startPrev\")' ");
            s.push("onmouseup='#{0}.drive(\"stopPrev\")' onmouseout='#{0}.drive(\"stopPrev\")'> </td>");
            s.push("<td style='text-align:center;' id='current' onclick='#{0}.drive(\"now\")'>year</td>");
            s.push("<td style='width:10%' id='next' onmousedown='#{0}.drive(\"startNext\")' ");
            s.push("onmouseup='#{0}.drive(\"stopNext\")' onmouseout='#{0}.drive(\"stopNext\")'> </td>");
        s.push("</tr></table>");
        
        var a = ["<table id='#{0}' cellpadding='0' cellspacing='0' style='z-index:1' onclick='#{1}.click(event, this)'>"];
        a.push("<tr><td></td><td></td><td></td><td></td></tr>");
        a.push("<tr><td></td><td></td><td></td><td></td></tr>");
        a.push("<tr><td></td><td></td><td></td><td></td></tr>");
        a.push("</table>");

        s.push("<div id='container' onmouseout='#{0}.mouseout()'");
        s.push(" onmouseover='#{0}.mouseover(event, this)'>");

            s.push(baidu.string.format(a.join(""), "year1", pm));
            s.push(baidu.string.format(a.join(""), "year2", pm));

            s.push(baidu.string.format(a.join(""), "month1", pm));
            s.push(baidu.string.format(a.join(""), "month2", pm));

            var line = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
            for (var i=1; i<=7; i++) a[i] = line;
            a[1] = a[1].replace(/td/g, "th");
            a.push("</table>");

            s.push(baidu.string.format(a.join(""), "date1", pm));
            s.push(baidu.string.format(a.join(""), "date2", pm));

        s.push("</div>");

        s.push("</td></tr></table>");

        this.write(baidu.string.format(s.join(""), pm));
    };
    dp.popup.render();

    // [interface]
    dp.addRule = function(key, value) {
        dp.styleSheet.addRule(key, value);
    };

    // [methods]
    dp.drive = function(name){
        name
            && dp.instance
            && typeof dp.instance[name] == "function"
            && dp.instance[name].apply(dp.instance, Array.prototype.slice.call(arguments, 1));
    };

    // 内容区鼠标划过
    dp.mouseover = function(e, div) {
        (dp.td = getd(e, div)) && baidu.dom.addClass(dp.td, "mover");
    };
    function getd(e, container) {
        e = dp.popup.window.event || e;
        e = e.srcElement || e.target;
        while (e) {
            if (e.tagName == "TD") return e;
            if (e == container) return null;
            e = e.parentNode;
        }
        return null;
    }
    // 内容区鼠标划出
    dp.mouseout = function() {
        dp.td && baidu.dom.removeClass(dp.td, "mover");
        dp.td = null;
    };

    // 内容区鼠标单击
    dp.click = function(e, table) {
        var td = getd(e, table);
        td && this.drive("click", table, td);
    };

})();

