
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="form-group"><div class="col-sm-12"><input');
buf.push(attrs({ 'data-control':("" + (id) + ""), 'value':("" + (value) + ""), 'type':("text"), 'tabindex':("0"), "class": ('form-control') }, {"data-control":true,"value":true,"type":true,"tabindex":true}));
buf.push('/></div></div>');
}
return buf.join("");
};