
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<tr data-type="nothing"><td');
buf.push(attrs({ 'colspan':("" + (columns.length + 1) + ""), 'align':("center") }, {"colspan":true,"align":true}));
buf.push('> <h4>' + escape((interp = gettext('Information not found')) == null ? '' : interp) + '</h4></td></tr>');
}
return buf.join("");
};