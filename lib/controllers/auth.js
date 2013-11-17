
var Firebird, Session, Auth, Validate, async, colors, middleware, md5;

async =      require('async');
colors =     require('colors');
md5 =        require('MD5');

Validate =  require(process.env.APP_DIR + '/lib/controllers/validate');
Session =   require(process.env.APP_DIR + '/lib/controllers/session');
Firebird =  require(process.env.APP_DIR + '/lib/controllers/firebird');

Auth = Firebird.extend({
  defaults: {
    user_id:             null,
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

  initialize: function() {},

  login: function(fn) {
    var req, valid,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    this.set('user_login',     this.get('user_login')    != null ? this.get('user_login').toString().trim()      : '');
    this.set('user_password',  this.get('user_password') != null ? this.get('user_password').toString().trim()   : '');

    valid = new Validate({
      schema: 'signin',
      data: {
        login:     this.get('user_login'),
        password:  this.get('user_password')
      }
    });

    if (!valid.check()) {
      this.error(valid.get('errors')[0]);
    }
    
    async.series({

      userExist: function(fn) {
        var tr;
        if ((!_this.get('error')) && (!_this.get('fb_error'))) {
          _this.fbTransactionOpen(function() {
            if (_this.get('fb_transaction')) {
              tr = _this.get('fb_transaction');
              tr.query(_this.sqlUserExist(), function(err, result) {
                if ((result != null ? result.length : void 0) != null) {
                  if (result.length < 1) {
                    _this.fbTransactionRollback();
                    _this.error('User not found', fn);
                  } else {
                    if (result[0].status !== 0) {
                      _this.fbTransactionRollback();
                      _this.error('Account is not active', fn);
                    } else {
                      if (result[0].userpsw.toString().length < 1) {
                        _this.fbTransactionRollback();
                        _this.error('The user has no password', fn);
                      } else {
                        _this.set({
                          user_id:              result[0].id,
                          user_name:            result[0].username,
                          user_password_hash:   result[0].userpsw
                        });
                        fn(null, 'success');
                      }
                    }
                  }
                } else {
                  _this.fbCheckError(err, fn);
                }
              });
            } else {
              _this.fbCheckError('Transaction not found', fn);
            }
          });
        } else {
          fn();
        }
      },

      userGroupAllow: function(fn) {
        var tr;
        if ((!_this.get('error')) && (!_this.get('fb_error'))) {
          if (_this.get('fb_transaction')) {
            tr = _this.get('fb_transaction');
            tr.query(_this.sqlUserGroupAllow(), function(err, result) {
              if ((result != null ? result.length : void 0) != null) {
                if (result.length < 1) {
                  _this.fbTransactionRollback();
                  _this.error('You are not allowed to login', fn);
                } else {
                  _this.fbTransactionCommit(tr, fn);
                }
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
      }

    }, function(err, results) {
      _this.checkPassword();
      if ((!_this.get('error')) && (!_this.get('fb_error'))) {
        _this.startSession(function() {
          fn();
        });
      } else {
        fn();
      }
    });

  },

  startSession: function(fn) {
    var session,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    session = new Session({
      req:      this.get('req'),
      user_id:  this.get('user_id'),
      force:    this.get('force')
    });

    session.start(function(err, result) {

      if (err) {
        _this.error('Create a session failed');
      } else {
        _this.set('session_id',       result.session_id);
        _this.set('session_success',  result.session_success);
        _this.set('session_startdt',  result.session_startdt);
        _this.set('session_open',     result.session_open);
        _this.set('workstation_id',   result.workstation_id);
        _this.set('workstation_name', result.workstation_name);
        _this.set('result', (_this.get('error') || _this.get('fb_error')) ? 'error' : 'success');
      }

      fn();

    });
  },

  checkPassword: function() {
    var hash, req;
    if ((!this.get('error')) && (!this.get('fb_error'))) {

      hash = md5(this.get('user_password'));

      if (!this.get('user_password_hash')) {
        this.set('user_password_hash', '0000');
      }

      if (this.get('user_password_hash').toString().toUpperCase() !== hash.toString().toUpperCase()) {
        this.error('Incorrect login or password');
      }

    }
  },

  signin: function(fn) {
    var session, req,
      _this = this;

    if (fn == null) {
      fn = function() {};      
    }

    session = new Session({
      req:        this.get('req'),
      user_id:    this.get('user_id')
    });

    session.check(function() {
      if ((!session.get('error')) && (!session.get('fb_error'))) {
        if ((_this.get('user_id') != session.get('user_id')) ||
          (_this.get('workstation_id') != session.get('workstation_id')) ||
            (_this.get('session_id') != session.get('session_id'))) {
          _this.error('Your session is outdated');
        }
      } else {
        _this.set('error',    session.get('error'));
        _this.set('fb_error', session.get('fb_error'));
      }

      _this.set('result', (_this.get('error') || _this.get('fb_error')) ? 'error' : 'success');
      fn(_this.get('error'), _this.get('result') == 'success' ? true : false);
    });

  },

  error: function(err, fn) {
    var req, error;

    req = this.get('req') || {
      gettext: function(s) {
        return s;
      }
    };

    if (fn == null) {
      fn = function() {};
    }

    if (err != null) {
      error = req.gettext(err);
      this.set('error', error);
      fn(error);
    }
  },

  logout: function(fn) {

    var session, 
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    session = new Session({
      req:      this.get('req'),
      user_id:  this.get('user_id')
    });

    session.check(function() {
      session.close(function() {
        _this.set({
          error:            session.get('error'),
          fb_error:         session.get('fb_error'),
          session_id:       session.get('session_id'),
          session_startdt:  session.get('session_startdt'),
          session_open:     session.get('session_open'),
          workstation_id:   session.get('workstation_id')
        });
        _this.set('result', (_this.get('error') || _this.get('fb_error')) ? 'error' : 'success');
        fn();
      });
    });

  },

  sqlUserExist: function() {
    return "select " +
           "id, status, username, userpsw " +
           "from sp$users " +
           "where " +
           "(userlogin = '" + (this.get('user_login')) + "')";
  },

  sqlUserGroupAllow: function() {
    return "select " +
           "id " +
           "from sp$group_detail " +
           "where " +
           "(group_id = " + (this.get('web_group_id')) + ") " +
           "and " +
           "(grouptable_id = " + (this.get('user_id')) + ")";
  }

});

middleware = function(options) {

  if (options == null) {
    options = {};
  }

  return function(req, res, next) {
    var auth;

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

      if ((req.session.user.id != null) &&
        (req.session.workstation.id != null) &&
          (req.session.fbsession.id != null)) {

        auth = new Auth({
          req:              req,
          user_id:          req.session.user.id,
          workstation_id:   req.session.workstation.id,
          session_id:       req.session.fbsession.id
        });

        auth.signin(function(err, result) {
          if (result) {
            req.signin =  true;
          }
          next();
        });

      } else {
        next();
      }

    } else {
      next();
    }

  };

};


exports = module.exports = Auth;

exports.middleware = middleware;


