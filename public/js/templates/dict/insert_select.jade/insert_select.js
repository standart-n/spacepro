jade.templates = jade.templates || {};
jade.templates['insert_select'] = (function(){
  return function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="form-group"><label class="col-sm-2 control-label">' + escape((interp = conf.showcaption) == null ? '' : interp) + '</label><div class="col-sm-10"><select');
buf.push(attrs({ 'placeholder':("" + (conf.showcaption) + ""), 'data-control':("" + (id) + ""), "class": ('form-control') }, {"placeholder":true,"data-control":true}));
buf.push('></select></div></div>');
}
return buf.join("");
};
})();