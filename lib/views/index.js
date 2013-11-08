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
        child: function(fn) {
          childDict = new Dict({
            sid: parentDict.getChildByIndex(0).wdict
          });

          childDict.initBySid(function() {
            async.parallel({
              grid: function(fn) {
                childDict.getGrid(fn);
              }
            }, function() {
              childDict.fbCommitAndCloseConnection();
              _this.set('childDict', childDict.toJSON());
              console.log(childDict.toJSON());
              fn();
            });
          });
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
