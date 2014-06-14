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
        var mainInfoOfDict;

        dict = bar.get('dict');

        _this.set('webDicts', {
          dicts:             bar.get('dicts'),
          active:            bar.get('active')
        });

        mainInfoOfDict = dict.getMainInfoOfDict();

        _this.set('parentDict', mainInfoOfDict);

        _this.exportGlobalObject(mainInfoOfDict.sid + '_data', mainInfoOfDict);

        console.log(mainInfoOfDict.childs);

        _.each(mainInfoOfDict.childs, function(child) {
          _this.exportGlobalObject(child.sid + '_data', child);
        });

        fn();
      });
    });
  
  }

});

exports = module.exports = Index;
