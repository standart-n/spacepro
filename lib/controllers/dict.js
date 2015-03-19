
/*
Модуль для работы со справочниками
@module Dict
*/

var _ =          require('lodash');
var fs =         require('fs');
var async =      require('async');
var mongoose =   require('mongoose');
var md5 =        require('MD5');
var iconv =      require('iconv-lite');

var Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');
var Sqlmaster =  require(process.env.APP_DIR + '/lib/controllers/sqlmaster');
var Grid =       require(process.env.APP_DIR + '/lib/controllers/grid');
var User =       require(process.env.APP_DIR + '/lib/controllers/user');
var Privilege =  require(process.env.APP_DIR + '/lib/controllers/privilege');
var ini =        require(process.env.APP_DIR + '/lib/controllers/ini');
var str =        require(process.env.APP_DIR + '/lib/controllers/str');
var DictSchema = require(process.env.APP_DIR + '/lib/schemas/dict');

var DictModel =  mongoose.model('Dict', DictSchema);

/*
Инициализация класса

`var dictionary = new Dict(options);`

`options`:
- `sid` псевдоним справочника
- `cache` `[true]` брать данные из кэша или из базы

@param {object} options
@class Dict
@extends Firebird
*/

var Dict = Firebird.extend({

  defaults: function() {
    return {
      /* основные параметры справочника */
      id:                  0,
      sid:                 '',
      parent_id:           0,
      viewid:              '',
      status:              0,
      caption:             '',
      showcaption:         '',
      description:         '',
      settings:            {},
      upgrade:             false,
      /* макроподстановки */
      user_id:             0,
      session_id:          0,
      folder_id:           0,
      group_ids:           0,
      selected_ids:        0,
      workstation_id:      0,
      /* параметры активной строки */
      selectRowIndex:      0,
      selectRowUUID:       '',
      /* ключевые поля для sql запросов */
      returnfieldname:     'd$uuid',
      captionfieldname:    'd$uuid',
      keyfieldname:        'd$uuid',
      keys:                {},
      vals:                {},
      line:                {},
      controls:            {},
      /* пагинация и поиск */
      limit:               50,
      step:                20,
      query:               '',
      /* подсправочники */
      childs:              [],
      childsInfo:          [],
      /* зависимые справочники */
      depDictsInfo:        [],
      depDicts:            [],
      /* вставка и редактирование */
      editfields:          {},
      addfields:           {},
      /* дополнительные настройки справочника */
      privileges:          {},
      columns:             {},
      data:                {},
      fields:              {},
      faIcon:              '',
      /* служебные переменные */
      fb_global:           true,
      cache:               true,
      insertdt:            null,
      /* поиск */
      cfselect: {
        selectfieldexpression: '',
        alwayspartial: 1
      },
      renderitemsearch:    '',
      renderoptionsearch:  '',
      /* folders */
      folders:             [],
      foldergroup:         '',
      initfolder_id:       null,
      folders_visible:     0,
      /* парсинг настроек справочника */
      toolbar: {
        search:            false,
        insert:            false,
        remove:            false,
        edit:              false
      },
      hiddenFieldsXS:      [],
      hiddenFieldsSM:      [],
      hiddenFieldsMD:      [],
      hiddenFieldsLG:      [],
      registerFields: [
        'caption'
      ],
      textFields: [
        'insertsql',
        'deletesql_selected',
        'deletesql',
        'refreshsql',
        'selectsqlwithdeleted',
        'selectsql',
        'renderitemsearch',
        'renderoptionsearch'
      ]
    };
  },

  initialize: function() {
    this.set('sid', this.get('sid').toString().trim().toLowerCase());
  }

});

/*
Получить необходимую информацию о справочнике в json формате

@return {object}
@api public
*/


