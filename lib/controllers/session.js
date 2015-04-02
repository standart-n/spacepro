
var _ =         require('lodash');
var os =        require('os');
var async =     require('async');

var Firebird =  require(process.env.APP_DIR + '/lib/controllers/firebird');

var Session =   Firebird.extend({

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
      regdata:           'web',
      session_id:        null,
      session_open:      false,
      workstation_id:    null,
      workstation_name:  '',
      success:           0,
      error:             null,
      fb_global:         true,
      fb_connection:     null,
      fb_transaction:    null
    };
  },

  initialize: function() {
  }
});

Session.prototype.start = function(user_id, force, fn) {
  var _this = this;
  var args = _.toArray(arguments);
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

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.startTransaction(function(err, tr) {
        if (!err) {
          var sql = _this.sqlNewSession();
          tr.query(sql, function(err, result) {
            if (!err) {
              _this.set({
                session_id:        result[0].session_id,
                session_success:   result[0].success,
                workstation_id:    result[0].workstation_id,
                workstation_name:  result[0].ws_name
              });
              if (_this.get('session_success') === 0) {
                _this.set('session_open', false);
                sql = _this.sqlStartdtForSession();
                tr.query(sql, function(err, result) {
                  if (!err) {
                    _this.set('session_startdt', result[0].startdt);
                    tr.commit(function(err) {
                      if (!err) {
                        db.detach();
                        fn();
                      } else {
                        tr.rollback();
                        db.detach();
                        fn(err);
                      }
                    });
                  } else {
                    tr.rollback();                    
                    db.detach();
                    fn(err);
                  }
                });
              } else {
                _this.set('session_open', true);
                tr.commit(function(err) {
                  if (!err) {
                    db.detach();
                    fn();
                  } else {
                    tr.rollback();
                    db.detach();
                    fn(err);
                  }
                });
              }
            } else {
              tr.rollback();
              db.detach();
              fn({
                fn: 'Session.prototype.start',
                sql: sql,
                err: err
              });
            }
          });
        } else {
          db.detach();
          fn(err);
        }
      });
    } else {
      fn(err);
    }
  });

  // async.series({
  //   newSession: function(fn) {
  //     var tr;
  //     _this.fbTransactionOpen(function() {
  //       if (_this.get('fb_transaction')) {
  //         tr = _this.get('fb_transaction');
  //         tr.query(_this.sqlNewSession(), function(err, result) {
  //           if (result != null) {
  //             _this.set({
  //               session_id:        result[0].session_id,
  //               session_success:   result[0].success,
  //               workstation_id:    result[0].workstation_id,
  //               workstation_name:  result[0].ws_name
  //             });
  //             if (_this.get('session_success') === 0) {
  //               _this.set('session_open', false);
  //               tr.query(_this.sqlStartdtForSession(), function(err, result) {
  //                 if (result != null) {
  //                   _this.set('session_startdt', result[0].startdt);
  //                   _this.fbTransactionCommit(tr, fn);
  //                 } else {
  //                   _this.fbCheckError(err, fn);
  //                 }
  //               });
  //             } else {
  //               _this.set('session_open', true);
  //               _this.fbTransactionCommit(tr, fn);
  //             }
  //           } else {
  //             _this.fbCheckError(err, fn);
  //           }
  //         });
  //       } else {
  //         _this.fbCheckError('Transaction not found', fn);
  //       }
  //     });
  //   }
  
  // }, function(err, results) {
  //   fn(_this.get('error') || _this.get('fb_error'), {
  //     session_id:        _this.get('session_id'),
  //     session_success:   _this.get('session_success'),
  //     session_startdt:   _this.get('session_startdt'),
  //     session_open:      _this.get('session_open'),
  //     workstation_id:    _this.get('workstation_id'),
  //     workstation_name:  _this.get('workstation_name')
  //   });
  // });
};

