
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<form role="form" data-view="form" class="form-horizontal"><div class="form-group"><div class="col-sm-6"><h4>Выбранные группы</h4>');
 var groups_active = window.parseGroupLine(value);
// iterate groups_active
;(function(){
  if ('number' == typeof groups_active.length) {

    for (var $index = 0, $$l = groups_active.length; $index < $$l; $index++) {
      var group = groups_active[$index];

buf.push('<div class="row">       <div class="col-sm-1"><span');
buf.push(attrs({ 'style':("color:#000; background-color:#" + (group.color) + ";"), "class": ('badge-group') }, {"style":true}));
buf.push('>&nbsp;</span></div><div class="col-sm-10"><a href="#" class="btn btn-xs btn-success">' + escape((interp = group.title) == null ? '' : interp) + '</a></div></div>');
    }

  } else {
    var $$l = 0;
    for (var $index in groups_active) {
      $$l++;      var group = groups_active[$index];

buf.push('<div class="row">       <div class="col-sm-1"><span');
buf.push(attrs({ 'style':("color:#000; background-color:#" + (group.color) + ";"), "class": ('badge-group') }, {"style":true}));
buf.push('>&nbsp;</span></div><div class="col-sm-10"><a href="#" class="btn btn-xs btn-success">' + escape((interp = group.title) == null ? '' : interp) + '</a></div></div>');
    }

  }
}).call(this);

buf.push('</div><div class="col-sm-6"><h4>Все группы</h4>');
// iterate groups
;(function(){
  if ('number' == typeof groups.length) {

    for (var $index = 0, $$l = groups.length; $index < $$l; $index++) {
      var group = groups[$index];

 if (group.depth > 1)
{
buf.push('<div class="row">       <div class="col-sm-1"><span');
buf.push(attrs({ 'style':("color:#000; background-color:#" + (window.colorToHex(group.color)) + ";"), "class": ('badge-group') }, {"style":true}));
buf.push('>&nbsp;</span></div><div class="col-sm-10"><a');
buf.push(attrs({ 'href':("#" + (group.id) + "_" + (group.depth) + "_" + (group.caption) + ""), "class": ('btn') + ' ' + ('btn-xs') + ' ' + ('btn-default') }, {"href":true}));
buf.push('>' + escape((interp = group.caption) == null ? '' : interp) + '</a></div></div>');
}
    }

  } else {
    var $$l = 0;
    for (var $index in groups) {
      $$l++;      var group = groups[$index];

 if (group.depth > 1)
{
buf.push('<div class="row">       <div class="col-sm-1"><span');
buf.push(attrs({ 'style':("color:#000; background-color:#" + (window.colorToHex(group.color)) + ";"), "class": ('badge-group') }, {"style":true}));
buf.push('>&nbsp;</span></div><div class="col-sm-10"><a');
buf.push(attrs({ 'href':("#" + (group.id) + "_" + (group.depth) + "_" + (group.caption) + ""), "class": ('btn') + ' ' + ('btn-xs') + ' ' + ('btn-default') }, {"href":true}));
buf.push('>' + escape((interp = group.caption) == null ? '' : interp) + '</a></div></div>');
}
    }

  }
}).call(this);

buf.push('</div><' + (value) + '></' + (value) + '></div></form>');
}
return buf.join("");
};