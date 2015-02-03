jade.templates = jade.templates || {};
jade.templates['head'] = (function(){
  return function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<title>' + escape((interp = title) == null ? '' : interp) + '</title><base href="/"/><meta');
buf.push(attrs({ 'name':("description"), 'content':("" + (description) + "") }, {"name":true,"content":true}));
buf.push('/><meta');
buf.push(attrs({ 'name':("keywords"), 'content':("" + (keywords) + "") }, {"name":true,"content":true}));
buf.push('/><meta name="Revesit" content="3"/><meta name="Document-state" content="Dynamic"/><meta');
buf.push(attrs({ 'name':("Copyright"), 'Lang':("eng"), 'content':("2013 " + (author) + "") }, {"name":true,"Lang":true,"content":true}));
buf.push('/><meta');
buf.push(attrs({ 'name':("Copyright"), 'Lang':("ru"), 'content':("2013 " + (author) + "") }, {"name":true,"Lang":true,"content":true}));
buf.push('/><meta name="robots" content="all"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><meta');
buf.push(attrs({ 'http-equiv':("Content-Language"), 'content':("" + (lang) + "") }, {"http-equiv":true,"content":true}));
buf.push('/><meta http-equiv="Content-Type" content="text/html; charset = utf-8"/>');
 css.forEach(function(file){
{
buf.push('<link');
buf.push(attrs({ 'href':("css/" + (file) + ""), 'rel':("stylesheet"), 'type':("text/css") }, {"href":true,"rel":true,"type":true}));
buf.push('/>');
}
 })
}
return buf.join("");
};
})();