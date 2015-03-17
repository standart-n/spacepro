
var _ = require('lodash');

var Str = function() {};

Str.prototype.parseKeyValueString = function(s) {
  var keys, exprs, exp, key, value;

  keys = {};

  if (s == null) {
    s = '';
  }

  s = s + ',';
  exprs = s.match(/(.*?)\,/g);

  for (var i = 0; i < exprs.length; i++) {
    exp = exprs[i];
    exp = exp.replace(',','');
    if (exp.match(/\=/)) {
      key =   exp.replace(/(.*?)\=(.*)/,'$1').trim();
      value = exp.replace(/(.*?)\=(.*)/,'$2').trim();
      if ((key != null) && (value != null)) {
        keys[key] = value;
      }
    }
  }

  return keys;
};

Str.prototype.parseStringToArray = function(s) {
  var keys, exprs, exp, value;

  keys = [];

  if (s == null) {
    s = '';
  }

  s = s + ',';
  exprs = s.match(/(.*?)\,/g);

  for (var i = 0; i < exprs.length; i++) {
    exp = exprs[i];
    exp = exp.replace(',','');
    value = exp.trim();
    keys.push(value);
  }

  return keys;
};

exports = module.exports = new Str();
