
var _, async, colors, moment, mongoose, Firebird, Bar, Dict, DictSchema;

_ =          require('lodash');
async =      require('async');
colors =     require('colors');
moment =     require('moment');
mongoose =   require('mongoose');

Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');
Dict =       require(process.env.APP_DIR + '/lib/controllers/dict');
DictSchema = require(process.env.APP_DIR + '/lib/schemas/dict');

DictModel =  mongoose.model('Dict', DictSchema);

Bar = Firebird.extend({

  defaults: function() {
    return {
      active:     {},
      dicts:      [],
      requireSid: ''
    };
  },

  initialize: function() {
  },

  getDicts: function(fn, type) {
    var tr,
      sql, 
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    if (type == null) {
      type = 'web';
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

  },

  getDictsFromCache: function(fn, type) {
    var query,
      requireSid, 
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    if (type == null) {
      type = 'web';
    }

    requireSid = this.get('requireSid');

    if (type == 'web') {
      query = DictModel.find({
        sid: /WEB\$/i
      });
    } else {
      query = DictModel.find();
    }

    query.exec(function(err, dicts) {
      _this.set('dicts', dicts);
      _this.set('active', _.findWhere(dicts, {sid: requireSid}) || dicts[0]);
      fn();
    });

  },

  renderActiveDict: function(fn) {
    var active,
      _this = this;

    if (fn == null) {
      fn = function() {};
    }

    active = this.get('active');

    dict = new Dict({
      id:           active.id,
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
      dict.initChilds(function() {
        _this.set('dict', dict);
        fn();
      });
    });

  },

  updateAllDicts: function(fn) {
    var dicts, 
      iterator,
      parallels = [],
      _this = this;

    iterator = 0;

    if (fn == null) {
      fn = function() {};
    }

    this.getDicts(function() {
      listOfDicts = _this.get('dicts');
      _.each(listOfDicts, function(item) {
        parallels.push(function(fn) {
          var dict;
          dict = new Dict({
            sid: item.sid
          });
          dict.initBySid(function() {
            var log;
            iterator ++;
            log = (moment().format('HH:mm:ss.SSS').blue)      + " " +
                  (moment().format('DD/MM/YYYY').magenta)     + " " +
                  "update".green                              + " " +
                  "Dict".cyan                                 + " " +
                   dict.get('sid').yellow;
            console.log(log);
            fn();
          });
        });
      });

      async.parallel(parallels, function() {
        fn();
      });

    }, 'all');

  },

  sqlGetWebDicts: function() {
    return "select \n" +
           "id, caption, sid, status, sorting \n" +
           "from sp$wdicts \n" +
           "where (1=1) \n" +
           "and (sid starting with 'WEB$')" +
           "order by sorting asc";
  },

  sqlGetAllDicts: function() {
    return "select \n" +
           "id, caption, sid, status, sorting \n" +
           "from sp$wdicts \n" +
           "where (1=1) \n" +
           "and (sid <> '')" +
           "and (ini <> '')" +
           "and (status <> 0)" +
           "order by id asc";
  }

});

exports = module.exports = Bar;

exports.bar = new Bar();

