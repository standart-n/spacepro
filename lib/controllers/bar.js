
/*
Модуль, который генерирует вкладки со справочниками
@module Bar
*/

var _ =          require('lodash');
var md5 =        require('MD5');
var async =      require('async');
var colors =     require('colors');
var moment =     require('moment');
var mongoose =   require('mongoose');

var Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');
var Dict =       require(process.env.APP_DIR + '/lib/controllers/dict');
var DictSchema = require(process.env.APP_DIR + '/lib/schemas/dict');

var DictModel =  mongoose.model('Dict', DictSchema);

/*
Инициализация класса

`var bar = new Bar(options);`

@param {object} options
@class Bar
@extends Firebird
*/

var Bar = Firebird.extend({

  defaults: function() {
    return {
      user_id:    0,
      active:     {},
      dicts:      [],
      fb_global:  true,
      requireSid: ''
    };
  },

  initialize: function() {
  }

});

/*
Получение списка справочников из Firebird

@param {string} type all - все справочники, web - справочники для sidebar
@param {function} callback
@callback ()
@api private
*/

Bar.prototype.getDicts = function(type, fn) {
  var tr,
    sql,
    args,
    _this = this;

  args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      type =    'web';
      fn =      function() {};
    break;
    case 1:
      if (typeof(args[0]) === 'function') {
        fn =    args[0];
        type =  'web';
      } else {
        fn =    function() {};
        type=   args[0];
      }
    break;
  }    

  _this.fbTransactionOpen(function() {
    if (_this.get('fb_transaction')) {
      sql = type == 'web' ? _this.sqlGetWebDicts() : _this.sqlGetAllDicts();
      tr = _this.get('fb_transaction');
      tr.query(sql, function(err, result) {
        if ((result != null) && (!err)) {
          if (result.length < 1) {
            _this.fbCheckError('Dicts not found', fn);
          } else {
            _this.set('dicts',  result);
            _this.fbTransactionCommit();
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

};

/*
Получение списка справочников из MongoDB

@param {string} type all - все справочники, web - справочники для sidebar
@param {function} callback
@callback ()
@api public
*/

Bar.prototype.getDictsFromCache = function(type, fn) {
  var query,
    args,
    hash,
    requireSid, 
    memcached,
    _this = this;

  memcached = global.memcached;

  args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      type =    'web';
      fn =      function() {};
    break;
    case 1:
      if (typeof(args[0]) === 'function') {
        fn =    args[0];
        type =  'web';
      } else {
        fn =    function() {};
        type=   args[0];
      }
    break;
  }    

  requireSid = this.get('requireSid');
  hash = md5('dicts ' + type);

  memcached.get(hash, function(err, result) {
    if (!result) {
      if (type == 'web') {
        query = DictModel.find({
          'settings.main.showintheweb': true
        });
      } else {
        query = DictModel.find();
      }

      query.exec(function(err, dicts) {
        memcached.set(hash, JSON.stringify(dicts), 600, function() {
          _this.set('dicts', dicts);
          _this.set('active', _.findWhere(dicts, {sid: requireSid}) || dicts[0]);
          fn();
        });
      });
    } else {
      dicts = JSON.parse(result);
      _this.set('dicts', dicts);
      _this.set('active', _.findWhere(dicts, {sid: requireSid}) || dicts[0]);
      fn();
    }
  });
};

/*
Рендеринг активного справочника

@param {function} callback
@callback ()
@api public
*/

Bar.prototype.renderActiveDict = function(fn) {
  var active,
    _this = this;

  if (fn == null) {
    fn = function() {};
  }

  active = this.get('active');

  if (active !== null) {
    dict = new Dict({
      user_id:      this.get('user_id') || 0,
      dict_id:      active.dict_id,
      sid:          active.sid,
      parent_id:    active.parent_id,
      caption:      active.caption,
      status:       active.status,
      description:  active.description,
      insertdt:     active.insertdt,
      settings:     active.settings
    });

    dict.initSomeSettings();

    dict.getGrid(function() {
      dict.checkHiddenFields();
      dict.getPrivileges(function() {
        dict.initChilds(function() {
          dict.initDepDicts(function() {
            _this.set('dict', dict);
            fn();
          });
        });
      });
    });
  } else {
    fn();
  }
};

/*
Импорт данных обо всех справочниках из Firebird в MongoDB

@param {function} callback
@callback ()
@api public
*/

Bar.prototype.updateAllDicts = function(fn) {
  var dicts, 
    dictFn = [],
    _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.getDicts('all', function() {
    listOfDicts = _this.get('dicts');
    _.each(listOfDicts, function(item) {
      dictFn.push(function(fn) {
        var dict;
        dict = new Dict({
          sid: item.sid
        });
        dict.initBySid(function() {
          var log;
          log = (moment().format('HH:mm:ss.SSS').blue)      + " " +
                (moment().format('DD/MM/YYYY').magenta)     + " " +
                "update".green                              + " " +
                "Dict".cyan                                 + " " +
                 dict.get('sid').yellow;
          console.log(log);
          fn(null, dict.get('sid'));
        });
      });
    });

    async.series(dictFn, function() {
      fn();
    });
  });
};

/*
@api public
*/

Bar.prototype.upgradeDictBySid = function(sid, fn) {
  var dicts, dict;

  if ((sid == null) || (sid === '')) {
    sid = test;
  }

  dict = new Dict({
    sid:     sid,
    upgrade: true
  });

  if (fn == null) {
    fn = function() {};
  }

  dict.initBySid(function() {    
    var log, res;
    if (dict.get('error') || dict.get('fb_error')) {
      log = (moment().format('HH:mm:ss.SSS').blue)      + " " +
            (moment().format('DD/MM/YYYY').magenta)     + " " +
            "ERROR!!!".red                              + " " +
            "upgrade".green                             + " " +
            "Dict".cyan                                 + " " +
             dict.get('sid').yellow;
      console.log(log);
      fn('error');
    } else {
      log = (moment().format('HH:mm:ss.SSS').blue)      + " " +
            (moment().format('DD/MM/YYYY').magenta)     + " " +
            "upgrade".green                             + " " +
            "Dict".cyan                                 + " " +
             dict.get('sid').yellow;      
      console.log(log);
      res = dict.get('settings');
      fn(null, res);
    }
  });
};

/*
Получить массив с sid'ами всех справочников

@param {function} callback
@callback ()
@param {string} error
@param {array} sids
@api private
*/

Bar.prototype.getListOfSids = function(fn) {

  if (fn == null) {
    fn = function() {};
  }

  DictModel.find({}, 'sid', function(err, dicts) {
    if (err) {
      fn(err, null);
    } else {
      if (dicts != null) {
        fn(null, _.pluck(dicts, 'sid'));
      } else {
        fn(null, null);
      }
    }
  });
};

/*
Sql запрос на получение web-справочников

@return {string} sql
@api private
*/

Bar.prototype.sqlGetWebDicts = function() {
  return "select \n" +
         "id, caption, sid, status, sorting \n" +
         "from sp$wdicts \n" +
         "where (1=1) \n" +
         "and (sid starting with 'WEB$')" +
         "order by sorting asc";
};

/*
Sql запрос на получение всех справочников

@return {string} sql
@api private
*/

Bar.prototype.sqlGetAllDicts = function() {
  return "select \n" +
         "id, caption, sid, status, sorting \n" +
         "from sp$wdicts \n" +
         "where (1=1) \n" +
         "and (sid <> '')" +
         "and (ini <> '')" +
         "and (status <> 0)" +
         "order by id asc";
};

/*
@export Bar
*/

exports = module.exports = Bar;

exports.bar = new Bar();

