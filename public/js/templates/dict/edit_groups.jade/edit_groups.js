
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<form role="form" data-view="form" class="form-horizontal"><div class="form-group"><div class="col-sm-6"><select');
buf.push(attrs({ 'data-control':("" + (id) + "_active"), 'miltiple':(true), 'size':("10"), "class": ('form-control') }, {"data-control":true,"miltiple":true,"size":true}));
buf.push('></select></div><div class="col-sm-6"><select');
buf.push(attrs({ 'data-control':("" + (id) + "_all"), 'miltiple':(true), 'size':("10"), "class": ('form-control') }, {"data-control":true,"miltiple":true,"size":true}));
buf.push('></select></div></div></form>');
}
return buf.join("");
};