var async, Globals, Index;

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
    var parentDict, data,
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
          parentDict.getData(function() {
            parentDict.initChilds(fn);
          });
        },
        grid: function(fn) {
          parentDict.getGrid(fn);
        }
      }, function() {
        parentDict.fbCommitAndCloseConnection();
        _this.set('parentDict', parentDict.toJSON());
        // data = parentDict.toJSON();
        // console.log(data.childs[0]);
        fn();
      });
    });
  
  }

});

exports = module.exports = Index;
