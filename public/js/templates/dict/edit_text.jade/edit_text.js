
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<form role="form" data-view="form" class="form-horizontal"><div class="form-group"><div class="col-sm-12"><textarea');
buf.push(attrs({ 'data-control':("" + (id) + ""), 'rows':("15"), "class": ('form-control') }, {"data-control":true,"rows":true}));
buf.push('>' + escape((interp = value) == null ? '' : interp) + '</textarea></div></div></form>');
}
return buf.join("");
};