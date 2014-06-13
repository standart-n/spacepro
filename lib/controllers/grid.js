
/*
Модуль для работы с сетками
@module Grid
*/

var _, fs, async, colors, moment, zip, ini, mongoose, middleware, GridSchema, GridModel, Grid, Firebird, iconv;

_ =          require('lodash');
fs =         require('fs');
async =      require('async');
zip =        require('zip');
colors =     require('colors');
moment =     require('moment');
iconv =      require('iconv-lite');
mongoose =   require('mongoose');

Firebird =     require(process.env.APP_DIR + '/lib/controllers/firebird');
ini =          require(process.env.APP_DIR + '/lib/controllers/ini');
GridSchema =   require(process.env.APP_DIR + '/lib/schemas/grid');

GridModel =    mongoose.model('Grid', GridSchema);

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

Grid = Firebird.extend({

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

  initialize: function() {}

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

    _this.fbTransactionOpen(function() {
      if (_this.get('fb_transaction')) {
        tr = _this.get('fb_transaction');
        tr.query(_this.sqlGetByUserId(), function(err, result) {
          if ((result != null) && (!err)) {
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
  var files, entry, buf, file, settings,
    userData = {},
    charset = 'win1251';

  if (archive != null) {
    files = zip.Reader(archive);
    files.forEach(function (entry) {
      if ((entry.isFile()) && (entry.getName() != null)) {
        buf =       entry.getData();
        file =      iconv.decode(buf, charset);
        settings =  ini.parse(file);
        userData[entry.getName()] = settings;
        // fs.writeFile(process.env.APP_DIR + '/grids/' + entry.getName() + '.ini', file);
        // fs.writeFile(process.env.APP_DIR + '/grids/' + entry.getName() + '.json', JSON.stringify(data));
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

  GridModel.findOne({
    user_id:  user_id,
    view:     view
  }, function(err, grid) {
    if (err) {
      _this.set('error', err);
      fn(err);
    } else {
      if (grid != null) {
        fn(null, grid.toJSON().settings || {});
      } else {
        fn('Data not found');
      }
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
  var parallels = [],
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
        parallels.push(function(fn) {
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

    async.parallel(parallels, function() {
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

