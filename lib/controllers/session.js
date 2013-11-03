var Backbone, Firebird, Session, async, exports, os, _;

_ =         require('lodash');
Backbone =  require('backbone');
async =     require('async');
os =        require('os');

Firebird = require(process.env.APP_DIR + '/lib/controllers/firebird');

Session = Firebird.extend({
  defaults: function() {
    return {
      user_id:          null,
      compname:         "web: " + (os.hostname()),
      compip:           process.env.PORT ? process.env.PORT.toString() : '2527',
      mac:              "" + (os.type()) + ", " + (os.arch()) + ", " + (os.release()),
      force:            0,
      prog:             'SPACEPRO',
      regdata:          '',
      session_id:       null,
      workstation_id:   null,
      success:          0,
      startdt:          null,
      ws_name:          '',
      error:            null,
      fb_connection:    null,
      fb_transaction:   null
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
    this.set('user_id', user_id);
    this.set('force', force);

    if (fn == null) {
      fn = function() {};
    }

    if (user_id == null) {
      user_id = 0;
    }

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
                session_id:      result[0].session_id,
                workstation_id:  result[0].workstation_id,
                success:         result[0].success,
                ws_name:         result[0].ws_name
              });
              if (_this.get('success') === 0) {
                tr.query(_this.sqlStartdtForSession(), function(err, result) {
                  if (result != null) {
                    _this.set('startdt', result[0].startdt);
                    _this.fbTransactionCommit(tr, fn);
                  } else {
                    _this.fbCheckError(err, fn);
                  }
                });
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
      fn(_this.get('error'), {
        session_id:      _this.get('session_id'),
        workstation_id:  _this.get('workstation_id'),
        success:         _this.get('success'),
        ws_name:         _this.get('ws_name'),
        startdt:         _this.get('startdt')
      });
    });
  },

  sqlNewSession: function() {
    return "select\n"
         + "session_id, workstation_id, success, ws_name\n"
         + "from sp$pr_newsession(\n"
         + "'" + (this.get('user_id').toString()) + "',\n"
         + "'" + (this.get('compname'))           + "',\n"
         + "'" + (this.get('compip'))             + "',\n"
         + "'" + (this.get('mac'))                + "',\n" 
         +       (this.get('force'))              + ",\n"
         + "'" + (this.get('prog'))               + "',\n"
         + "'" + (this.get('regdata'))            + "'\n"
         + ")";
  },

  sqlStartdtForSession: function() {
    return "select\n"
         + "startdt\n"
         + "from sp$sessions\n"
         + "where\n"
         + "(id = '" + (this.get('session_id').toString()) + "')";
  }

});

exports = module.exports = Session;
