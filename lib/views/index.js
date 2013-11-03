var Globals, Index, exports;

Globals = require(process.env.APP_DIR + '/lib/views/globals');

Index = Globals.extend({
  initialize: function() {
    this.globals();
    return this.addLocalCssFile();
  }
});

exports = module.exports = Index;
