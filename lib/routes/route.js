
var Signin, async;

async = require('async');

Index =    require(process.env.APP_DIR + '/lib/views/index');
Signin =   require(process.env.APP_DIR + '/lib/views/signin');

module.exports = function(app) {

  app.get('/', function(req, res, next) {
    var index, signin;
    if (req.session.user != null) {
      if (req.session.user.session_open) {
        index = new Index({
          req: req,
          res: res
        });
        res.render('layout/index', index.toJSON());
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
