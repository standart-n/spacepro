var Globals, Index, exports;

Dict =    require(process.env.APP_DIR + '/lib/controllers/dict');
Globals = require(process.env.APP_DIR + '/lib/views/globals');

Index = Globals.extend({

  initialize: function() {
    this.globals();
    this.addLocalCssFile('index');
  },

  view: function(fn) {
    var dict;
    
    if (fn == null) {
      fn = function() {};
    }

    dict = new Dict({
      sid: 'DEVICE_DATA'
    });

    dict.initBySid(function() {
      fn();
    });
  }

});

exports = module.exports = Index;