Dict.prototype.exportInfo = function(fn) {
  var data = {};

  if (fn == null) {
    fn = function() {};
  }

  var marina = function(dicts, fn) {
    async.eachSeries(dicts, function(dict, fn) {
      var sid =       dict.get('sid')       || '';
      var sqlmaster = dict.get('sqlmaster') || new Sqlmaster();
      if ((sid !== '') && (!data.hasOwnProperty(sid))) {
        data[sid] = {
          'el':                  "[data-dict-sid=\"" + sid + "\"]",
          'sid':                 dict.get('sid'),
          'caption':             dict.get('caption'),
          'showcaption':         dict.get('showcaption'),
          'faIcon':              dict.get('faIcon'),
          'limit':               dict.get('limit'),
          'step':                dict.get('step'),
          'query':               dict.get('query'),
          'returnfieldname':     dict.get('returnfieldname'),
          'captionfieldname':    dict.get('captionfieldname'),
          'keyfieldname':        dict.get('keyfieldname'),
          'renderitemsearch':    dict.get('renderitemsearch'),
          'renderoptionsearch':  dict.get('renderoptionsearch'),
          'privileges':          dict.get('privileges'),
          'toolbar':             dict.get('toolbar'),
          'cfselect':            dict.get('cfselect'),
          'folders':             dict.get('folders'),
          'foldergroup':         dict.get('foldergroup'),
          'initfolder_id':       dict.get('initfolder_id'),
          'folders_visible':     dict.get('folders_visible'),
          'addfields':           dict.get('addfields'),
          'editfields':          dict.get('editfields'),
          'childsInfo':          dict.get('childsInfo'),
          'selectRowUUID':       dict.get('selectRowUUID'),
          'keys':                sqlmaster.get('keys'),
          'vals':                sqlmaster.get('vals'),
          'columns':             dict.get('columns')
        };
        marina(dict.get('childs') || [], function() {
          marina(dict.get('depDicts') || [], function() {
            fn();
          });
        });
      } else {
        fn();
      }
    }, function() {
      fn();
    });
  };

  marina([this], function() {
    fn(data);
  });
};

/*
Инициализация справочника по `sid` из Firebird

@param {function} callback
@callback ()
@api public
*/

Dict.prototype.initBySid = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  _this.fbTransactionOpen(function(err, tr) {
    if (!err) {
      tr.query(_this.sqlGetByDictSid(), function(err, result) {
        if ((result != null) && (!err)) {
          if (result.length < 1) {
            _this.fbCheckError('Dict not found', fn);
          } else {
            _this.fbTransactionCommit(function() {
              _this.getDictInfo(result[0], fn);
            });
          }
        } else {
          _this.fbCheckError(err, fn);
        }
      });
    } else {
      _this.fbCheckError('Transaction not found', fn);
    }
  });
};

/*
Инициализация справочника по `sid` из MongoDB

@param {function} callback
@callback ()
@api public
*/

Dict.prototype.initBySidFromCache = function(fn) {

  var _this =     this;
  var sid =       this.get('sid');
  var hash =      md5(sid);
  var memcached = global.memcached;

  if (fn == null) {
    fn = function() {};
  }

  memcached.get(hash, function(err, result) {
    if (!result) {
      DictModel.findOne({
        sid:  sid
      }, function(err, dict) {
        if (err) {
          _this.set('error', err);
          fn(err);
        } else {
          if (dict != null) {
            memcached.set(hash, JSON.stringify(dict), 3600, function() {
              _this.getDictInfo(dict, fn);
            });
          } else {
            fn('Data not found');
          }
        }
      });
    } else {
      _this.getDictInfo(JSON.parse(result), fn);
    }
  });
};

/*
Обработка информации о справочнике, полученной из базы

@param {object}
@api private
*/

