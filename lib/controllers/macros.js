
var _, async, Backbone, Macros;

_ =          require('lodash');
Backbone =   require('backbone');

Macros = Backbone.Model.extend({

  defaults: function() {
    return {
      vals: {}
    };
  },
 
  initialize: function() {

  },

  parseString: function(s) {
    var vals, exprs, exp, key, value;

    vals = this.get('vals') || {};

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
          vals[key] = value;
        }
      }
    }

    this.set('vals', vals);
    return vals;
  },

  parseSql: function(sql) {
    var vals, re;

    vals = this.get('vals') || {};

    if (sql == null) {
      sql = '';
    }

    _.each(vals, function(value, key) {
      re = new RegExp(':' + key, 'g');
      sql = sql.replace(re, value);
    });

    this.set('sql', sql);
    return sql;
  }

});

exports = module.exports = Macros;
