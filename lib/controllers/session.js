var Backbone, Firebird, Session, async, exports, os, _;

_ =         require('lodash');
Backbone =  require('backbone');
async =     require('async');
os =        require('os');

Firebird = require(process.env.APP_DIR + '/lib/controllers/firebird');

Session = Firebird.extend({

  defaults: function() {
    return {
      user_id:           null,
      compname:          "web: " + (os.hostname()),
      compip:            process.env.PORT ? process.env.PORT.toString() : '2527',
      mac:               "" + (os.type()) + ", " + (os.arch()) + ", " + (os.release()),
      force:             0,
      doevent:           0,
      endflag:           0,
      prog:              'SPACEPRO',
      regdata:           '',
      session_id:        null,
      session_open:      false,
      workstation_id:    null,
      workstation_name:  '',
      success:           0,
      error:             null,
      fb_connection:     null,
      fb_transaction:    null
    };
  },

  initialize: function() {
    var req;
    if (this.get('req')) {
      req = this.get('req');
      if (req.headers['user-agent'] != null) {
        this.set('regdata', req.headers['user-agent']);
      }
    }
  },

  start: function(user_id, force, fn) {
    var args,
      _this = this;
    args = _.toArray(arguments);
    switch (args.length) {
      case 0:
        user_id =  this.get('user_id');
        force =    this.get('force');
        fn =       function() {};
      break;
      case 1:
        user_id =  this.get('user_id');
        force =    this.get('force');
        fn =       args[0];
      break;
      case 2:
        user_id =  args[0];
        force =    this.get('force');
        fn =       args[1];
      break;
    }

    force = force === true || force === 1 ? 1 : 0;
    this.set('force', force);

    if (fn == null) {
      fn = function() {};
    }

    if (user_id == null) {
      user_id = 0;
    }
    this.set('user_id', user_id);

    async.series({
      openConnection: function(fn) {
        _this.fbConnectionOpen(fn);
      },

      startTransaction: function(fn) {
        _this.fbTransactionStart(fn);
      },

      newSession: function(fn) {
        var tr;
        if (_this.get('fb_transaction')) {
          tr = _this.get('fb_transaction');
          tr.query(_this.sqlNewSession(), function(err, result) {
            if (result != null) {
              _this.set({
                session_id:        result[0].session_id,
                session_success:   result[0].success,
                workstation_id:    result[0].workstation_id,
                workstation_name:  result[0].ws_name
              });
              if (_this.get('session_success') === 0) {
                _this.set('session_open', false);
                tr.query(_this.sqlStartdtForSession(), function(err, result) {
                  if (result != null) {
                    _this.set('session_startdt', result[0].startdt);
                    _this.fbTransactionCommit(tr, fn);
                  } else {
                    _this.fbCheckError(err, fn);
                  }
                });
              } else {
                _this.set('session_open', true);
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
      fn(_this.get('error'), {
        session_id:        _this.get('session_id'),
        session_success:   _this.get('session_success'),
        session_startdt:   _this.get('session_startdt'),
        session_open:      _this.get('session_open'),
        workstation_id:    _this.get('workstation_id'),
        workstation_name:  _this.get('workstation_name')
      });
    });
  },

  close: function(session_id, endflag, doevent, fn) {
    var args,
      _this = this;
    args = _.toArray(arguments);
    switch (args.length) {
      case 0:
        session_id =  this.get('session_id');
        endflag =     this.get('endflag');
        doevent =     this.get('doevent');
        fn =          function() {};
      break;
      case 1:
        session_id =  this.get('session_id');
        endflag =     this.get('endflag');
        doevent =     this.get('doevent');
        fn =          args[0];
      break;
      case 2:
        session_id =  args[0];
        endflag =     this.get('endflag');
        doevent =     this.get('doevent');
        fn =          args[1];
      break;
      case 3:
        session_id =  args[0];
        endflag =     args[1];
        doevent =     this.get('doevent');
        fn =          args[2];
      break;
    }
    endflag = endflag === true || endflag === 1 ? 1 : 0;
    doevent = doevent === true || doevent === 1 ? 1 : 0;
    this.set('session_id', session_id);
    this.set('endflag', endflag);
    this.set('doevent', doevent);

    if (fn == null) {
      fn = function() {};
    }

    if (session_id == null) {
      session_id = 0;
    }

    async.series({
      openConnection: function(fn) {
        _this.fbConnectionOpen(fn);
      },

      startTransaction: function(fn) {
        _this.fbTransactionStart(fn);
      },

      closeSession: function(fn) {
        var tr;
        if (_this.get('fb_transaction')) {
          tr = _this.get('fb_transaction');
          tr.query(_this.sqlCloseSession(), function(err, result) {
            if (err) {
              _this.fbCheckError(err, fn);
            } else {
              _this.set('session_open', false);
              _this.fbTransactionCommit(tr, fn);
            }
          });
        } else {
          _this.fbCheckError('Transaction not found', fn);
        }
      }
    
    }, function(err, results) {
      var result;
      result = _this.get('error') ? false : true;
      _this.fbConnectionClose();
      fn(_this.get('error'), result);
    });
  },

  check: function(user_id, fn) {
    var args,
      _this = this;
    args = _.toArray(arguments);
    switch (args.length) {
      case 0:
        user_id =  this.get('user_id');
        fn =       function() {};
      break;
      case 1:
        user_id =  this.get('user_id');
        fn =       args[0];
      break;
    }

    this.set('user_id', user_id);

    if (fn == null) {
      fn = function() {};
    }

    async.series({
      openConnection: function(fn) {
        _this.fbConnectionOpen(fn);
      },

      startTransaction: function(fn) {
        _this.fbTransactionStart(fn);
      },

      checkSession: function(fn) {
        var tr;
        if (_this.get('fb_transaction')) {
          tr = _this.get('fb_transaction');
          tr.query(_this.sqlCheckSession(), function(err, result) {
            if ((err) || (result.length < 1)) {
              _this.fbCheckError(err, fn);
            } else {
              _this.set({
                session_id:        result[0].id,
                session_startdt:   result[0].startdt,
                session_enddt:     result[0].enddt,
                workstation_id:    result[0].ws_id
              });
              _this.set('session_open', _this.get('session_enddt') ? false : true);
              _this.fbTransactionCommit(tr, fn);
            }
          });
        } else {
          _this.fbCheckError('Transaction not found', fn);
        }
      }
    
    }, function(err, results) {
      var result;
      result = _this.get('error') ? false : true;
      _this.fbConnectionClose();
      fn(_this.get('error'), result);
    });

  },

  sqlNewSession: function() {
    return "select\n" +
           "session_id, workstation_id, success, ws_name\n" +
           "from sp$pr_newsession(\n" +
           "'" + (this.get('user_id').toString()) + "',\n" +
           "'" + (this.get('compname'))           + "',\n" +
           "'" + (this.get('compip'))             + "',\n" +
           "'" + (this.get('mac'))                + "',\n" +
                 (this.get('force'))              + ",\n"  +
           "'" + (this.get('prog'))               + "',\n" +
           "'" + (this.get('regdata'))            + "'\n"  +
           ")";
  },

  sqlCheckSession: function() {
    return "select \n" +
           "first 1 \n" +
           "id, startdt, enddt, ws_id \n" +
           "from sp$sessions \n" +
           "where \n" +
           "(user_id = " + (this.get('user_id')) + ") \n" +
           "and \n" +
           "(prog = '" + (this.get('prog')) + "') \n" +
           "order by id desc";
  },

  sqlCloseSession: function() {
    return "execute procedure sp$pr_closesession(\n" +
           "'" + (this.get('session_id').toString()) + "', \n" +
           "'" + (this.get('endflag').toString())    + "', \n" +
           "'" + (this.get('session_id').toString()) + "', \n" +
           "'" + (this.get('doevent').toString())    + "'\n"  +
           ")";
  },

  sqlStartdtForSession: function() {
    return "select \n" +
           "startdt \n" +
           "from sp$sessions \n" +
           "where \n" +
           "(id = '" + (this.get('session_id').toString()) + "')";
  }

});

exports = module.exports = Session;
