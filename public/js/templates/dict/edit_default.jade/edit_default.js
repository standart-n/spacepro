
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<form role="form" data-view="form" class="form-horizontal"><div class="form-group"><div class="col-sm-12"><input');
buf.push(attrs({ 'data-control':("" + (id) + ""), 'value':("" + (value) + ""), 'type':("text"), "class": ('form-control') }, {"data-control":true,"value":true,"type":true}));
buf.push('/></div></div></form>');
}
return buf.join("");
};