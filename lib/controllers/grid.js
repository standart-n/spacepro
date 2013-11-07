
var _, fs, async, zip, ini, mongoose, middleware, GridSchema, GridModel, Grid, iconv;

_ =          require('lodash');
fs =         require('fs');
async =      require('async');
zip =        require('zip');
iconv =      require('iconv-lite');
mongoose =   require('mongoose');

Firebird =     require(process.env.APP_DIR + '/lib/controllers/firebird');
ini =          require(process.env.APP_DIR + '/lib/controllers/ini');
GridSchema =   require(process.env.APP_DIR + '/lib/schemas/grid');

GridModel =    mongoose.model('Grid', GridSchema);

Grid = Firebird.extend({

  defaults: function() {
    return {
      user_id:     -1,
      userData:    {},
      view:        '',
      data:        {},
      columns:     []
    };
  },

  initialize: function() {

  },

  getUserDataByUserId: function(fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    async.series({

      openConnection: function(fn) {
        _this.fbConnectionOpen(fn);
      },

      startTransaction: function(fn) {
        _this.fbTransactionStart(fn);
      },

      getGrid: function(fn) {
        var tr;

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
      }

    }, function(err, result) {

      _this.fbConnectionClose();
      fn(_this.get('error'));

    });

  },

  unzip: function(archive) {
    var files, entry, buf, file, data,
      userData = {},
      charset = 'win1251';

    if (archive != null) {
      files = zip.Reader(archive);
      files.forEach(function (entry) {
        if ((entry.isFile()) && (entry.getName() != null)) {
          buf =   entry.getData();
          file =  iconv.decode(buf, charset);
          data =  ini.parse(file);
          userData[entry.getName()] = data;
          // fs.writeFile(process.env.APP_DIR + '/grids/' + entry.getName() + '.ini', file);
          // fs.writeFile(process.env.APP_DIR + '/grids/' + entry.getName() + '.json', JSON.stringify(data));
        }
      });
      this.set('userData', userData); 
    }

  },

  getGridByViewAndUserId: function(view, user_id, fn) {
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
          _this.set('data', grid.data);
          fn(null, grid.data || {});
        } else {
          fn('Data not found');
        }
      }
    });

  },

  updateGridByUserId: function(fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    this.getUserDataByUserId(function() {     
      var user_id, userData;

      user_id =   _this.get('user_id')   || -1;
      userData =  _this.get('userData')  || {};

      _.each(userData, function(data, view) {

        GridModel.findOne({
          user_id:  user_id,
          view:     view
        }, function(err, grid) {
          if (err) {
            _this.set('error', err);
            fn(err);
          } else {
            if (grid != null) {
              grid.view = view;
              grid.data = data;
              grid.save(function() {
                fn(null);
              });
            } else {
              grid = new GridModel({
                user_id: user_id,
                view:    view,
                data:    data
              });
              grid.save(function() {
                fn(null);
              });
            }
          }
        });

      });
    });

  },

  getVisibleColumns: function() {
    var data, 
      columns = [];

    data = this.get('data') || {};

    _.each(data, function(settings, caption) {
      if (caption.match(/gb\\Columns\\gbListcolumn/)) {
        if (settings.Visible === '1') {
          settings.Field = caption.replace(/gb\\Columns\\gbListcolumn/,'').toLowerCase();
          columns[settings.ColIndex] = settings;
        }
      }
    });
    this.set('columns', columns);
    return columns;

  },

  sqlGetByUserId: function() {
    return "select \n" +
           "* \n" +
           "from sp$users \n" + 
           "where \n" +
           "(id = '" + this.get('user_id').toString() +"')";
  }

});


exports = module.exports = Grid;

exports.grid = new Grid();

