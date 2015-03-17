
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="sidebar-left" class="col-lg-2 col-sm-1"><div class="sidebar-nav nav-collapse collapse navbar-collapse bs-navbar-collapse"><ul class="nav nav-tabs nav-stacked main-menu">');
// iterate webDicts.dicts
;(function(){
  if ('number' == typeof webDicts.dicts.length) {

    for (var $index = 0, $$l = webDicts.dicts.length; $index < $$l; $index++) {
      var dict = webDicts.dicts[$index];

 if (dict.sid == webDicts.active)
{
buf.push('<li class="active"><a href="#"><div class="visible-sm">');
 if (dict.settings.main.fa_icon !== undefined) {
{
buf.push('<i');
buf.push(attrs({ "class": ("fa " + (dict.settings.main.fa_icon) + "") }, {"class":true}));
buf.push('></i>');
}
 } else {
{
buf.push('<i class="fa fa-power-off"></i>');
}
 }
buf.push('</div><small class="hidden-sm">' + escape((interp = dict.caption) == null ? '' : interp) + '</small></a></li>');
}
 else
{
buf.push('<li><a');
buf.push(attrs({ 'href':("/dict/" + (dict.sid) + "") }, {"href":true}));
buf.push('><div class="visible-sm">');
 if (dict.settings.main.fa_icon !== undefined) {
{
buf.push('<i');
buf.push(attrs({ "class": ("fa " + (dict.settings.main.fa_icon) + "") }, {"class":true}));
buf.push('></i>');
}
 } else {
{
buf.push('<i class="fa fa-table"></i>');
}
 }
buf.push('</div><small class="hidden-sm">' + escape((interp = dict.caption) == null ? '' : interp) + '</small></a></li>');
}
    }

  } else {
    var $$l = 0;
    for (var $index in webDicts.dicts) {
      $$l++;      var dict = webDicts.dicts[$index];

 if (dict.sid == webDicts.active)
{
buf.push('<li class="active"><a href="#"><div class="visible-sm">');
 if (dict.settings.main.fa_icon !== undefined) {
{
buf.push('<i');
buf.push(attrs({ "class": ("fa " + (dict.settings.main.fa_icon) + "") }, {"class":true}));
buf.push('></i>');
}
 } else {
{
buf.push('<i class="fa fa-power-off"></i>');
}
 }
buf.push('</div><small class="hidden-sm">' + escape((interp = dict.caption) == null ? '' : interp) + '</small></a></li>');
}
 else
{
buf.push('<li><a');
buf.push(attrs({ 'href':("/dict/" + (dict.sid) + "") }, {"href":true}));
buf.push('><div class="visible-sm">');
 if (dict.settings.main.fa_icon !== undefined) {
{
buf.push('<i');
buf.push(attrs({ "class": ("fa " + (dict.settings.main.fa_icon) + "") }, {"class":true}));
buf.push('></i>');
}
 } else {
{
buf.push('<i class="fa fa-table"></i>');
}
 }
buf.push('</div><small class="hidden-sm">' + escape((interp = dict.caption) == null ? '' : interp) + '</small></a></li>');
}
    }

  }
}).call(this);

buf.push('</ul></div></div>');
}
return buf.join("");
};