Dict.prototype.getDictInfo = function(result, fn) {
  var _this = this;
  var settings, main, path, tr, file;

  var cb = function(fn) {
    _this.updateCacheOfDictSettings(fn);
  };
  
  if (result == null) {
    result = {};
  }

  if (fn == null) {
    fn = function() {};
  }

  var sid = result.sid.toString().trim().toLowerCase();

  if (typeof result.ini === 'string') {
    path = process.env.APP_DIR + '/dicts/' + sid + '.ini';
    if (this.get('upgrade') === true) {
      file = fs.readFileSync(path);
      result.ini = iconv.decode(new Buffer(file), 'utf8');
      settings = ini.parse(result.ini, {
          textFields:      this.get('textFields')     || [],
          registerFields:  this.get('registerFields') || []
      } || {});
    } else {
      fs.writeFileSync(path, result.ini);
      settings = ini.parse(result.ini, {
          textFields:      this.get('textFields')     || [],
          registerFields:  this.get('registerFields') || []
      } || {});
    }
  } else {
    settings = result.settings;
  }

  this.set({
    sid:          sid                       || null,
    id:           result.id                 || null,
    parent_id:    result.parent_id          || '0',
    caption:      result.caption            || 'dict',
    status:       result.status             || 0,
    description:  result.description        || null,
    insertdt:     result.insertdt           || null,
    settings:     settings
  });

  this.initSomeSettings();

  if (typeof result.ini === 'string') {
    if (this.get('upgrade') === true) {
      this.fbTransactionOpen(function(err, tr) {
        if (!err) {
          tr.query(_this.sqlUpdateIniBySid(), [file], function(err, result) {
            if (!err) {
              _this.fbTransactionCommit(function() {
                cb(fn);
              });
            } else {
              _this.fbCheckError('Not upgrade dict ' + sid, cb(fn));
            } 
          });        
        } else {
          _this.fbCheckError(err, cb(fn));
        }
      });
    } else {
      cb(fn);
    }
  } else {
    fn();
  }
};

/*
Вспомогательная функция для обработчки информации о справочнике.

@api private
*/

Dict.prototype.initSomeSettings = function() {
  this.getHiddenFields();
  this.getSqlInfo();
  this.getInfoFromMainBlock();
  this.getFoldersInfo();
  this.getSearchInfo();
  this.getToolbarInfo();
  this.getSpecialFields();
};

/*
Получение данных из базы для наполнения справочника

@param {function} callback
@callback ()
@api public
*/

Dict.prototype.getData = function(fn) {
  var _this = this;
  var sql = this.sqlGetData();

  if (fn == null) {
    fn = function() {};
  }
  
  this.fbConnectionOpen(function(err, db) {
    if (!err) {
      db.query(sql, function(err, result, fields) {
        // console.log('Dict.prototype.getData', sql);
        if (!err) {
          _this.set('fields', _this.getFields(fields));
          // _this.set('data', result);
          fn(null, result);
        } else {
          _this.fbCheckError({
            fn: 'Dict.prototype.getData',
            sid: _this.get('sid'),
            sql: sql,
            err: err
          }, fn);
        }
      });
    } else {
      _this.fbCheckError('DB not found: ' + err, fn);
    }
  });

  // _this.fbTransactionOpen(function(err, tr) {
  //   if (!err) {
  //     // if (_this.get('sid') === 'uchet_user') {
  //     //   sql = "select first 50 v1.solution from vw_uchet_personal v1 left join uchet_detail_send uds on v1.id=uds.uchet_id where (((v1.user_id='38') and ((v1.user_id=uds.user_id) or (uds.user_id is null))) or (uds.user_id='38')) and (v1.id=302314) order by obj_date_int desc,id desc";
  //     // }
  //     // console.log('Dict.prototype.getData', sql);
  //     tr.query(sql, function(err, result, fields) {
  //       // console.log('Dict.prototype.getData', arguments);
  //       if (!err) {
  //         _this.fbTransactionCommit(function() {
  //           _this.set('fields', _this.getFields(fields));
  //           // _this.set('data', result);
  //           fn(null, result);
  //         });
  //       } else {
  //         _this.fbCheckError({
  //           fn: 'Dict.prototype.getData',
  //           sid: _this.get('sid'),
  //           sql: sql,
  //           err: err
  //         }, fn);
  //       }
  //     });
  //   } else {
  //     _this.fbCheckError('Transaction not found: ' + err, fn);
  //   }
  // });

};

/*
Добавление записи в справочник

@param {function} callback
@callback ()
@api public
*/

Dict.prototype.insertLine = function(fn) {
  var tr,
    controls,
    execute,
    _this = this;

  controls = this.get('controls') || {};
  
  _this.fbTransactionOpen(function(err, tr) {
    if (!err) {
      _this.executePreSql(controls, function(err, controls) {
        if (!err) {
          tr.query(_this.sqlInsert(controls), function(err, result) {
            if (!err) {
              _this.fbTransactionCommit(function() {
                console.log('insert commit', result);
                fn(null, result);
              });
            } else {
              _this.fbCheckError(err, fn);
            }
          });
        } else {
          this.fbCheckError(err, fn);
        }
      });
    } else {
      this.fbCheckError('Transaction not found: ' + err, fn);
    }
  });

};

