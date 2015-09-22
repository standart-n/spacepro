
/*
Модуль авторизации пользователя
@module Auth
*/

var _ =          require('lodash');
var async =      require('async');
var colors =     require('colors');
var md5 =        require('MD5');

var Validate =   require(process.env.APP_DIR + '/lib/controllers/validate');
var Session =    require(process.env.APP_DIR + '/lib/controllers/session');
var Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');
var User =       require(process.env.APP_DIR + '/lib/controllers/user');

/*
Инициализация класса

`var auth = new Auth(options);`

@param {object} options
@class Auth
@extends Firebird
*/

var Auth = Firebird.extend({
  defaults: {
    user_id:             null,
    user_name:           null,
    user_login:          null,
    user_password:       null,
    user_password_hash:  null,
    session_id:          null,
    session_open:        false,
    session_success:     null,
    session_startdt:     null,
    session_enddt:       null,
    workstation_id:      null,
    workstation_name:    null,
    web_group_id:        -20,
    force:               0,
    error:               null,
    fb_global:           true,
    fb_error:            null,
    fb_connection:       null,
    fb_transaction:      null,
    result:              'error'
  },

  initialize: function() {}

});

/*
Авторизация пользователя c запросами к MongoDB и с кэшированием в Memcached

@param {function} callback
@callback
@param {string} error
@param {string} result
@api public
*/

Auth.prototype.login = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.set('user_login',     this.get('user_login')    != null ? this.get('user_login').toString().toLowerCase().trim()      : '');
  this.set('user_password',  this.get('user_password') != null ? this.get('user_password').toString().toLowerCase().trim()   : '');

  var valid = new Validate({
    schema: 'signin',
    data: {
      login:     this.get('user_login'),
      password:  this.get('user_password')
    }
  });

  if (valid.check()) {
    var userdb = new User({
      userlogin: this.get('user_login')
    });

    userdb.getUserByLogin(function(err, user) {
      if ((!err) && (user != null)) {
        if (user.status === 0) {
          if (user.userpsw.toString().length > 1) {
            _this.set({
              user_id:              user.user_id,
              user_login:           user.userlogin,
              user_name:            user.username,
              user_password_hash:   user.userpsw
            });
            if (_this.checkPassword()) {
              _this.startSession(function(err) {
                if (!err) {
                  fn();
                } else {
                  fn(err);
                }
              });
            } else {
              fn('Incorrect login or password');
            }
          } else {
            fn('The user has no password');
          }
        } else {
          fn('Account is not active');
        }
      } else {
        fn('User not found');
      }
    });
  } else {
    fn(valid.get('errors')[0]);
  }


  // if ((!_this.get('error')) && (!_this.get('fb_error'))) {

  //   var userdb = new User({
  //     userlogin: this.get('user_login')
  //   });

  //   userdb.getUserByLogin(function(err, user) {
  //     if (user != null) {
  //       if (user.status === 0) {
  //         if (user.userpsw.toString().length > 1) {
  //           _this.set({
  //             user_id:              user.user_id,
  //             user_login:           user.userlogin,
  //             user_name:            user.username,
  //             user_password_hash:   user.userpsw
  //           });
  //           // if (_.findWhere(user.groups || [], {'group_id': _this.get('web_group_id').toString()}) !== undefined) {
  //             _this.checkPassword();
  //             if ((!_this.get('error')) && (!_this.get('fb_error'))) {
  //               _this.startSession(function() {
  //                 fn();
  //               });
  //             } else {
  //               fn();
  //             }
  //           // } else {
  //           //   _this.error('You are not allowed to login', fn);                
  //           // }
  //         } else {
  //           _this.error('The user has no password', fn);
  //         }
  //       } else {
  //         _this.error('Account is not active', fn);
  //       }
  //     } else {
  //       _this.error('User not found', fn);          
  //     }
  //   });
  // } else {
  //   fn();
  // }

};

/*
Авторизация пользователя c запросами напрямую в Firebird

@param {function} callback
@callback
@param {string} error
@param {string} result
@api private
*/

// Auth.prototype.fbLogin = function(fn) {
//   var req, valid,
//     _this = this;

//   if (fn == null) {
//     fn = function() {};
//   }

