var Globals, Index, exports;

Globals = require(process.env.APP_DIR + '/lib/views/globals');

Index = Globals.extend({
  initialize: function() {
    this.globals();
    this.addLocalCssFile();
  }
});

exports = module.exports = Index;