/*
@param {function} callback
@callback ()
@api private
*/

Dict.prototype.executePreSql = function(vals, fn) {
  var addfields,
    execute,
    parallels = [];
    _this = this;

  addfields = this.get('addfields') || {};

  if (vals == null) {
    vals = {};
  }

  if (fn == null) {
    fn = function() {};
  }

  execute = function(key, value, fn) {
    var res = {};
    tr = _this.get('fb_transaction');
    tr.query(value, function(err, result) {
      if (!err) {
        res[key] = _.values(result[0])[0].toString().trim();
        vals = _.extend(vals, res);
        fn(null, result);
      } else {
        fn(err);        
      }
    });
  };

  _.each(addfields, function(value, key) {
    if (value.toString().match(/^select/i)) {
      parallels.push(function(fn) {
        execute(key, value, fn);
        // if (_this.get('fb_transaction') == null) {
        //   _this.fbTransactionOpen(function() {
        //     execute(key, value, fn);
        //   });
        // } else {
        //   execute(key, value, fn);
        // }
      });
    }
  });

  async.series(parallels, function(err, results) {
    fn(err, vals);
  });
};

/*
Удаление записи из справочника

@param {function} callback
@callback ()
@api public
*/

Dict.prototype.deleteLine = function(fn) {
  var tr,
    executeSqlInFirebird,
    _this = this;

  executeSqlInFirebird = function(fn) {
    if (_this.get('fb_transaction')) {
      tr = _this.get('fb_transaction');
      tr.query(_this.sqlDelete(), function(err, result) {
        // console.log(arguments);
        _this.fbTransactionCommit(function() {
          fn();
        });
      });
    } else {
      this.fbCheckError('Transaction not found', fn);
    }
  };

  if (this.get('fb_transaction') == null) {
    _this.fbTransactionOpen(function() {
      executeSqlInFirebird(fn);
    });
  } else {
    executeSqlInFirebird(fn);
  }
};

/*
Получение сетки для справочника

Сетка берется по `ViewID`.

@param {function} callback
@callback ()
@api public
*/

Dict.prototype.getGrid = function(fn) {
  var _this = this;

  var viewid = this.get('viewid') || '';

  if (fn == null) {
    fn = function() {};
  }

  var grid = new Grid();
  grid.getGridByViewAndUserId(viewid, function(err, result) {
    _this.set('columns', result);
    fn();
  });

};

/*
Возвращает информацию о привилегиях пользователя, 
которые относятся к данному справочнику.

@param {function} callback
@callback ()
@param {string} error
@param {object} privileges
@api public
*/

Dict.prototype.getPrivileges = function(fn) {
  var user, 
    privileges,
    def,
    sid,
    data,
    _this = this;

  def = {
    I: false,
    S: false,
    U: [],
    D: false,
    F: false
  };

  sid = this.get('sid') || '';

  sid = sid.replace(/web\_?\$?/i, '');

  user = new User({
    user_id: this.get('user_id')
  });

  user.getUserById(function(err, userData) {
    if ((err) || (!userData)) {
      fn(err || 'User data not found');
    } else {
      data = _.findWhere(userData.privileges || [], {'sid': sid}) || {};
      privileges = data.rules || {};
      privileges = _.defaults(privileges, def);
      _this.set('privileges', privileges);
      fn(null, privileges);
    }
  });
};

/*
Обновление информации о справочнике в MongoDB по `sid`

@param {function} callback
@callback ()
@api private
*/

Dict.prototype.updateCacheOfDictSettings = function(fn) {
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
      console.log('error', err);
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
        dict.settings.folders =                settings.folders                || [];
        dict.settings.insertsql =              settings.insertsql              || '';
        dict.settings.deletesql_selected =     settings.deletesql_selected     || '';
        dict.settings.deletesql =              settings.deletesql              || '';
        dict.settings.refreshsql =             settings.refreshsql             || '';
        dict.settings.selectsqlwithdeleted =   settings.selectsqlwithdeleted   || '';
        dict.settings.selectsql =              settings.selectsql              || '';
        dict.settings.cfselect =               settings.cfselect               || {};
        dict.settings.renderitemsearch =       settings.renderitemsearch       || null;
        dict.settings.renderoptionsearch =     settings.renderoptionsearch     || null;
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
        // if (_this.get('sid') == 'WEB$REQUESTS') {
        //   console.log(_this.get('sid'), settings);
        // } else {
        //   console.log(_this.get('sid'));
        // }
        dict.save(function(err) {
          if (err) {
            console.log(_this.get('sid'), err);
          }
          fn(null);
        });
      }
    }
  });

};

