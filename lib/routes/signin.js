var Signin, _;

_ = require('lodash');

Signin = require(process.env.APP_DIR + '/lib/controllers/signin');

module.exports = function(app) {
  
  app.post('/api/user/signin', function(req, res) {
    var model, body, signin;

    body = req.body != null       ? req.body : {};
    model = body.model != null    ? JSON.parse(body.model) : {};

    signin = new Signin({
      req: req,
      res: res,
      login:      model.login != null     ? model.login : '',
      password:   model.password != null  ? model.password : '',
      force:      model.force != null     ? model.force : 0
    });

    signin.check(function() {
      res.json(_.pick(signin.toJSON(), 
        'result', 
        'error', 
        'id', 
        'name', 
        'session_id', 
        'session_success', 
        'session_startdt', 
        'workstation_id', 
        'workstation_name'
      ));
    });

  });



  app.get('/api/user/logout', function(req, res) {
    var model, query, signin;

    query = req.query != null     ? req.query : {};
    model = query.model != null   ? JSON.parse(query.model) : {};

    signin = new Signin({
      req: req,
      res: res,
      id:  model.id != null ? model.id : '',
    });

    signin.logout(function() {
      res.json(_.pick(signin.toJSON(), 
        'result', 
        'error'
      ));
    });

  
  });

};



