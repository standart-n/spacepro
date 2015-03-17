
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
 js.forEach(function(file){
{
buf.push('<script');
buf.push(attrs({ 'src':("js/" + (file) + ""), 'type':("text/javascript") }, {"src":true,"type":true}));
buf.push('></script>');
}
 })
 globalObjects.forEach(function(globalObject){
{
var __val__ = "<script type=\"text/javascript\">var " + globalObject.name + " = " + JSON.stringify(globalObject.data) + ";</script>"
buf.push(null == __val__ ? "" : __val__);
}
 })
// iterate wdicts_data
;(function(){
  if ('number' == typeof wdicts_data.length) {

    for (var $index = 0, $$l = wdicts_data.length; $index < $$l; $index++) {
      var dict = wdicts_data[$index];

var __val__ = "<script type=\"text/javascript\">var " + dict.sid + "_data = " + JSON.stringify(dict) + ";</script>"
buf.push(null == __val__ ? "" : __val__);
    }

  } else {
    var $$l = 0;
    for (var $index in wdicts_data) {
      $$l++;      var dict = wdicts_data[$index];

var __val__ = "<script type=\"text/javascript\">var " + dict.sid + "_data = " + JSON.stringify(dict) + ";</script>"
buf.push(null == __val__ ? "" : __val__);
    }

  }
}).call(this);

 scripts.forEach(function(script){
{
buf.push('<script type="text/javascript">' + escape((interp = script) == null ? '' : interp) + '</script>');
}
 })
var __val__ = "<script type=\"text/javascript\">var json_locale_data = " + JSON.stringify(json_locale_data) + ";</script>"
buf.push(null == __val__ ? "" : __val__);
}
return buf.join("");
};