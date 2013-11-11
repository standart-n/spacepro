var Backbone, fb, _;

_ =         require('lodash');
Backbone =  require('backbone');
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
      error:          null,
      hide_errors:    true
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

    if (!this.get('error')) {
      if (!this.get('fb_connection')) {
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
  },

  fbConnectionClose: function() {
    var connect;
    if (this.get('fb_connection')) {
      connect = this.get('fb_connection');
      connect.detach();
      this.unset('fb_connection');
    }
  },

  fbTransactionStart: function(fn) {
    var connect,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

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
    var req;

    if (fn == null) {
      fn = function() {};
    }

    if (err != null) {
      req = this.get('req') ? this.get('req') : {
        gettext: function(s) {
          return s;
        }
      };
      if (typeof err === 'object') {
        err = JSON.stringify(err);
      }
      if (typeof err === 'function') {
        err = err();
      }
      err = req.gettext(err);
      if (!this.get('error')) {
        this.set('error', err);
        if (!this.get('hide_errors')) {
          console.error(err.red);
        }
      }      
      this.fbTransactionRollback();
      this.fbConnectionClose();
      fn(err);
      return true;
    } else {
      return false;
    }
  }

});