
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="content" class="col-sm-11 col-lg-10">');
 var parentDict = wdicts_data[webDicts.active]
buf.push('<div class="row"><div class="col-md-12"><ul class="nav nav-pills"><li class="active"><a href="#dddd" data-toggle="tab"> <i');
buf.push(attrs({ "class": ("fa fa-fw fa-lg " + (parentDict.faIcon) + "") }, {"class":true}));
buf.push('></i><span class="hidden-xs hidden-sm">' + escape((interp = parentDict.showcaption) == null ? '' : interp) + '</span></a></li>');
// iterate parentDict.childsInfo
;(function(){
  if ('number' == typeof parentDict.childsInfo.length) {

    for (var $index = 0, $$l = parentDict.childsInfo.length; $index < $$l; $index++) {
      var childInfo = parentDict.childsInfo[$index];

 var child = wdicts_data[childInfo.wdict]
buf.push('<li><a');
buf.push(attrs({ 'href':("#" + (child.sid) + ""), 'data-toggle':("tab") }, {"href":true,"data-toggle":true}));
buf.push('> <i');
buf.push(attrs({ "class": ("fa fa-fw fa-lg " + (child.faIcon) + "") }, {"class":true}));
buf.push('></i><span class="hidden-xs hidden-sm">' + escape((interp = child.showcaption) == null ? '' : interp) + '</span></a></li>');
    }

  } else {
    var $$l = 0;
    for (var $index in parentDict.childsInfo) {
      $$l++;      var childInfo = parentDict.childsInfo[$index];

 var child = wdicts_data[childInfo.wdict]
buf.push('<li><a');
buf.push(attrs({ 'href':("#" + (child.sid) + ""), 'data-toggle':("tab") }, {"href":true,"data-toggle":true}));
buf.push('> <i');
buf.push(attrs({ "class": ("fa fa-fw fa-lg " + (child.faIcon) + "") }, {"class":true}));
buf.push('></i><span class="hidden-xs hidden-sm">' + escape((interp = child.showcaption) == null ? '' : interp) + '</span></a></li>');
    }

  }
}).call(this);