//   this.set('user_login',     this.get('user_login')    != null ? this.get('user_login').toString().toLowerCase().trim()      : '');
//   this.set('user_password',  this.get('user_password') != null ? this.get('user_password').toString().toLowerCase().trim()   : '');

//   valid = new Validate({
//     schema: 'signin',
//     data: {
//       login:     this.get('user_login'),
//       password:  this.get('user_password')
//     }
//   });

//   if (!valid.check()) {
//     this.error(valid.get('errors')[0]);
//   }
  
//   async.series({

//     userExist: function(fn) {
//       _this.fbTransactionOpen(function(err, tr) {
//         if (!err) {
//           tr.query(_this.sqlUserExist(), function(err, result) {
//             if (!err) {
//               if (result.length < 1) {
//                 _this.fbTransactionRollback();
//                 _this.error('User not found', fn);
//               } else {
//                 if (result[0].status !== 0) {
//                   _this.fbTransactionRollback();
//                   _this.error('Account is not active', fn);
//                 } else {
//                   if (result[0].userpsw.toString().length < 1) {
//                     _this.fbTransactionRollback();
//                     _this.error('The user has no password', fn);
//                   } else {
//                     _this.set({
//                       user_id:              result[0].id,
//                       user_name:            result[0].username,
//                       user_password_hash:   result[0].userpsw
//                     });
//                     fn(null, 'success');
//                   }
//                 }
//               }
//             } else {
//               _this.fbCheckError(err, fn);
//             }
//           });
//         } else {
//           _this.fbCheckError('Transaction not found', fn);
//         }
//       });
//     },

//     userGroupAllow: function(fn) {
//       // fn();
//       _this.fbTransactionOpen(function(err, tr) {
//         if (!err) {
//           tr.query(_this.sqlUserGroupAllow(), function(err, result) {
//             if ((result != null ? result.length : void 0) != null) {
//               if (result.length < 1) {
//                 _this.fbTransactionRollback();
//                 _this.error('You are not allowed to login', fn);
//               } else {
//                 _this.fbTransactionCommit(tr, fn);
//               }
//             } else {
//               _this.fbCheckError(err, fn);
//             }
//           });
//         } else {
//           _this.fbCheckError('Transaction not found', fn);
//         }
//       });
//     }

//   }, function(err, results) {
//     _this.checkPassword();
//     if (!err) {
//       _this.startSession(function() {
//         fn();
//       });
//     } else {
//       fn(err);
//     }
//   });
// };

/*
Открыть сессию пользователя

@param {function} callback
@callback ()
@api public
*/

Auth.prototype.startSession = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  var session = new Session({
    user_id:  this.get('user_id'),
    force:    this.get('force')
  });

  session.start(function(err) {
    if (!err) {
      _this.set({
        'result':                   true,
        'session_id':               session.get('session_id'),
        'session_open':             session.get('session_open'),
        'session_startdt':          session.get('session_startdt'),
        'session_success':          session.get('session_success'),
        'workstation_id':           session.get('workstation_id'),
        'workstation_name':         session.get('workstation_name')
      });
      fn();
    } else {
      _this.set('result', false);
      fn('Create a session failed');
    }
  });
};

/*
Проверка пароля при авторизации

@api private
*/

Auth.prototype.checkPassword = function() {
  var hash = md5(this.get('user_password'));

  if (!this.get('user_password_hash')) {
    this.set('user_password_hash', '0000');
  }

  return this.get('user_password_hash').toString().trim().toUpperCase() === hash.toString().trim().toUpperCase();
};

/*
Проверка авторизован ли пользователь и
активна ли его сессия.

@param {function} callback
@callback
@param {string} error
@param {string} result
@api public
*/

Auth.prototype.signin = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};      
  }

  var session = new Session({
    user_id:    this.get('user_id')
  });

  session.check(function(err) {
    if (!err) {
      if ((_this.get('user_id') != session.get('user_id')) ||
        (_this.get('workstation_id') != session.get('workstation_id')) ||
          (_this.get('session_id') != session.get('session_id'))) {
        fn('Your session is outdated');
      } else {
        fn(null, true);
      }
    } else {
      fn(err);
    }
  });

    // if ((!session.get('error')) && (!session.get('fb_error'))) {
    //   if ((_this.get('user_id') != session.get('user_id')) ||
    //     (_this.get('workstation_id') != session.get('workstation_id')) ||
    //       (_this.get('session_id') != session.get('session_id'))) {
    //     _this.error('Your session is outdated');
    //   }
    // } else {
    //   _this.set('error',    session.get('error'));
    //   _this.set('fb_error', session.get('fb_error'));
    // }

    // _this.set('result', (_this.get('error') || _this.get('fb_error')) ? 'error' : 'success');
    // fn(_this.get('error'), _this.get('result') == 'success' ? true : false);

};

