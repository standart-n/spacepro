
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!DOCTYPE html><html');
buf.push(attrs({ terse: true, 'lang':("" + (lang) + ""), 'lang_dir':("" + (lang_dir) + "") }, {"lang":true,"lang_dir":true}));
buf.push('><head><title>' + escape((interp = title) == null ? '' : interp) + '</title><base href="/"><meta');
buf.push(attrs({ terse: true, 'name':("description"), 'content':("" + (description) + "") }, {"name":true,"content":true}));
buf.push('><meta');
buf.push(attrs({ terse: true, 'name':("keywords"), 'content':("" + (keywords) + "") }, {"name":true,"content":true}));
buf.push('><meta name="Revesit" content="3"><meta name="Document-state" content="Dynamic"><meta');
buf.push(attrs({ terse: true, 'name':("Copyright"), 'Lang':("eng"), 'content':("2013 " + (author) + "") }, {"name":true,"Lang":true,"content":true}));
buf.push('><meta');
buf.push(attrs({ terse: true, 'name':("Copyright"), 'Lang':("ru"), 'content':("2013 " + (author) + "") }, {"name":true,"Lang":true,"content":true}));
buf.push('><meta name="robots" content="all"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta');
buf.push(attrs({ terse: true, 'http-equiv':("Content-Language"), 'content':("" + (lang) + "") }, {"http-equiv":true,"content":true}));
buf.push('><meta http-equiv="Content-Type" content="text/html; charset = utf-8"><link href="/img/favicon.ico" rel="shortcut icon" type="image/x-icon">');
 css.forEach(function(file){
{
buf.push('<link');
buf.push(attrs({ terse: true, 'href':("css/" + (file) + ""), 'rel':("stylesheet"), 'type':("text/css") }, {"href":true,"rel":true,"type":true}));
buf.push('>');
}
 })
buf.push('</head><body><div id="main"><div data-view="signin" class="container signin-container"><div class="row"><div class="row"><div class="login-box"><h2 class="signin-form-heading">' + escape((interp = gettext('Signin')) == null ? '' : interp) + '</h2><div data-type="error" class="alert alert-danger hide"></div><form data-type="form" class="form-horizontal signin-form"><fieldset><input');
buf.push(attrs({ terse: true, 'data-type':("login"), 'type':("text"), 'placeholder':("" + (gettext('Login')) + ""), "class": ('input-large') + ' ' + ('col-xs-12') + ' ' + ('signin-form-input') + ' ' + ('signin-form-login') }, {"data-type":true,"type":true,"placeholder":true}));
buf.push('><input');
buf.push(attrs({ terse: true, 'data-type':("password"), 'type':("password"), 'placeholder':("" + (gettext('Password')) + ""), "class": ('input-large') + ' ' + ('col-xs-12') + ' ' + ('signin-form-input') + ' ' + ('signin-form-password') }, {"data-type":true,"type":true,"placeholder":true}));
buf.push('><div class="clearfix"></div><button');
buf.push(attrs({ terse: true, 'data-type':("submit"), 'type':("submit"), 'data-loading-text':("" + (gettext('Loading')) + "..."), "class": ('btn') + ' ' + ('btn-primary') + ' ' + ('col-xs-12') + ' ' + ('signin-form-submit') }, {"data-type":true,"type":true,"data-loading-text":true}));
buf.push('>' + escape((interp = gettext('Enter')) == null ? '' : interp) + '</button></fieldset></form></div></div></div></div></div><div class="modals"><div data-view="resolve" class="modal-resolve"></div></div>');
 js.forEach(function(file){
{
buf.push('<script');
buf.push(attrs({ terse: true, 'src':("js/" + (file) + ""), 'type':("text/javascript") }, {"src":true,"type":true}));
buf.push('></script>');
}
 })
 globalObjects.forEach(function(globalObject){
{
var __val__ = "<script type=\"text/javascript\">var " + globalObject.name + " = " + JSON.stringify(globalObject.data) + ";</script>"
buf.push(null == __val__ ? "" : __val__);
}
 })
// iterate wdicts_data
;(function(){
  if ('number' == typeof wdicts_data.length) {

    for (var $index = 0, $$l = wdicts_data.length; $index < $$l; $index++) {
      var dict = wdicts_data[$index];

var __val__ = "<script type=\"text/javascript\">var " + dict.sid + "_data = " + JSON.stringify(dict) + ";</script>"
buf.push(null == __val__ ? "" : __val__);
    }

  } else {
    var $$l = 0;
    for (var $index in wdicts_data) {
      $$l++;      var dict = wdicts_data[$index];

var __val__ = "<script type=\"text/javascript\">var " + dict.sid + "_data = " + JSON.stringify(dict) + ";</script>"
buf.push(null == __val__ ? "" : __val__);
    }

  }
}).call(this);

 scripts.forEach(function(script){
{
buf.push('<script type="text/javascript">' + escape((interp = script) == null ? '' : interp) + '</script>');
}
 })
var __val__ = "<script type=\"text/javascript\">var json_locale_data = " + JSON.stringify(json_locale_data) + ";</script>"
buf.push(null == __val__ ? "" : __val__);
buf.push('</body></html>');
}
return buf.join("");
};