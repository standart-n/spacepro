jade.templates = jade.templates || {};
jade.templates['js'] = (function(){
  return function anonymous(locals, attrs, escape, rethrow, merge) {
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
})();