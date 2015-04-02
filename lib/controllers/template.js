
var _ =              require('lodash');
var fs =             require('fs');

var layoutIndex =    require(process.env.APP_DIR + '/public/js/templates/layout/index.jade/index');
var layoutSignin =   require(process.env.APP_DIR + '/public/js/templates/layout/signin.jade/signin');

var attrs =          require(process.env.APP_DIR + '/lib/controllers/runtime').attrs;
var escape =         require(process.env.APP_DIR + '/lib/controllers/runtime').escape;
var rethrow =        require(process.env.APP_DIR + '/lib/controllers/runtime').rethrow;
var merge =          require(process.env.APP_DIR + '/lib/controllers/runtime').merge;

var template = function(layout, locals, gettext, lang, lang_dir) {
  var result = '';

  if (locals == null) {
    locals = {};
  }

  if (gettext == null) {
    gettext = function(a) {
      return a;
    };
  }

  if (lang == null) {
    lang = 'en';
  }

  if (lang_dir == null) {
    lang_dir = 'ltr';
  }

  locals.gettext =  gettext;
  locals.lang =     lang;
  locals.lang_dir = lang_dir;

  switch (layout) {
    case 'layout/index':
      result = layoutIndex(locals, attrs, escape, rethrow, merge);
    break;
    case 'layout/signin':
      result = layoutSignin(locals, attrs, escape, rethrow, merge);
    break;
  }

  return result;
};

exports = module.exports = template;