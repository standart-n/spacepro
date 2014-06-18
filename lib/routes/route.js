
var Auth, Signin, Index, async;

async = require('async');

Index =    require(process.env.APP_DIR + '/lib/views/index');
Signin =   require(process.env.APP_DIR + '/lib/views/signin');

module.exports = function(app) {

  app.get('/', function(req, res, next) {
    var index, signin, data;

    if (!res.finished) {
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
    } else {
      console.log('route cached');
    }

  });

  app.get('/dict/:sid', function(req, res, next) {
    var index, signin, data;

    if (!res.finished) {
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
    }
  });

};
