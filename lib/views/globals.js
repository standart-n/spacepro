var Common, Globals, exports;

Common = require(process.env.APP_DIR + '/lib/views/common');

Globals = Common.extend({
  globals: function() {
    this.common();
    this.set('theme', process.env.THEME);
    this.set('name', this.toUpperCaseFirstLetter(process.env.APP_NAME));
    this.set('author', process.env.APP_AUTHOR);
    this.set('description', process.env.APP_DESCRIPTION);
    this.set('keywords', process.env.APP_KEYWORDS);
    this.set('version', process.env.APP_VERSION);
    return this.set('title', "" + (this.get('name')) + " v" + (this.get('version')));
  },
  toUpperCaseFirstLetter: function(letter) {
    return "" + (letter[0].toUpperCase()) + (letter.slice(1));
  }
});

exports = module.exports = Globals;
