
var express =                 require('express');
var i18n =                    require('i18n-abide');
var auth =                    require(process.env.APP_DIR + '/lib/controllers/auth').middleware;
var logger =                  require(process.env.APP_DIR + '/lib/controllers/logger');
// var MemcachedSessionStore =   require(process.env.APP_DIR + '/lib/config/express/memcachedSessionStore')(express);
var MongoSessionStore =       require(process.env.APP_DIR + '/lib/config/express/mongoSessionStore')(express);

module.exports = function(app) {
  
  var maxAge = 365 * 24 * 60 * 60 * 1000;
  
  app.configure(function() {

    app.set('port', process.env.PORT);

    app.use(express.compress());

    app.use(logger(express));

    app.use(express.json());

    app.use(express.urlencoded());

    app.use(express.methodOverride());

    app.use(i18n.abide({
      supported_languages: ['en', 'ru'],
      default_lang: 'en',
      translation_directory: process.env.APP_DIR + '/public/i18n',
      translation_type: 'key-value-json'
    }));

    app.use(express.static(process.env.APP_DIR + '/public'));

    app.use(express.cookieParser());

    app.use(express.session({
      secret: 'spacepro',
      store: new MongoSessionStore()
    }));

    app.use(auth());

    app.use(app.router);

    app.configure('development', function() {
      app.use(express.errorHandler());
    });

    app.all('*', function(req, res, next) {
      if (req.query != null) {
        if (req.query._method != null) {
          req.method = req.query._method;
        }
      }
      next();
    });

  });
};
