
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<tr data-type="error"><td');
buf.push(attrs({ 'colspan':("" + (columns.length) + ""), 'align':("center") }, {"colspan":true,"align":true}));
buf.push('> <h4>' + escape((interp = gettext('Error on server')) == null ? '' : interp) + '</h4></td></tr>');
}
return buf.join("");
};