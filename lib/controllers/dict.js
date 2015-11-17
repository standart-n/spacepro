
/*
Модуль для работы со справочниками
@module Dict
*/

var _ =          require('lodash');
var fs =         require('fs');
var async =      require('async');
var mongoose =   require('mongoose');
var md5 =        require('MD5');
var colors =     require('colors');
var iconv =      require('iconv-lite');
var debug =      require('debug')('dict');

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
      initOptions:         {},
      initvalue:           null,
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
      columns:             [],
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
      /* filters */
      filters:             [],
      filter_id:           null,
      /* mmbsh */
      groups:              [],
      mmbshgroup:          '',
      groupfield:          '',
      initgroup_id:        null,
      groups_visible:      0,
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
        edit:              false,
        folders:           false,
        filters:           false
      },
      hiddenFieldsXS:      [],
      hiddenFieldsSM:      [],
      hiddenFieldsMD:      [],
      hiddenFieldsLG:      [],
      visibleFieldsXS:     [],
      visibleFieldsSM:     [],
      visibleFieldsMD:     [],
      visibleFieldsLG:     [],
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
    var line        = this.get('line')        || {};
    var initOptions = this.get('initOptions') || {};
    if (initOptions.initvalue) {
      if (line[initOptions.initvalue]) {
        this.set('initvalue', line[initOptions.initvalue]);
      }
    }
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

  var recurse = function(dicts, fn) {
    async.eachSeries(dicts, function(dict, fn) {
      var sid, sqlmaster, keys;
      if (typeof(dict.get) === 'function') {
        sid =       dict.get('sid')       || '';
        sqlmaster = dict.get('sqlmaster') || new Sqlmaster();
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
            'groups':              dict.get('groups'),
            'mmbshgroup':          dict.get('mmbshgroup'),
            'groupfield':          dict.get('groupfield'),
            'viewfields':          dict.get('viewfields'),
            'filters':             dict.get('filters'),
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
          recurse(dict.get('childs') || [], function() {
            recurse(dict.get('depDicts') || [], function() {
              fn();
            });
          });
        } else {
          fn();
        }
      } else {
        keys = _.keys(dict);
        if (keys.length === 1) {
          sid = keys[0] || '';
          if ((sid !== '') && (!data.hasOwnProperty(sid))) {
            data[sid] = dict[sid];
            recurse(dict[sid].childs || {}, function() {
              recurse(dict[sid].depDicts || {}, function() {
                fn();
              });
            });
          } else {
            fn();
          }
        } else {
          data = _.extend(dict, data);
          fn();
        }
      }
    }, function() {
      fn();
    });
  };

  recurse([this], function() {
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

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.query(_this.sqlGetByDictSid(), function(err, result) {
        db.detach();
        if (!err) {
          if (result.length < 1) {
            fn('Dict not found');
          } else {
            _this.getDictInfo(result[0], fn);
          }
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
Инициализация справочника по `sid` из MongoDB

@param {function} callback
@callback ()
@api public
*/

Dict.prototype.initBySidFromCache = function(fn) {
  var _this =     this;
  var sid =       this.get('sid');
  // var hash =      md5(sid);
  // var memcached = global.memcached;

  if (fn == null) {
    fn = function() {};
  }

  debug('initBySidFromCache'.magenta, sid.yellow);

  // memcached.get(hash, function(err, result) {
  //   if (!result) {
      DictModel.findOne({
        sid:  sid
      }, function(err, dict) {
        if (!err) {
          if (dict != null) {
            var res = dict.toJSON();
            // memcached.set(hash, JSON.stringify(res), 3600, function() {
            debug('initBySidFromCache'.magenta, sid.yellow, 'success'.green);
              _this.getDictInfo(res, fn);
            // });
          } else {
            debug('initBySidFromCache'.magenta, sid.yellow, 'Dict not found'.red);
            fn(null, {});
          }
        } else {
          fn(err);
        }
      });
  //   } else {
  //     _this.getDictInfo(JSON.parse(result), fn);
  //   }
  // });
};

/*
Обработка информации о справочнике, полученной из базы

@param {object}
@api private
*/

Dict.prototype.getDictInfo = function(result, fn) {
  var _this = this;
  var settings, main, path, file;

  var cb = function(fn) {
    _this.getFIeldsStructure(function() {
      _this.updateCacheOfDictSettings(fn);
    });
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
      this.fbCreateConnection(function(err, db) {
        if (!err) {
          db.query(_this.sqlUpdateIniBySid(), [file], function(err, result) {
            db.detach();
            if (!err) {
              cb(fn);
            } else {
              cb(fn);
            }
          });
        } else {
          cb(fn);
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
  this.getInfoFromMainBlock();
  this.getFoldersInfo();
  this.getGroupsInfo();
  this.getFiltersInfo();
  this.getSearchInfo();
  this.getSqlInfo();
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

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.query(sql, function(err, result, fields) {
        db.detach();
        if (!err) {
          _this.set('fields', _this.getFields(fields));
          fn(null, result);
        } else {
          fn({
            fn: 'Dict.prototype.getData',
            sid: _this.get('sid'),
            sql: sql,
            err: err
          });
        }
      });
    } else {
      fn(err);
    }
  });
};


Dict.prototype.getInitData = function(fn) {
  var _this = this;
  var sql = this.sqlGetInitData();

  if (fn == null) {
    fn = function() {};
  }

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.query(sql, function(err, result, fields) {
        db.detach();
        if (!err) {
          fn(null, result);
        } else {
          fn({
            fn: 'Dict.prototype.getInitData',
            sid: _this.get('sid'),
            sql: sql,
            err: err
          });
        }
      });
    } else {
      fn(err);
    }
  });
};


Dict.prototype.getFieldsByTableName = function(sourcetablename, fn) {
  var _this = this;

  if (sourcetablename == null) {
    sourcetablename = '';
  }

  sourcetablename = sourcetablename.toString().trim().toUpperCase();

  if (fn == null) {
    fn = function() {};
  }

  this.fbCreateConnection(function(err, db) {
    var sql = _this.sqlGetFields(sourcetablename);
    if (!err) {
      db.query(sql, function(err, result) {
        db.detach();
        if (!err) {
          // tr.commit(function(err) {
          fn(null, result);
          // });
        } else {
          fn({
            fn: 'Dict.prototype.getFieldsByTableName',
            sid: _this.get('sid'),
            sql: sql,
            err: err
          });
        }
      });
    } else {
      fn(err);
    }
  });
};

Dict.prototype.getFIeldsStructure = function(fn) {
  var _this = this;
  var settings = this.get('settings') || {};
  var selectsql = settings.selectsql || '';
  var view = selectsql.toString().replace(/select (.*?) from ([\w\$]*)(.*)/i, '$2');
  // console.log(this.get('sid'), view.red, '!!!', selectsql);
  this.getFieldsByTableName(view, function(err, res) {
    if (!err) {
      // console.log(_this.get('sid'), view.red, res);
      settings.viewfields = res;
      _this.set('settings', settings);
      fn();
    } else {
      fn();
    }
  });
};

Dict.prototype.checkUpdateSessionId = function(sourcetablename, fn) {
  var _this = this;

  if (sourcetablename == null) {
    sourcetablename = '';
  }

  sourcetablename = sourcetablename.toString().trim().toUpperCase();

  if (fn == null) {
    fn = function() {};
  }

  this.fbCreateConnection(function(err, db) {
    var sql = _this.sqlCheckUpdateSessionId(sourcetablename);
    if (!err) {
      db.query(sql, function(err, result) {
        db.detach();
        if (!err) {
          if (result.length > 0) {
            fn(null, true);
          } else {
            fn(null, false);
          }
        } else {
          fn({
            fn: 'Dict.prototype.checkUpdateSessionId',
            sid: _this.get('sid'),
            sql: sql,
            err: err
          });
        }
      });
    } else {
      fn(err);
    }
  });
};

/*
Редактирование записи

@param {function} callback
@callback ()
@api public
*/



Dict.prototype.editLine = function(fn) {
  var groupkey;
  var _this = this;
  var controls =          this.get('controls')            || {};
  var sourcetablename =   this.get('sourcetablename')     || null;
  var keyfieldname =      this.get('keyfieldname')        || {};
  var mmbshgroup =        this.get('mmbshgroup')          || null;
  var groupfield =        this.get('groupfield')          || null;
  var line =              controls.line                   || {};
  var field =             controls.field                  || null;
  var fieldInfo =         controls.fieldInfo              || {};
  var mtype =             fieldInfo.mtype                 || null;
  var value =             controls.val                    || null;
  var key =               line[keyfieldname]              || null;

  this.checkUpdateSessionId(sourcetablename, function(err, update_session) {
    console.log('update_session', update_session);

    if (!err) {

      if (field !== 'mmbsh') {
        console.log(value);
        _this.fbCreateConnection(function(err, db) {
          var sql;
          if (!err) {
            sql = _this.sqlUpdate(sourcetablename, keyfieldname, key, field, value, update_session);
            db.query(sql, [value], function(err) {
              db.detach();
              if (!err) {
                // tr.commit(function(err) {
                fn();
                // });
              } else {
                fn({
                  fn: 'Dict.prototype.editLine',
                  sid: _this.get('sid'),
                  sql: sql,
                  err: err
                });
              }
            });
          } else {
            fn(err);
          }
        });
      } else {
        if (((value.add) || (value.del)) && (groupfield)) {
          groupkey = line[groupfield];
          _this.fbCreateConnection(function(err, db) {
            if (!err) {
              db.startTransaction(function(err, tr) {
                if (!err) {
                  async.series([
                    function(fn) {
                      if (value.add) {
                        async.each(value.add, function(group, fn) {
                          var table = sourcetablename.toUpperCase();
                          var sql =   _this.sqlAddGroup(group, groupkey, mmbshgroup);
                          tr.query(sql, [group, groupkey, mmbshgroup, 0], function(err) {
                            if (!err) {                          
                              fn();
                            } else {
                              console.log(err);
                              fn(err);
                            }
                          });
                        }, function(err) {
                          if (!err) {
                            fn();
                          } else {
                            fn(err);
                          }
                        });
                      } else {
                        fn();
                      }
                    },
                    function(fn) {
                      if (value.del) {
                        async.each(value.del, function(group, fn) {
                          var table = sourcetablename.toUpperCase();
                          var sql =   _this.sqlDeleteGroup(group, groupkey, mmbshgroup);
                          tr.query(sql, [group, groupkey, mmbshgroup, 0], function(err) {
                            if (!err) {
                              fn();
                            } else {
                              console.log(err);
                              fn(err);
                            }
                          });
                        }, function(err) {
                          if (!err) {
                            fn();
                          } else {
                            fn(err);
                          }
                        });
                      } else {
                        fn();
                      }
                    }
                  ], function(err) {
                    if (!err) {
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
                  db.detach();
                  fn(err);
                }
              });
            } else {
              fn(err);
            }
          });
        } else {
          fn();
        }

      }

    } else {
      fn(err);
    }

  });

};

/*
Добавление записи в справочник

@param {function} callback
@callback ()
@api public
*/

Dict.prototype.insertLine = function(fn) {
  var _this = this;

  var controls = this.get('controls') || {};

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.startTransaction(function(err, tr) {
        if (!err) {
          _this.executePreSql(tr, controls, function(err, vals) {
            if (!err) {
              tr.query(_this.sqlInsert(vals), function(err, result) {
                if (!err) {
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

};

/*
@param {function} callback
@callback ()
@api private
*/

Dict.prototype.executePreSql = function(tr, vals, fn) {
  var _this = this;

  var addfields = this.get('addfields') || {};

  if (vals == null) {
    vals = {};
  }

  if (fn == null) {
    fn = function() {};
  }

  async.forEachOfSeries(addfields, function(value, key, fn) {
    if (value.toString().match(/^select/i)) {
      tr.query(value, function(err, result) {
        var res = {};
        if (!err) {
          res[key] = _.values(result[0])[0].toString().trim();
          vals = _.extend(vals, res);
          fn(null, result);
        } else {
          fn(err);        
        }
      });
    } else {
      fn();
    }
  }, function(err) {
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
  var _this = this;

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      debug('deleteLine'.magenta);
      db.query(_this.sqlDelete(), function(err) {
        db.detach();
        if (!err) {
          fn();
        } else {
          debug('deleteLine'.red, err);
          fn(err);
        }
      });
    } else { 
      fn(err);
    }
  });

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
    if (!err) {
      _this.set('columns', result);
      fn();
    } else {
      fn(err);
    }
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
  var _this = this;

  var def = {
    I: false,
    S: false,
    U: [],
    D: false,
    F: false
  };

  var sid = this.get('sid') || '';

  sid = sid.replace(/web\_?\$?/i, '');

  var user = new User({
    user_id: this.get('user_id')
  });

  user.getUserById(function(err, userData) {
    if ((err) || (!userData)) {
      fn(err || 'User data not found');
    } else {
      var data = _.findWhere(userData.privileges || [], {'sid': sid}) || {};
      var privileges = data.rules || {};
      privileges = _.defaults(privileges, def);
      _this.set('privileges', privileges);
      fn();
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
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  var settings = this.get('settings') || {};

  DictModel.findOne({
    sid:  this.get('sid')
  }, function(err, dict) {
    if (err) {
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
        dict.settings.groups =                 settings.groups                 || [];
        dict.settings.folders =                settings.folders                || [];
        dict.settings.filters =                settings.filters                || [];
        dict.settings.viewfields =             settings.viewfields             || [];
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
        dict.save(function(err) {
          if (err) {
            console.log(_this.get('sid'), err);
          }
          fn();
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

  var settings = this.get('settings') || {};
  var main =     settings.main || {};

  main.hidden_xs = typeof main.hidden_xs === 'string' ? str.parseStringToArray(main.hidden_xs) : main.hidden_xs || [];
  main.hidden_sm = typeof main.hidden_sm === 'string' ? str.parseStringToArray(main.hidden_sm) : main.hidden_sm || [];
  main.hidden_md = typeof main.hidden_md === 'string' ? str.parseStringToArray(main.hidden_md) : main.hidden_md || [];
  main.hidden_lg = typeof main.hidden_lg === 'string' ? str.parseStringToArray(main.hidden_lg) : main.hidden_lg || [];

  main.visible_xs = typeof main.visible_xs === 'string' ? str.parseStringToArray(main.visible_xs) : main.visible_xs || [];
  main.visible_sm = typeof main.visible_sm === 'string' ? str.parseStringToArray(main.visible_sm) : main.visible_sm || [];
  main.visible_md = typeof main.visible_md === 'string' ? str.parseStringToArray(main.visible_md) : main.visible_md || [];
  main.visible_lg = typeof main.visible_lg === 'string' ? str.parseStringToArray(main.visible_lg) : main.visible_lg || [];

  main.visible_columns = typeof main.visible_columns === 'string' ? str.parseStringToArray(main.visible_columns) : main.visible_columns || [];

  settings.main = main;

  this.set({
    hiddenFieldsXS:  settings.main.hidden_xs,
    hiddenFieldsSM:  settings.main.hidden_sm,
    hiddenFieldsMD:  settings.main.hidden_md,
    hiddenFieldsLG:  settings.main.hidden_lg,
    visibleFieldsXS: settings.main.visible_xs,
    visibleFieldsSM: settings.main.visible_sm,
    visibleFieldsMD: settings.main.visible_md,
    visibleFieldsLG: settings.main.visible_lg,
    visibleColumns:  settings.main.visible_columns,
    settings:        settings
  });
};

/*
Добавление информации о том, 
какие колонки на каких устройствах нужно скрывать,
к объекту `columns`.

@api private
*/

Dict.prototype.checkHiddenFields = function() {

  var columns =        this.get('columns')        || [];
  var resColumns =     [];

  var hiddenFieldsXS = this.get('hiddenFieldsXS') || [];
  var hiddenFieldsSM = this.get('hiddenFieldsSM') || [];
  var hiddenFieldsMD = this.get('hiddenFieldsMD') || [];
  var hiddenFieldsLG = this.get('hiddenFieldsLG') || [];

  var visibleFieldsXS = this.get('visibleFieldsXS') || [];
  var visibleFieldsSM = this.get('visibleFieldsSM') || [];
  var visibleFieldsMD = this.get('visibleFieldsMD') || [];
  var visibleFieldsLG = this.get('visibleFieldsLG') || [];

  var visibleColumns = this.get('visibleColumns') || [];

  _.each(columns, function(column) {
    column.class_properties = '';
    column.hidden_class = '';
    column.visible_class = '';

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


    if (_.indexOf(visibleFieldsXS, column.field) > -1) {
      column.visible_class += 'visible-xs';
      column.visible_xs = true;
    } else {
      column.visible_xs = false;
    }

    if (_.indexOf(visibleFieldsSM, column.field) > -1) {
      column.visible_class += ' visible-sm';
      column.visible_sm = true;
    } else {
      column.visible_sm = false;
    }

    if (_.indexOf(visibleFieldsMD, column.field) > -1) {
      column.visible_class += ' visible-md';
      column.visible_md = true;
    } else {
      column.visible_md = false;
    }

    if (_.indexOf(visibleFieldsLG, column.field) > -1) {
      column.visible_class += ' visible-lg';
      column.visible_lg = true;
    } else {
      column.visible_lg = false;
    }

    column.hidden_class = column.hidden_class.trim();
    column.visible_class = column.visible_class.trim();
    column.class_properties = column.hidden_class + column.visible_class;
    column.class_properties = column.class_properties.trim();
  });

  if (visibleColumns.length > 0) { 
    _.each(visibleColumns, function(vColumn) {
      var i = 0;
      var column = _.findWhere(columns, {field: vColumn});
      if (column) {
        resColumns.push(column); 
      }
    });

    this.set('columns', resColumns);

  } else {

    this.set('columns', columns);

  }

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
    returnfieldname:    this.get('returnfieldname')             || 'd$uuid',
    captionfieldname:   this.get('captionfieldname')            || 'd$uuid',
    keyfieldname:       this.get('keyfieldname')                || 'd$uuid',
    initvalue:          this.get('initvalue')                   || null,
    query:              this.get('query')                       || null,
    limit:              this.get('limit')                       || 100,
    folder_id:          this.get('folder_id')                   || null,
    filter_id:          this.get('filter_id')                   || null,
    line:               this.get('line')                        || {},
    controls:           this.get('controls')                    || {},
    filters:            this.get('filters')                     || {},
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
@api private
*/

Dict.prototype.getGroupsInfo = function() {
  var _this = this;
  var settings =  this.get('settings')  || {};
  if (settings.membership) {
    _.each(settings.membership, function(value, key) {
      // console.log('mmbsh ini:', key, value);
      settings.main.mmbshgroup = key.toUpperCase();
      settings.main.groupfield = value;
      _this.set('settings', settings);
      _this.set('mmbshgroup', key);
      _this.set('groupfield', value);
    });
  } else {
    if (settings.main) {
      // console.log('mmbsh mongo:', settings.main.mmbshgroup, settings.main.groupfield);
      _this.set('groups', settings.groups || []);
    }
  }

  // this.set('folders', settings.folders || []);
};

/*
@api private
*/

Dict.prototype.getFiltersInfo = function() {
  var settings =  this.get('settings')  || {};
  this.set('filters', settings.filters || []);
};

/*
Определяет какие инструменты справочника нужно выводить

@api private
*/

Dict.prototype.getToolbarInfo = function() {

  var toolbar =  this.get('toolbar')   || {};
  var settings = this.get('settings')  || {};

  if (settings.insertsql != null) {
    if (settings.insertsql.toString().trim() !== '') {
      toolbar.insert = true;
    }
  }

  if (settings.cfselect != null) {
    toolbar.search = true;
  }

  if (settings.deletesql != null) {
    if (settings.deletesql.toString().trim().length > 3) {
      toolbar.remove = true;
    }
  }

  if (settings.editfields != null) {
    toolbar.edit = true;
  }

  if (this.get('folders_visible')) {
    toolbar.folders = true;
  }

  if (this.get('filters').length > 0) {
    toolbar.filters = true;
  }

  this.set('toolbar', toolbar);
};

/*
Получение доп. настроек поиска 

@api private
*/

Dict.prototype.getSearchInfo = function() {

  var settings =    this.get('settings') || {};
  var selectfield = '';

  if (settings.cfselect != null) {
    if (settings.cfselect.selectfieldexpression != null) {
      selectfield = settings.cfselect.selectfieldexpression;
    }
  }

  if (settings.renderitemsearch == null) {
    settings.renderitemsearch = '';
  }

  if (settings.renderoptionsearch == null) {
    settings.renderoptionsearch = '';
  }

  this.set({
    settings:              settings,
    cfselect:              settings.cfselect,
    viewfields:            settings.viewfields,
    renderitemsearch:      settings.renderitemsearch,
    renderoptionsearch:    settings.renderoptionsearch
  });
};

/* 
Получение информации для редактирования и добавления записей

@api private
*/

Dict.prototype.getSpecialFields = function() {

  var settings = this.get('settings') || {};

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

  debug('initChild'.magenta, conf.wdict.yellow);

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
                  // fn(null, child);
                  child.exportInfo(function(data) {
                    debug('initChild'.magenta, conf.wdict.yellow, 'finish'.green.bold);
                    fn(null, data);                    
                  });
                } else {
                  debug('initChild'.red, 'initDepDicts'.yellow, conf.wdict.blue, err);
                  fn(err);
                }
              });
            } else {
              debug('initChild'.red, 'getPrivileges'.yellow, conf.wdict.blue, err);
              fn(err);
            }
          });
        } else {
          debug('initChild'.red, 'getGrid'.yellow, conf.wdict.blue, err);
          fn(err);
        }
      });
    } else {
      debug('initChild'.red, 'initBySidFromCache'.yellow, conf.wdict.blue, err);
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
  
  var ind = index || this.get('selectRowIndex') || 0;
  var key = this.get('keyfieldname') || 'd$uuid';

  var line = (this.get('data') || {})[ind] || {};
  var uuid = line[key] || '';

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
    'sourcetablename':    main.sourcetablename    || this.get('sourcetablename'),
    'returnfieldname':    main.returnfieldname    || this.get('returnfieldname'),
    'captionfieldname':   main.captionfieldname   || this.get('captionfieldname'),
    'keyfieldname':       main.keyfieldname       || this.get('keyfieldname'),
    'faIcon':             main.fa_icon            || '',
    'mmbshgroup':         main.mmbshgroup         || '',
    'groupfield':         main.groupfield         || '',
    'initgroup_id':       main.initgroup_id       || null,
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

  var list = [];

  check = function(value) {
    if (value.toString().match(/WDICTS\./i)) {
      return value.toString().replace(/WDICTS\./i, '').replace(/\(.*\)/i, '').trim();
    } else {
      return null;
    }
  };

  var addfields =  this.get('addfields')  || {};
  var editfields = this.get('editfields') || {};

  _.each(addfields, function(value, key) {
    var sid = check(value);
    if (sid) {
      list.push(sid);
    }
  });

  _.each(editfields, function(value, key) {
    var sid = check(value);
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
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  var depDicts  = [];
  var user_id   = this.get('user_id');

  async.eachSeries(this.getListOfDepDicts(), function(sid, fn) {
    _this.initDepDict(sid, function(err, dep) {
      if (!err) {
        depDicts.push(dep);
        fn();
      } else {
        fn(err);
      }
    });
  }, function(err) {
    if (!err) {
      _this.set('depDicts', depDicts);
      fn();
    } else {
      fn(err);
    }
  });
};

/*
@api private
*/

Dict.prototype.initDepDict = function(sid, fn) {

  var user_id = this.get('user_id');

  if (sid == null) {
    sid = '';
  }

  if (fn == null) {
    fn = function() {};
  }

  var dep = new Dict({
    user_id:  user_id || 0,
    sid:      sid
  });

  debug('initDepDict'.magenta, sid.yellow);

  dep.initBySidFromCache(function(err) {
    if (!err) {
      dep.getGrid(function(err) {
        if (!err) {
          dep.checkHiddenFields();
          dep.getPrivileges(function(err) {
            if (!err) {
              dep.exportInfo(function(data) {
                debug('initDepDict'.magenta, sid.yellow, 'success'.green);
                fn(null, data);
              });
            } else {
              debug('initDepDict'.red, 'getPrivileges'.yellow, sid.blue, err);
              fn(err);
            }
          });
        } else {
          debug('initDepDict'.red, 'getGrid'.yellow, sid.blue, err);
          fn(err);
        }
      });
    } else {
      debug('initDepDict'.red, 'initBySidFromCache'.yellow, sid.blue, err);
      fn(err);
    }
  });
};

/*
Sql запрос на получение данных для наполнения справочника.

@return {string} sql
@api private
*/

Dict.prototype.sqlGetData = function() {
  var sqlmaster = this.get('sqlmaster') || new Sqlmaster();
  // console.log(this.get('sid'), sqlmaster.select());
  return sqlmaster.select();
};

Dict.prototype.sqlGetInitData = function() {
  var sqlmaster = this.get('sqlmaster') || new Sqlmaster();
  // console.log(this.get('sid'), sqlmaster.select());
  return sqlmaster.initSelect();
};

/*
Sql запрос на изменение записи

@return {string} sql
@api private
*/

Dict.prototype.sqlUpdate = function(table, keyfield, key, updatefield, value, update_session) {
  var sqlmaster = this.get('sqlmaster') || new Sqlmaster();
  return sqlmaster.update(table, keyfield, key, updatefield, value, update_session);
};

/*
Sql запрос на добавление группы

@return {string} sql
@api private
*/

Dict.prototype.sqlAddGroup = function(group, key, table) {
  var sqlmaster = this.get('sqlmaster') || new Sqlmaster();
  return sqlmaster.addGroup(group, key, table);
};

/*
Sql запрос на удаление группы

@return {string} sql
@api private
*/

Dict.prototype.sqlDeleteGroup = function(group, key, table) {
  var sqlmaster = this.get('sqlmaster') || new Sqlmaster();
  return sqlmaster.deleteGroup(group, key, table);
};


/*
Sql запрос на вставку новой записи

@return {string} sql
@api private
*/

Dict.prototype.sqlInsert = function(controls) {
  var sqlmaster = this.get('sqlmaster') || new Sqlmaster();
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
  var sqlmaster = this.get('sqlmaster') || new Sqlmaster();
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

Dict.prototype.sqlGetFields = function(sourcetablename) {
  return "select \n" +
         "rdb$field_name, rdb$field_source, rdb$field_position, rdb$field_id \n" +
         "from rdb$relation_fields \n" +
         "where \n" +
         "RDB$RELATION_NAME='" + sourcetablename + "'";
};


Dict.prototype.sqlCheckUpdateSessionId = function(sourcetablename) {
  return "select \n" +
         "rdb$field_name \n" +
         "from rdb$relation_fields \n" +
         "where \n" +
         "RDB$RELATION_NAME='" + sourcetablename + "'" +
         "and (RDB$FIELD_NAME='UPDATESESSION_ID') ";
};

/*
@export Dict
*/

exports = module.exports = Dict;
