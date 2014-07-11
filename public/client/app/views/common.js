var Backbone, Common;

Backbone = require('backbone');

Common = Backbone.View.extend({

  initialize: function() {}

});

Common.prototype.setLineVals = function(str, line, escape) {
  var args;

  if (str == null) {
    str = '';
  }

  if (line == null) {
    line = {};
  }

  _.each(line, function(value, key) {
    var re, pattern, sub;
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

Common.prototype.setValsToLowerCase = function(ms) {
  var tmp = {};
  _.each(ms || {}, function(value, key) {
    tmp[key] = value.toLowerCase();
  });
  return tmp;
};

Common.prototype.setKeysToLowerCase = function(ms) {
  var tmp = {};
  _.each(ms || {}, function(value, key) {
    tmp[key.toLowerCase()] = value;
  });
  return tmp;
};

Common.prototype.cleanVals = function(new_vals) {
  var keys, vals, 
    tmp = {};

  if (!this.options) {
    this.options = {};
  }

  keys = this.options.keys || {};
  vals = this.options.vals || {};

  if ((new_vals != null) && (typeof new_vals === 'object')) {
    vals = _.extend({}, vals, new_vals);
  }

  keys =  this.setValsToLowerCase(keys);
  vals =  this.setKeysToLowerCase(vals);

  _.each(keys, function(value, key) {
    if (vals[value] != null) {
      if (typeof vals[value] === 'string') {
        tmp[value] = vals[value].trim();
      } else {
        tmp[value] = vals[value];
      }
    }
  });

  this.options.vals = tmp;

  return tmp;
};

module.exports = Common;
