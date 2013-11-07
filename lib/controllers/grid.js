
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
      user_id: -1,
      data:    {}
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
        var tr, reader, entry, buf, file, json,
          data = {},
          charset = '';
        if (_this.get('fb_transaction')) {
          tr = _this.get('fb_transaction');
          tr.query(_this.sqlGetByUserId(), function(err, result) {
            if ((result != null) && (!err)) {
              if (result.length < 1) {
                _this.fbCheckError('Grid not found', fn);
              } else {
                _this.fbTransactionCommit(function() {
                  if (result[0].userdata != null) {
                    reader = zip.Reader(result[0].userdata);
                    reader.forEach(function (entry) {
                      if (entry.isFile()) {
                        buf = entry.getData();
                        file = iconv.decode(buf, 'win1251');
                        json = ini.parse(file);
                        fs.writeFile(process.env.APP_DIR + '/grids/' + entry.getName() + '.ini', file);
                        fs.writeFile(process.env.APP_DIR + '/grids/' + entry.getName() + '.json', JSON.stringify(json));
                        data[entry.getName()] = json;
                      }
                    });
                    _this.set('data', data);
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

  updateGridByUserId: function(fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    this.getUserDataByUserId(function() {     
        GridModel.findOne({
          user_id: _this.get('user_id') || -1
        }, function(err, grid) {
            if (err) {
              _this.set('error', err);
              fn(err);
            } else {
              if (grid != null) {
                grid.view = _this.get('data');
                grid.save(function() {
                  fn(null);
                });
              } else {
                grid = new GridModel({
                  user_id: _this.get('user_id'),
                  view:    _this.get('data')
                });
                grid.save(function() {
                  fn(null);
                });
              }
            }
        });

    });
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




