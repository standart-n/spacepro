
var _, async, ini, str, mongoose, Grid, Firebird, Dict, Sqlmaster, DictSchema, DictModel;

_ =          require('lodash');
async =      require('async');
mongoose =   require('mongoose');


Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');
Sqlmaster =  require(process.env.APP_DIR + '/lib/controllers/sqlmaster');
Grid =       require(process.env.APP_DIR + '/lib/controllers/grid');
ini =        require(process.env.APP_DIR + '/lib/controllers/ini');
str =        require(process.env.APP_DIR + '/lib/controllers/str');
DictSchema = require(process.env.APP_DIR + '/lib/schemas/dict');

DictModel =  mongoose.model('Dict', DictSchema);

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
      faIcon:              '',
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
      cache:               true,
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
    this.set('sid', this.get('sid').trim());
  },

  render: function(fn) {
    var afterInit,
      cache,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    cache = this.get('cache');

    afterInit = function(fn) {
      _this.getGrid(function() {
        _this.checkHiddenFields();
        if (_this.get('fb_transaction') !== null) {
          _this.fbTransactionCommit();
        }
        fn();
      });
    };

    if (cache === true) {
      this.initBySidFromCache(function() {
        afterInit(fn);
      });
    } else {
      this.initBySid(function() {
        afterInit(fn);
      });
    }

  },

  initBySid: function(fn) {
    var _this = this, tr;

    if (fn == null) {
      fn = function() {};
    }

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

  },

  initBySidFromCache: function(fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    DictModel.findOne({
      sid:  this.get('sid')
    }, function(err, dict) {
      if (err) {
        _this.set('error', err);
        fn(err);
      } else {
        if (dict != null) {
          _this.getDictInfo(dict);
          fn();
        } else {
          fn('Data not found');
        }
      }
    });

  },

  getDictInfo: function(result) {
    var settings, main;
    
    if (result == null) {
      result = {};
    }

    if (typeof result.ini === 'string') {
      settings = ini.parse(result.ini, {
          textFields: this.get('textFields') || []
        } || {});      
    } else {
      settings = result.settings;
    }

    this.set({
      id:           result.id                 || null,
      parent_id:    result.parent_id          || '0',
      caption:      result.caption            || 'dict',
      status:       result.status             || 0,
      description:  result.description        || null,
      sid:          result.sid.trim()         || null,      
      insertdt:     result.insertdt           || null,
      settings:     settings
    });

    if (typeof result.ini === 'string') {
      this.updateCacheOfDictSettings();
    }

    this.initSomeSettings();
  },

  initSomeSettings: function() {
    this.getHiddenFields();
    this.getSqlInfo();
    this.getChildsInfo();
    this.getFaIcon();
  },

  getData: function(fn) {
    var tr,
      getDataFromDB,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    getDataFromDB = function(fn) {
      if (_this.get('fb_transaction')) {
        tr = _this.get('fb_transaction');
        tr.query(_this.sqlGetData(), function(err, result, fields) {
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
    };

    if (this.get('fb_transaction') == null) {
      _this.fbTransactionOpen(function() {
        getDataFromDB(fn);
      });
    } else {
      getDataFromDB(fn);
    }

  },

  getGrid: function(fn) {
    var grid, settings, 
      ViewID = '',
      _this = this;

    settings = this.get('settings') || {};

    if (settings.main != null) {
      ViewID = settings.main.viewid || '';
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

  updateCacheOfDictSettings: function(fn) {
    var settings,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    settings = this.get('settings') || {};

    DictModel.findOne({
      sid:  this.get('sid')
    }, function(err, dict) {
      if (err) {
        _this.set('error', err);
        fn(err);
      } else {
        if (dict != null) {
          dict.post_dt =                         Date();
          dict.parent_id =                       _this.get('parent_id')          || 0;
          dict.caption =                         _this.get('caption')            || '';
          dict.status =                          _this.get('status')             || 0;
          dict.description =                     _this.get('description')        || '';
          dict.insertdt =                        _this.get('insertdt')           || Date();
          dict.settings.main =                   settings.main                   || {};
          dict.settings.insertsql =              settings.insertsql              || '';
          dict.settings.deletesql_selected =     settings.deletesql_selected     || '';
          dict.settings.deletesql =              settings.deletesql              || '';
          dict.settings.refreshsql =             settings.refreshsql             || '';
          dict.settings.selectsqlwithdeleted =   settings.selectsqlwithdeleted   || '';
          dict.settings.selectsql =              settings.selectsql              || '';
          dict.settings.cfselect =               settings.cfselect               || {};
          dict.settings.form_show =              settings.form_show              || {};
          dict.settings.form_get =               settings.form_get               || {};
          dict.settings.editfields =             settings.editfields             || {};
          dict.settings.addfields =              settings.addfields              || {};
          dict.settings.childs =                 settings.childs                 || {};
          dict.settings.child_0 =                settings.child_0                || {};
          dict.settings.child_1 =                settings.child_1                || {};
          dict.settings.child_2 =                settings.child_2                || {};
          dict.settings.child_3 =                settings.child_3                || {};
          dict.settings.child_4 =                settings.child_4                || {};
          dict.settings.child_5 =                settings.child_5                || {};
          dict.settings.child_6 =                settings.child_6                || {};
          dict.settings.child_7 =                settings.child_7                || {};
          dict.settings.child_8 =                settings.child_8                || {};
          dict.settings.child_9 =                settings.child_9                || {};
          dict.save(function(err, result) {
            if (err) {
              console.log(_this.get('sid'), err);
            }
            fn(null);
          });
        } else {
          dict = new DictModel({
            dict_id:      _this.get('id'),
            sid:          _this.get('sid'),
            parent_id:    _this.get('parent_id'),
            caption:      _this.get('caption'),
            status:       _this.get('status'),
            description:  _this.get('description'),
            settings:     _this.get('settings'),
            insertdt:     _this.get('insertdt')
          });
          dict.save(function(err) {
            fn(null);
          });
        }
      }
    });

  },

  getHiddenFields: function() {
    var main, 
      settings;

    settings = this.get('settings') || {};
    main =     settings.main || {};

    main.hidden_xs = typeof main.hidden_xs === 'string' ? str.parseStringToArray(main.hidden_xs) : main.hidden_xs || [];
    main.hidden_sm = typeof main.hidden_sm === 'string' ? str.parseStringToArray(main.hidden_sm) : main.hidden_sm || [];
    main.hidden_md = typeof main.hidden_md === 'string' ? str.parseStringToArray(main.hidden_md) : main.hidden_md || [];
    main.hidden_lg = typeof main.hidden_lg === 'string' ? str.parseStringToArray(main.hidden_lg) : main.hidden_lg || [];

    settings.main = main;

    this.set({
      hiddenFieldsXS: settings.main.hidden_xs,
      hiddenFieldsSM: settings.main.hidden_sm,
      hiddenFieldsMD: settings.main.hidden_md,
      hiddenFieldsLG: settings.main.hidden_lg,
      settings:       settings
    });

  },

  checkHiddenFields: function() {
    var columns,
      hiddenFieldsXS,
      hiddenFieldsSM,
      hiddenFieldsMD,
      hiddenFieldsLG;

    columns =        this.get('columns') || {};
    hiddenFieldsXS = this.get('hiddenFieldsXS') || [];
    hiddenFieldsSM = this.get('hiddenFieldsSM') || [];
    hiddenFieldsMD = this.get('hiddenFieldsMD') || [];
    hiddenFieldsLG = this.get('hiddenFieldsLG') || [];

    _.each(columns, function(column) {
      column.hidden_class = '';
      if (_.indexOf(hiddenFieldsXS, column.field) > -1) {
        column.hidden_class += 'hidden-xs';
        column.hidden_xs = true;
      } else {
        column.hidden_xs = false;
      }
      if (_.indexOf(hiddenFieldsSM, column.field) > -1) {
        column.hidden_class += ' hidden-sm';
        column.hidden_sm = true;
      } else {
        column.hidden_sm = false;
      }
      if (_.indexOf(hiddenFieldsMD, column.field) > -1) {
        column.hidden_class += ' hidden-md';
        column.hidden_md = true;
      } else {
        column.hidden_md = false;
      }
      if (_.indexOf(hiddenFieldsLG, column.field) > -1) {
        column.hidden_class += ' hidden-lg';
        column.hidden_lg = true;
      } else {
        column.hidden_lg = false;
      }
      column.hidden_class = column.hidden_class.trim();
    });

    this.set('columns', columns);
  },

  getSqlInfo: function() {
    var settings, sqlmaster;

    settings =  this.get('settings') || {};
    sqlmaster = this.get('sqlmaster') || new Sqlmaster();

    sqlmaster.extVals(this.get('vals'));
    sqlmaster.extKeys(this.get('keys'));

    if (settings.cfselect == null) {
      settings.cfselect = {
        selectfieldexpression: '',
        alwayspartial: 1
      };
    }

    sqlmaster.set({
      query:        this.get('query')                       || null,
      limit:        this.get('limit')                       || 100,
      selectsql:    settings.selectsql                      || null,
      insertsql:    settings.insertsql                      || null,
      refreshsql:   settings.refreshsql                     || null,
      deletesql:    settings.deletesql                      || null,
      cfselect:     settings.cfselect.selectfieldexpression || null
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
    var parallels = [],
      childs = [],
      childsInfo = [],
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    childsInfo =  this.get('childsInfo')  || [];

    _.each(childsInfo, function(childInfo, index) {
      parallels.push(function(fn) {
        if (childInfo.defaultdocksite !== 'none') {
          _this.initChild(childInfo, function(child) {
            childs[index] = child;
            // childs[0] = child;
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
    var child, 
      sqlmaster, 
      cache,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    sqlmaster = new Sqlmaster();
    cache = this.get('cache');

    child = new Dict({
      sid: conf.wdict || ''
    });

    if (conf.afterscroll != null) {
      sqlmaster.parseString(conf.afterscroll);
      sqlmaster.extVals(this.getSelectLineByIndex() || {}, true);
      child.set('sqlmaster', sqlmaster);
    }

    if (cache === true) {
      child.initBySidFromCache(function() {
        child.getGrid(function() {          
          fn(child);        
        });
      });    
    } else {
      child.initBySid(function() {
        child.getGrid(function() {
          if (child.get('fb_transaction') !== null) {
            child.fbTransactionCommit(function() {
              fn(child);
            });
          } else {
            fn(child);
          }
        });
      });    
    }

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

  getFaIcon: function() {
    var main,
        faIcon, 
      settings;

    settings = this.get('settings') || {};
    main =     settings.main || {};
    faIcon =   main.fa_icon || '';
    this.set('faIcon', faIcon);
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
