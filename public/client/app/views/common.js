var Backbone, Common;

Backbone = require('backbone');

Common = Backbone.View.extend({

  initialize: function() {}

});

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

  keys = this.keys || {};
  vals = this.vals || {};

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

  return tmp;
};

module.exports = Common;
