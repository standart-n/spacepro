
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
var debug =      require('debug')('user');

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
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  var userlogin = this.get('userlogin') || '';
  // var memcached = global.memcached;
  // var hash =      md5('userlogin:' + userlogin);

  // memcached.get(hash, function(err, result) {
  //   if (!result) {
      UserModel.findOne({
        userlogin:  userlogin
      }, function(err, user) {
        if (err) {
          // _this.set('error', err);
          fn(err);
        } else {
          if (user != null) {
            var result = user.toJSON();
            // memcached.set(hash, JSON.stringify(result), 10, function() {
            fn(null, result);
            // });
          } else {
            fn(null);
          }
        }
      });
  //   } else {
  //     fn(null, JSON.parse(result));
  //   }
  // });
};

User.prototype.getUserById = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  var user_id =   this.get('user_id') || '';
  // var memcached = global.memcached;
  // var hash =      md5('user_id:' + user_id);

  // memcached.get(hash, function(err, result) {
  //   if (!result) {
      UserModel.findOne({
        user_id:  user_id
      }, function(err, user) {
        if (err) {
          _this.set('error', err);
          fn(err);
        } else {
          if (user != null) {
            var result = user.toJSON();
            // memcached.set(hash, JSON.stringify(result), 10, function() {
              fn(null, result);
            // });
          } else {
            fn(null, null);
          }
        }
      });
  //   } else {
  //     fn(null, JSON.parse(result));
  //   }
  // });
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
    if (!err) {
      _this.updateCacheOfUsers(fn);
    } else {
      fn(err);
    }
  });
};

User.prototype.clearAllUsers = function(fn) {

  if (fn == null) {
    fn = function() {};
  }

  UserModel.find().exec(function(err, users) {
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

  async.eachSeries(users, function(user, fn) {
    UserModel.findOne({
      user_id:  user.id
    }, function(err, userdb) {
      var caption = '';

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

      var groupAccepted = _.where(groups, {
        'user_id': user.id
      });

      var listOfGroups = _.pluck(groupAccepted, 'group_id');

      var privilege = new Privilege({
        'user_id':        user.id.toString(),
        'usergroups_id':  listOfGroups
      });

      var log = (moment().format('HH:mm:ss.SSS').blue)  + " " +
            (moment().format('DD/MM/YYYY').magenta)     + " " +
            "update".green                              + " " +
            "User".cyan                                 + " " +
             caption.yellow;

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
              fn();
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
              fn();
            });
          }
        }
      });
    });
  }, function() {
    fn();
  });

};

User.prototype.getUserList = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.query(_this.sqlUserList(), function(err, result) {
        db.detach();
        if (!err) {
          _this.set('users', result);
          fn(null);
        } else {
          fn(err);
        }
      });
    } else {
      fn(err);
    }
  });
};

User.prototype.getUserGroups = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.query(_this.sqlUserGroups(), function(err, result) {
        db.detach();
        if (!err) {
          _this.set('groups', result);
          fn();
        } else {
          fn(err);
        }
      });
    } else {
      fn(err);
    }
  });
};

User.prototype.updatePasswordByUserLogin = function(userlogin, userpassword, fn) {
  var _this = this;

  var hash = md5(userpassword);

  if (fn == null) {
    fn = function() {};
  }

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.query(_this.sqlUpdatePasswordByLogin(userlogin, hash), function(err) {
        db.detach();
        if (!err) {
          fn(null);
        } else {
          fn(err);
        }
      });
    } else {
      fn(err);
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

User.prototype.sqlGetUserByLogin = function(userlogin) {
  return "select " +
         "id, status, username, userpsw, userlogin " +
         "from sp$users " +
         "where (userlogin='" + userlogin + "') " +
         // "and (userlogin <> '') " +
         "and (status = 0) ";
};

User.prototype.sqlUpdatePasswordByLogin = function(userlogin, userpassword) {
  return "update " +
         "sp$users " +
         "set userpsw = '" + userpassword + "' " +
         "where (userlogin='" + userlogin + "') " +
         // "and (userlogin <> '') " +
         "";
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

