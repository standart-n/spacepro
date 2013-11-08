
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
      limit:               50,
      caption:             '',
      ViewID:              '',
      status:              0,
      description:         '',
      columns:             '',
      data:                {},
      settings:            {},
      childs:              [],
      sid:                 '',
      insertdt:            null,
      textFields: [
        'insertsql',
        'deletesql_selected',
        'deletesql',
        'refreshsql',
        'selectsqlwithdeleted',
        'selectsql'
      ]
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
                _this.getDictInfo(result[0]);
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
      fn();
    });

  },

  getData: function(fn) {
    var tr,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

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
  },

  getGrid: function(fn) {
    var grid, settings, 
      ViewID = '',
      _this = this;

    settings = this.get('settings') || {};

    if (settings.main != null) {
      ViewID = settings.main.ViewID || '';
    }


    if (fn == null) {
      fn = function() {};
    }

    grid = new Grid();
    grid.getGridByViewAndUserId(ViewID, function(err, result) {
      _this.set('columns', grid.getVisibleColumns());
      fn();
    });

  },

  getDictInfo: function(result) {
    
    if (result == null) {
      result = {};
    }

    this.set({
      'id':           result.id                 || null,
      'parent_id':    result.parent_id          || '0',
      'caption':      result.caption            || 'dict',
      'status':       result.status             || 0,
      'description':  result.description        || null,
      'sid':          result.sid                || null,
      'insertdt':     result.insertdt           || null,
      'settings':     ini.parse(result.ini, {
        textFields: this.get('textFields') || []
      } || {})
    });

    this.getChilds();
  },

  getChilds: function() {
    var settings,
      childs = [];

    settings = this.get('settings') || {};

    _.each(settings, function(block, caption) {
      if (caption.match(/child_/)) {
        block.index = caption.replace(/child_/,'');
        childs[block.index] = block;
      }
    });
    this.set('childs', childs);
    return childs;

  },

  getChildByIndex: function(index) {
    var childs;

    childs = this.get('childs') || [];

    if (index == null) {
      index = 0;
    }

    return childs[index] || {};
  },

  sqlGetData: function(sql) {
    var settings;

    settings = this.get('settings') || {};

    sql = sql || settings.selectsql || '';
    if (this.get('limit')) {
      if (!sql.match(/first/i)) {
        sql = sql.replace('select', 'select first ' + this.get('limit') + ' ');
      }
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
