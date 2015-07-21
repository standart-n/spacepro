
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div data-view="edit" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-edit"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Edit record')) == null ? '' : interp) + '</h4></div><div data-type="modal-body" class="modal-body"><form role="form" data-view="form" class="form-horizontal"></form></div><div class="modal-footer"><button data-type="button" type="button" class="btn btn-success">' + escape((interp = gettext('Save edit record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel edit record')) == null ? '' : interp) + '</button></div></div></div></div>');
}
return buf.join("");
};