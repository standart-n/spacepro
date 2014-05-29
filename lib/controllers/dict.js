
var _, async, ini, str, Grid, Firebird, Dict, Sqlmaster;

_ =          require('lodash');
async =      require('async');

Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');
Sqlmaster =  require(process.env.APP_DIR + '/lib/controllers/sqlmaster');
Grid =       require(process.env.APP_DIR + '/lib/controllers/grid');
ini =        require(process.env.APP_DIR + '/lib/controllers/ini');
str =        require(process.env.APP_DIR + '/lib/controllers/str');

Dict = Firebird.extend({

  defaults: function() {
    return {
      id:                  0,
      sid:                 '',
      parent_id:           0,
      selectRowIndex:      0,
      selectRowUUID:       '',
      limit:               50,
      caption:             '',
      query:               '',
      ViewID:              '',
      status:              0,
      description:         '',
      columns:             {},
      fields:              {},
      hiddenFieldsXS:      [],
      hiddenFieldsSM:      [],
      hiddenFieldsMD:      [],
      hiddenFieldsLG:      [],
      data:                {},
      settings:            {},
      childs:              [],
      childsInfo:          [],
      keys:                {},
      vals:                {},
      insertdt:            null,
      fb_global:           true,
      initChilds:          true,
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

  render: function(fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    this.initBySid(function() {
       async.parallel({
        data: function(fn) {
          _this.getData(function() {
            if (_this.get('initChilds') === true) {
              _this.initChilds(fn);            
            } else {
              fn();
            }
          });
        },
        grid: function(fn) {
          _this.getGrid(fn);
        }
      }, function() {
        _this.checkHiddenFields();
        _this.fbTransactionCommit();
        fn();
      });
    });

  },


  initBySid: function(fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    async.series({
      getIni: function(fn) {
        var tr;
        _this.fbTransactionOpen(function() {
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
        });
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
      tr.query(this.sqlGetData(), function(err, result, fields) {
        _this.set('fields', _this.getFields(fields));
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
      id:           result.id                 || null,
      parent_id:    result.parent_id          || '0',
      caption:      result.caption            || 'dict',
      status:       result.status             || 0,
      description:  result.description        || null,
      sid:          result.sid.trim()         || null,      
      insertdt:     result.insertdt           || null,
      settings:     ini.parse(result.ini, {
        textFields: this.get('textFields') || []
      } || {})
    });

    this.getSqlInfo();
    this.getHiddenFields();
    this.getChildsInfo();
  },

  getHiddenFields: function() {
    var main, 
      settings, 
      hiddenFieldsXS,
      hiddenFieldsSM,
      hiddenFieldsMD,
      hiddenFieldsXS;

    settings = this.get('settings') || {};
    main =     settings.main || {};

    hiddenFieldsXS = main.hidden_xs || '';
    hiddenFieldsSM = main.hidden_sm || '';
    hiddenFieldsMD = main.hidden_md || '';
    hiddenFieldsLG = main.hidden_LG || '';

    this.set({
      hiddenFieldsXS: str.parseStringToArray(hiddenFieldsXS),
      hiddenFieldsSM: str.parseStringToArray(hiddenFieldsSM),
      hiddenFieldsMD: str.parseStringToArray(hiddenFieldsMD),
      hiddenFieldsLG: str.parseStringToArray(hiddenFieldsLG),
    });

  },

  checkHiddenFields: function() {
    var columns,
      hiddenFieldsXS,
      hiddenFieldsSM,
      hiddenFieldsMD,
      hiddenFieldsXS;

    columns =        this.get('columns') || {};
    hiddenFieldsXS = this.get('hiddenFieldsXS') || [];
    hiddenFieldsSM = this.get('hiddenFieldsSM') || [];
    hiddenFieldsMD = this.get('hiddenFieldsMD') || [];
    hiddenFieldsLG = this.get('hiddenFieldsLG') || [];

    _.each(columns, function(column) {
      column.HiddenClass = '';
      if (_.indexOf(hiddenFieldsXS, column.Field) > -1) {
        column.HiddenClass += 'hidden-xs';
        column.HiddenXS = true;
      } else {
        column.HiddenXS = false;
      }
      if (_.indexOf(hiddenFieldsSM, column.Field) > -1) {
        column.HiddenClass += ' hidden-sm';
        column.HiddenSM = true;
      } else {
        column.HiddenSM = false;
      }
      if (_.indexOf(hiddenFieldsMD, column.Field) > -1) {
        column.HiddenClass += ' hidden-md';
        column.HiddenMD = true;
      } else {
        column.HiddenMD = false;
      }
      if (_.indexOf(hiddenFieldsLG, column.Field) > -1) {
        column.HiddenClass += ' hidden-lg';
        column.HiddenLG = true;
      } else {
        column.HiddenLG = false;
      }
      column.HiddenClass = column.HiddenClass.trim();
      console.log(column.HiddenClass);
    });

    this.set('columns', columns);
  },

  getSqlInfo: function() {
    var settings, sqlmaster;

    settings =  this.get('settings') || {};
    sqlmaster = this.get('sqlmaster') || new Sqlmaster();

    sqlmaster.extVals(this.get('vals'));
    sqlmaster.extKeys(this.get('keys'));

    sqlmaster.set({
      query:        this.get('query')                       || null,
      limit:        this.get('limit')                       || 100,
      selectsql:    settings.selectsql                      || null,
      insertsql:    settings.insertsql                      || null,
      refreshsql:   settings.refreshsql                     || null,
      deletesql:    settings.deletesql                      || null,
      cfselect:     settings.cfSelect.selectfieldexpression || null
    });

    this.set('sqlmaster', sqlmaster);

  },

  getChildsInfo: function() {
    var settings,
      childsInfo = [];

    settings = this.get('settings') || {};

    _.each(settings, function(block, caption) {
      if (caption.match(/child_/)) {
        block.index = caption.replace(/child_/,'');
        childsInfo[block.index] = block;
      }
    });
    this.set('childsInfo', childsInfo);
    return childsInfo;

  },

  initChilds: function(fn) {
    var settings,
      parallels = [],
      childs = [],
      childsInfo = [],
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    settings =    this.get('settings')    || {};
    childsInfo =  this.get('childsInfo')  || [];

    _.each(childsInfo, function(childInfo, index) {
      parallels.push(function(fn) {
        if (childInfo.defaultdocksite !== 'none') {
          _this.initChild(childInfo, function(child) {
            childs[index] = child;
            childs[0] = child;
            fn();
          });
        } else {
          fn();
        }
      });
    });

    async.parallel(parallels, function() {
      _this.set('childs', childs);
      fn();
    });

  },

  initChild: function(conf, fn) {
    var settings, child, sqlmaster,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    // sqlmaster = this.get('sqlmaster') || new Sqlmaster();
    sqlmaster = new Sqlmaster();

    child = new Dict({
      sid: conf.wdict || ''
    });

    if (conf.afterscroll != null) {
      sqlmaster.parseString(conf.afterscroll);
      sqlmaster.extVals(this.getSelectLineByIndex() || {}, true);
      child.set('sqlmaster', sqlmaster);
    }

    child.initBySid(function() {
      async.parallel({
        grid: function(fn) {
          child.getGrid(fn);
        },
        data: function(fn) {
          child.getData(fn);
        }
      }, function() {
        child.fbTransactionCommit(function() {
          fn(child);
        });
      });
    });    
  },

  getChildByIndex: function(index) {
    var childs;
    return (this.get('childs') || [])[index || 0] || {};
  },

  getChildInfoByIndex: function(index) {
    var childsInfo;
    return (this.get('childsInfo') || [])[index || 0] || {};
  },

  getSelectLineByIndex: function(index) {
    var uuid, line, ind = index || this.get('selectRowIndex') || 0;

    line = (this.get('data') || {})[ind] || {};
    uuid = line.d$uuid || '';
    this.set('selectRowIndex', ind);
    this.set('selectRowUUID', uuid);
    return line;
  },

  sqlGetData: function(sql) {
    var sqlmaster;
    sqlmaster = this.get('sqlmaster') || new Sqlmaster();
    return sqlmaster.select();
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
