
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<tr');
buf.push(attrs({ 'data-uuid':("" + (line[keyfieldname]) + "") }, {"data-uuid":true}));
buf.push('>');
// iterate columns
;(function(){
  if ('number' == typeof columns.length) {

    for (var $index = 0, $$l = columns.length; $index < $$l; $index++) {
      var column = columns[$index];

 if (column.field)
{
 var value = line[column.field] || ''
 if (column.visible === true)
{
 if (value.toString().match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/))
{
buf.push('<td');
buf.push(attrs({ 'data-col-field':("" + (column.field) + ""), 'data-col-type':("date"), "class": ("" + (column.class_properties) + "") }, {"class":true,"data-col-field":true,"data-col-type":true}));
buf.push('><span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (moment(value).fromNow()) + "") }, {"data-toggle":true,"title":true}));
buf.push('><span>' + escape((interp = moment(value).format('DD.MM.YYYY')) == null ? '' : interp) + '</span>&nbsp;<small>' + escape((interp = moment(value).format('HH:mm')) == null ? '' : interp) + '</small></span></td>');
}
 else
{
 if (value.toString().match(/-?\d+\=\{\d+\|-?\d+\}[а-яА-Я\w ]*/i))
{
buf.push('<td');
buf.push(attrs({ 'data-col-field':("" + (column.field) + ""), 'data-col-type':("groups"), "class": ("" + (column.class_properties) + "") }, {"class":true,"data-col-field":true,"data-col-type":true}));
buf.push('>');
 var groups = window.parseGroupLine(value);
// iterate groups
;(function(){
  if ('number' == typeof groups.length) {

    for (var $index = 0, $$l = groups.length; $index < $$l; $index++) {
      var group = groups[$index];

buf.push('<span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (group.caption) + ""), 'style':("color:#000; background-color:#" + (group.hex) + ";"), "class": ('badge-group') }, {"data-toggle":true,"title":true,"style":true}));
buf.push('>&nbsp;</span>');
    }

  } else {
    var $$l = 0;
    for (var $index in groups) {
      $$l++;      var group = groups[$index];

buf.push('<span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (group.caption) + ""), 'style':("color:#000; background-color:#" + (group.hex) + ";"), "class": ('badge-group') }, {"data-toggle":true,"title":true,"style":true}));
buf.push('>&nbsp;</span>');
    }

  }
}).call(this);

buf.push('</td>');
}
 else
{
buf.push('<td');
buf.push(attrs({ 'data-col-field':("" + (column.field) + ""), 'data-col-type':("text"), "class": ("" + (column.class_properties) + "") }, {"class":true,"data-col-field":true,"data-col-type":true}));
buf.push('>');
 if (value.length > 103)
{
buf.push('<span>' + escape((interp = value.slice(0, 100)) == null ? '' : interp) + '<b>...</b></span>');
}
 else
{
buf.push('' + escape((interp = value) == null ? '' : interp) + '');
}
buf.push('</td>');
}
}
}
}
 else             
{
buf.push('<td');
buf.push(attrs({ 'data-col-field':("" + (column.field) + ""), 'data-col-type':("text") }, {"data-col-field":true,"data-col-type":true}));
buf.push('></td>');
}
    }

  } else {
    var $$l = 0;
    for (var $index in columns) {
      $$l++;      var column = columns[$index];

 if (column.field)
{
 var value = line[column.field] || ''
 if (column.visible === true)
{
 if (value.toString().match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/))
{
buf.push('<td');
buf.push(attrs({ 'data-col-field':("" + (column.field) + ""), 'data-col-type':("date"), "class": ("" + (column.class_properties) + "") }, {"class":true,"data-col-field":true,"data-col-type":true}));
buf.push('><span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (moment(value).fromNow()) + "") }, {"data-toggle":true,"title":true}));
buf.push('><span>' + escape((interp = moment(value).format('DD.MM.YYYY')) == null ? '' : interp) + '</span>&nbsp;<small>' + escape((interp = moment(value).format('HH:mm')) == null ? '' : interp) + '</small></span></td>');
}
 else
{
 if (value.toString().match(/-?\d+\=\{\d+\|-?\d+\}[а-яА-Я\w ]*/i))
{
buf.push('<td');
buf.push(attrs({ 'data-col-field':("" + (column.field) + ""), 'data-col-type':("groups"), "class": ("" + (column.class_properties) + "") }, {"class":true,"data-col-field":true,"data-col-type":true}));
buf.push('>');
 var groups = window.parseGroupLine(value);
// iterate groups
;(function(){
  if ('number' == typeof groups.length) {

    for (var $index = 0, $$l = groups.length; $index < $$l; $index++) {
      var group = groups[$index];

buf.push('<span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (group.caption) + ""), 'style':("color:#000; background-color:#" + (group.hex) + ";"), "class": ('badge-group') }, {"data-toggle":true,"title":true,"style":true}));
buf.push('>&nbsp;</span>');
    }

  } else {
    var $$l = 0;
    for (var $index in groups) {
      $$l++;      var group = groups[$index];

buf.push('<span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (group.caption) + ""), 'style':("color:#000; background-color:#" + (group.hex) + ";"), "class": ('badge-group') }, {"data-toggle":true,"title":true,"style":true}));
buf.push('>&nbsp;</span>');
    }

  }
}).call(this);

buf.push('</td>');
}
 else
{
buf.push('<td');
buf.push(attrs({ 'data-col-field':("" + (column.field) + ""), 'data-col-type':("text"), "class": ("" + (column.class_properties) + "") }, {"class":true,"data-col-field":true,"data-col-type":true}));
buf.push('>');
 if (value.length > 103)
{
buf.push('<span>' + escape((interp = value.slice(0, 100)) == null ? '' : interp) + '<b>...</b></span>');
}
 else
{
buf.push('' + escape((interp = value) == null ? '' : interp) + '');
}
buf.push('</td>');
}
}
}
}
 else             
{
buf.push('<td');
buf.push(attrs({ 'data-col-field':("" + (column.field) + ""), 'data-col-type':("text") }, {"data-col-field":true,"data-col-type":true}));
buf.push('></td>');
}
    }

  }
}).call(this);

buf.push('</tr>');
}
return buf.join("");
};