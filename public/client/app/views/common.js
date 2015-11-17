
var _ =        require('_');
var Backbone = require('backbone');

var Common = Backbone.View.extend({

  initialize: function() {}

});

Common.prototype.parseDictOptions = function(s) {
  var res = {};
  var options = s.toString().split(',') || [];
  _.each(options, function(vals) {
    var key, value;
    if (vals.match(/\=/)) {
      key =   vals.replace(/(.*)\=(.*)/,'$1');
      value = vals.replace(/(.*)\=(.*)/,'$2');
      res[key] = value;
    }
  });
  return res;
};

// Common.prototype.getUnits = function(conf) {
//   var units = {};
//   if (window.units) {
//     if (window.units[conf.sid]) {
//       _.each(window.units[conf.sid], function(unit) {
//         var resource = require(unit);
//         units[unit] = new resource({
//           el:   conf.el,
//           conf: conf
//         });
//       });
//     }
//   }
//   this.units = units;
// };

// Common.prototype.checkUnits = function(field, type) {
//   var _this = this;
//   var units = [];

//   if (type == null) {
//     type = 'editfields';
//   }

//   _.each(this.units || {}, function(unit, name) {
//     if (unit[type]) {
//       if (_.indexOf(unit[type], field) > -1){
//         if (typeof (unit.onEdit) !== null) {
//           units.push(name);
//         }
//       }
//     } 
//   });
//   return units;
// };

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

Common.prototype.setCaptionVals = function(str, line) {

  if (str == null) {
    str = '';
  }

  if (line == null) {
    line = {};
  }

  _.each(line, function(value, key) {
    var re, pattern;
    value =    value.toString().trim();
    key =      key.replace(/\$/gi, "\\$");
    pattern =  ':' + key + ':';
    re =       new RegExp(pattern, 'ig');
    if (str.match(re)) {
      if (value.length > 10) {
        value = '<b>' + value.slice(0, 10) + '</b>...';
      } else {
        value = '<b>' + value + '</b>';
      }
      str = str.replace(re, value);
    }
  });
  str = str.replace(/\"\"/g, '"');
  str = str.replace(/\"<b>\"/g, '"<b>');
  return str;
};


module.exports = Common;
