jade.templates = jade.templates || {};
jade.templates['line_loading'] = (function(){
  return function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<tr data-type="loading"><td');
buf.push(attrs({ 'colspan':("" + (columns.length + 2) + ""), 'align':("center") }, {"colspan":true,"align":true}));
buf.push('> <div class="progress progress-striped active"><div style="width:100%;" class="progress-bar"></div></div></td></tr>');
}
return buf.join("");
};
})();