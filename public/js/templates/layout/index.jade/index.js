
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<!DOCTYPE html><html');
buf.push(attrs({ terse: true, 'lang':("" + (lang) + ""), 'dir':("" + (lang_dir) + "") }, {"lang":true,"dir":true}));
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
buf.push('><meta http-equiv="Content-Type" content="text/html; charset = utf-8"><link href="/img/favicon.ico" rel="shortcut" type="image/x-icon"><link href="/img/favicon.png" rel="icon" type="image/png">');
 css.forEach(function(file){
{
buf.push('<link');
buf.push(attrs({ terse: true, 'href':("css/" + (file) + ""), 'rel':("stylesheet"), 'type':("text/css") }, {"href":true,"rel":true,"type":true}));
buf.push('>');
}
 })
buf.push('</head><body><header class="navbar"><div class="container"><button type="button" data-toggle="collapse" data-target=".sidebar-nav.nav-collapse" class="navbar-toggle"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a id="main-menu-toggle" class="hidden-xs open"><i class="fa fa-bars"></i></a><a href="/" class="navbar-brand col-lg-2 col-sm-1 col-xs-12"><i class="fa fa-rocket fa-lg fa-inverse fa-fw"></i><span class="hidden-sm">SpacePro</span></a><div class="header-nav nav-no-collapse"><ul class="nav navbar-nav pull-right"><li><a href="#auth/logout" class="btn"><i class="fa fa-power-off fa-fw"></i>&nbsp;<small>' + escape((interp = gettext('Logout')) == null ? '' : interp) + '</small></a></li></ul></div></div></header><div class="container"><div class="row">');
 if (webDicts != undefined)
{
 if (webDicts.active != undefined)
{
buf.push('<div id="sidebar-left" class="col-lg-2 col-sm-1"><div class="sidebar-nav nav-collapse collapse navbar-collapse bs-navbar-collapse"><ul class="nav nav-tabs nav-stacked main-menu">');
// iterate webDicts.dicts
;(function(){
  if ('number' == typeof webDicts.dicts.length) {

    for (var $index = 0, $$l = webDicts.dicts.length; $index < $$l; $index++) {
      var dict = webDicts.dicts[$index];

 var caption = dict.caption
 if (caption.length > 20)
{
 caption = caption.slice(0,20) + '...'
}
 if (dict.sid == webDicts.active)        
{
buf.push('<li class="active"><a href="#"><div class="visible-sm">');
 if (dict.settings.main.fa_icon !== undefined) {
{
buf.push('<i');
buf.push(attrs({ terse: true, "class": ("fa " + (dict.settings.main.fa_icon) + "") }, {"class":true}));
buf.push('></i>');
}
 } else {
{
buf.push('<i class="fa fa-power-off"></i>');
}
 }
buf.push('</div><small class="hidden-sm">' + escape((interp = caption) == null ? '' : interp) + '</small></a></li>');
}
 else
{
buf.push('<li><a');
buf.push(attrs({ terse: true, 'href':("/dict/" + (dict.sid) + "") }, {"href":true}));
buf.push('><div class="visible-sm">');
 if (dict.settings.main.fa_icon !== undefined) {
{
buf.push('<i');
buf.push(attrs({ terse: true, "class": ("fa " + (dict.settings.main.fa_icon) + "") }, {"class":true}));
buf.push('></i>');
}
 } else {
{
buf.push('<i class="fa fa-table"></i>');
}
 }
buf.push('</div><small class="hidden-sm">' + escape((interp = caption) == null ? '' : interp) + '</small></a></li>');
}
    }

  } else {
    var $$l = 0;
    for (var $index in webDicts.dicts) {
      $$l++;      var dict = webDicts.dicts[$index];

 var caption = dict.caption
 if (caption.length > 20)
{
 caption = caption.slice(0,20) + '...'
}
 if (dict.sid == webDicts.active)        
{
buf.push('<li class="active"><a href="#"><div class="visible-sm">');
 if (dict.settings.main.fa_icon !== undefined) {
{
buf.push('<i');
buf.push(attrs({ terse: true, "class": ("fa " + (dict.settings.main.fa_icon) + "") }, {"class":true}));
buf.push('></i>');
}
 } else {
{
buf.push('<i class="fa fa-power-off"></i>');
}
 }
buf.push('</div><small class="hidden-sm">' + escape((interp = caption) == null ? '' : interp) + '</small></a></li>');
}
 else
{
buf.push('<li><a');
buf.push(attrs({ terse: true, 'href':("/dict/" + (dict.sid) + "") }, {"href":true}));
buf.push('><div class="visible-sm">');
 if (dict.settings.main.fa_icon !== undefined) {
{
buf.push('<i');
buf.push(attrs({ terse: true, "class": ("fa " + (dict.settings.main.fa_icon) + "") }, {"class":true}));
buf.push('></i>');
}
 } else {
{
buf.push('<i class="fa fa-table"></i>');
}
 }
buf.push('</div><small class="hidden-sm">' + escape((interp = caption) == null ? '' : interp) + '</small></a></li>');
}
    }

  }
}).call(this);

buf.push('</ul></div></div><div id="content" class="col-sm-11 col-lg-10">');
 var parentDict = wdicts_data[webDicts.active]
buf.push('<div class="row"><div class="col-md-12"><ul data-view="tabs" class="nav nav-pills"><li class="active"><a');
buf.push(attrs({ terse: true, 'href':("#dddd"), 'data-target-tab':("" + (parentDict.sid) + ""), 'data-toggle':("tab"), 'data-toggle-tab':("tooltip"), 'title':("" + (parentDict.sid) + "") }, {"href":true,"data-target-tab":true,"data-toggle":true,"data-toggle-tab":true,"title":true}));
buf.push('> <i');
buf.push(attrs({ terse: true, "class": ("fa fa-fw fa-lg " + (parentDict.faIcon) + "") }, {"class":true}));
buf.push('></i><div');
buf.push(attrs({ terse: true, 'data-dict-caption':("" + (parentDict.sid) + ""), "class": ('hidden-xs') + ' ' + ('hidden-sm') }, {"data-dict-caption":true}));
buf.push('>' + escape((interp = parentDict.showcaption) == null ? '' : interp) + '</div></a></li>');
// iterate parentDict.childsInfo
;(function(){
  if ('number' == typeof parentDict.childsInfo.length) {

    for (var $index = 0, $$l = parentDict.childsInfo.length; $index < $$l; $index++) {
      var childInfo = parentDict.childsInfo[$index];

 var child = wdicts_data[childInfo.wdict]
 if (child != null)
{
buf.push('<li><a');
buf.push(attrs({ terse: true, 'href':("#" + (child.sid) + ""), 'data-target-tab':("" + (child.sid) + ""), 'data-toggle':("tab"), 'data-toggle-tab':("tooltip"), 'title':("" + (child.sid) + "") }, {"href":true,"data-target-tab":true,"data-toggle":true,"data-toggle-tab":true,"title":true}));
buf.push('> <i');
buf.push(attrs({ terse: true, "class": ("fa fa-fw fa-lg " + (child.faIcon) + "") }, {"class":true}));
buf.push('></i><div');
buf.push(attrs({ terse: true, 'data-dict-caption':("" + (child.sid) + ""), "class": ('hidden-xs') + ' ' + ('hidden-sm') }, {"data-dict-caption":true}));
buf.push('>' + escape((interp = child.showcaption) == null ? '' : interp) + '</div></a></li>');
}
    }

  } else {
    var $$l = 0;
    for (var $index in parentDict.childsInfo) {
      $$l++;      var childInfo = parentDict.childsInfo[$index];

 var child = wdicts_data[childInfo.wdict]
 if (child != null)
{
buf.push('<li><a');
buf.push(attrs({ terse: true, 'href':("#" + (child.sid) + ""), 'data-target-tab':("" + (child.sid) + ""), 'data-toggle':("tab"), 'data-toggle-tab':("tooltip"), 'title':("" + (child.sid) + "") }, {"href":true,"data-target-tab":true,"data-toggle":true,"data-toggle-tab":true,"title":true}));
buf.push('> <i');
buf.push(attrs({ terse: true, "class": ("fa fa-fw fa-lg " + (child.faIcon) + "") }, {"class":true}));
buf.push('></i><div');
buf.push(attrs({ terse: true, 'data-dict-caption':("" + (child.sid) + ""), "class": ('hidden-xs') + ' ' + ('hidden-sm') }, {"data-dict-caption":true}));
buf.push('>' + escape((interp = child.showcaption) == null ? '' : interp) + '</div></a></li>');
}
    }

  }
}).call(this);

buf.push('</ul><div class="tab-content"><div');
buf.push(attrs({ terse: true, 'id':("dddd"), 'data-view':("dict"), 'data-dict-type':("parent"), 'data-dict-sid':("" + (parentDict.sid) + ""), "class": ('tab-pane') + ' ' + ('active') }, {"id":true,"data-view":true,"data-dict-type":true,"data-dict-sid":true}));
buf.push('><div data-view="insert" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-insert"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Add new record')) == null ? '' : interp) + '</h4></div><div data-type="modal-body" class="modal-body"><form role="form" data-view="form" class="form-horizontal"></form></div><div class="modal-footer"><button data-type="button" type="button" class="btn btn-success">' + escape((interp = gettext('Save new record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel new record')) == null ? '' : interp) + '</button></div></div></div></div><div data-view="edit" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-edit"><div data-view="modal-dialog" class="modal-dialog"><div class="modal-content"><div data-view="modal-header" class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Edit record')) == null ? '' : interp) + '</h4></div><div data-view="modal-body" class="modal-body"><form role="form" data-view="modal-form" class="form-horizontal"></form></div><div data-view="modal-footer" class="modal-footer"><button data-view="button" type="button" class="btn btn-success">' + escape((interp = gettext('Save edit record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel edit record')) == null ? '' : interp) + '</button></div><div data-view="modal-bottom" class="modal-body"></div></div></div></div><div data-view="delete" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-delete"><div class="modal-dialog"><div class="modal-content"><div data-view="modal-header" class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Delete record')) == null ? '' : interp) + '</h4></div><div data-view="modal-body" class="modal-body"><p>' + escape((interp = gettext('Yes or No?')) == null ? '' : interp) + '</p></div><div data-view="modal-footer" class="modal-footer"><button data-view="button" type="button" class="btn btn-danger">' + escape((interp = gettext('Delete record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel delete record')) == null ? '' : interp) + '</button></div><div data-view="modal-bottom" class="modal-body"></div></div></div></div><br><div class="row"><div class="col-md-12"><form data-view="toolbar" class="form-inline">');
 if (parentDict.toolbar.search === true)
{
buf.push('<div data-view="search" class="form-group col-xs-12 col-md-6 col-lg-4"><input');
buf.push(attrs({ terse: true, 'width':("100%"), 'type':("search"), 'placeholder':("" + (gettext('Toolbar search')) + ""), "class": ('form-control') }, {"width":true,"type":true,"placeholder":true}));
buf.push('></div>');
}
 if (parentDict.toolbar.folders === true)
{
buf.push('<div data-view="folders" class="form-group col-xs-12 col-md-3 col-lg-2"><select');
buf.push(attrs({ terse: true, 'placeholder':("" + (gettext('Toolbar folders')) + ""), "class": ('form-control') }, {"placeholder":true}));
buf.push('></select></div>');
}
 if (parentDict.toolbar.filters === true)
{
buf.push('<div data-view="filters" class="form-group col-xs-12 col-md-3 col-lg-2"><select');
buf.push(attrs({ terse: true, 'placeholder':("" + (gettext('Toolbar filters')) + ""), "class": ('form-control') }, {"placeholder":true}));
buf.push('></select></div>');
}
buf.push('<div class="form-group col-xs-6 col-md-3 col-lg-2">');
 if (parentDict.toolbar.insert === true)
{
buf.push('<a');
buf.push(attrs({ terse: true, 'href':("#"), 'data-action':("insert"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar insert')) + ""), "class": ('btn') + ' ' + ('btn-success') }, {"href":true,"data-action":true,"data-toggle":true,"title":true}));
buf.push('> <i class="fa fa-plus"></i></a>&nbsp;');
}
 if (parentDict.toolbar.remove === true)
{
buf.push('<a');
buf.push(attrs({ terse: true, 'href':("#"), 'data-action':("delete"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar remove')) + ""), "class": ('btn') + ' ' + ('btn-danger') }, {"href":true,"data-action":true,"data-toggle":true,"title":true}));
buf.push('><i class="fa fa-minus"></i></a>');
}
buf.push('</div><div class="form-group col-xs-12 col-md-3 col-lg-2"><div data-view="toolbar-units"></div></div></form></div></div><div class="row"><div class="col-md-12"><table class="table table-condensed table-striped table-hover dict"><thead><tr>');
// iterate parentDict.columns
;(function(){
  if ('number' == typeof parentDict.columns.length) {

    for (var $index = 0, $$l = parentDict.columns.length; $index < $$l; $index++) {
      var column = parentDict.columns[$index];

 if (column.visible === true)
{
buf.push('<th');
buf.push(attrs({ terse: true, "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ terse: true, 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</span></th>');
}
    }

  } else {
    var $$l = 0;
    for (var $index in parentDict.columns) {
      $$l++;      var column = parentDict.columns[$index];

 if (column.visible === true)
{
buf.push('<th');
buf.push(attrs({ terse: true, "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ terse: true, 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</span></th>');
}
    }

  }
}).call(this);

buf.push('</tr></thead><tbody></tbody></table></div></div></div>');
// iterate parentDict.childsInfo
;(function(){
  if ('number' == typeof parentDict.childsInfo.length) {

    for (var $index = 0, $$l = parentDict.childsInfo.length; $index < $$l; $index++) {
      var childInfo = parentDict.childsInfo[$index];

 var child = wdicts_data[childInfo.wdict]
 if (child != null)
{
buf.push('<div');
buf.push(attrs({ terse: true, 'id':("" + (child.sid) + ""), 'data-view':("dict"), 'data-dict-type':("child"), 'data-dict-sid':("" + (child.sid) + ""), "class": ('tab-pane') }, {"id":true,"data-view":true,"data-dict-type":true,"data-dict-sid":true}));
buf.push('><div data-view="insert" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-insert"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Add new record')) == null ? '' : interp) + '</h4></div><div data-type="modal-body" class="modal-body"><form role="form" data-view="form" class="form-horizontal"></form></div><div class="modal-footer"><button data-type="button" type="button" class="btn btn-success">' + escape((interp = gettext('Save new record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel new record')) == null ? '' : interp) + '</button></div></div></div></div><div data-view="edit" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-edit"><div data-view="modal-dialog" class="modal-dialog"><div class="modal-content"><div data-view="modal-header" class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Edit record')) == null ? '' : interp) + '</h4></div><div data-view="modal-body" class="modal-body"><form role="form" data-view="modal-form" class="form-horizontal"></form></div><div data-view="modal-footer" class="modal-footer"><button data-view="button" type="button" class="btn btn-success">' + escape((interp = gettext('Save edit record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel edit record')) == null ? '' : interp) + '</button></div><div data-view="modal-bottom" class="modal-body"></div></div></div></div><div data-view="delete" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-delete"><div class="modal-dialog"><div class="modal-content"><div data-view="modal-header" class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Delete record')) == null ? '' : interp) + '</h4></div><div data-view="modal-body" class="modal-body"><p>' + escape((interp = gettext('Yes or No?')) == null ? '' : interp) + '</p></div><div data-view="modal-footer" class="modal-footer"><button data-view="button" type="button" class="btn btn-danger">' + escape((interp = gettext('Delete record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel delete record')) == null ? '' : interp) + '</button></div><div data-view="modal-bottom" class="modal-body"></div></div></div></div><br><div class="row"><div class="col-md-12"><form data-view="toolbar" class="form-inline">');
 if (child.toolbar.search === true)
{
buf.push('<div data-view="search" class="form-group col-xs-12 col-md-6 col-lg-4"><input');
buf.push(attrs({ terse: true, 'width':("100%"), 'type':("search"), 'placeholder':("" + (gettext('Toolbar search')) + ""), "class": ('form-control') }, {"width":true,"type":true,"placeholder":true}));
buf.push('></div>');
}
 if (child.toolbar.folders === true)
{
buf.push('<div data-view="folders" class="form-group col-xs-12 col-md-3 col-lg-2"><select');
buf.push(attrs({ terse: true, 'placeholder':("" + (gettext('Toolbar folders')) + ""), "class": ('form-control') }, {"placeholder":true}));
buf.push('></select></div>');
}
 if (child.toolbar.filters === true)
{
buf.push('<div data-view="filters" class="form-group col-xs-12 col-md-3 col-lg-2"><select');
buf.push(attrs({ terse: true, 'placeholder':("" + (gettext('Toolbar filters')) + ""), "class": ('form-control') }, {"placeholder":true}));
buf.push('></select></div>');
}
buf.push('<div class="form-group col-xs-12 col-md-3 col-lg-2">');
 if (child.toolbar.insert === true)
{
buf.push('<a');
buf.push(attrs({ terse: true, 'href':("#"), 'data-action':("insert"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar insert')) + ""), "class": ('btn') + ' ' + ('btn-success') }, {"href":true,"data-action":true,"data-toggle":true,"title":true}));
buf.push('><i class="fa fa-plus"></i></a>&nbsp;');
}
 if (child.toolbar.remove === true)
{
buf.push('<a');
buf.push(attrs({ terse: true, 'href':("#"), 'data-action':("delete"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar remove')) + ""), "class": ('btn') + ' ' + ('btn-danger') }, {"href":true,"data-action":true,"data-toggle":true,"title":true}));
buf.push('><i class="fa fa-minus"></i></a>');
}
buf.push('</div></form></div></div><div class="row"><div class="col-md-12"><table class="table table-condensed table-striped table-hover dict"><thead><tr>');
// iterate child.columns
;(function(){
  if ('number' == typeof child.columns.length) {

    for (var $index = 0, $$l = child.columns.length; $index < $$l; $index++) {
      var column = child.columns[$index];

 if (column.visible === true)
{
buf.push('<th');
buf.push(attrs({ terse: true, "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ terse: true, 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</span></th>');
}
    }

  } else {
    var $$l = 0;
    for (var $index in child.columns) {
      $$l++;      var column = child.columns[$index];

 if (column.visible === true)
{
buf.push('<th');
buf.push(attrs({ terse: true, "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ terse: true, 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</span></th>');
}
    }

  }
}).call(this);

buf.push('</tr></thead><tbody></tbody></table></div></div></div>');
}
    }

  } else {
    var $$l = 0;
    for (var $index in parentDict.childsInfo) {
      $$l++;      var childInfo = parentDict.childsInfo[$index];

 var child = wdicts_data[childInfo.wdict]
 if (child != null)
{
buf.push('<div');
buf.push(attrs({ terse: true, 'id':("" + (child.sid) + ""), 'data-view':("dict"), 'data-dict-type':("child"), 'data-dict-sid':("" + (child.sid) + ""), "class": ('tab-pane') }, {"id":true,"data-view":true,"data-dict-type":true,"data-dict-sid":true}));
buf.push('><div data-view="insert" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-insert"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Add new record')) == null ? '' : interp) + '</h4></div><div data-type="modal-body" class="modal-body"><form role="form" data-view="form" class="form-horizontal"></form></div><div class="modal-footer"><button data-type="button" type="button" class="btn btn-success">' + escape((interp = gettext('Save new record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel new record')) == null ? '' : interp) + '</button></div></div></div></div><div data-view="edit" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-edit"><div data-view="modal-dialog" class="modal-dialog"><div class="modal-content"><div data-view="modal-header" class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Edit record')) == null ? '' : interp) + '</h4></div><div data-view="modal-body" class="modal-body"><form role="form" data-view="modal-form" class="form-horizontal"></form></div><div data-view="modal-footer" class="modal-footer"><button data-view="button" type="button" class="btn btn-success">' + escape((interp = gettext('Save edit record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel edit record')) == null ? '' : interp) + '</button></div><div data-view="modal-bottom" class="modal-body"></div></div></div></div><div data-view="delete" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-delete"><div class="modal-dialog"><div class="modal-content"><div data-view="modal-header" class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Delete record')) == null ? '' : interp) + '</h4></div><div data-view="modal-body" class="modal-body"><p>' + escape((interp = gettext('Yes or No?')) == null ? '' : interp) + '</p></div><div data-view="modal-footer" class="modal-footer"><button data-view="button" type="button" class="btn btn-danger">' + escape((interp = gettext('Delete record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel delete record')) == null ? '' : interp) + '</button></div><div data-view="modal-bottom" class="modal-body"></div></div></div></div><br><div class="row"><div class="col-md-12"><form data-view="toolbar" class="form-inline">');
 if (child.toolbar.search === true)
{
buf.push('<div data-view="search" class="form-group col-xs-12 col-md-6 col-lg-4"><input');
buf.push(attrs({ terse: true, 'width':("100%"), 'type':("search"), 'placeholder':("" + (gettext('Toolbar search')) + ""), "class": ('form-control') }, {"width":true,"type":true,"placeholder":true}));
buf.push('></div>');
}
 if (child.toolbar.folders === true)
{
buf.push('<div data-view="folders" class="form-group col-xs-12 col-md-3 col-lg-2"><select');
buf.push(attrs({ terse: true, 'placeholder':("" + (gettext('Toolbar folders')) + ""), "class": ('form-control') }, {"placeholder":true}));
buf.push('></select></div>');
}
 if (child.toolbar.filters === true)
{
buf.push('<div data-view="filters" class="form-group col-xs-12 col-md-3 col-lg-2"><select');
buf.push(attrs({ terse: true, 'placeholder':("" + (gettext('Toolbar filters')) + ""), "class": ('form-control') }, {"placeholder":true}));
buf.push('></select></div>');
}
buf.push('<div class="form-group col-xs-12 col-md-3 col-lg-2">');
 if (child.toolbar.insert === true)
{
buf.push('<a');
buf.push(attrs({ terse: true, 'href':("#"), 'data-action':("insert"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar insert')) + ""), "class": ('btn') + ' ' + ('btn-success') }, {"href":true,"data-action":true,"data-toggle":true,"title":true}));
buf.push('><i class="fa fa-plus"></i></a>&nbsp;');
}
 if (child.toolbar.remove === true)
{
buf.push('<a');
buf.push(attrs({ terse: true, 'href':("#"), 'data-action':("delete"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar remove')) + ""), "class": ('btn') + ' ' + ('btn-danger') }, {"href":true,"data-action":true,"data-toggle":true,"title":true}));
buf.push('><i class="fa fa-minus"></i></a>');
}
buf.push('</div></form></div></div><div class="row"><div class="col-md-12"><table class="table table-condensed table-striped table-hover dict"><thead><tr>');
// iterate child.columns
;(function(){
  if ('number' == typeof child.columns.length) {

    for (var $index = 0, $$l = child.columns.length; $index < $$l; $index++) {
      var column = child.columns[$index];

 if (column.visible === true)
{
buf.push('<th');
buf.push(attrs({ terse: true, "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ terse: true, 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</span></th>');
}
    }

  } else {
    var $$l = 0;
    for (var $index in child.columns) {
      $$l++;      var column = child.columns[$index];

 if (column.visible === true)
{
buf.push('<th');
buf.push(attrs({ terse: true, "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ terse: true, 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</span></th>');
}
    }

  }
}).call(this);

buf.push('</tr></thead><tbody></tbody></table></div></div></div>');
}
    }

  }
}).call(this);

buf.push('</div></div></div></div>');
}
}
buf.push('</div></div>');
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