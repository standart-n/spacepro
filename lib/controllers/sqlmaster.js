
/*
Модуль для работы с sql-запросами
@module Sqlmaster
*/

var _ =          require('lodash');
var Backbone =   require('backbone');

var str =        require(process.env.APP_DIR + '/lib/controllers/str');

/*
Инициализация класса

`var sqlmaster = new Sqlmaster(options);`

@param {object} options
@class Sqlmaster
@extends Backbone
*/

var Sqlmaster = Backbone.Model.extend({

  defaults: function() {
    return {
      keys:         {},
      vals:         {},
      line:         {},
      controls:     {},
      filters:      {},
      limit:        null,
      folder_id:    null,
      filter_id:    null,
      macro:        {},
      sql:          '',
      selectsql:    null,
      insertsql:    null,
      refreshsql:   null,
      deletesql:    null,
      cfselect:     null
    };
  },
 
  initialize: function() {}
});

/*
Взять из строки микро-переменные

@param {string} string with keys
@return {object} keys-value
@api public
*/

Sqlmaster.prototype.parseString = function(s) {
  var keys;

  keys = this.get('keys') || {};

  if (s == null) {
    s = '';
  }

  keys = str.parseKeyValueString(s);

  this.set('keys', keys);
  return keys;
};

/*
Подставить в sql запрос микропеременные

@param {string} sql запрос
@param {object} [local] переменные
@return {string} sql запрос
@api public
*/

Sqlmaster.prototype.setParams = function(sql, local) {
  var args, keys, vals;

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
    var re, pattern, sub;
    if (vals[value] != null) {
      sub = vals[value];
      if (typeof sub === 'string') {
        sub = "'" + sub.trim() + "'";
      }
      pattern =  ':' + key;
      re =       new RegExp(pattern, 'ig');
      sql =      sql.replace(re, sub);
    }
  });

  return sql;
};

/*
Подставить в sql запрос параметры текущей строки

@param {string} [sql] запрос
@param {object} [line] переменные данной строки
@return {string} sql запрос
@api public
*/

Sqlmaster.prototype.setLineVals = function(sql, line) {
  var args;

  args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      sql =   this.get('sql')  || '';
      line =  this.get('line') || {};
    break;
    case 1:
      sql =   args[0];
      line =  this.get('line') || {};
    break;
  }

  _.each(line, function(value, key) {
    var re, pattern, sub;
    if (typeof value === 'string') {
      value = "'" + value.trim() + "'";
    }
    key =      key.replace(/\$/gi, "\\$");
    pattern =  ':' + key;
    re =       new RegExp(pattern, 'ig');
    sql =      sql.replace(re, value);
  });

  return sql;
};

/*
Подставить в sql запрос параметры из формы ввода

@param {string} [sql] запрос
@param {object} [controls] переменные данной строки
@return {string} sql запрос
@api public
*/

Sqlmaster.prototype.setControlVals = function(sql, controls) {
  var args;

  args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      sql =       this.get('sql')  || '';
      controls =  this.get('controls') || {};
    break;
    case 1:
      sql =       args[0];
      controls =  this.get('controls') || {};
    break;
  }

  _.each(controls, function(value, key) {
    var re, pattern, sub;
    if (typeof value === 'string') {
      value = value.trim();
      if (value.match(/^select/gi)) {
        value = value;
      } else {
        value = "'" + value + "'";
      }
    }
    key =      key.replace(/\$/gi, "\\$");
    pattern =  ':' + key;
    re =       new RegExp(pattern, 'ig');
    sql =      sql.replace(re, value);
  });

  return sql;
};

/*
Сделать в sql-запросе макро-подстановки

@param {string} [sql] запрос
@param {object} [vals] макро-переменные
@return {string} sql запрос
@api public
*/

Sqlmaster.prototype.setMacroVals = function(sql, vals) {
  var args;

  args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      sql =   this.get('sql')   || '';
      vals =  this.get('macro') || {};
    break;
    case 1:
      sql =   args[0];
      vals =  this.get('macro') || {};
    break;
  }

  _.each(vals, function(value, key) {
    var re, pattern;
    if (typeof value === 'string') {
      value = "'" + value.toString().trim() + "'";
    }
    key =      key.toString().replace(/\$/gi, "\\$");
    pattern =  ':' + key + ':';
    re =       new RegExp(pattern, 'ig');
    sql =      sql.replace(re, value);
  });

  return sql;
};

/*
Перевести значения объекта в lowercase

@param {object}
@return {string}
@api private
*/

Sqlmaster.prototype.setValsToLowerCase = function(ms) {
  var tmp = {};
  _.each(ms || {}, function(value, key) {
    tmp[key] = value.toLowerCase();
  });
  return tmp;
};

/*
Перевести ключи объекта в lowercase

@param {object}
@return {string}
@api private
*/

Sqlmaster.prototype.setKeysToLowerCase = function(ms) {
  var tmp = {};
  _.each(ms || {}, function(value, key) {
    tmp[key.toLowerCase()] = value;
  });
  return tmp;
};

/*
Обновление значений массива микропеременных

@param {object} vals
@param {boolean} clean
@return {object} vals
@api private
*/

