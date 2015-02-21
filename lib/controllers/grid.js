
/*
Модуль для работы с сетками
@module Grid
*/

var _ =          require('lodash');
var fs =         require('fs');
var async =      require('async');
var zip =        require('zip');
var md5 =        require('MD5');
var colors =     require('colors');
var moment =     require('moment');
var iconv =      require('iconv-lite');
var mongoose =   require('mongoose');

var Firebird =     require(process.env.APP_DIR + '/lib/controllers/firebird');
var ini =          require(process.env.APP_DIR + '/lib/controllers/ini');
var GridSchema =   require(process.env.APP_DIR + '/lib/schemas/grid');

var GridModel =    mongoose.model('Grid', GridSchema);

/*
Инициализация класса

`var grid = new Grid(options);`

`options`:
- `user_1` `[-1]` id пользователя, по-умолчанию супер-админ
- `view` представление

@param {object} options
@class Grid
@extends Firebird
*/

var Grid = Firebird.extend({

  defaults: function() {
    return {
      user_id:     -1,
      userData:    {},
      view:        '',
      settings:    {},
      columns:     [],
      fb_global:   true
    };
  },

  initialize: function() {
    var view = this.get('view') || '';
    this.set('view', view.toString().toLowerCase().trim());
  }

});

/*
Получение набора сеток по `user_id` из базы Firebird.

@param {function} callback
@callback 
@param {string} error
@api public
*/

Grid.prototype.getUserDataByUserId = function(fn) {
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  getGrid = function(fn) {
    var tr;

    _this.fbTransactionOpen(function(err, tr) {
      if (!err) {
        tr.query(_this.sqlGetByUserId(), function(err, result) {
          if (!err) {
            if (result.length < 1) {
              _this.fbCheckError('Grid not found', fn);
            } else {
              _this.fbTransactionCommit(function() {
                if (result[0].userdata != null) {
                  _this.unzip(result[0].userdata);
                  fn();
                } else {
                  _this.fbCheckError('User data not found', fn);
                }
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

  getGrid(function(err, result) {
    fn(_this.get('error'));
  });
};

/*
Извлечение данных из архива, который получен из blob поля

@param {file} zip archive
@api private
*/

Grid.prototype.unzip = function(archive) {
  var files, entry, buf, file, settings, name,
    userData = {},
    charset = 'win1251';

  if (archive != null) {
    files = zip.Reader(archive);
    files.forEach(function (entry) {
      if ((entry.isFile()) && (entry.getName() != null)) {
        buf =       entry.getData();
        file =      iconv.decode(buf, charset);
        settings =  ini.parse(file);
        name =      entry.getName().toString().trim().toLowerCase();
        userData[name] = settings;
        fs.writeFileSync(process.env.APP_DIR + '/grids/' + name + '.ini', file);
      }
    });
    this.set('userData', userData); 
  }
};

/*
Получить сетку по `user_id` и `view` из MongoDB

@param {string} view
@param {int} user_id
@param {function} callback
@callback
@param {string} error
@param {object} grid
@api public
*/

Grid.prototype.getGridByViewAndUserId = function(view, user_id, fn) {
  var args,
    hash,
    memcached,
    _this = this;

  args = _.toArray(arguments);
  switch (args.length) {
    case 0:
      view =     this.get('view');
      user_id =  this.get('user_id');
      fn =       function() {};
    break;
    case 1:
      view =     this.get('view');
      user_id =  this.get('user_id');
      fn =       args[0];
    break;
    case 2:
      view =     args[0];
      user_id =  this.get('user_id');
      fn =       args[1];
    break;
  }

  if (fn == null) {
    fn = function() {};
  }

  memcached = global.memcached;
  hash = md5(JSON.stringify({
    user_id:  user_id,
    view:     view
  }));

  memcached.get(hash, function(err, result) {
    if (!result) {
      GridModel.findOne({
        user_id:  user_id,
        view:     view
      }, function(err, grid) {
        var data;
        if (err) {
          _this.set('error', err);
          fn(err);
        } else {
          if (grid != null) {
            data = grid.toJSON().settings || {};
            memcached.set(hash, JSON.stringify(data), 3600, function() {
              fn(null, data);
            });
          } else {
            fn('Data not found');
          }
        }
      });
    } else {
      fn(null, JSON.parse(result));
    }
  });

};

/*
Обновить данные о сетках пользователя 
в MongoDB по `user_id`

@param {string} view
@param {int} user_id
@param {function} callback
@callback
@param {string} error
@param {object} grid
@api public
*/

Grid.prototype.updateGridByUserId = function(fn) {
  var gridFn = [],
    _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.getUserDataByUserId(function() {     
    var user_id, userData;

    user_id =   _this.get('user_id')   || -1;
    userData =  _this.get('userData')  || {};

    _.each(userData, function(settings, view) {
      if ((view !== '') && (view !== undefined)) {
        gridFn.push(function(fn) {
          var columns;
          GridModel.findOne({
            user_id:  user_id,
            view:     view
          }, function(err, grid) {
            var log;
            if (err) {
              _this.set('error', err);
              fn(err);
            } else {
              log = (moment().format('HH:mm:ss.SSS').blue)      + " " +
                    (moment().format('DD/MM/YYYY').magenta)     + " " +
                    "update".green                              + " " +
                    "Grid".cyan                                 + " " +
                     view.yellow;
              if (grid != null) {
                grid.view =      view;
                grid.settings =  _this.getVisibleColumns(settings);
                grid.post_dt =   Date();
                grid.save(function(err) {
                  console.log(log);
                  fn(null);
                });
              } else {

                grid = new GridModel({
                  user_id:   user_id,
                  view:      view,
                  settings:  _this.getVisibleColumns(settings)
                });
                grid.save(function() {
                  console.log(log);
                  fn(null);
                });
              }
            }
          });
        });
      }
    });

    async.series(gridFn, function() {
      fn();
    });

  });
};

/*
Получить из стеки колонки, которые нужно отображать.

@return {object} columns
@api public
*/

Grid.prototype.getVisibleColumns = function(grid) {
  var settings, 
    columns = [];

  settings = grid || this.get('settings') || {};

  _.each(settings, function(block, caption) {
    if (caption.match(/gb\\columns\\gblistcolumn/)) {
      if (block.visible === '1') {
        block.field = caption.replace(/gb\\columns\\gblistcolumn/i,'').toLowerCase();
        if (block.field !== '') {
          columns[block.colindex] = block;          
        }
      }
    }
  });
  this.set('columns', columns);
  return columns;
};

/*
Sql запрос на получение файла с сетками пользователя из Firebird.

@return {string} sql
@api private
*/

Grid.prototype.sqlGetByUserId = function() {
  return "select \n" +
         "* \n" +
         "from sp$users \n" + 
         "where \n" +
         "(id = '" + this.get('user_id').toString() +"')";
};

/*
@export Grid
*/

exports = module.exports = Grid;

exports.grid = new Grid();

