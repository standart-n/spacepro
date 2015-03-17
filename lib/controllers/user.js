
/*
Модуль для работы с пользователями
@module User
*/

var _ =          require('lodash');
var async =      require('async');
var md5 =        require('MD5');
var colors =     require('colors');
var moment =     require('moment');
var mongoose =   require('mongoose');

var Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');
var Privilege =  require(process.env.APP_DIR + '/lib/controllers/privilege');
var UserSchema = require(process.env.APP_DIR + '/lib/schemas/user');

var UserModel =  mongoose.model('User', UserSchema);

/*
Инициализация класса

`var user = new User(options);`

@param {object} options
@class User
@extends Privilege
*/

var User = Firebird.extend({

  defaults: function() {
    return {
      userlogin:     '',
      user_id:       0,
      sid:           '',      
      users:         [],
      groups:        [],
      usergroups_id: [],
      fb_global:     true
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
  hash =      md5('userlogin:' + userlogin);

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

User.prototype.getUserById = function(fn) {
  var hash,
    user_id,
    memcached,
    _this = this;

  if (fn == null) {
    fn = function() {};
  }

  user_id =   this.get('user_id') || '';
  memcached = global.memcached;
  hash =      md5('user_id:' + user_id);

  memcached.get(hash, function(err, result) {
    if (!result) {
      UserModel.findOne({
        user_id:  user_id
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

  async.series({

    userGroups: function(fn) {
      _this.getUserGroups(fn);
    },

    userList: function(fn) {
      _this.getUserList(fn);
    }

  }, function(err, results) {
    _this.updateCacheOfUsers(fn);
  });
};

User.prototype.clearAllUsers = function(fn) {
  var query = UserModel.find();

  if (fn == null) {
    fn = function() {};
  }

  query.exec(function(err, users) {
    if (!err) {
      async.eachSeries(users, function(user, fn) {
        user.remove();
        user.save(function() {
          fn();
        });
      }, function() {
        fn(null, null);
      });
    } else {
      fn(err);
    }
  });
};


User.prototype.updateCacheOfUsers = function(fn) {
  var _this = this;
  var userFn = [];

  if (fn == null) {
    fn = function() {};
  }

  var users =  this.get('users');
  var groups = this.get('groups');

  _.each(users, function(user) {

    userFn.push(function(fn) {
      UserModel.findOne({
        user_id:  user.id
      }, function(err, userdb) {
        var log, caption, groupAccepted, listOfGroups, userPrivileges, privilege;

        if ((user.username) && (user.username !== undefined)) {
          if ((user.userlogin) && (user.userlogin !== undefined)) {
            caption = user.username.toString().yellow;
            caption += ' ' + user.userlogin.toString().red;
          } else {
            caption = user.username.toString().grey;
          }
        } else {
          caption = 'no name'.red;
        }

        log = (moment().format('HH:mm:ss.SSS').blue)      + " " +
              (moment().format('DD/MM/YYYY').magenta)     + " " +
              "update".green                              + " " +
              "User".cyan                                 + " " +
               caption.yellow;

        groupAccepted = _.where(groups, {
          'user_id': user.id.toString()
        });

        listOfGroups = _.pluck(groupAccepted, 'group_id');

        privilege = new Privilege({
          'user_id':        user.id.toString(),
          'usergroups_id':  listOfGroups
        });

        privilege.getPrivileges(function(pr_error, privileges) {

          if (err || pr_error) {
            _this.set('error', err || pr_error);
            fn(err || pr_error);
          } else {
            if (userdb !== null) {

              userdb.user_id =       user.id;
              userdb.userlogin =     user.userlogin;
              userdb.username =      user.username;
              userdb.userpsw =       user.userpsw;
              userdb.status =        user.status;
              userdb.groups =        groupAccepted;
              userdb.privileges =    privileges;
              userdb.save(function(err, result) { 
                if (err) {
                  console.log(user, err);
                }
                console.log(log);
                fn(null);
              });
            } else {
              userdb = new UserModel({
                user_id:      user.id,
                userlogin:    user.userlogin,
                username:     user.username,
                userpsw:      user.userpsw,
                status:       user.status,
                groups:       groupAccepted,
                privileges:   privileges
              });

              userdb.save(function(err) {
                console.log(log);
                fn(null);
              });
            }
          }
        });
      });
    });
  });

  async.series(userFn, function() {
    fn();
  });
};

User.prototype.getUserList = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.fbTransactionOpen(function(err, tr) {
    if (!err) {
      tr.query(_this.sqlUserList(), function(err, result) {        
        if (!err) {
          if (result.length) {
            _this.fbTransactionCommit(function() {
              _this.set('users', result);
              fn(null, result);
            });
          } else {
            _this.fbCheckError('Users not Found', fn);
          }
        } else {
          _this.fbCheckError(err, fn);
        }
      });
    } else {
      _this.fbCheckError('Transaction not found: ' + err, fn);
    }
  });
};

User.prototype.getUserGroups = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.fbTransactionOpen(function(err, tr) {
    if (!err) {
      tr.query(_this.sqlUserGroups(), function(err, result) {
        if (!err) {
          if (result.length) {
            _this.fbTransactionCommit(function() {
              _this.set('groups', result);
              fn(null, result);
            });
          } else {
            _this.fbCheckError('Groups not found', fn);
          }
        } else {
          _this.fbCheckError(err, fn);
        }
      });
    } else {
      _this.fbCheckError('Transaction not found', fn);
    }
  });
};

User.prototype.sqlUserList = function() {
  return "select " +
         "id, status, username, userpsw, userlogin " +
         "from sp$users " +
         "where (1=1) " +
         // "and (userlogin <> '') " +
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

