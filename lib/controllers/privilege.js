
/*
Модуль для работы с привелегиями
@module Privilege
*/

var _, Firebird, Privilege;

_ = require('lodash');

Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');

/*
Инициализация класса

`var privilege = new Privilege(options);`

`options`:
- `user_id` `id` пользователя

@param {object} options
@class Privilege
@extends Firebird
*/

Privilege = Firebird.extend({

  defaults: function() {
    return {
      user_id:         0,
      sid:             '',
      usergroups_id:   []
    };
  },

  initialize: function() {}

});

Privilege.prototype.getPrivileges = function(fn) {
  var tr,
    sql, 
    dicts,
    user_id,
    privileges,
    usergroups_id,
    _this = this;

  user_id =        this.get('user_id')       || 0;
  usergroups_id =  this.get('usergroups_id') || [];

  if (fn == null) {
    fn = function() {};
  }

  this.fbTransactionOpen(function() {
    if ((!_this.get('error')) && (!_this.get('fb_error'))) {
      if (_this.get('fb_transaction')) {
        tr = _this.get('fb_transaction');
        sql = _this.sqlGetPrivileges(user_id, usergroups_id);
        tr.query(sql, function(err, result) {
          if ((result != null ? result.length : void 0) != null) {
            // console.log('result', _.groupBy(result, function(res) {
            //   return res.sp$object;
            // }));
            _this.fbTransactionCommit(function() {
              privileges = _this.parsePrivileges(result);
              fn(null, privileges);
            });
          } else {
            _this.fbTransactionCommit(function() {
              fn(err);
            });
          }
        });
      } else {
        _this.fbCheckError('Transaction not found', fn);
      }      
    } else {
      fn(_this.get('error') || _this.get('fb_error') || 'error in getPrivileges');
    }
  });
};

Privilege.prototype.parsePrivileges = function(res) {
  var spGroup, ms;

  ms = [];

  if (res == null) {
    res = {};
  }

  spGroup = _.groupBy(res, function(sp) {
    return sp.sp$object;
  });

  _.each(spGroup, function(data, dict) {
    var privileges, editfields;
    editfields = [];
    dict = dict.toString().trim();
    privileges = {
      I: false,
      S: false,
      U: [],
      D: false,
      F: false
    };
    if (_.find(data, function(line) {
      return line.sp$privilege.toString().trim() === 'S';
    })) {
      privileges.S = true;
    }
    if (_.find(data, function(line) {
      return line.sp$privilege.toString().trim() === 'I';
    })) {
      privileges.I = true;
    }
    if (_.find(data, function(line) {
      return line.sp$privilege.toString().trim() === 'D';
    })) {
      privileges.D = true;
    }
    if (_.find(data, function(line) {
      return line.sp$privilege.toString().trim() === 'F';
    })) {
      privileges.F = true;
    }
    editfields = _.filter(data, function(line) {
      return line.sp$privilege.toString().trim() === 'U';
    });
    privileges.U = _.map(_.uniq(_.pluck(editfields, 'sp$object_field')), function(field) {
      return field.toString().trim();
    });
    ms.push({
      sid:   dict,
      rules: privileges
    });
  });

  return ms;
};

Privilege.prototype.sqlGetPrivileges = function(user_id, usergroups_id) {
  var sql;
  sql =  "SELECT SP$OBJECT, SP$PRIVILEGE, SP$OBJECT_FIELD " +
         "FROM SP$PRIVILEGES " +
         "WHERE " +
         "((SP$USER_ID = " + user_id + ")";
  _.each(usergroups_id, function(usergroup_id) {
    sql += " OR (SP$USERGROUP_ID = " + usergroup_id + ")";
  });
  sql += ")" +
         "ORDER BY SP$OBJECT ASC";
  return sql;
};

/*
@export Privilege
*/

exports = module.exports = Privilege;

exports.privilege = new Privilege();
