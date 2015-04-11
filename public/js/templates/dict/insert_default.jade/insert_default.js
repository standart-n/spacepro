
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="form-group"><div class="col-sm-12"><h3>' + escape((interp = caption) == null ? '' : interp) + '</h3></div><div class="col-sm-12"><input');
buf.push(attrs({ 'placeholder':("" + (caption) + ""), 'type':("text"), 'data-control':("" + (id) + ""), "class": ('form-control') }, {"placeholder":true,"type":true,"data-control":true}));
buf.push('/></div></div>');
}
return buf.join("");
};