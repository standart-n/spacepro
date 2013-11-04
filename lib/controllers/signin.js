var Backbone, Firebird, Session, Signin, Validate, async, colors, exports, md5;

Backbone =   require('backbone');
async =      require('async');
colors =     require('colors');
md5 =        require('MD5');

Validate =  require(process.env.APP_DIR + '/lib/controllers/validate');
Session =   require(process.env.APP_DIR + '/lib/controllers/session');
Firebird =  require(process.env.APP_DIR + '/lib/controllers/firebird');

Signin = Firebird.extend({
  defaults: {
    id:                  null,
    login:               null,
    password:            null,
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
    fb_connection:       null,
    fb_transaction:      null,
    result:              'error'
  },

  initialize: function() {},

  check: function(fn) {
    var req, valid,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    req = this.get('req') ? this.get('req') : {
      gettext: function(s) {
        return s;
      }
    };

    this.set('login', this.get('login') != null ? this.get('login').toString().trim() : '');
    this.set('password', this.get('password') != null ? this.get('password').toString().trim() : '');

    valid = new Validate({
      schema: 'signin',
      data: {
        login: this.get('login'),
        password: this.get('password')
      }
    });

    if (!valid.check()) {
      this.set('error', req.gettext(valid.get('errors')[0]));
    }
    async.series({

      openConnection: function(fn) {
        _this.fbConnectionOpen(fn);
      },

      startTransaction: function(fn) {
        _this.fbTransactionStart(fn);
      },

      userExist: function(fn) {
        var tr;
        if (_this.get('fb_transaction')) {
          tr = _this.get('fb_transaction');
          tr.query(_this.sqlUserExist(), function(err, result) {
            if ((result != null ? result.length : void 0) != null) {
              if (result.length < 1) {
                _this.fbCheckError('User not found', fn);
              } else {
                if (result[0].status !== 0) {
                  _this.fbCheckError('Account is not active', fn);
                } else {
                  if (result[0].userpsw.toString().length < 1) {
                    _this.fbCheckError('The user has no password', fn);
                  } else {
                    _this.set({
                      id:   result[0].id,
                      name: result[0].username,
                      hash: result[0].userpsw
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
      },

      userGroupAllow: function(fn) {
        var tr;
        if (_this.get('fb_transaction')) {
          tr = _this.get('fb_transaction');
          tr.query(_this.sqlUserGroupAllow(), function(err, result) {
            if ((result != null ? result.length : void 0) != null) {
              if (result.length < 1) {
                _this.fbCheckError('You are not allowed to login', fn);
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
      }

    }, function(err, results) {
      _this.fbConnectionClose();
      _this.checkPassword();
      if (!_this.get('error')) {
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
      user_id:  this.get('id'),
      force:    this.get('force')
    });

    session.start(function(err, result) {

      if (err) {
        _this.set('error', req.gettext("Create a session failed"));
      } else {
        _this.set('session_id',       result.session_id);
        _this.set('session_success',  result.session_success);
        _this.set('session_startdt',  result.session_startdt);
        _this.set('session_open',     result.session_open);
        _this.set('workstation_id',   result.workstation_id);
        _this.set('workstation_name', result.workstation_name);
        _this.set('result', 'success');
      }

      fn();

    });
  },

  checkPassword: function() {
    var hash, req;
    if (!this.get('error')) {

      req = this.get('req') ? this.get('req') : {
        gettext: function(s) {
          return s;
        }
      };

      hash = md5(this.get('password'));

      if (!this.get('hash')) {
        this.set('hash', '0000');
      }

      if (this.get('hash').toString().toUpperCase() !== hash.toString().toUpperCase()) {
        this.set('error', req.gettext('Incorrect login or password'));
      }

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
      user_id:  this.get('id'),
    });

    session.check(function() {
      session.close(function() {
        _this.set('error',            session.get('error'));
        _this.set('result',           session.get('result'));
        _this.set('session_id',       session.get('session_id'));
        _this.set('session_startdt',  session.get('session_startdt'));
        _this.set('session_open',     session.get('session_open'));
        _this.set('workstation_id',   session.get('workstation_id'));
        // console.log('session:',  session.toJSON());
        fn();
      });
    });

  },

  sqlUserExist: function() {
    return "select \n" +
           "id, status, username, userpsw \n" +
           "from sp$users \n" +
           "where \n" +
           "(userlogin = '" + (this.get('login')) + "')";
  },

  sqlUserGroupAllow: function() {
    return "select \n" +
           "id \n" +
           "from sp$group_detail \n" +
           "where \n" +
           "(group_id = " + (this.get('web_group_id')) + ") \n" +
           "and \n" +
           "(grouptable_id = " + (this.get('id')) + ")";
  }

});

exports = module.exports = Signin;
