
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div data-type="modal" role="dialog" tabindex="-1" class="modal fade signin-resolve"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Attention')) == null ? '' : interp) + '!</h4></div><div data-type="modal-body" class="modal-body"><p> \n' + escape((interp = gettext('Dear user')) == null ? '' : interp) + ', ' + escape((interp = name) == null ? '' : interp) + '!<br>\n' + escape((interp = gettext('Your session is opened on another workstation')) == null ? '' : interp) + ':<br> \n' + escape((interp = workstation_name) == null ? '' : interp) + '.<br>\n' + escape((interp = gettext('Session is opened')) == null ? '' : interp) + ' ' + escape((interp = moment(session_startdt).fromNow()) == null ? '' : interp) + '.<br>\n' + escape((interp = gettext('It was incorrect to exit the program')) == null ? '' : interp) + '.<br><strong>' + escape((interp = gettext('Do you want to close the previous session and log in')) == null ? '' : interp) + '?</strong></p></div><div class="modal-footer"><button type="button" data-type="force" data-dismiss="modal" class="btn btn-primary">' + escape((interp = gettext('Yes')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel')) == null ? '' : interp) + '</button></div></div></div></div>');
}
return buf.join("");
};