/*
Получение информации о колонках, 
которые нужно скрывать в зависимости от типа дисплея,
из настроек справочника.

@api private
*/

Dict.prototype.getHiddenFields = function() {
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
};

/*
Добавление информации о том, 
какие колонки на каких устройствах нужно скрывать,
к объекту `columns`.

@api private
*/

Dict.prototype.checkHiddenFields = function() {
  var columns,
    hiddenFieldsXS,
    hiddenFieldsSM,
    hiddenFieldsMD,
    hiddenFieldsLG;

  columns =        this.get('columns')        || {};
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
};

/*
Получение информации об sql запросах из настроек справочника.

@api private
*/

Dict.prototype.getSqlInfo = function() {

  var settings =  this.get('settings')  || {};
  var sqlmaster = this.get('sqlmaster') || new Sqlmaster();

  sqlmaster.extVals(this.get('vals'));
  sqlmaster.extKeys(this.get('keys'));

  if (settings.cfselect == null) {
    settings.cfselect = {
      selectfieldexpression: '',
      alwayspartial: 1
    };
  }

  sqlmaster.set({
    query:              this.get('query')                       || null,
    limit:              this.get('limit')                       || 100,
    folder_id:          this.get('folder_id')                   || null,
    line:               this.get('line')                        || {},
    controls:           this.get('controls')                    || {},
    macro: {
      user_id:          this.get('user_id')                     || '',
      session_id:       this.get('session_id')                  || '',
      folder_id:        this.get('folder_id')                   || null,
      group_ids:        this.get('group_ids')                   || '',
      selected_ids:     this.get('selected_ids')                || '',
      workstation_id:   this.get('workstation_id')              || ''
    },
    selectsql:          settings.selectsql                      || null,
    insertsql:          settings.insertsql                      || null,
    refreshsql:         settings.refreshsql                     || null,
    deletesql:          settings.deletesql                      || null,
    cfselect:           settings.cfselect.selectfieldexpression || null
  });

  this.set('sqlmaster', sqlmaster);
};

/*
@api private
*/

Dict.prototype.getFoldersInfo = function() {
  var settings =  this.get('settings')  || {};
  this.set('folders', settings.folders || []);
};

/*
Определяет какие инструменты справочника нужно выводить

@api private
*/

Dict.prototype.getToolbarInfo = function() {
  var settings, toolbar;

  toolbar =  this.get('toolbar')   || {};
  settings = this.get('settings')  || {};

  if (settings.insertsql != null) {
    if (settings.insertsql.toString().trim() !== '') {
      toolbar.insert = true;
    }
  }

  if (settings.cfselect != null) {
    toolbar.search = true;
  }

  if (settings.deletesql_selected != null) {
    toolbar.remove = true;
  }

  if (settings.editfields != null) {
    toolbar.edit = true;
  }

  if (this.get('folders_visible')) {
    toolbar.folders = true;
  }

  this.set('toolbar', toolbar);
};

/*
Получение доп. настроек поиска 

@api private
*/

Dict.prototype.getSearchInfo = function() {
  var settings, 
    selectfield,
    renderitemsearch,
    renderoptionsearch;

  settings =    this.get('settings') || {};
  selectfield = '';

  if (settings.cfselect != null) {
    if (settings.cfselect.selectfieldexpression != null) {
      selectfield = settings.cfselect.selectfieldexpression;
    }
  }

  if (settings.renderitemsearch == null) {
    // settings.renderitemsearch = selectfield || '';
    settings.renderitemsearch = '';
  }

  if (settings.renderoptionsearch == null) {
    // settings.renderoptionsearch = selectfield || '';
    settings.renderoptionsearch = '';
  }

  this.set({
    settings:              settings,
    cfselect:              settings.cfselect,
    renderitemsearch:      settings.renderitemsearch,
    renderoptionsearch:    settings.renderoptionsearch
  });
};

