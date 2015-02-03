
var lodash, jade, md5, fs;

_ =    require('lodash');
fs =   require('fs');
md5 =  require('MD5');
jade = require('jade');

middleware = function(options) {

  if (options == null) {
    options = {};
  }

  return function(req, res, next) {

    if (!global.templates) {
      global.templates = [];
    }

    res.template = function(tpl, locals, options) {
      var hash, code, path, def;

      path = process.env.APP_DIR + '/public/templates/' + tpl + '.jade';
      code = fs.readFileSync(path);
      hash = md5(path);

      global.gettext =   req.gettext;
      global.lang =      req.lang;
      global.lang_dir =  req.lang_dir || 'ltr';

      if (locals == null) {
        locals = {};
      }

      if (options == null) {
        options = {};
      }

      def = {
        filename:     path,
        scope:        req,
        pretty:       true,
        compileDebug: false,
        globals: [
          'gettext',
          'lang',
          'lang_dir'
        ]
      };

      options = _.defaults(options, def);

      if (!global.templates[hash]) {
        global.templates[hash] = jade.compile(code, options);
      }
      res.send(global.templates[hash](locals));
    };

    next();

  };

};

exports.middleware = middleware;