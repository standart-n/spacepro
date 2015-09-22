
/*
Модуль для работы с привелегиями
@module Privilege
*/


var _ = require('lodash');

var Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');

/*
Инициализация класса

`var privilege = new Privilege(options);`

`options`:
- `user_id` `id` пользователя

@param {object} options
@class Privilege
@extends Firebird
*/

var Privilege = Firebird.extend({

  defaults: function() {
    return {
      user_id:         0,
      sid:             '',
      usergroups_id:   [],
      fb_global:       true
    };
  },

  initialize: function() {}

});

Privilege.prototype.getPrivileges = function(fn) {
  var privileges = [];
  var _this = this;

  var user_id =        this.get('user_id')       || 0;
  var usergroups_id =  this.get('usergroups_id') || [];

  if (fn == null) {
    fn = function() {};
  }

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      var sql = _this.sqlGetPrivileges(user_id, usergroups_id);
      db.query(sql, function(err, result) {
        db.detach();
        if (!err) {
          try {
            privileges = _this.parsePrivileges(result);
          } catch (e) {
            console.log(e);
          } finally {
            fn(null, privileges);
          }
        } else {
          fn(err);
        }
      });
    } else {
      fn(err);
    }
  });  
};

Privilege.prototype.parsePrivileges = function(res) {
  var _this = this;
  var ms = [];
  var spGroup = _.groupBy(res, function(sp) {
    return sp.sp$object;
  });

  if (res == null) {
    res = {};
  }

  _.each(spGroup, function(data, dict) {
    var privileges, editfields;
    editfields = [];
    dict = dict.toString().trim().toLowerCase();
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
  var sql =  "SELECT SP$OBJECT, SP$PRIVILEGE, SP$OBJECT_FIELD " +
         "FROM SP$PRIVILEGES " +
         "WHERE " +
         "((SP$USER_ID = " + user_id + ")";
  _.each(usergroups_id, function(usergroup_id) {
    sql += " OR (SP$USERGROUP_ID = " + usergroup_id + ")";
  });
  sql += ") " +
         "ORDER BY SP$OBJECT ASC";
  return sql;
};

/*
@export Privilege
*/

exports = module.exports = Privilege;

exports.privilege = new Privilege();