/*
Обработка ошибок

@param {(string|function)} error
@param {function} callback
@callback ()
@api private
*/

// Auth.prototype.error = function(err, fn) {
//   var error = err;

//   if (fn == null) {
//     fn = function() {};
//   }

//   if (err != null) {
//     // if (req != undefined) {
//     //   if (req.gettext != null) {
//     //     error = req.gettext(err);
//     //   } 
//     // }
//     this.set('error', error);
//     fn(error);
//   }
// };

/*
Выход пользователя из системы

@param {function} callback
@callback ()
@api public
*/

Auth.prototype.logout = function(fn) {

  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  var session = new Session({
    user_id:  this.get('user_id')
  });

  session.check(function(err) {
    if (!err) {
      session.close(function(err) {
        if (!err) {
          fn(null, 'success');
        } else {
          fn(err);
        }
      });
    } else {
      fn(err);
    }
  });

  // session.check(function() {
  //   session.close(function() {
  //     _this.set({
  //       error:            session.get('error'),
  //       fb_error:         session.get('fb_error'),
  //       session_id:       session.get('session_id'),
  //       session_startdt:  session.get('session_startdt'),
  //       session_open:     session.get('session_open'),
  //       workstation_id:   session.get('workstation_id')
  //     });
  //     _this.set('result', (_this.get('error') || _this.get('fb_error')) ? 'error' : 'success');
  //     fn();
  //   });
  // });
};

/*
Sql запрос для поиска пользователя по логину

@param {function} callback
@callback ()
@api private
*/

Auth.prototype.sqlUserExist = function() {
  return "select " +
         "id, status, username, userpsw " +
         "from sp$users " +
         "where " +
         "(userlogin = '" + (this.get('user_login')) + "')";
};

/*
Sql запрос на принадлежность пользователя определенной группе

@param {function} callback
@callback ()
@api private
*/

Auth.prototype.sqlUserGroupAllow = function() {
  return "select " +
         "id " +
         "from sp$group_detail " +
         "where " +
         "(group_id = " + (this.get('web_group_id')) + ") " +
         "and " +
         "(grouptable_id = " + (this.get('user_id')) + ")";
};

/*
Middleware

@param {object} options
@api public
*/

var middleware = function(options) {

  if (options == null) {
    options = {};
  }

  return function(req, res, next) {
    var auth, memcached, hash;

    if (req.session != null) {

      if (req.session.user == null) {
        req.session.user = {
          id: null
        };
      }

      if (req.session.workstation == null) {
        req.session.workstation = {
          id: null
        };
      }

      if (req.session.fbsession == null) {
        req.session.fbsession = {
          id: null
        };
      }

      req.signin = false;

      if ((req.session.user.id != null) && (req.session.workstation.id != null) && (req.session.fbsession.id != null)) {

        // memcached = global.memcached;
        // hash = md5(JSON.stringify(req.session.user) + JSON.stringify(req.session.workstation) + JSON.stringify(req.session.fbsession));

        // memcached.get(hash, function(err, result) {
        //   if (!result) {
            auth = new Auth({
              user_id:          req.session.user.id,
              workstation_id:   req.session.workstation.id,
              session_id:       req.session.fbsession.id
            });

            auth.signin(function(err, result) {
      
              if (err) {
                console.log('auth.js middleware', err);
              }
              if (result) {
                req.signin =  true;
                // memcached.set(hash, req.signin, 20, function() {
                  next();
                // });
              } else {
                next();
              }
            });
        //   } else {
        //     req.signin = result;
        //     next();
        //   }
        // });

      } else {
        next();
      }

    } else {
      next();
    }

  };

};


/*
@export Auth
*/

exports = module.exports = Auth;

exports.middleware = middleware;

