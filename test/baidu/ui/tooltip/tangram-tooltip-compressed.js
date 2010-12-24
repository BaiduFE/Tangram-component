/* Copyright (c) 2010 Baidu */
var baidu=baidu||{version:"1-1-1",guid:"$BAIDU$"};window[baidu.guid]=window[baidu.guid]||{};baidu.ui=baidu.ui||{get:function(a){var c;
while((a=a.parentNode)!=document.body){if(c=baidu.dom.getAttr(a,"data-tguid")){return baidu.lang.instance(c)}}}};baidu.ui.tooltip=baidu.ui.tooltip||{instances:{}};
baidu.dom=baidu.dom||{};baidu.dom.g=function(a){if("string"==typeof a||a instanceof String){return document.getElementById(a)
}else{if(a&&a.nodeName&&(a.nodeType==1||a.nodeType==9)){return a}}return null};baidu.g=baidu.G=baidu.dom.g;baidu.lang=baidu.lang||{};
baidu.lang.guid=function(){return"TANGRAM__"+(window[baidu.guid]._counter++).toString(36)};window[baidu.guid]._counter=window[baidu.guid]._counter||1;
window[baidu.guid]._instances=window[baidu.guid]._instances||{};baidu.lang.Class=function(a){this.guid=a||baidu.lang.guid();
window[baidu.guid]._instances[this.guid]=this};window[baidu.guid]._instances=window[baidu.guid]._instances||{};baidu.lang.Class.prototype.dispose=function(){delete window[baidu.guid]._instances[this.guid];
for(var a in this){if(typeof this[a]!="function"){delete this[a]}}};baidu.lang.Class.prototype.toString=function(){return"[object "+(this._className||"Object")+"]"
};baidu.lang.Event=function(a,c){this.type=a;this.returnValue=true;this.target=c||null;this.currentTarget=null};baidu.lang.Class.prototype.addEventListener=function(e,d,c){if(typeof d!="function"){return
}!this.__listeners&&(this.__listeners={});var a=this.__listeners,f;if(typeof c=="string"&&c){if(/[^\w\-]/.test(c)){throw ("nonstandard key:"+c)
}else{d.hashCode=c;f=c}}e.indexOf("on")!=0&&(e="on"+e);typeof a[e]!="object"&&(a[e]={});f=f||baidu.lang.guid();d.hashCode=f;
a[e][f]=d};baidu.lang.Class.prototype.removeEventListener=function(d,c){if(typeof c=="function"){c=c.hashCode}else{if(typeof c!="string"){return
}}!this.__listeners&&(this.__listeners={});d.indexOf("on")!=0&&(d="on"+d);var a=this.__listeners;if(!a[d]){return}a[d][c]&&delete a[d][c]
};baidu.lang.Class.prototype.dispatchEvent=function(d){if("string"==typeof d){d=new baidu.lang.Event(d)}!this.__listeners&&(this.__listeners={});
var c,a=this.__listeners,e=d.type;d.target=d.target||this;d.currentTarget=this;typeof this[e]=="function"&&this[e].apply(this,arguments);
e.indexOf("on")!=0&&(e="on"+e);if(typeof a[e]=="object"){for(c in a[e]){a[e][c].apply(this,arguments)}}return d.returnValue
};baidu.object=baidu.object||{};baidu.object.extend=function(d,a){for(var c in a){if(a.hasOwnProperty(c)){d[c]=a[c]}}return d
};baidu.extend=baidu.object.extend;(function(){var a={getId:function(c){var d="tangram"+this.type+this.guid;return c?d+c:d
},getClass:function(c){var f=this,e=f.type.toLowerCase(),d=this.classPrefix?this.classPrefix:"tangram-"+e;if(c){d+="-"+c}return d
},getMain:function(){return baidu.g(this.getId())},type:"",addons:[],getCallString:function(f){var d=arguments.length,g=[],e,c;
if(d>1){for(e=1;e<d;e++){c=arguments[e];if(typeof c=="string"){c="'"+c+"'"}g.push(c)}}return"window[baidu.guid]._instances['"+this.guid+"']."+f+"("+g.join(",")+");"
}};baidu.ui.create=function(f,d){d=d||{};var h=d.parentClass||baidu.lang.Class,e,g=function(i){if(h==baidu.lang.Class){h.call(this,i?i.guid:"")
}else{h.call(this,i)}f.apply(this,arguments);for(e=0,n=g.addons.length;e<n;e++){g.addons[e](this)}baidu.object.extend(this,g.options);
baidu.object.extend(this,i)};var k=function(){},j=f.prototype;k.prototype=h.prototype;var c=g.prototype=new k();for(var e in j){c[e]=j[e]
}typeof d.className=="string"&&(c._className=d.className);c.constructor=j.constructor;for(e in a){c[e]=a[e]}g.extend=function(m){for(var l in m){g.prototype[l]=m[l]
}return g};g.addons=[];g.register=function(i){if(typeof i=="function"){g.addons.push(i)}};g.options={};return g}})();baidu.page=baidu.page||{};
baidu.page.getViewWidth=function(){var c=document,a=c.compatMode=="BackCompat"?c.body:c.documentElement;return a.clientWidth
};baidu.page.getViewHeight=function(){var c=document,a=c.compatMode=="BackCompat"?c.body:c.documentElement;return a.clientHeight
};baidu.page.getScrollLeft=function(){var a=document;return a.documentElement.scrollLeft||a.body.scrollLeft};baidu.page.getScrollTop=function(){var a=document;
return a.documentElement.scrollTop||a.body.scrollTop};baidu.browser=baidu.browser||{};if(/msie (\d+\.\d)/i.test(navigator.userAgent)){baidu.ie=baidu.browser.ie=parseFloat(RegExp["\x241"])
}baidu.dom._NAME_ATTRS=(function(){var a={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",rowspan:"rowSpan",valign:"vAlign",usemap:"useMap",frameborder:"frameBorder"};
if(baidu.browser.ie<8){a["for"]="htmlFor";a["class"]="className"}else{a.htmlFor="for";a.className="class"}return a})();baidu.dom.getAttr=function(c,a){c=baidu.dom.g(c);
if("style"==a){return c.style.cssText}a=baidu.dom._NAME_ATTRS[a]||a;return c.getAttribute(a)};baidu.getAttr=baidu.dom.getAttr;
baidu.dom.setAttr=function(c,a,d){c=baidu.dom.g(c);if("style"==a){c.style.cssText=d}else{a=baidu.dom._NAME_ATTRS[a]||a;c.setAttribute(a,d)
}return c};baidu.setAttr=baidu.dom.setAttr;baidu.dom.insertHTML=function(f,a,e){f=baidu.dom.g(f);if(f.insertAdjacentHTML){f.insertAdjacentHTML(a,e)
}else{var c=f.ownerDocument.createRange();c.setStartBefore(f);var d=c.createContextualFragment(e),h=f.parentNode,g;switch(a.toUpperCase()){case"BEFOREBEGIN":h.insertBefore(d,f);
break;case"AFTERBEGIN":f.insertBefore(d,f.firstChild);break;case"BEFOREEND":f.appendChild(d);break;case"AFTEREND":(g=f.nextSibling)?h.insertBefore(d,g):h.appendChild(d)
}}};baidu.insertHTML=baidu.dom.insertHTML;baidu.dom.remove=function(a){a=baidu.dom.g(a);if("HTML BODY HEAD".indexOf(a.nodeName)==-1){if(baidu.browser.ie){var c=document.createElement("DIV");
c.appendChild(a);c.innerHTML=""}else{(c=a.parentNode)&&c.removeChild(a)}}};baidu.dom.getDocument=function(a){a=baidu.dom.g(a);
return a.nodeType==9?a:a.ownerDocument||a.document};baidu.dom._styleFixer=baidu.dom._styleFixer||{};baidu.dom._styleFilter=baidu.dom._styleFilter||[];
baidu.dom._styleFilter.filter=function(c,f,g){for(var a=0,e=baidu.dom._styleFilter,d;d=e[a];a++){if(d=d[g]){f=d(c,f)}}return f
};baidu.string=baidu.string||{};baidu.string.toCamelCase=function(a){return String(a).replace(/[-_]\D/g,function(c){return c.charAt(1).toUpperCase()
})};baidu.dom.getStyle=function(d,c){var g=baidu.dom;d=g.g(d);c=baidu.string.toCamelCase(c);var f=d.style[c];if(!f){var a=g._styleFixer[c],e=d.currentStyle||(baidu.browser.ie?d.style:getComputedStyle(d,null));
if("string"==typeof a){f=e[a]}else{if(a&&a.get){f=a.get(d,e)}else{f=e[c]}}}if(a=g._styleFilter){f=a.filter(c,f,"get")}return f
};baidu.getStyle=baidu.dom.getStyle;if(/opera\/(\d+\.\d)/i.test(navigator.userAgent)){baidu.browser.opera=parseFloat(RegExp["\x241"])
}baidu.browser.isWebkit=/webkit/i.test(navigator.userAgent);baidu.browser.isGecko=/gecko/i.test(navigator.userAgent)&&!/like gecko/i.test(navigator.userAgent);
baidu.browser.isStrict=document.compatMode=="CSS1Compat";baidu.dom.getPosition=function(c){var i=baidu.dom.getDocument(c),f=baidu.browser;
c=baidu.dom.g(c);var d=f.isGecko>0&&i.getBoxObjectFor&&baidu.dom.getStyle(c,"position")=="absolute"&&(c.style.top===""||c.style.left==="");
var h={left:0,top:0};var g=(f.ie&&!f.isStrict)?i.body:i.documentElement;if(c==g){return h}var j=null;var e;if(c.getBoundingClientRect){e=c.getBoundingClientRect();
h.left=Math.floor(e.left)+Math.max(i.documentElement.scrollLeft,i.body.scrollLeft);h.top=Math.floor(e.top)+Math.max(i.documentElement.scrollTop,i.body.scrollTop);
h.left-=i.documentElement.clientLeft;h.top-=i.documentElement.clientTop;if(f.ie&&!f.isStrict){h.left-=2;h.top-=2}}else{if(i.getBoxObjectFor&&!d){e=i.getBoxObjectFor(c);
var a=i.getBoxObjectFor(g);h.left=e.screenX-a.screenX;h.top=e.screenY-a.screenY}else{j=c;do{h.left+=j.offsetLeft;h.top+=j.offsetTop;
if(f.isWebkit>0&&baidu.dom.getStyle(j,"position")=="fixed"){h.left+=i.body.scrollLeft;h.top+=i.body.scrollTop;break}j=j.offsetParent
}while(j&&j!=c);if(f.opera>0||(f.isWebkit>0&&baidu.dom.getStyle(c,"position")=="absolute")){h.top-=i.body.offsetTop}j=c.offsetParent;
while(j&&j!=i.body){h.left-=j.scrollLeft;if(!b.opera||j.tagName!="TR"){h.top-=j.scrollTop}j=j.offsetParent}}}return h};baidu.dom.setStyle=function(d,c,e){var f=baidu.dom,a;
d=f.g(d);c=baidu.string.toCamelCase(c);if(a=f._styleFilter){e=a.filter(c,e,"set")}a=f._styleFixer[c];(a&&a.set)?a.set(d,e):(d.style[a||c]=e);
return d};baidu.setStyle=baidu.dom.setStyle;baidu.dom.setStyles=function(c,d){c=baidu.dom.g(c);for(var a in d){baidu.dom.setStyle(c,a,d[a])
}return c};baidu.setStyles=baidu.dom.setStyles;baidu.string.format=function(e,c){e=String(e);if(typeof c!="undefined"){if("[object Object]"==Object.prototype.toString.call(c)){return e.replace(/#\{(.+?)\}/g,function(f,h){var g=c[h];
if("function"==typeof g){g=g(h)}return("undefined"==typeof g?"":g)})}else{var d=Array.prototype.slice.call(arguments,1),a=d.length;
return e.replace(/#\{(\d+)\}/g,function(g,f){f=parseInt(f,10);return(f>=a?g:d[f])})}}return e};baidu.format=baidu.string.format;
baidu.event=baidu.event||{};baidu.event.EventArg=function(d,f){f=f||window;d=d||f.event;var e=f.document;this.target=d.srcElement;
this.keyCode=d.which;for(var a in d){var c=d[a];if("function"!=typeof c){this[a]=c}}if(!this.pageX&&this.pageX!==0){this.pageX=(d.clientX||0)+(e.documentElement.scrollLeft||e.body.scrollLeft);
this.pageY=(d.clientY||0)+(e.documentElement.scrollTop||e.body.scrollTop)}this._event=d};baidu.event.EventArg.prototype.preventDefault=function(){if(this._event.preventDefault){this._event.preventDefault()
}else{this._event.returnValue=false}return this};baidu.event.EventArg.prototype.stopPropagation=function(){if(this._event.stopPropagation){this._event.stopPropagation()
}else{this._event.cancelBubble=true}return this};baidu.event.EventArg.prototype.stop=function(){return this.stopPropagation().preventDefault()
};baidu.event.get=function(a,c){return new baidu.event.EventArg(a,c)};baidu.event._unload=function(){var d=baidu.event._listeners,a=d.length,c=!!window.removeEventListener,f,e;
while(a--){f=d[a];if(f[1]=="unload"){continue}e=f[0];if(e.removeEventListener){e.removeEventListener(f[1],f[3],false)}else{if(e.detachEvent){e.detachEvent("on"+f[1],f[3])
}}}if(c){window.removeEventListener("unload",baidu.event._unload,false)}else{window.detachEvent("onunload",baidu.event._unload)
}};if(window.attachEvent){window.attachEvent("onunload",baidu.event._unload)}else{window.addEventListener("unload",baidu.event._unload,false)
}baidu.event._listeners=baidu.event._listeners||[];baidu.event.on=function(c,e,f){e=e.replace(/^on/i,"");if("string"==typeof c){c=baidu.dom.g(c)
}var d=function(g){f.call(c,g)},a=baidu.event._listeners;a[a.length]=[c,e,f,d];if(c.addEventListener){c.addEventListener(e,d,false)
}else{if(c.attachEvent){c.attachEvent("on"+e,d)}}return c};baidu.on=baidu.event.on;baidu.ui.tooltip.Tooltip=baidu.ui.tooltip.Tooltip||baidu.ui.create(function(a){var c=this;
baidu.object.extend(c,a);if(!c.target){return null}c.content=c.content||baidu.dom.getAttr(c.target,"title")||"";baidu.dom.setAttr(c.target,"title","")
}).extend({type:"TOOLTIP",width:"",height:"",content:"",singleton:true,xOffset:10,yOffset:10,positionBy:"mouse",tplMain:'<div id="#{id}" class="#{class}" data-guid="#{guid}">#{content}</div>',getString:function(){var a=this;
return baidu.format(a.tplMain,{id:a.getId(),"class":a.getClass(),guid:a.guid,content:a.content})},render:function(f){var d=this,f=baidu.event.get(f),c;
if(d.singleton){try{baidu.ui.tooltip.showing.dispose()}catch(a){}}baidu.ui.tooltip.showing=d;!baidu.g(d.getId())&&baidu.dom.insertHTML(document.body,"beforeEnd",d.getString());
c=baidu.g(d.getId());baidu.dom.setStyles(c,{position:"absolute",width:d.width,height:d.height});d.setPosition(f);d.dispatchEvent(new baidu.lang.Event("onload",f))
},setPosition:function(h){var d=this,c=baidu.g(d.getId()),g=d.target;function a(k,m,l){var e=l=="x"?baidu.page.getScrollLeft():baidu.page.getScrollTop(),j=l=="x"?baidu.page.getViewWidth():baidu.page.getViewHeight();
return k+m-e>j?Math.max(k-m,0):k}function f(j,e){baidu.dom.setStyles(c,{left:a(j+d.xOffset,c.offsetWidth,"x"),top:a(e+d.yOffset,c.offsetHeight,"y")})
}if(d.positionBy=="mouse"){f(h.pageX,h.pageY)}else{var i=baidu.dom.getPosition(g);f(i.left,i.top)}},open:function(c){var a=this;
c=baidu.event.get(c);a.dispatchEvent(new baidu.lang.Event("beforeopen",c));a.render(c);a.dispatchEvent(new baidu.lang.Event("afteropen",c))
},close:function(c){var a=this;a.dispatchEvent("beforeclose");a.dispose();a.dispatchEvent("afterclose")},dispose:function(){try{clearTimeout(this.hideHdl);
baidu.dom.remove(this.getId());baidu.ui.tooltip.showing=null}catch(a){}}});baidu.array=baidu.array||{};baidu.array.each=function(g,e){var d,f,c,a=g.length;
if("function"==typeof e){for(c=0;c<a;c++){f=g[c];d=e.call(g,f,c);if(d===false){break}}}return g};baidu.each=baidu.array.each;
baidu.ui.tooltip.create=function(d,c,a){if(!d){return null}d=(d.splice&&d.join)?d:[d];ret=[];c=c||{};baidu.array.each(d,function(e){c.target=e;
var f=new baidu.ui.tooltip.Tooltip(c);if("function"==typeof a){a(f)}ret.push(f)});return ret};baidu.ui.tooltip.Tooltip.prototype.showDelay=100;
baidu.ui.tooltip.Tooltip.prototype.hideDelay=500;baidu.ui.tooltip.hover=function(c,a){return baidu.ui.tooltip.create(c,a,function(e){baidu.on(e.target,"mouseover",function(f){f=baidu.event.get(f);
clearTimeout(e.hideHdl);e.showHdl=setTimeout(function(){e.open(f)},e.showDelay)});e.addEventListener("onload",function(){baidu.on(baidu.g(e.getId()),"mouseover",function(f){clearTimeout(e.hideHdl)
})});function d(f){clearTimeout(e.showHdl);e.hideHdl=setTimeout(function(){e.close(f)},e.hideDelay)}baidu.on(e.target,"mouseout",d);
e.addEventListener("onload",function(){baidu.on(baidu.g(e.getId()),"mouseout",d)})})};baidu.ui.tooltip.click=function(c,a){return baidu.ui.tooltip.create(c,a,function(d){baidu.on(d.target,"click",function(f){f=baidu.event.get(f);
d.open(f);f.stopPropagation()});d.addEventListener("onload",function(){baidu.on(baidu.g(d.getId()),"click",function(f){f=baidu.event.get(f);
f.stopPropagation()})});baidu.on(document,"click",function(f){d.close(f)})})};