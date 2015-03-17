
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
 css.forEach(function(file){
{
buf.push('<link');
buf.push(attrs({ 'href':("css/" + (file) + ""), 'rel':("stylesheet"), 'type':("text/css") }, {"href":true,"rel":true,"type":true}));
buf.push('/>');
}
 })
}
return buf.join("");
};