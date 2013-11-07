
var _, async, ini, Grid, Firebird, Dict;

_ =          require('lodash');
async =      require('async');

Firebird =  require(process.env.APP_DIR + '/lib/controllers/firebird');
Grid =      require(process.env.APP_DIR + '/lib/controllers/grid');
ini =       require(process.env.APP_DIR + '/lib/controllers/ini');

Dict = Firebird.extend({

  defaults: function() {
    return {
      id:                  70,
      parent_id:           0,
      limit:               10,
      caption:             '',
      ViewID:              '',
      status:              0,
      description:         '',
      sid:                 'DEVICE_DATA',
      ini:                 '',
      insertdt:            null,
      selectsql:           null,
      sourcetablename:     null
    };
  },

  initialize: function() {

  },

  initBySid: function(fn) {
    var _this = this;

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

      getIni: function(fn) {
        var tr;
        if (_this.get('fb_transaction')) {
          tr = _this.get('fb_transaction');
          tr.query(_this.sqlGetByDictSid(), function(err, result) {
            if ((result != null) && (!err)) {
              if (result.length < 1) {
                _this.fbCheckError('Dict not found', fn);
              } else {
                _this.checkLine(result[0]);
                _this.parseIni();                
                fn();
              }
            } else {
              _this.fbCheckError(err, fn);
            }
          });
        } else {
          _this.fbCheckError('Transaction not found', fn);
        }
      }

    }, function(err, result) {

      // _this.fbConnectionClose();
      fn();

    });

  },

  selectData: function(fn) {
    var tr, grid,
      _this = this;

    if (this.get('selectsql')) {
      if (this.get('fb_transaction')) {
        tr = this.get('fb_transaction');
        tr.query(this.sqlSelectData(), function(err, result) {
          if ((result != null) && (!err)) {
            _this.fbTransactionCommit(function() {
              _this.fbConnectionClose();
              grid = new Grid();
              console.log('view:', _this.get('ViewID'));
              grid.getGridByViewAndUserId(_this.get('ViewID'), function(err, result) {
                console.log('columns', grid.getVisibleColumns());
                fn();
              });
            });
          } else {
            _this.fbCheckError(err, fn);
          }          
        });
      } else {
        this.fbCheckError('Transaction not found', fn);
      }
    } else {
      this.fbCheckError('Select sql not found', fn);
    }
  },

  parseIni: function(data) {
    
    if (data == null) {
      data = this.get('ini') || '';
    }
    
    json = ini.parse(data) || {};

    this.set({
      json:             json                       || {},
      selectsql:        json.selectsql             || '',
      sourcetablename:  json.main.sourcetablename  || '',
      ViewID:           json.main.ViewID           || ''
    });

  },

  checkLine: function(result) {
    if (result == null) {
      result = {};
    }

    this.set({
      'id':           result.id            || null,
      'parent_id':    result.parent_id     || '0',
      'caption':      result.caption       || 'dict',
      'status':       result.status        || 0,
      'description':  result.description   || null,
      'sid':          result.sid           || null,
      'ini':          result.ini           || null,
      'insertdt':     result.insertdt      || null
    });

  },

  sqlSelectData: function(sql) {
    sql = sql || this.get('selectsql') || '';
    if (!sql.match(/first/i)) {
      sql = sql.replace('select', 'select first ' + this.get('limit') + ' ');
    }
    console.log(sql);
    return sql;
  },

  sqlGetByDictSid: function() {
    return "select \n" +
           "* \n" +
           "from sp$wdicts \n" +
           "where \n" +
           "(sid = '" + this.get('sid') + "')";
  }

});

exports = module.exports = Dict;
