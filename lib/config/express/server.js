var express, i18n, logger, session;

express = require('express');

i18n = require('i18n-abide');

session = require(process.env.APP_DIR + '/lib/config/express/session');

logger = require(process.env.APP_DIR + '/lib/config/express/logger');

module.exports = function(app) {
  var maxAge;
  maxAge = 365 * 24 * 60 * 60 * 1000;
  return app.configure(function() {
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
    app.use(app.router);
    app.use(express["static"](process.env.APP_DIR + '/public'));
    app.configure(function() {
      app.set('views', process.env.APP_DIR + '/public/templates');
      return app.set('view engine', 'jade');
    });
    app.configure('development', function() {
      return app.use(express.errorHandler());
    });
    app.all('*', function(req, res, next) {
      if (req.query != null) {
        if (req.query._method != null) {
          req.method = req.query._method;
        }
      }
      return next();
    });
    return app.all('*', function(req, res, next) {
      if (req.session != null) {
        if (req.session.user == null) {
          req.session.user = {};
        }
      }
      return next();
    });
  });
};
