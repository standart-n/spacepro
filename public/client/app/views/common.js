
var _ =        require('_');
var Backbone = require('backbone');

var Common = Backbone.View.extend({

  initialize: function() {}

});

Common.prototype.setSearchVals = function(str, line, escape) {

  if (str == null) {
    str = '';
  }

  if (line == null) {
    line = {};
  }

  _.each(line, function(value, key) {
    var re, pattern;
    if (typeof value === 'string') {
      if (typeof escape === 'function') {
        value = escape(value.toString().trim());
      } else {
        value = "" + value.toString().trim() + "";
      }
    }
    key =      key.replace(/\$/gi, "\\$");
    pattern =  key;
    re =       new RegExp(pattern, 'ig');
    str =      str.replace(re, value);
  });

  str = str.replace(/\|\|/gi, "");
  str = str.replace(/\'\ \'/gi, " ");

  return str;
};

Common.prototype.setLineVals = function(str, line, escape) {

  if (str == null) {
    str = '';
  }

  if (line == null) {
    line = {};
  }

  _.each(line, function(value, key) {
    var re, pattern;
    if (typeof value === 'string') {
      if (typeof escape === 'function') {
        value = escape(value.toString().trim());
      } else {
        value = "'" + value.trim() + "'";
      }
    }
    key =      key.replace(/\$/gi, "\\$");
    pattern =  ':' + key;
    re =       new RegExp(pattern, 'ig');
    str =      str.replace(re, value);
  });

  return str;
};

module.exports = Common;
