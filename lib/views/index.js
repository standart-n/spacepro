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
    var dict, 
      child, 
      bar, 
      active,
      _this = this;
    
    if (fn == null) {
      fn = function() {};
    }

    bar = new Bar();

    bar.getDictsFromCache(function() {
      bar.renderActiveDict(function() {
        dict = bar.get('dict');

        _this.set('webDicts', {
          dicts:             bar.get('dicts'),
          active:            bar.get('active')
        });

        _this.set('parentDict', {
          'sid':             dict.get('sid'),
          'caption':         dict.get('caption'),
          'columns':         dict.get('columns'),
          'fields':          dict.get('fields'),
          'limit':           dict.get('limit')
        });

        _this.exportGlobalObject(_this.get('parentDict').sid + '_data', _this.get('parentDict'));
        // _this.exportGlobalObject(_this.get('childDict').sid  + '_data', _this.get('childDict'));

        fn();
      });
    });
  
  }

});

exports = module.exports = Index;