/* 
Получение информации для редактирования и добавления записей

@api private
*/

Dict.prototype.getSpecialFields = function() {
  var settings;

  settings =    this.get('settings') || {};

  this.set({
    addfields:   settings.addfields  || {},
    editfields:  settings.editfields || {}
  });
};

/*
Получение информации о дочерних справочниках 
из настроек данного справочника.

@api private
*/

Dict.prototype.getChildsInfo = function() {
  var childsInfo = [];
  var settings = this.get('settings') || {};

  _.each(settings, function(block, caption) {
    if (caption.match(/child_/)) {
      block.inc =   caption.replace(/child_/ig, '');
      if (block.wdict !== undefined) {
        childsInfo.push(block);
      }
      // block.wdict = block.wdict.toString().trim().toLowerCase();
      // childsInfo[block.index] = block;
    }
  });
  this.set('childsInfo', childsInfo);
  return childsInfo;
};

/*
Инициализация дочерних справочников.

@param {function} callback
@callback ()
@api public
*/

Dict.prototype.initChilds = function(fn) {
  var _this = this;
  var parallels = [];
  var childs = [];

  if (fn == null) {
    fn = function() {};
  }

  var childsInfo =  this.getChildsInfo() || [];

  async.eachSeries(childsInfo, function(childInfo, fn) {
    if ((childInfo.defaultdocksite !== 'none') && (childInfo.wdict !== undefined)) {
      _this.initChild(childInfo, function(err, child) {
        if (!err) {
          childs.push(child);
          fn();
        } else {
          fn(err);
        }
      });
    } else {
      fn();
    }
  }, function(err) {
    if (!err) {
      _this.set('childs', childs);
      fn();
    } else {
      fn(err);
    }
  });

};

/*
Вспомогательный метод для инициализации дочерних справочников,
который инициализирует отдельно взятый справочник и 
задает ему нужные настройки.

@param {object} conf - настройки дочернего справочника
@param {function} callback
@callback ()
@api private
*/

Dict.prototype.initChild = function(conf, fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  var user_id = this.get('user_id');

  var sqlmaster = new Sqlmaster();

  var child = new Dict({
    user_id:  user_id    || 0,
    sid:      conf.wdict || ''
  });

  if (conf.afterscroll != null) {
    sqlmaster.parseString(conf.afterscroll);
    sqlmaster.extVals(this.getSelectLineByIndex() || {}, true);
    child.set('sqlmaster', sqlmaster);
  }

  child.initBySidFromCache(function(err) {
    if (!err) {
      child.getGrid(function(err) {
        if (!err) {
          child.checkHiddenFields();
          child.getPrivileges(function(err) {
            if (!err) {
              child.initDepDicts(function(err) {
                if (!err) {
                  fn(null, child);
                } else {
                  fn(err);
                }
              });
            } else {
              fn(err);
            }
          });
        } else {
          fn(err);
        }
      });
    } else {
      fn(err);
    }
  });    
};

/*
Получить объект дочернего справочника по номеру.

@param {int} номер потомка
@return {object} child
@api public
*/

// Dict.prototype.getChildByIndex = function(index) {
//   var childs;
//   return (this.get('childs') || [])[index || 0] || {};
// };

/*
Получить информацию о дочернем справочнике по его номеру.

@param {int} номер потомка
@return {object} info
@api public
*/

// Dict.prototype.getChildInfoByIndex = function(index) {
//   var childsInfo;
//   return (this.get('childsInfo') || [])[index || 0] || {};
// };

/*
Получить строку справочника по ее номеру.

@param {int} номер строки
@return {object} line
@api public
*/

Dict.prototype.getSelectLineByIndex = function(index) {
  var uuid, 
    line, 
    ind,
    key;
  
  ind = index || this.get('selectRowIndex') || 0;
  key = this.get('keyfieldname') || 'd$uuid';

  line = (this.get('data') || {})[ind] || {};
  uuid = line[key] || '';

  this.set('selectRowIndex', ind);
  this.set('selectRowUUID', uuid);
  return line;
};

/*
Обработка дополнительной информации из главного блока настроек справочника.

@api private
*/

