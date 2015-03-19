
module.exports = function (locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<tr');
buf.push(attrs({ 'data-uuid':("" + (line[keyfieldname]) + "") }, {"data-uuid":true}));
buf.push('><td><label><input type="checkbox"/></label></td>');
// iterate columns
;(function(){
  if ('number' == typeof columns.length) {

    for (var $index = 0, $$l = columns.length; $index < $$l; $index++) {
      var column = columns[$index];

 if (column.visible === true)
{
buf.push('<td');
buf.push(attrs({ 'data-col-field':("" + (column.field) + ""), "class": ("" + (column.hidden_class) + "") }, {"class":true,"data-col-field":true}));
buf.push('>');
 if ((line[column.field] != null) && (line[column.field] !== ''))        
{
 if (line[column.field].toString().match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/))
{
buf.push('<span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (moment(line[column.field]).fromNow()) + "") }, {"data-toggle":true,"title":true}));
buf.push('><span>' + escape((interp = moment(line[column.field]).format('DD.MM.YYYY')) == null ? '' : interp) + '</span>&nbsp;<small>' + escape((interp = moment(line[column.field]).format('HH:mm')) == null ? '' : interp) + '</small></span>');
}
 else
{
 if (line[column.field].toString().match(/-?\d+\=\{\d+\|-?\d+\}[а-яА-Я\w ]*/i))
{
 var groups = window.parseGroupLine(line[column.field]);
// iterate groups
;(function(){
  if ('number' == typeof groups.length) {

    for (var $index = 0, $$l = groups.length; $index < $$l; $index++) {
      var group = groups[$index];

buf.push('<span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (group.title) + ""), 'style':("color:#000; background-color:#" + (group.color) + ";"), "class": ('badge') }, {"data-toggle":true,"title":true,"style":true}));
buf.push('>&nbsp;</span>');
    }

  } else {
    var $$l = 0;
    for (var $index in groups) {
      $$l++;      var group = groups[$index];

buf.push('<span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (group.title) + ""), 'style':("color:#000; background-color:#" + (group.color) + ";"), "class": ('badge') }, {"data-toggle":true,"title":true,"style":true}));
buf.push('>&nbsp;</span>');
    }

  }
}).call(this);

}
 else
{
 if (line[column.field].length > 103)
{
buf.push('<span>' + escape((interp = line[column.field].slice(0, 100)) == null ? '' : interp) + '<b>...</b></span>');
}
 else              
{
buf.push('' + escape((interp = line[column.field]) == null ? '' : interp) + '');
}
}
}
}
buf.push('</td>');
}
    }

  } else {
    var $$l = 0;
    for (var $index in columns) {
      $$l++;      var column = columns[$index];

 if (column.visible === true)
{
buf.push('<td');
buf.push(attrs({ 'data-col-field':("" + (column.field) + ""), "class": ("" + (column.hidden_class) + "") }, {"class":true,"data-col-field":true}));
buf.push('>');
 if ((line[column.field] != null) && (line[column.field] !== ''))        
{
 if (line[column.field].toString().match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/))
{
buf.push('<span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (moment(line[column.field]).fromNow()) + "") }, {"data-toggle":true,"title":true}));
buf.push('><span>' + escape((interp = moment(line[column.field]).format('DD.MM.YYYY')) == null ? '' : interp) + '</span>&nbsp;<small>' + escape((interp = moment(line[column.field]).format('HH:mm')) == null ? '' : interp) + '</small></span>');
}
 else
{
 if (line[column.field].toString().match(/-?\d+\=\{\d+\|-?\d+\}[а-яА-Я\w ]*/i))
{
 var groups = window.parseGroupLine(line[column.field]);
// iterate groups
;(function(){
  if ('number' == typeof groups.length) {

    for (var $index = 0, $$l = groups.length; $index < $$l; $index++) {
      var group = groups[$index];

buf.push('<span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (group.title) + ""), 'style':("color:#000; background-color:#" + (group.color) + ";"), "class": ('badge') }, {"data-toggle":true,"title":true,"style":true}));
buf.push('>&nbsp;</span>');
    }

  } else {
    var $$l = 0;
    for (var $index in groups) {
      $$l++;      var group = groups[$index];

buf.push('<span');
buf.push(attrs({ 'data-toggle':("tooltip"), 'title':("" + (group.title) + ""), 'style':("color:#000; background-color:#" + (group.color) + ";"), "class": ('badge') }, {"data-toggle":true,"title":true,"style":true}));
buf.push('>&nbsp;</span>');
    }

  }
}).call(this);

}
 else
{
 if (line[column.field].length > 103)
{
buf.push('<span>' + escape((interp = line[column.field].slice(0, 100)) == null ? '' : interp) + '<b>...</b></span>');
}
 else              
{
buf.push('' + escape((interp = line[column.field]) == null ? '' : interp) + '');
}
}
}
}
buf.push('</td>');
}
    }

  }
}).call(this);

buf.push('</tr>');
}
return buf.join("");
};