
var template =   require(process.env.APP_DIR + '/lib/controllers/template');
var Index =      require(process.env.APP_DIR + '/lib/views/index');
var Signin =     require(process.env.APP_DIR + '/lib/views/signin');

// var memwatch =   require('memwatch');
// var jsome =      require(process.env.APP_DIR + '/lib/controllers/jsome');

module.exports = function(app) {

  // app.get('/', function(req, res, next) {
  //   res.send('go!');
  // });

  app.get('/', function(req, res, next) {

    // var hd = new memwatch.HeapDiff();

    if (req.signin) {

      var index = new Index({
        user_id:     req.session.user.id,
        requireSid:  req.params.sid || '',
        gettext:     req.gettext
      });

      // console.log(jsome(hd.end()));
      index.view(function() {
        // res.send('go!');
        var result = index.toJSON();
        res.send(template('layout/index', result, req.gettext, req.lang, req.lang_dir));
      });

    } else {
      var signin = new Signin({
        gettext:     req.gettext
      });
      res.send(template('layout/signin', signin.toJSON(), req.gettext, req.lang, req.lang_dir));
    }

  });

  app.get('/dict/:sid', function(req, res, next) {

    if (req.signin) {
      var index = new Index({
        user_id:     req.session.user.id,
        requireSid:  req.params.sid || '',
        gettext:     req.gettext
      });

      index.view(function() {
        var result = index.toJSON();
        res.send(template('layout/index', result, req.gettext, req.lang, req.lang_dir));
      });
      
    } else {
      var signin = new Signin({
        gettext:     req.gettext
      });
      res.send(template('layout/signin', signin.toJSON(), req.gettext, req.lang, req.lang_dir));
    }

  });

};
