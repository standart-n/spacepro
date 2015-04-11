
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<form role="form" data-view="form" class="form-horizontal"><div class="form-group"><div class="col-sm-6"><input');
buf.push(attrs({ 'data-control':("" + (id) + "_date"), 'value':("" + (moment(value).format('DD.MM.YYYY')) + ""), "class": ('form-control') }, {"data-control":true,"value":true}));
buf.push('/></div><div class="col-sm-6"><div class="bootstrap-timepicker"><input');
buf.push(attrs({ 'data-control':("" + (id) + "_time"), "class": ('form-control') }, {"data-control":true}));
buf.push('/></div></div></div></form>');
}
return buf.join("");
};