buf.push('</ul><div class="tab-content"><div');
buf.push(attrs({ 'id':("dddd"), 'data-view':("dict"), 'data-dict-type':("parent"), 'data-dict-sid':("" + (parentDict.sid) + ""), "class": ('tab-pane') + ' ' + ('active') }, {"id":true,"data-view":true,"data-dict-type":true,"data-dict-sid":true}));
buf.push('><div data-view="insert" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-insert"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Add new record')) == null ? '' : interp) + '</h4></div><div data-type="modal-body" class="modal-body"><form role="form" data-view="form" class="form-horizontal"></form></div><div class="modal-footer"><button data-type="button" type="button" disabled="disabled" class="btn btn-success">' + escape((interp = gettext('Save new record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel new record')) == null ? '' : interp) + '</button></div></div></div></div><br/><div class="row"><div class="col-md-12"><form data-view="toolbar" class="form-inline">');
 if (parentDict.toolbar.search === true)
{
buf.push('<div data-view="search" class="form-group col-xs-12 col-md-6 col-lg-4"><input');
buf.push(attrs({ 'width':("100%"), 'type':("search"), 'placeholder':("" + (gettext('Toolbar search')) + ""), "class": ('form-control') }, {"width":true,"type":true,"placeholder":true}));
buf.push('/></div>');
}
 if (parentDict.toolbar.folders === true)
{
buf.push('<div data-view="folders" class="form-group col-xs-12 col-md-6 col-lg-4"><select');
buf.push(attrs({ 'placeholder':("" + (gettext('Toolbar folders')) + ""), "class": ('form-control') }, {"placeholder":true}));
buf.push('></select></div>');
}
 if (parentDict.toolbar.insert === true)
{
buf.push('<a');
buf.push(attrs({ 'href':("#"), 'data-action':("insert"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar insert')) + ""), "class": ('btn') + ' ' + ('btn-success') }, {"href":true,"data-action":true,"data-toggle":true,"title":true}));
buf.push('> <i class="fa fa-plus"></i></a>');
}
 if (parentDict.toolbar.remove === true)
{
buf.push('&nbsp;<a');
buf.push(attrs({ 'href':("#"), 'data-action':("delete_many"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar remove')) + ""), "class": ('btn') + ' ' + ('btn-danger') }, {"href":true,"data-action":true,"data-toggle":true,"title":true}));
buf.push('><i class="fa fa-minus"></i></a>');
}
buf.push('</form></div></div><div class="row"><div class="col-md-12"><table class="table table-condensed table-striped table-hover dict"><thead><tr><th></th>');
// iterate parentDict.columns
;(function(){
  if ('number' == typeof parentDict.columns.length) {

    for (var $index = 0, $$l = parentDict.columns.length; $index < $$l; $index++) {
      var column = parentDict.columns[$index];

 if (column.visible === true)
{
buf.push('<th');
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
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
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
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
buf.push('<div');
buf.push(attrs({ 'id':("" + (child.sid) + ""), 'data-view':("dict"), 'data-dict-type':("child"), 'data-dict-sid':("" + (child.sid) + ""), "class": ('tab-pane') }, {"id":true,"data-view":true,"data-dict-type":true,"data-dict-sid":true}));
buf.push('><br/><div class="row"><div class="col-md-12"><form data-view="toolbar" class="form-inline">');
 if (child.toolbar.search === true)
{
buf.push('<div data-view="search" class="form-group col-xs-12 col-md-6 col-lg-4"><input');
buf.push(attrs({ 'width':("100%"), 'type':("search"), 'placeholder':("" + (gettext('Toolbar search')) + ""), "class": ('form-control') }, {"width":true,"type":true,"placeholder":true}));
buf.push('/></div>');
}
 if (child.toolbar.folders === true)
{
buf.push('<div data-view="folders" class="form-group col-xs-12 col-md-3 col-lg-2"><select');
buf.push(attrs({ 'placeholder':("" + (gettext('Toolbar folders')) + ""), "class": ('form-control') }, {"placeholder":true}));
buf.push('></select></div>');
}
 if (child.toolbar.insert === true)
{
buf.push('<a');
buf.push(attrs({ 'href':("#"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar insert')) + ""), "class": ('btn') + ' ' + ('btn-success') }, {"href":true,"data-toggle":true,"title":true}));
buf.push('><i class="fa fa-plus"></i></a>');
}
 if (child.toolbar.remove === true)
{
buf.push('&nbsp;<a');
buf.push(attrs({ 'href':("#"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar remove')) + ""), "class": ('btn') + ' ' + ('btn-danger') }, {"href":true,"data-toggle":true,"title":true}));
buf.push('><i class="fa fa-minus"></i></a>');
}
buf.push('</form></div></div><div class="row"><div class="col-md-12"><table class="table table-condensed table-striped table-hover dict"><thead><tr><th></th>');
// iterate child.columns
;(function(){
  if ('number' == typeof child.columns.length) {

    for (var $index = 0, $$l = child.columns.length; $index < $$l; $index++) {
      var column = child.columns[$index];

 if (column.visible === true)
{
buf.push('<th');
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
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
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</span></th>');
}
    }

  }
}).call(this);

buf.push('</tr></thead><tbody></tbody></table></div></div></div>');
    }

  } else {
    var $$l = 0;
    for (var $index in parentDict.childsInfo) {
      $$l++;      var childInfo = parentDict.childsInfo[$index];

 var child = wdicts_data[childInfo.wdict]
buf.push('<div');
buf.push(attrs({ 'id':("" + (child.sid) + ""), 'data-view':("dict"), 'data-dict-type':("child"), 'data-dict-sid':("" + (child.sid) + ""), "class": ('tab-pane') }, {"id":true,"data-view":true,"data-dict-type":true,"data-dict-sid":true}));
buf.push('><br/><div class="row"><div class="col-md-12"><form data-view="toolbar" class="form-inline">');
 if (child.toolbar.search === true)
{
buf.push('<div data-view="search" class="form-group col-xs-12 col-md-6 col-lg-4"><input');
buf.push(attrs({ 'width':("100%"), 'type':("search"), 'placeholder':("" + (gettext('Toolbar search')) + ""), "class": ('form-control') }, {"width":true,"type":true,"placeholder":true}));
buf.push('/></div>');
}
 if (child.toolbar.folders === true)
{
buf.push('<div data-view="folders" class="form-group col-xs-12 col-md-3 col-lg-2"><select');
buf.push(attrs({ 'placeholder':("" + (gettext('Toolbar folders')) + ""), "class": ('form-control') }, {"placeholder":true}));
buf.push('></select></div>');
}
 if (child.toolbar.insert === true)
{
buf.push('<a');
buf.push(attrs({ 'href':("#"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar insert')) + ""), "class": ('btn') + ' ' + ('btn-success') }, {"href":true,"data-toggle":true,"title":true}));
buf.push('><i class="fa fa-plus"></i></a>');
}
 if (child.toolbar.remove === true)
{
buf.push('&nbsp;<a');
buf.push(attrs({ 'href':("#"), 'data-toggle':("tooltip"), 'title':("" + (gettext('Toolbar remove')) + ""), "class": ('btn') + ' ' + ('btn-danger') }, {"href":true,"data-toggle":true,"title":true}));
buf.push('><i class="fa fa-minus"></i></a>');
}
buf.push('</form></div></div><div class="row"><div class="col-md-12"><table class="table table-condensed table-striped table-hover dict"><thead><tr><th></th>');
// iterate child.columns
;(function(){
  if ('number' == typeof child.columns.length) {

    for (var $index = 0, $$l = child.columns.length; $index < $$l; $index++) {
      var column = child.columns[$index];

 if (column.visible === true)
{
buf.push('<th');
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
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
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('><span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (column.field) + "") }, {"data-toggle":true,"title":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</span></th>');
}
    }

  }
}).call(this);

buf.push('</tr></thead><tbody></tbody></table></div></div></div>');
    }

  }
}).call(this);

buf.push('</div></div></div></div>');
}
return buf.join("");
};