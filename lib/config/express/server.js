var express, i18n, logger, session;

express =             require('express');
i18n =                require('i18n-abide');
logger =              require(process.env.APP_DIR + '/lib/config/express/logger');
MongoSessionStore =   require(process.env.APP_DIR + '/lib/config/express/mongoSessionStore')(express);

module.exports = function(app) {
  var maxAge;
  
  maxAge = 365 * 24 * 60 * 60 * 1000;
  
  app.configure(function() {

    app.set('port', process.env.PORT);

    app.use(express.logger(logger));

    app.use(express.json());

    app.use(express.urlencoded());

    app.use(express.methodOverride());

    app.use(i18n.abide({
      supported_languages: ['en', 'ru'],
      default_lang: 'en',
      translation_directory: process.env.APP_DIR + '/public/i18n'
    }));

    app.use(express.static(process.env.APP_DIR + '/public'));

    app.use(express.cookieParser());

    app.use(express.session({
      secret: 'spacepro',
      store:   new MongoSessionStore()
    }));

    app.use(app.router);

    app.configure(function() {
      app.set('views', process.env.APP_DIR + '/public/templates');
      app.set('view engine', 'jade');
    });

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

    app.all('*', function(req, res, next) {
      if (req.session != null) {
        if (req.session.user == null) {
          req.session.user = {};
        } else {
          console.log(req.session.user);
        }
      }
      next();
    });

  });
};
