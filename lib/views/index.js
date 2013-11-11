var _, async, Globals, Index;

_     =   require('lodash');
async =   require('async');

Dict =    require(process.env.APP_DIR + '/lib/controllers/dict');
Globals = require(process.env.APP_DIR + '/lib/views/globals');

Index = Globals.extend({

  initialize: function() {
    this.globals();
    this.addLocalCssFile('index');
    this.addLocalJsLmdFile('app');
  },

  view: function(fn) {
    var dict, data,
      _this = this;
    
    if (fn == null) {
      fn = function() {};
    }

    dict = new Dict({
      sid: 'DEVICE_DATA'
    });

    dict.initBySid(function() {
      async.parallel({
        data: function(fn) {
          dict.getData(function() {
            dict.initChilds(fn);
          });
        },
        grid: function(fn) {
          dict.getGrid(fn);
        }
      }, function() {

        dict.fbCommitAndCloseConnection();

        _this.set('parentDict', 
          _.pick(dict.toJSON(),
            'columns',
            'sid',
            'limit',
            'data',
            'caption'
          )
        );

        _this.set('childDict', 
          _.pick(dict.get('childs')[0].toJSON(),
            'columns',
            'sid',
            'limit',
            'data',
            'caption'
          )
        );

        _this.exportGlobalObject(_this.get('parentDict').sid, _this.get('parentDict'));
        _this.exportGlobalObject(_this.get('childDict').sid,  _this.get('childDict'));

        fn();
      });
    });
  
  }

});

exports = module.exports = Index;
