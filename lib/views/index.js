var _, async, moment, Globals, Index, Dict, Bar;

_     =   require('lodash');
async =   require('async');
moment =  require('moment');

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
      'Error on server',
      'Line data edit',
      'Line data remove'
    ]);
  },

  view: function(fn) {
    var dict, 
      child, 
      bar, 
      active,
      req,
      _this = this;
    
    if (fn == null) {
      fn = function() {};
    }

    req = this.get('req');

    bar = new Bar({
      user_id:    req.session.user.id,
      requireSid: req.params.sid || ''
    });

  
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

        _.each(mainInfoOfDict.childs, function(child) {
          _this.exportGlobalObject(child.sid + '_data', child);
        });

        _.each(mainInfoOfDict.depDicts, function(depDict) {
          _this.exportGlobalObject(depDict.sid + '_data', depDict);
        });

        fn();
      });
    });
  
  }

});

exports = module.exports = Index;
