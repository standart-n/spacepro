
/*
Модуль для работы с фильтрами
@module Filter
*/

var _ =          require('lodash');
var async =      require('async');
var moment =     require('moment');
var mongoose =   require('mongoose');

var Firebird =   require(process.env.APP_DIR + '/lib/controllers/firebird');
var DictSchema = require(process.env.APP_DIR + '/lib/schemas/dict');

var DictModel =  mongoose.model('Dict', DictSchema);

/*
Инициализация класса

`var filter = new Filter(options);`

@param {object} options
@class filter
@extends Firebird
*/

var Filter = Firebird.extend({

  defaults: function() {
    return {
      filters:      [],
      fb_global:   true
    };
  },

  initialize: function() {
  }

});


/*
@api public
*/

Filter.prototype.getListOfFilters = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.query(_this.sqlFilterList(), function(err, res) {
        db.detach();
        if (!err) {
          fn(null, res);
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
@api public
*/

Filter.prototype.updateAllFilters = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.getListOfFilters(function(err, filters) {
    if (!err) {
      async.eachSeries(filters, function(filter, cb) {
        _this.updateDicts(filter, cb);
      }, function(err) {
        if (!err) {
          fn();
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
@api public
*/

Filter.prototype.updateDicts = function(filter, fn) {
  var _this = this;

  if (filter == null) {
    filter = {};
  }

  if (fn == null) {
    fn = function() {};
  }

  if (!filter.wdict_id) {
    filter.wdict_id = '';
  } else {
    filter.wdict_id = filter.wdict_id.toString().trim();
  }

  if (!filter.caption) {
    filter.caption = '';
  } else {
    filter.caption = filter.caption.toString().trim();
  }

  if (!filter.sqltext) {
    filter.sqltext = '';
  } else {
    filter.sqltext = filter.sqltext.toString().trim();
  }

  if ((filter.wdict_id !== '') && (filter.caption !== '') && (filter.sqltext !== '')) {
    DictModel.findOne({
      'dict_id': filter.wdict_id
    }, function(err, dict) {
      if (err) {
        _this.set('error', err);
        fn(err);
      } else {
        if (dict != null) {
          if ((!_.findWhere(dict.settings.filters, {'caption': filter.caption})) && (!_.findWhere(dict.settings.filters, {'sqltext': filter.sqltext}))) {
            dict.settings.filters.push(filter);
            dict.save(function(err) {
              if (err) {
                fn(err);
              } else {
                var log = (moment().format('HH:mm:ss.SSS').blue)  + " " +
                      (moment().format('DD/MM/YYYY').magenta)     + " " +
                      "update".green                              + " " +
                      "Filter".cyan                               + " " +
                       filter.caption.yellow                      + " " +
                       dict.sid.red;
                console.log(log);
                fn();
              }
            });
          } else {
            fn();
          }
        } else {
          fn('Data not found! dict_id:' + filter.wdict_id + ' ' + filter.caption);
        }
      }
    });    
  } else {
    fn('Undefined name');
  }
};

/*
@api private
*/

Filter.prototype.sqlFilterList = function() {
  return "select " +
         "f.id, f.caption, f.wdict_id, f.user_id, f.sqltext, f.insertdt, f.systemflag " +
         "from sp$userfilters f " +
         "where (1=1) " +
         "and (f.systemflag = 1) " +
         "order by f.caption asc ";
};


/*
@export Group
*/

exports = module.exports = Filter;

exports.filter = new Filter();

