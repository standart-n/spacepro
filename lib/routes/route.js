var Signin, async;

async = require('async');

Signin = require(process.env.APP_DIR + '/lib/views/signin');

module.exports = function(app) {
  return app.get('/', function(req, res) {
    var signin;
    signin = new Signin({
      req: req,
      res: res
    });
    return res.render('layout/signin', signin.toJSON());
  });
};