Session.prototype.close = function(session_id, endflag, doevent, fn) {
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
    closeSession: function(fn) {
      var tr;
      _this.fbTransactionOpen(function() {
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
      });
    }
  
  }, function(err, results) {
    var result;
    result = (_this.get('error') || _this.get('fb_error')) ? false : true;
    fn(_this.get('error') || _this.get('fb_error'), result);
  });
};

Session.prototype.check = function(user_id, fn) {
  var _this = this;
  var args = _.toArray(arguments);
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

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.query(_this.sqlCheckSession(), function(err, result) {
        db.detach();
        if (!err) {
          if (result.length < 1) {
            fn('Session not found');
          } else {
            _this.set({
              workstation_id:    result[0].ws_id,
              session_id:        result[0].id,
              session_startdt:   result[0].startdt,
              session_enddt:     result[0].enddt,
              session_open:      result[0].enddt ? false : true
            });
          }
          fn();
        } else {
          fn(err);
        }
      });
    } else {
      fn(err);
    }
  });

  // async.series({
  //   checkSession: function(fn) {
  //     var tr;
  //     _this.fbTransactionOpen(function() {
  //       if (_this.get('fb_transaction')) {
  //         tr = _this.get('fb_transaction');
  //         tr.query(_this.sqlCheckSession(), function(err, result) {
  //           if (err) {
  //             _this.fbCheckError(err, fn);
  //           } else {
  //             if (result.length < 1) {
  //               _this.error('Session not found');
  //               _this.fbTransactionCommit(tr, fn);
  //             } else {
  //               _this.set({
  //                 session_id:        result[0].id,
  //                 session_startdt:   result[0].startdt,
  //                 session_enddt:     result[0].enddt,
  //                 workstation_id:    result[0].ws_id
  //               });
  //               _this.set('session_open', _this.get('session_enddt') ? false : true);
  //               _this.fbTransactionCommit(tr, fn);
  //             }
  //           }
  //         });
  //       } else {
  //         _this.fbCheckError('Transaction not found', fn);
  //       }
  //     });
  //   }
  
  // }, function(err, results) {
  //   var result;
  //   result = (_this.get('error') || _this.get('fb_error')) ? false : true;
  //   fn((_this.get('error') || _this.get('fb_error')), result);
  // });

};

// Session.prototype.error = function(err, fn) {
//   var req, error;

//   req = this.get('req') || {
//     gettext: function(s) {
//       return s;
//     }
//   };

//   if (fn == null) {
//     fn = function() {};
//   }

//   if (err != null) {
//     error = req.gettext(err);
//     this.set('error', error);
//     fn(error);
//   }
// };

Session.prototype.sqlNewSession = function() {
  return "select " +
         "session_id, workstation_id, success, ws_name " +
         "from sp$pr_newsession( " +
         "'" + (this.get('user_id').toString()) + "', " +
         "'" + (this.get('compname'))           + "', " +
         "'" + (this.get('compip'))             + "', " +
         "'" + (this.get('mac'))                + "', " +
               (this.get('force'))              + ", "  +
         "'" + (this.get('prog'))               + "', " +
         "'" + (this.get('regdata'))            + "' "  +
         ")";
};

Session.prototype.sqlCheckSession = function() {
  return "select " +
         "first 1 " +
         "id, startdt, enddt, ws_id " +
         "from sp$sessions " +
         "where " +
         "(user_id = '" + (this.get('user_id').toString()) + "') " +
         "and " +
         "(prog = '" + (this.get('prog')) + "') " +
         "order by id desc";
};

Session.prototype.sqlCloseSession = function() {
  return "execute procedure sp$pr_closesession( " +
         "'" + (this.get('session_id').toString()) + "', " +
         "'" + (this.get('endflag').toString())    + "', " +
         "'" + (this.get('session_id').toString()) + "', " +
         "'" + (this.get('doevent').toString())    + "' "  +
         ")";
};

Session.prototype.sqlStartdtForSession = function() {
  return "select " +
         "startdt " +
         "from sp$sessions " +
         "where " +
         "(id = '" + (this.get('session_id').toString()) + "')";
};


exports = module.exports = Session;
