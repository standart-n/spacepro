jade.templates = jade.templates || {};
jade.templates['grid'] = (function(){
  return function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="content" class="col-sm-11 col-lg-10"><div class="row"><div class="col-md-12"><ul class="nav nav-pills"><li class="active"><a href="#dddd" data-toggle="tab"> <i');
buf.push(attrs({ "class": ("fa fa-fw fa-lg " + (parentDict.faIcon) + "") }, {"class":true}));
buf.push('></i><span class="hidden-xs hidden-sm">' + escape((interp = parentDict.showcaption) == null ? '' : interp) + '</span></a></li>');
// iterate parentDict.childs
;(function(){
  if ('number' == typeof parentDict.childs.length) {

    for (var $index = 0, $$l = parentDict.childs.length; $index < $$l; $index++) {
      var child = parentDict.childs[$index];

buf.push('<li><a');
buf.push(attrs({ 'href':("#" + (child.sid) + ""), 'data-toggle':("tab") }, {"href":true,"data-toggle":true}));
buf.push('> <i');
buf.push(attrs({ "class": ("fa fa-fw fa-lg " + (child.faIcon) + "") }, {"class":true}));
buf.push('></i><span class="hidden-xs hidden-sm">' + escape((interp = child.showcaption) == null ? '' : interp) + '</span></a></li>');
    }

  } else {
    var $$l = 0;
    for (var $index in parentDict.childs) {
      $$l++;      var child = parentDict.childs[$index];

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
buf.push('><div data-view="insert" data-type="modal" role="dialog" tabindex="-1" class="modal fade dict-insert"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-hidden="true" class="close">&times;     </button><h4 class="modal-title">' + escape((interp = gettext('Add new record')) == null ? '' : interp) + '</h4></div><div data-type="modal-body" class="modal-body"><form role="form" data-view="form" class="form-horizontal"></form></div><div class="modal-footer"><button data-type="button" type="button" disabled="disabled" class="btn btn-success">' + escape((interp = gettext('Save new record')) == null ? '' : interp) + '</button><button type="button" data-dismiss="modal" class="btn btn-default">' + escape((interp = gettext('Cancel new record')) == null ? '' : interp) + '</button></div></div></div></div><br/><div class="row"><div class="col-md-12"><form data-view="search" class="form-inline">');
 if (parentDict.toolbar.search === true)
{
buf.push('<div class="form-group col-xs-12 col-md-6 col-lg-4"><input');
buf.push(attrs({ 'width':("100%"), 'type':("search"), 'placeholder':("" + (gettext('Toolbar search')) + ""), "class": ('form-control') }, {"width":true,"type":true,"placeholder":true}));
buf.push('/></div>');
}
 if (parentDict.toolbar.insert === true)
{
buf.push('<a href="#" data-action="insert" class="btn btn-success"> <i class="fa fa-plus"></i>&nbsp;<span>' + escape((interp = gettext('Toolbar insert')) == null ? '' : interp) + '</span></a>');
}
 if (parentDict.toolbar.remove === true)
{
buf.push('&nbsp;<a href="#" data-action="delete_many" class="btn btn-danger"> <i class="fa fa-minus"></i>&nbsp;<span>' + escape((interp = gettext('Toolbar remove')) == null ? '' : interp) + '</span></a>');
}
buf.push('</form></div></div><div class="row"><div class="col-md-12"><table class="table table-condensed table-striped table-hover dict"><thead><tr><th></th>');
// iterate parentDict.columns
;(function(){
  if ('number' == typeof parentDict.columns.length) {

    for (var $index = 0, $$l = parentDict.columns.length; $index < $$l; $index++) {
      var column = parentDict.columns[$index];

buf.push('<th');
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</th>');
    }

  } else {
    var $$l = 0;
    for (var $index in parentDict.columns) {
      $$l++;      var column = parentDict.columns[$index];

buf.push('<th');
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</th>');
    }

  }
}).call(this);

buf.push('<th></th></tr></thead><tbody></tbody></table></div></div></div>');
// iterate parentDict.childs
;(function(){
  if ('number' == typeof parentDict.childs.length) {

    for (var $index = 0, $$l = parentDict.childs.length; $index < $$l; $index++) {
      var child = parentDict.childs[$index];

buf.push('<div');
buf.push(attrs({ 'id':("" + (child.sid) + ""), 'data-view':("dict"), 'data-dict-type':("child"), 'data-dict-sid':("" + (child.sid) + ""), "class": ('tab-pane') }, {"id":true,"data-view":true,"data-dict-type":true,"data-dict-sid":true}));
buf.push('><br/><div class="row"><div class="col-md-12"><form data-view="search" class="form-inline">');
 if (child.toolbar.search === true)
{
buf.push('<div class="form-group col-xs-12 col-md-6 col-lg-4"><input type="search" placeholder="search" class="form-control"/></div>');
}
 if (child.toolbar.insert === true)
{
buf.push('<a href="#" class="btn btn-success"> <i class="fa fa-plus"></i>&nbsp;<span>Добавить</span></a>');
}
 if (child.toolbar.remove === true)
{
buf.push('&nbsp;<a href="#" class="btn btn-danger"> <i class="fa fa-minus"></i>&nbsp;<span>Удалить</span></a>');
}
buf.push('</form></div></div><div class="row"><div class="col-md-12"><table class="table table-condensed table-striped table-hover dict"><thead><tr><th></th>');
// iterate child.columns
;(function(){
  if ('number' == typeof child.columns.length) {

    for (var $index = 0, $$l = child.columns.length; $index < $$l; $index++) {
      var column = child.columns[$index];

buf.push('<th');
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</th>');
    }

  } else {
    var $$l = 0;
    for (var $index in child.columns) {
      $$l++;      var column = child.columns[$index];

buf.push('<th');
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</th>');
    }

  }
}).call(this);

buf.push('<th></th></tr></thead><tbody></tbody></table></div></div></div>');
    }

  } else {
    var $$l = 0;
    for (var $index in parentDict.childs) {
      $$l++;      var child = parentDict.childs[$index];

buf.push('<div');
buf.push(attrs({ 'id':("" + (child.sid) + ""), 'data-view':("dict"), 'data-dict-type':("child"), 'data-dict-sid':("" + (child.sid) + ""), "class": ('tab-pane') }, {"id":true,"data-view":true,"data-dict-type":true,"data-dict-sid":true}));
buf.push('><br/><div class="row"><div class="col-md-12"><form data-view="search" class="form-inline">');
 if (child.toolbar.search === true)
{
buf.push('<div class="form-group col-xs-12 col-md-6 col-lg-4"><input type="search" placeholder="search" class="form-control"/></div>');
}
 if (child.toolbar.insert === true)
{
buf.push('<a href="#" class="btn btn-success"> <i class="fa fa-plus"></i>&nbsp;<span>Добавить</span></a>');
}
 if (child.toolbar.remove === true)
{
buf.push('&nbsp;<a href="#" class="btn btn-danger"> <i class="fa fa-minus"></i>&nbsp;<span>Удалить</span></a>');
}
buf.push('</form></div></div><div class="row"><div class="col-md-12"><table class="table table-condensed table-striped table-hover dict"><thead><tr><th></th>');
// iterate child.columns
;(function(){
  if ('number' == typeof child.columns.length) {

    for (var $index = 0, $$l = child.columns.length; $index < $$l; $index++) {
      var column = child.columns[$index];

buf.push('<th');
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</th>');
    }

  } else {
    var $$l = 0;
    for (var $index in child.columns) {
      $$l++;      var column = child.columns[$index];

buf.push('<th');
buf.push(attrs({ "class": ("" + (column.hidden_class) + "") }, {"class":true}));
buf.push('>' + escape((interp = column.caption) == null ? '' : interp) + '</th>');
    }

  }
}).call(this);

buf.push('<th></th></tr></thead><tbody></tbody></table></div></div></div>');
    }

  }
}).call(this);

buf.push('</div></div></div></div>');
}
return buf.join("");
};
})();