
var Auth, Signin, Index, zlib, fs, async, moment;

fs =     require('fs');
zlib =   require('zlib');
async =  require('async');
moment = require('moment');

Index =    require(process.env.APP_DIR + '/lib/views/index');
Signin =   require(process.env.APP_DIR + '/lib/views/signin');

module.exports = function(app) {

  app.get('/', function(req, res, next) {
    var index, signin, data, encoding;

    if (req.signin) {
      index = new Index({
        req: req,
        res: res
      });

      index.view(function() {
        res.render('layout/index', index.toJSON());
      });

    } else {
      signin = new Signin({
        req: req,
        res: res
      });
      res.render('layout/signin', signin.toJSON());
    }

  });

  app.get('/dict/:sid', function(req, res, next) {
    var index, signin, data, encoding, deflate, s;

    if (req.signin) {
      index = new Index({
        req: req,
        res: res
      });

      encoding = req.headers['accept-encoding'] || '';

      index.view(function() {
        var raw;
        res.render('layout/index', index.toJSON());
      });
      
    } else {
      signin = new Signin({
        req: req,
        res: res
      });
      res.render('layout/signin', signin.toJSON());
    }
  });

};
