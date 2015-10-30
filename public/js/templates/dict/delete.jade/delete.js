
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div data-view="delete" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-delete"><div class="modal-dialog"><div class="modal-content"><div data-view="modal-header" class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Delete record')) == null ? '' : interp) + '</h4></div><div data-view="modal-body" class="modal-body"><p>' + escape((interp = gettext('Yes or No?')) == null ? '' : interp) + '</p></div><div data-view="modal-footer" class="modal-footer"><button data-view="button" type="button" class="btn btn-danger">' + escape((interp = gettext('Delete record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel delete record')) == null ? '' : interp) + '</button></div><div data-view="modal-bottom" class="modal-body"></div></div></div></div>');
}
return buf.join("");
};