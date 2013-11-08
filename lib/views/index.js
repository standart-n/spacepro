var Globals, Index;

Dict =    require(process.env.APP_DIR + '/lib/controllers/dict');
Globals = require(process.env.APP_DIR + '/lib/views/globals');

Index = Globals.extend({

  initialize: function() {
    this.globals();
    this.addLocalCssFile('index');
  },

  view: function(fn) {
    var dict,
      _this = this;
    
    if (fn == null) {
      fn = function() {};
    }

    dict = new Dict({
      sid: 'DEVICE_DATA'
    });

    dict.initBySid(function() {
      dict.getData(function() {
        dict.getGrid(function() {
          dict.fbCommitAndCloseConnection();
          _this.set('mainDict', dict.toJSON());
          fn();
        });
      });
    });
  }

});

exports = module.exports = Index;
