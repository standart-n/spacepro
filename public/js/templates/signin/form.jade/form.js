jade.templates = jade.templates || {};
jade.templates['form'] = (function(){
  return function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div data-view="signin" class="container signin-container"><div class="row"><div class="row"><div class="login-box"><h2 class="signin-form-heading">' + escape((interp = gettext('Signin')) == null ? '' : interp) + '</h2><div data-type="error" class="alert alert-danger hide"></div><form data-type="form" class="form-horizontal signin-form"><fieldset><input');
buf.push(attrs({ 'data-type':("login"), 'type':("text"), 'placeholder':("" + (gettext('Login')) + ""), "class": ('input-large') + ' ' + ('col-xs-12') + ' ' + ('signin-form-input') + ' ' + ('signin-form-login') }, {"data-type":true,"type":true,"placeholder":true}));
buf.push('/><input');
buf.push(attrs({ 'data-type':("password"), 'type':("password"), 'placeholder':("" + (gettext('Password')) + ""), "class": ('input-large') + ' ' + ('col-xs-12') + ' ' + ('signin-form-input') + ' ' + ('signin-form-password') }, {"data-type":true,"type":true,"placeholder":true}));
buf.push('/><div class="clearfix"></div><button');
buf.push(attrs({ 'data-type':("submit"), 'type':("submit"), 'data-loading-text':("" + (gettext('Loading')) + "..."), "class": ('btn') + ' ' + ('btn-primary') + ' ' + ('col-xs-12') + ' ' + ('signin-form-submit') }, {"data-type":true,"type":true,"data-loading-text":true}));
buf.push('>' + escape((interp = gettext('Enter')) == null ? '' : interp) + '</button></fieldset></form></div></div></div></div>');
}
return buf.join("");
};
})();