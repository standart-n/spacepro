
var Index =    require(process.env.APP_DIR + '/lib/views/index');
var Signin =   require(process.env.APP_DIR + '/lib/views/signin');

module.exports = function(app) {

  var memcached = global.memcached;

  app.get('/', function(req, res, next) {
    var index, signin;

    if (req.signin) {
      index = new Index({
        req: req
      });

      index.view(function() {
        var result = index.toJSON();
        res.template('layout', 'index', result);
      });

    } else {
      signin = new Signin({
        req: req
      });
      res.template('layout', 'signin', signin.toJSON());
    }

  });

  app.get('/dict/:sid', function(req, res, next) {
    var index, signin;

    if (req.signin) {
      index = new Index({
        req: req,
        res: res
      });

      index.view(function() {
        var result = index.toJSON();
        res.template('layout', 'index', result);
      });
      
    } else {
      signin = new Signin({
        req: req,
        res: res
      });
      res.template('layout', 'signin', signin.toJSON());
    }
  });

};
