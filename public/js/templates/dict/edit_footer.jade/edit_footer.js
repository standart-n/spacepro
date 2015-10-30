
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<button');
buf.push(attrs({ 'data-view':("button"), 'type':("button"), 'data-request':("" + (operation_id) + ""), "class": ('btn') + ' ' + ('btn-success') }, {"data-view":true,"type":true,"data-request":true}));
buf.push('>' + escape((interp = gettext('Save edit record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel edit record')) == null ? '' : interp) + '</button>');
}
return buf.join("");
};