Sqlmaster.prototype.extVals = function(new_vals, clean) {
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
};

/*
Обработка ключей массива микропеременных

@param {object} keys
@return {object} keys
@api private
*/

Sqlmaster.prototype.extKeys = function(new_keys) {
  var keys;

  if (typeof new_keys === 'object') {
    keys = this.get('keys') || {};
    this.set('keys', _.extend({}, keys, new_keys));
  }
  return this.get('keys') || {};
};

/*
Обработка массива микропеременных

@api private
*/

Sqlmaster.prototype.clean = function() {
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
};

/*
Подставить в sql запрос значение параметра first

@param {string} sql
@param {int} limit
@return {string} sql
@api public
*/

Sqlmaster.prototype.limit = function(sql, limit) {
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
};

/*
Сформировать для sql запроса значения для поиска

@param {string} query
@param {string} field
@return {string} containing
@api private
*/

Sqlmaster.prototype.containing = function(query, cfselect) {
  var words = [];
  var containing = '';

  if ((query != null) && (cfselect != null)) {
    if (cfselect.match(/\W/)) {
      cfselect = '(' + cfselect + ')';
    }
    query =  query.trim() + ' ';
    words = query.split(" ");
    if (words.length < 5) {
      _.each(words, function(word) {
        word = word.trim();
        if (word !== '') {
          if (containing !== '') {
            containing += ' and ';
          }
          containing += cfselect + ' containing \'' + word.trim() + '\'';
        }
      });
    } else {
      containing += cfselect + ' containing \'' + query.trim() + '\'';
    }
  }
  return containing;
};

/*
@api private
*/

Sqlmaster.prototype.condition = function(sql, cond) {

  sql = sql.toString();

  if (sql.match(/where/i)) {
    sql = sql.replace(/(where)/i, '$1 ' + cond + ' and');
  } else {
    if (sql.match(/group by/i)) {
      sql = sql.replace(/(group by)/i, 'where ' + cond + ' $1');
    } else {
      if (sql.match(/order/i)) {
        sql = sql.replace(/(order by)/i, 'where ' + cond + ' $1');
      } else {
        sql = sql + ' where ' + cond + '';
      }
    }
  }
  return sql;
};

/*
Запонить sql запрос данными из строки поиска

@param {string} sql
@param {string} query
@param {string} field
@return {string} sql
@api public
*/

Sqlmaster.prototype.search = function(sql, query, cfselect) {

  var args = _.toArray(arguments);
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
    var containing = this.containing(query, cfselect);
    sql =  this.condition(sql, containing);
  }

  return sql;
};

/*
@api public
*/

Sqlmaster.prototype.folder = function(sql, folder_id) {

  var args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      sql =       this.get('sql')        || '';
      folder_id = this.get('folder_id')  || null;
    break;
    case 1:
      sql =       args[0];
      folder_id = this.get('folder_id')  || null;
    break;
  }

  folder_id = parseInt(folder_id);

  if ((sql != null) && (folder_id) && (folder_id !== 0)) {
    var query = '(folder_id=' + folder_id + ')';
    sql =  this.condition(sql, query);
  }

  return sql;
};

/*
@api public
*/

Sqlmaster.prototype.filter = function(sql, filter_id) {
  var filters = this.get('filters') || {};

  var args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      sql =       this.get('sql')        || '';
      filter_id = this.get('filter_id')  || null;
    break;
    case 1:
      sql =       args[0];
      filter_id = this.get('filter_id')  || null;
    break;
  }

  filter_id = parseInt(filter_id);

  if ((sql != null) && (filter_id) && (filter_id !== -1)) {
    var filter = _.findWhere(filters, {'id': filter_id});
    if (filter) {
      if (filter.sqltext !== '') {
        sql =  this.condition(sql, '(' + filter.sqltext + ')');
      }
    }
  }

  return sql;
};


/*
Сформировать sql-запрос на select

@param {string} [sql]
@return {string} sql
@api public
*/

Sqlmaster.prototype.select = function(sql) {

  if (sql == null) {
    sql = this.get('selectsql') || this.get('sql') || '';
  }

  sql = this.limit(sql);
  sql = this.search(sql);
  sql = this.folder(sql);
  sql = this.filter(sql);
  sql = this.setParams(sql);

  return sql;
};

/*
Сформировать sql-запрос на insert

@param {string} [sql]
@return {string} sql
@api public
*/

Sqlmaster.prototype.insert = function(sql) {

  if (sql == null) {
    sql = this.get('insertsql') || this.get('sql') || '';
  }

  sql = this.setControlVals(sql);
  sql = this.setMacroVals(sql);

  console.log('insert sql:', sql);

  return sql;
};

/*
Сформировать sql-запрос на delete

@param {string} [sql]
@return {string} sql
@api public
*/

Sqlmaster.prototype.del = function(sql) {

  if (sql == null) {
    sql = this.get('deletesql') || this.get('sql') || '';
  }

  sql = this.setParams(sql);
  sql = this.setLineVals(sql);
  sql = this.setMacroVals(sql);

  console.log('delete sql:', sql);

  return sql;
};


/*
@export Dict
*/

exports = module.exports = Sqlmaster;
