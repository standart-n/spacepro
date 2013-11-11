
var _, async, Backbone, Sqlmaster;

_ =          require('lodash');
Backbone =   require('backbone');

Sqlmaster = Backbone.Model.extend({

  defaults: function() {
    return {
      keys: {}
    };
  },
 
  initialize: function() {

  },

  parseString: function(s) {
    var keys, exprs, exp, key, value;

    keys = this.get('keys') || {};

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

    this.set('keys', keys);
    return keys;
  },

  setParams: function(sql, local) {
    var keys, vals, re, pattern, ms, sub;

    keys = this.get('keys') || {};
    vals = this.get('vals') || {};

    if (sql == null) {
      sql = this.get('sql') || '';
    }

    if (local == null) {
      local = {};
    }

    keys =  this.setValsToLowerCase(keys);
    vals =  this.setKeysToLowerCase(vals);
    local = this.setKeysToLowerCase(local);

    vals = _.extend({}, vals, local);

    _.each(keys, function(value, key) {
      if (vals[value] != null) {
        sub = vals[value];
        if (typeof sub === 'string') {
          sub = "'" + sub.trim() + "'";
        }
        value =    value.toLowerCase();
        pattern =  ':' + key;
        re =       new RegExp(pattern, 'ig');
        sql =      sql.replace(re, sub);
      }
    });

    return sql;
  },

  setValsToLowerCase: function(ms) {
    var tmp = {};

    _.each(ms || {}, function(value, key) {
      tmp[key] = value.toLowerCase();
    });

    return tmp;
  },

  setKeysToLowerCase: function(ms) {
    var tmp = {};

    _.each(ms || {}, function(value, key) {
      tmp[key.toLowerCase()] = value;
    });

    return tmp;
  }


});

exports = module.exports = Sqlmaster;
