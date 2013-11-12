
var _, async, Backbone, Sqlmaster;

_ =          require('lodash');
Backbone =   require('backbone');

Sqlmaster = Backbone.Model.extend({

  defaults: function() {
    return {
      keys: {},
      vals: {},
      sql:  ''
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
    var args, keys, vals, re, pattern, ms, sub;

    keys = this.get('keys') || {};
    vals = this.get('vals') || {};

    args = _.toArray(arguments);
    switch (args.length) {
      case 0:
        sql =    this.get('sql') || '';
        local =  {};
      break;
      case 1:
        sql =    args[0];
        local =  {};
      break;
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
  },

  extVals: function(new_vals, clean) {
    var vals;

    if (clean == null) {
      clean = false;
    }

    if (typeof new_vals === 'object') {
      vals = this.get('vals') || {};
      this.set('vals', _.extend({}, vals, new_vals));
      if (clean) {
        this.clean();
      }
    }
    return this.get('vals') || {};
  },

  clean: function() {
    var keys, vals, 
      tmp = {};

    keys = this.get('keys') || {};
    vals = this.get('vals') || {};

    keys =  this.setValsToLowerCase(keys);
    vals =  this.setKeysToLowerCase(vals);

    _.each(keys, function(value, key) {
      if (vals[value] != null) {
        tmp[value] = vals[value];
      }
    });

    this.set('vals', tmp);
  },

  extKeys: function(new_keys) {
    var keys;

    if (typeof new_keys === 'object') {
      keys = this.get('keys') || {};
      this.set('keys', _.extend({}, keys, new_keys));
    }
    return this.get('keys') || {};
  },

  limit: function(sql, limit) {
    var args;

    args = _.toArray(arguments);
    switch (args.length) {
      case 0:
        sql =    this.get('sql') || '';
        limit =  this.get('limit') || null;
      break;
      case 1:
        sql =    args[0];
        limit =  this.get('limit') || null;
      break;
    }

    if (limit != null) {
      if (!sql.match(/first/i)) {
        sql = sql.replace(/select/i, 'select first ' + limit);
      } else {
        sql = sql.replace(/first [\d]+/i, 'first ' + limit);
      }
    }

    return sql;
  },

  containing: function(query, cfselect) {
    var words = [], 
      containing = '';

    if ((query != null) && (cfselect != null)) {
      query =  query + ' ';
      words = query.match(/(.*?)\ /g);
      _.each(words, function(word) {
        if (containing !== '') {
          containing += ' and ';
        }
        containing += cfselect + ' containing \'' + word.trim() + '\'';
      });
    }
    return containing;
  },

  search: function(sql, query, cfselect) {
    var args, parse, containing;

    args = _.toArray(arguments);
    switch (args.length) {
      case 0:
        sql =       this.get('sql')      || '';
        query =     this.get('query')    || null;
        cfselect =  this.get('cfselect') || null;
      break;
      case 1:
        sql =       args[0];
        query =     this.get('query')    || null;
        cfselect =  this.get('cfselect') || null;
      break;
      case 2:
        sql =       args[0];
        query =     args[1];
        cfselect =  this.get('cfselect') || null;
      break;
    }

    if ((sql != null) && (query != null) && (cfselect != null)) {
      
      containing = this.containing(query, cfselect);

      if (sql.match(/where/i)) {
        sql = sql.replace(/(where)/i, '$1 ' + containing + ' and');
      } else {
        if (sql.match(/group by/i)) {
          sql = sql.replace(/(group by)/i, 'where ' + containing + ' $1');
        } else {
          if (sql.match(/order/i)) {
            sql = sql.replace(/(order by)/i, 'where ' + containing + ' $1');
          } else {
            sql = sql + ' where ' + containing + '';
          }
        }
      }
    }

    return sql;
  },

  select: function(sql) {
    var limit;

    limit = this.get('limit') || null;

    if (sql == null) {
      sql = this.get('selectsql') || this.get('sql') || '';
    }

    sql = this.limit(sql);
    sql = this.search(sql);
    sql = this.setParams(sql);

    return sql;
  }

});

exports = module.exports = Sqlmaster;