Dict.prototype.getInfoFromMainBlock = function() {

  var settings = this.get('settings') || {};
  var main =     settings.main || {};
  var caption =  main.showcaption || this.get('caption');
  caption = caption[0].toUpperCase() + caption.slice(1);
  this.set({
    'showcaption':        caption,
    'viewid':             main.viewid             || this.get('viewid'),
    'returnfieldname':    main.returnfieldname    || this.get('returnfieldname'),
    'captionfieldname':   main.captionfieldname   || this.get('captionfieldname'),
    'keyfieldname':       main.keyfieldname       || this.get('keyfieldname'),
    'faIcon':             main.fa_icon            || '',
    'foldergroup':        main.foldergroup        || '',
    'initfolder_id':      main.initfolder_id      || null,
    'folders_visible':    main.folders_visible    || 0
  });
};

/*
Получить список справочников, которые связаны с данным справочником

@api private
*/

Dict.prototype.getListOfDepDicts = function() {
  var addfields,
    editfields,
    check,
    list;

  list = [];

  check = function(value) {
    if (value.toString().match(/WDICTS\./i)) {
      return value.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
    } else {
      return null;
    }
  };

  addfields =  this.get('addfields')  || {};
  editfields = this.get('editfields') || {};

  _.each(addfields, function(value, key) {
    sid = check(value);
    if (sid) {
      list.push(sid);
    }
  });

  _.each(editfields, function(value, key) {
    sid = check(value);
    if (sid) {
      list.push(sid);
    }
  });

  this.set('depDictsInfo', list);

  return list;
};

/*
Инициализировать зависимые справочники

@api private
*/

Dict.prototype.initDepDicts = function(fn) {
  var parallels,
    user_id,
    depDicts,
    depDictsInfo,
    _this = this;

  if (fn == null) {
    fn = function() {};
  }

  depDicts  = [];
  parallels = [];

  user_id      = this.get('user_id');
  // depDictsInfo = this.get('depDictsInfo');
  depDictsInfo = this.getListOfDepDicts();

  _.each(depDictsInfo, function(sid) {
    parallels.push(function(fn) {
      var dict;
      dict = new Dict({
        sid:     sid,
        user_id: user_id
      });
      dict.initBySidFromCache(function() {
        dict.getGrid(function() {
          dict.checkHiddenFields();
          dict.getPrivileges(function() {
            depDicts.push(dict);
            fn();
          });
        });
      });
    });
  }); 

  async.parallel(parallels, function() {
    _this.set('depDicts', depDicts);
    fn();
  });
};

/*
Sql запрос на получение данных для наполнения справочника.

@return {string} sql
@api private
*/

Dict.prototype.sqlGetData = function() {
  var sqlmaster;
  sqlmaster = this.get('sqlmaster') || new Sqlmaster();
  // console.log(this.get('sid'), sqlmaster.select());
  return sqlmaster.select();
};

/*
Sql запрос на вставку новой записи

@return {string} sql
@api private
*/

Dict.prototype.sqlInsert = function(controls) {
  var sqlmaster;
  sqlmaster = this.get('sqlmaster') || new Sqlmaster();
  if (controls) {
    sqlmaster.set('controls', controls);
  }
  return sqlmaster.insert();
};

/*
Sql запрос на удаление строки из справочника

@return {string} sql
@api private
*/

Dict.prototype.sqlDelete = function() {
  var sqlmaster;
  sqlmaster = this.get('sqlmaster') || new Sqlmaster();
  return sqlmaster.del();
};

/*
Sql запрос на получение информации о справочнике 
из Firebird по `sid`.

@return {string} sql
@api private
*/

Dict.prototype.sqlGetByDictSid = function() {
  return "select \n" +
         "* \n" +
         "from sp$wdicts \n" +
         "where \n" +
         "(lower(sid) = '" + this.get('sid') + "')";
};

/*
@api private
*/

Dict.prototype.sqlUpdateIniBySid = function() {
  return "update  \n" +
         "sp$wdicts \n" +
         "set ini = ? \n" +
         "where \n" +
         "(lower(sid) = '" + this.get('sid') + "')";

};

/*
@export Dict
*/

exports = module.exports = Dict;
