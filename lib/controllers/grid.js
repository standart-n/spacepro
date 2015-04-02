
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
var debug =      require('debug')('grid');

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

  this.fbCreateConnection(function(err, db) {
    if (!err) {
      db.query(_this.sqlGetByUserId(), function(err, result) {
        db.detach();
        if (!err) {
          if (result[0].userdata != null) {
            _this.unzip(result[0].userdata);
            fn();
          } else {
            fn('User data not found');
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
Извлечение данных из архива, который получен из blob поля

@param {file} zip archive
@api private
*/

Grid.prototype.unzip = function(archive) {
  var userData = {};
  var charset = 'win1251';

  if (archive != null) {
    var files = zip.Reader(archive);
    files.forEach(function (entry) {
      if ((entry.isFile()) && (entry.getName() != null)) {
        var buf =       entry.getData();
        var file =      iconv.decode(buf, charset);
        var settings =  ini.parse(file);
        var name =      entry.getName().toString().trim().toLowerCase();
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
  var _this = this;

  var args = _.toArray(arguments);
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

  // var memcached = global.memcached;
  // var hash = md5(JSON.stringify({
  //   user_id:  user_id,
  //   view:     view
  // }));

  // memcached.get(hash, function(err, result) {
  //   if (!result) {
      GridModel.findOne({
        user_id:  user_id,
        view:     view
      }, function(err, grid) {
        if (!err) {
          var data = {};
          if (grid != null) {
            data = grid.toJSON().settings || {};
            debug('getGridByViewAndUserId'.magenta, view.yellow, 'success'.green);
          } else {
            debug('getGridByViewAndUserId'.magenta, view.yellow, 'grid not found'.red);
          }
            // memcached.set(hash, JSON.stringify(data), 3600, function() {
          fn(null, data);
            // });
        } else {
          debug('getGridByViewAndUserId'.red, view.yellow, err);
          fn(err);
        }
      });
  //   } else {
  //     fn(null, JSON.parse(result));
  //   }
  // });

};

/*
@api public
*/

Grid.prototype.clearAllGrids = function(fn) {
  if (fn == null) {
    fn = function() {};
  }

  GridModel.find().exec(function(err, grids) {
    if (!err) {
      async.eachSeries(grids, function(grid, fn) {
        grid.remove();
        grid.save(function() {
          fn();
        });
      }, function() {
        fn(null, null);
      });
    } else {
      fn(err);
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
  var gridFn = [];
  var _this = this;

  if (fn == null) {
    fn = function() {};
  }

  this.getUserDataByUserId(function() {     

    var user_id =   _this.get('user_id')   || -1;
    var userData =  _this.get('userData')  || {};

    _.each(userData, function(settings, view) {
      if ((view !== '') && (view !== undefined)) {
        gridFn.push(function(fn) {
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
                grid.settings =  _this.getVisibleColumns(settings, view);
                grid.post_dt =   Date();
                grid.save(function(err) {
                  console.log(log);
                  fn(null);
                });
              } else {

                grid = new GridModel({
                  user_id:   user_id,
                  view:      view,
                  settings:  _this.getVisibleColumns(settings, view)
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

Grid.prototype.getVisibleColumns = function(grid, view) {
  var columns = [];

  var settings = grid || this.get('settings') || {};

  _.each(settings, function(block, caption) {    
    if (caption.match(/gb\\columns\\gblistcolumn/)) {
      caption = caption.toString().trim().replace(/gb\\columns\\gblistcolumn/i,'').toLowerCase();
      if (block.caption.length) {
        block.caption = block.caption.toString().trim().toLowerCase();
        block.caption = block.caption[0].toUpperCase() + block.caption.slice(1);
      }
      // if (block.visible === '0') {
      block.field = caption;
      if (block.field !== '') {
        columns[block.index] = block;
      }
      // }
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

