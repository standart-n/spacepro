
/*
Модуль для работы с пользователями
@module User
*/

var _, md5, mongoose, async, Firebird, User, UserSchema, UserModel;

_ =        require('lodash');
async =    require('async');
md5 =      require('MD5');
mongoose = require('mongoose');

Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');
UserSchema = require(process.env.APP_DIR + '/lib/schemas/user');

UserModel =  mongoose.model('User', UserSchema);

/*
Инициализация класса

`var user = new User(options);`

@param {object} options
@class User
@extends Firebird
*/

User = Firebird.extend({

  defaults: function() {
    return {
      user_id:       0,
      users:         [],
      groups:        []
    };
  },

  initialize: function() {}

});

User.prototype.getUserByLogin = function(fn) {
  var hash,
    userlogin,
    memcached,
    _this = this;

  if (fn == null) {
    fn = function() {};
  }

  userlogin = this.get('userlogin') || '';
  memcached = global.memcached;
  hash =      md5(userlogin);

  memcached.get(hash, function(err, result) {
    if (!result) {
      UserModel.findOne({
        userlogin:  userlogin
      }, function(err, user) {
        if (err) {
          _this.set('error', err);
          fn(err);
        } else {
          if (user != null) {
            result = user.toJSON();
            memcached.set(hash, JSON.stringify(result), 10, function() {
              fn(null, user.toJSON());
            });
          } else {
            fn(null, null);
          }
        }
      });
    } else {
      fn(null, JSON.parse(result));
    }
  });


};

User.prototype.updateAllUsers = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  _this.fbTransactionOpen(function() {

    async.parallel({

      userList: function(fn) {
        _this.getUserList(fn);
      },

      userGroups: function(fn) {
        _this.getUserGroups(fn);
      }

    }, function(err, results) {
      if ((!_this.get('error')) && (!_this.get('fb_error'))) {
        _this.fbTransactionCommit(function() {
          _this.updateCacheOfUsers(fn);
        });
      } else {
        fn();
      }
    });
  });
};

User.prototype.updateCacheOfUsers = function(fn) {
  var users, 
    groups,
    parallels = [];

  if (fn == null) {
    fn = function() {};
  }

  users =  this.get('users');
  groups = this.get('groups');

  _.each(users, function(user) {
    parallels.push(function(fn) {
      UserModel.findOne({
        user_id:  user.id
      }, function(err, userdb) {
        var groupAccepted;

        groupAccepted = _.where(groups, {
          'user_id': user.id.toString()
        });

        if (err) {
          _this.set('error', err);
          fn(err);
        } else {
          if (userdb !== null) {

            userdb.user_id =   user.id;
            userdb.userlogin = user.userlogin;
            userdb.username =  user.username;
            userdb.userpsw =   user.userpsw;
            userdb.status =    user.status;
            userdb.groups =    groupAccepted;
            userdb.save(function(err, result) { 
              if (err) {
                console.log(user, err);
              }
              fn(null);
            });
          } else {
            userdb = new UserModel({
              user_id:   user.id,
              userlogin: user.userlogin,
              username:  user.username,
              userpsw:   user.userpsw,
              status:    user.status,
              groups:    groupAccepted
            });
            userdb.save(function(err) {
              fn(null);
            });
          }
        }
      });
    });
  });

  async.parallel(parallels, function() {
    fn();
  });
};

User.prototype.getUserList = function(fn) {
  var tr, _this = this;

  if (fn == null) {
    fn = function() {};
  }

  if ((!_this.get('error')) && (!_this.get('fb_error'))) {
    if (_this.get('fb_transaction')) {
      tr = _this.get('fb_transaction');
      tr.query(_this.sqlUserList(), function(err, result) {
        if ((result != null ? result.length : void 0) != null) {
          _this.set('users', result);
          fn();
        } else {
          _this.fbCheckError(err, fn);
        }
      });
    } else {
      _this.fbCheckError('Transaction not found', fn);
    }
  } else {
    fn();
  }
};

User.prototype.getUserGroups = function(fn) {
  var tr, _this = this;

  if (fn == null) {
    fn = function() {};
  }

  if ((!_this.get('error')) && (!_this.get('fb_error'))) {
    if (_this.get('fb_transaction')) {
      tr = _this.get('fb_transaction');
      tr.query(_this.sqlUserGroups(), function(err, result) {
        if ((result != null ? result.length : void 0) != null) {
          _this.set('groups', result);
          fn();
        } else {
          _this.fbCheckError(err, fn);
        }
      });
    } else {
      _this.fbCheckError('Transaction not found', fn);
    }
  } else {
    fn();
  }
};

User.prototype.sqlUserList = function() {
  return "select " +
         "id, status, username, userpsw, userlogin " +
         "from sp$users " +
         "where (1=1) " +
         "and (userlogin <> '') " +
         "and (status = 0) ";
};

User.prototype.sqlUserGroups = function() {
  return "select " +
         "gd.id as id, gd.group_id as group_id, gd.grouptable_id as user_id,  " +
         "g.sid as sid, g.parent_id as parent_id, g.caption as caption, g.color as color, g.status as status " +
         "from sp$group_detail gd " +
         "left join sp$groups g on g.id = gd.group_id " +
         "where " +
         "gd.grouptable = 'USERS' " +
         "order by gd.grouptable_id asc";
};

/*
@export Privilege
*/

exports = module.exports = User;

exports.user = new User();
