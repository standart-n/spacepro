
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<form role="form" data-view="form" class="form-horizontal"><div');
buf.push(attrs({ 'data-control':("" + (id) + ""), "class": ('form-group') }, {"data-control":true}));
buf.push('><div class="col-sm-6"><h4>Выбранные группы</h4><div data-view="check-groups"></div></div><div class="col-sm-6"><h4>Все группы</h4><div data-view="all-groups"></div></div></div></form>');
}
return buf.join("");
};