var async, Globals, Index;

async =   require('async');

Dict =    require(process.env.APP_DIR + '/lib/controllers/dict');
Globals = require(process.env.APP_DIR + '/lib/views/globals');

Index = Globals.extend({

  initialize: function() {
    this.globals();
    this.addLocalCssFile('index');
  },

  view: function(fn) {
    var parentDict, childDict,
      _this = this;
    
    if (fn == null) {
      fn = function() {};
    }

    parentDict = new Dict({
      sid: 'DEVICE_DATA'
    });

    parentDict.initBySid(function() {
      async.parallel({
        data: function(fn) {
          parentDict.getData(fn);
        },
        grid: function(fn) {
          parentDict.getGrid(fn);
        },
        childs: function(fn) {
          parentDict.initChilds(fn);
        }
      }, function() {
        parentDict.fbCommitAndCloseConnection();
        _this.set('parentDict', parentDict.toJSON());
        fn();
      });
    });
  
  }

});

exports = module.exports = Index;
