
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<form role="form" data-view="form" class="form-horizontal"><div class="form-group"><div class="col-sm-12"><h3>' + escape((interp = conf.showcaption) == null ? '' : interp) + '</h3></div><div class="col-sm-12"><select');
buf.push(attrs({ 'placeholder':("" + (conf.showcaption) + ""), 'data-control':("" + (id) + ""), "class": ('form-control') }, {"placeholder":true,"data-control":true}));
buf.push('></select></div></div></form>');
}
return buf.join("");
};