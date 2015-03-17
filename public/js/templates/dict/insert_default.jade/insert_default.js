
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="form-group"><label class="col-sm-2 control-label">' + escape((interp = caption) == null ? '' : interp) + '</label><div class="col-sm-10"><input');
buf.push(attrs({ 'placeholder':("" + (caption) + ""), 'type':("text"), 'data-control':("" + (id) + ""), "class": ('form-control') }, {"placeholder":true,"type":true,"data-control":true}));
buf.push('/></div></div>');
}
return buf.join("");
};