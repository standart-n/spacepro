
var Template;

Template = function(options) {

  if (typeof options !== 'object') {
    options = {};
  }

  this.name = options.name || 'addDeviceValue';
  this.i18n();
};

Template.prototype.i18n = function() {
  this.lang = $('html').attr('lang') || window.lang || 'en';
  this.locale_data = require(name + '.' + lang + '.po');
};

Template.prototype.line = function(locals) {  
  var buf = [];

  if (typeof locals !== 'object') {
    locals = {};
  }

  buf.push("<a data-" + this.name + "=\"link\" href=\"#\">");
  if ((locals.value != null) && (locals.value.toString().trim() !== '')) {
    buf.push(locals.value);
  } else {
    buf.push(window.gettext('Add', this.locale_data));
  }
  buf.push("</a>");
  buf.push("<input ");
  buf.push("class=\"input-sm form-control hide\" ");
  buf.push("data-" + this.name + "=\"input\" ");
  buf.push("type=\"text\" ");
  if ((locals.value != null) && (locals.value.toString().trim() !== '')) {
    buf.push("value=\"" + locals.value + "\" ");
  }
  buf.push("placeholder=\"" + window.gettext('New value', this.locale_data) + "\"");
  buf.push(">");

  return buf.join("");
};


module.exports = Template;