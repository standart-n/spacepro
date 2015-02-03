var Common, Globals, exports;

Common = require(process.env.APP_DIR + '/lib/views/common');

Globals = Common.extend({

  globals: function() {
    this.common();
    this.set({
      theme:        process.env.THEME,
      name:         this.toUpperCaseFirstLetter(process.env.APP_NAME),
      author:       process.env.APP_AUTHOR,
      description:  process.env.APP_DESCRIPTION,
      keywords:     process.env.APP_KEYWORDS,
      version:      process.env.APP_VERSION
    });
    this.set({
      title:        "" + (this.get('name')) + " v" + (this.get('version'))
    });
  },

  toUpperCaseFirstLetter: function(letter) {
    return "" + (letter[0].toUpperCase()) + (letter.slice(1));
  }
  
});

exports = module.exports = Globals;
