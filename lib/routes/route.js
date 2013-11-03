var Signin, async;

async = require('async');

Signin = require(process.env.APP_DIR + '/lib/views/signin');

module.exports = function(app) {

  app.get('/', function(req, res) {
    var signin;

    signin = new Signin({
      req: req,
      res: res
    });

    res.render('layout/signin', signin.toJSON());
  });

};
