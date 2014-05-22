var _, async, Globals, Index, Dict, Bar;

_     =   require('lodash');
async =   require('async');

Dict =    require(process.env.APP_DIR + '/lib/controllers/dict');
Bar =     require(process.env.APP_DIR + '/lib/controllers/bar');
Globals = require(process.env.APP_DIR + '/lib/views/globals');

Index = Globals.extend({

  initialize: function() {
    this.globals();
    this.addLocalCssFile('index');
    this.addLocalJsLmdFile('app');

    this.addLocaleString([
      'Information not found',
      'Error on server'
    ]);

  },

  view: function(fn) {
    var dict, child, bar,
      _this = this;
    
    if (fn == null) {
      fn = function() {};
    }

    bar = new Bar();

    bar.getDicts(function() {

      dict = new Dict({
        sid: bar.get('active')
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

          dict.fbTransactionCommit();

          child = dict.get('childs')[0];

          _this.set('parentDict', {
            'sid':             dict.get('sid'),
            'caption':         dict.get('caption'),
            'columns':         dict.get('columns'),
            'fields':          dict.get('fields'),
            'data':            dict.get('data'),
            'limit':           dict.get('limit')
          });

          _this.set('childDict', {
            'sid':             child.get('sid'),
            'caption':         child.get('caption'),
            'columns':         child.get('columns'),
            'fields':          child.get('fields'),
            'data':            child.get('data'),
            'limit':           child.get('limit'),
            'keys':            child.get('sqlmaster').get('keys'),
            'vals':            child.get('sqlmaster').get('vals')
          });

          _this.exportGlobalObject(_this.get('parentDict').sid + '_data', _this.get('parentDict'));
          _this.exportGlobalObject(_this.get('childDict').sid  + '_data', _this.get('childDict'));

          fn();

        });
      });

    });
  
  }

});

exports = module.exports = Index;
