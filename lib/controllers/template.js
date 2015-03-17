
var _ =         require('lodash');
var fs =        require('fs');
// var md5 =  require('MD5');
// var jade = require('jade');
var attrs =     require(process.env.APP_DIR + '/lib/controllers/runtime').attrs;
var escape =    require(process.env.APP_DIR + '/lib/controllers/runtime').escape;
var rethrow =   require(process.env.APP_DIR + '/lib/controllers/runtime').rethrow;
var merge =     require(process.env.APP_DIR + '/lib/controllers/runtime').merge;

var middleware = function(options) {

  if (options == null) {
    options = {};
  }

  return function(req, res, next) {

    global.jade = {};


    res.template = function(dir, tpl, locals, options) {

      locals.gettext =   req.gettext;
      locals.lang =      req.lang;
      locals.lang_dir =  req.lang_dir || 'ltr';

      var code = require(process.env.APP_DIR + '/public/js/templates/' + dir + '/' + tpl + '.jade' + '/' + tpl);
      var result = code(locals, attrs, escape, rethrow, merge);

      res.send(result);

    };

    next();

  };

};

exports.middleware = middleware;