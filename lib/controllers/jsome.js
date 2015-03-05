require('colors');
require('than');

var data = {
    "global": {
        "colored": true,
        "async": false
    },
    "colors": {
        "num"	: "cyan",
        "str"	: "magenta",
        "bool"	: "red",
        "undef"	: "grey",
        "null"	: "grey",
        "attr"	: "green",
        "quot"	: "magenta",
        "punc"	: "yellow",
        "brack" : "yellow"
    },
    "level": {
        "show": false,
        "char": ".",
        "color": "yellow",
        "spaces": 4
    }
};
var colors = data.colors;
var level = data.level;
var global = data.global;
var generateColors = function (value, type) {
    if(!global.colored) {
        return value;
    }
    if(type) {
        return value[colors[type]];
    }
    if((''+value) == 'null') {
        return 'null'[colors.null];
    }
    if((''+value) == 'undefined') {
        return 'undefined'[colors.undef];
    }
    switch (toString.call(value)) {
        case '[object Number]':
            return value.toString()[colors.num];
        case '[object String]':
            return '"'[colors.quot] + value[colors.str] + '"'[colors.quot];
        case '[object Boolean]':
            return value.toString()[colors.bool];
        case '[object Function]':
            return 'null'[colors.null];
        case '[object Array]':
            var log = '['[colors.brack];
            for(var i=0; i<value.length; i++) {
                log += generateColors(value[i]);
                if(i<value.length-1)
                    log += ', '[colors.punc];
            }
            log += (']'[colors.brack]);
            return log;
    }
};

var getTabs = function (lvl) {
    var tabs = '';
    var spaces = ' ';
    while(spaces.length < level.spaces ) {
        spaces += ' ';
    }
    for(var i=0; i<lvl; i++) {
        tabs += ((level.show)?level.char[level.color]:'') + spaces;
    }

    return tabs;
};

var hasChilds = function (array) {
    for(var i=0; i<array.length; i++) {
        if(toString.call(array[i]) === '[object Array]' ||  toString.call(array[i]) === '[object Object]' )
            return true;
    }

    return false;
};

var clearObject = function (json) {
    var len = 0;
    for (var key in json ) {
        if(json.hasOwnProperty(key) && toString.call(json[key])!=='[object Function]') {
            len ++;
        } else {
            delete json[key];
        }
    }

    return len;
};

var clearArray = function (json) {
    for (var key in json) {
        if (toString.call(json[key])=='[object Function]') {
            json[key] = null;
        }
    }

    return json.length;
};

var isEmpty = function (elem) {
    for (var key in elem) {
        return false;
    }

    return true;
};

var jsome = function (json, lvl, inObj) {
    var len;
    var key;
    var level = lvl?lvl:0;
    var result = '';
    if (toString.call(json) === '[object Object]') {
        len = clearObject(json);
        if(isEmpty(json)) {
            return getTabs(level) + generateColors('{}','brack');
        }
        result += getTabs(inObj?0:level) + generateColors('{\n','brack');
        for(key in json) {
            len --;
            if(toString.call(json[key]) === '[object Object]' ||toString.call(json[key]) === '[object Array]') {
                result += getTabs(level + 1) + generateColors(key,'attr') + generateColors(': ','punc') + jsome(json[key],level+1,true) + generateColors((len?',':'') + '\n','punc');
            } else {
                result += getTabs(level + 1) + generateColors(key,'attr') + generateColors(': ','punc') + generateColors(json[key]) + generateColors((len?',':'') + '\n','punc');
            }
        }
        result += getTabs(level) + generateColors('}','brack');
    }
    else if (toString.call(json) === '[object Array]' && hasChilds(json)) {
        if(isEmpty(json)) {
            return getTabs(level) + generateColors('[]','brack');
        }
        result += getTabs(inObj?0:level) + generateColors('[\n','brack');
        len = clearArray(json);
        for(key in json) {
            len --;
            if(toString.call(json[key]) === '[object Object]' ||toString.call(json[key]) === '[object Array]') {
                result += jsome(json[key],level+1) + generateColors((len?',':'') + '\n','punc');
            } else {
                result += getTabs(level + 1) + generateColors(json[key]) + generateColors((len?',':'') + '\n','punc');
            }
        }
        result += getTabs(level) + generateColors(']','brack');
    }
    else {
        result += getTabs(inObj?0:level) + generateColors(json);
    }

    return result;
};

var service = function (json, func) {
    if(global.async) {
        jsome.than(json, function (data) {
            console.log.than(data, function () {
                func(json);
            });
        });
    } else {
        // console.log(jsome(json));
        return jsome(json);
    }
};
service.parse = function (json) {
    this(JSON.parse(json));
};
service.colors = colors;
service.level = level;
service.global = global;

module.exports = service;