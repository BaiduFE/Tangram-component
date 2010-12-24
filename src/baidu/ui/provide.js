
///import baidu.ui;
baidu.ui.provide = function(UI, fnName) {
    var uiType = UI.prototype.uiType;
    if (!baidu.ui[uiType][fnName]) {
        baidu.ui[uiType][fnName] = function() {
            var len = arguments.length,
                options = arguments[len - 1],
                arg = [].slice.call(arguments, 0, len - 1);
            var ui = new baidu.ui[uiType][uiType.replace(/\b\w+\b/g, function(word) {
                                return word.substring(0, 1).toUpperCase() + word.substring(1);
                            })](options);
            return ui[fnName].apply(ui, arg);
        };
    }

};
