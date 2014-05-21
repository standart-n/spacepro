var Backbone, fb, _;

_ =         require('lodash');
Backbone =  require('backbone');
moment =    require('moment');
fb =        require('node-firebird');

exports = module.exports = Backbone.Model.extend({

  defaults: function() {
    return {
      fb_host:        process.env.FIREBIRD_HOST,
      fb_database:    process.env.FIREBIRD_PATH,
      fb_user:        process.env.FIREBIRD_USER,
      fb_password:    process.env.FIREBIRD_PASSWORD,
      fb_connection:  null,
      fb_transaction: null,
      fb_error:       null,
      fb_hide_errors: true,
      fb_global:      true
    };
  },

  initialize: function() {
    //
  },

  fbConnectionCreate: function(fn) {

    if (fn == null) {
      fn = function() {};
    }

    this.set({
      fb_host:        this.get('fb_host')       || process.env.FIREBIRD_HOST      || '',
      fb_database:    this.get('fb_database')   || process.env.FIREBIRD_PATH      || '',
      fb_user:        this.get('fb_user')       || process.env.FIREBIRD_USER      || '',
      fb_password:    this.get('fb_password')   || process.env.FIREBIRD_PASSWORD  || ''
    });

    fb.attach({
      host:      this.get('fb_host'),
      database:  this.get('fb_database'),
      user:      this.get('fb_user'),
      password:  this.get('fb_password')
    }, function(err, connect) {
      fn(err, connect);
    });
  },

  fbConnectionOpen: function(fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    if (!this.get('fb_global')) {
      if (!this.get('fb_error')) {
        if (this.fbIsConnectionClose()) {
          this.fbConnectionCreate(function(err, connect) {
            if (connect != null) {
              _this.set('fb_connection', connect);
              fn(null, connect);
            } else {
              _this.fbCheckError(err, fn);
            }
          });
        } else {
          fn(null, this.get('fb_connection'));
        }
      } else {
        fn();
      }
    } else {
      if (!this.get('fb_error')) {
        if (this.fbIsConnectionClose()) {
          // console.log('need connect');
          this.fbConnectionCreate(function(err, connect) {
            if (connect != null) {
              global.fb_connection = connect;
              fn(null, connect);
            } else {
              _this.fbCheckError(err, fn);
            }
          });
        } else {
          fn(null, global.fb_connection);
        }
      } else {
        fn();
      }
    }

  },

  fbConnectionClose: function() {
    var connect;
    if (!this.get('fb_global')) {
      if (this.get('fb_connection')) {
        connect = this.get('fb_connection');
        connect.detach();
        this.unset('fb_connection');
      }
    } else {
      if (global.fb_connection) {
        global.fb_connection.detach();
        global.fb_connection = null;
      }
    }
  },

  fbIsConnectionReady: function() {
    var connect, socket, res = false;
    if (!this.get('fb_global')) {
      connect = this.get('fb_connection');
    } else {
      connect = global.fb_connection;
    }
    if (connect != null) {
      if (connect.connection != null) {
        if (connect.connection._socket != null) {
          socket = connect.connection._socket;
          if ((socket.destroyed != null) && (socket.writable != null) && (socket.readable != null)) {
            if ((!socket.destroyed) && (socket.writable) && (socket.readable)) {
              res = true;
            }
          }
        }
      }
    }

    if ((!res) && (connect != null)) {
      if (!this.get('fb_global')) {
        this.unset('fb_connection');
        this.unset('fb_transaction');
      } else {
        global.fb_connection = null;
        this.unset('fb_transaction');
      }
    }
    return res;
  },

  fbIsConnectionClose: function() {
    return !this.fbIsConnectionReady();
  },

  fbTransactionStart: function(fn) {
    var connect,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    if (!this.get('fb_global')) {
      if (this.get('fb_connection')) {
        connect = this.get('fb_connection');
        connect.startTransaction(function(err, tr) {
          if (tr != null) {
            _this.set('fb_transaction', tr);
            fn(null, tr);
          } else {
            _this.fbCheckError(err, fn);
          }
        });
      } else {
        this.fbCheckError('Connection not found', fn);
      }
    } else {
      if (global.fb_connection != null) {
        connect = global.fb_connection;
        connect.startTransaction(function(err, tr) {
          if (tr != null) {
            _this.set('fb_transaction', tr);
            fn(null, tr);
          } else {
            _this.fbCheckError(err, fn);
          }
        });
      } else {
        this.fbCheckError('Connection not found', fn);
      }
    }

  },

  fbTransactionOpen: function(fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    this.fbConnectionOpen(function() {
      if (!_this.get('fb_error')) {
        _this.fbTransactionStart(function() {
          fn(_this.get('fb_error'), _this.get('fb_transaction'));
        });
      } else {
        fn(_this.get('fb_error'));
      }
    });
  },

  fbTransactionCommit: function(tr, fn) {
    var args,
      _this = this;
    args = _.toArray(arguments);
    switch (args.length) {
      case 0:
        tr = this.get('fb_transaction');
        fn = function() {};
      break;
      case 1:
        tr = this.get('fb_transaction');
        fn = args[0];
      break;
    }

    if (fn == null) {
      fn = function() {};
    }

    if (tr != null) {
      tr.commit(function(err) {
        _this.unset('fb_transaction');
        if (!_this.fbCheckError(err, fn)) {
          fn(null, 'commit');
        }
      });
    }
  },

  fbCommitAndCloseConnection: function(fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    this.fbTransactionCommit(function() {
      _this.fbConnectionClose();
      fn();
    });

  },

  fbTransactionRollback: function(tr, fn) {
    var args;
    args = _.toArray(arguments);
    switch (args.length) {
      case 0:
        tr =       this.get('fb_transaction');
        fn =       function() {};
      break;
      case 1:
        tr =       this.get('fb_transaction');
        fn =       args[0];
      break;      
    }

    if (fn == null) {
      fn = function() {};
    }

    if (tr != null) {
      tr.rollback();
      this.unset('fb_transaction');
      fn();
    }
  },

  fbCheckError: function(err, fn) {
    var req, tm;

    tm = moment().format('HH:mm:ss.SSS').red + " " + moment().format('DD/MM/YYYY').magenta;

    if (fn == null) {
      fn = function() {};
    }

    if (err != null) {
      req = this.get('req') ? this.get('req') : {
        gettext: function(s) {
          return s;
        }
      };
      if (typeof err === 'function') {
        try {
          err = err();
        } catch(_error) {
          console.log(tm, _error);
        }
      }
      if (typeof err === 'string') {
        err = req.gettext(err);
      }
      this.set('fb_error', err);
      if (!this.get('fb_hide_errors')) {
        console.error(tm, err);
      }
      this.fbTransactionRollback();
      fn(err);
      return true;
    } else {
      return false;
    }
  },

  getFieldTypes: function() {
    var types = [];
    types[452] =   'text';
    types[448] =   'varying';
    types[500] =   'short';
    types[496] =   'long';
    types[482] =   'float';
    types[480] =   'double';
    types[530] =   'd_float';
    types[510] =   'timestamp';
    types[520] =   'blob';
    types[540] =   'array';
    types[550] =   'quad';
    types[560] =   'type_time';
    types[570] =   'type_date';
    types[580] =   'int64';
    types[32764] = 'boolean';
    types[32766] = 'null';
    return types;
  },

  getFields: function(fields) {
    var caption,
      tmp = {},
      types = this.getFieldTypes() || [];

    _.each(fields, function(field) {
      if ((field.alias != null) && (field.type != null) && (types[field.type] != null)) {
        caption = field.alias.toLowerCase();
        tmp[caption] = field;
        tmp[caption].mtype = types[field.type];
      }
    });
    return tmp;
  }

});
