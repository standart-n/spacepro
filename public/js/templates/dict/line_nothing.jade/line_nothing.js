jade.templates = jade.templates || {};
jade.templates['line_nothing'] = (function(){
  return function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<tr data-type="nothing"><td');
buf.push(attrs({ 'colspan':("" + (columns.length + 2) + ""), 'align':("center") }, {"colspan":true,"align":true}));
buf.push('> <h4>' + escape((interp = gettext('Information not found')) == null ? '' : interp) + '</h4></td></tr>');
}
return buf.join("");
};
})();