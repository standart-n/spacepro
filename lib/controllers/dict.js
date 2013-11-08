
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
      columns:             '',
      data:                {},
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

  getData: function(fn) {
    var tr,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    if (this.get('selectsql')) {
      if (this.get('fb_transaction')) {
        tr = this.get('fb_transaction');
        tr.query(this.sqlGetData(), function(err, result) {
          if ((result != null) && (!err)) {
            _this.set('data', result);
            fn();
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

  getGrid: function(fn) {
    var grid,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    grid = new Grid();
    grid.getGridByViewAndUserId(this.get('ViewID'), function(err, result) {
      _this.set('columns', grid.getVisibleColumns());
      fn();
    });

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

  sqlGetData: function(sql) {
    sql = sql || this.get('selectsql') || '';
    if (!sql.match(/first/i)) {
      sql = sql.replace('select', 'select first ' + this.get('limit') + ' ');
    }
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
