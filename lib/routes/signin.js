var Signin, _;

_ = require('lodash');

Signin = require(process.env.APP_DIR + '/lib/controllers/signin');

module.exports = function(app) {
  
  app.post('/api/user/signin', function(req, res) {
    var model, body, signin;

    body = req.body     != null    ? req.body                 : {};
    model = body.model  != null    ? JSON.parse(body.model)   : {};

    signin = new Signin({
      req: req,
      res: res,
      login:      model.login     != null     ? model.login     : '',
      password:   model.password  != null     ? model.password  : '',
      force:      model.force     != null     ? model.force     : 0
    });

    signin.check(function() {

      if (signin.get('result') === 'success') {
        req.session.user.id =              signin.get('id');
        req.session.user.name =            signin.get('name');
        req.session.user.session_id =      signin.get('session_id');
        req.session.user.session_open =    signin.get('session_open');
        req.session.user.workstation_id =  signin.get('workstation_id');
        // console.log(req.session.user);
      }

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

      if (signin.get('result') === 'success') {
        req.session.user = {};
      }

      res.json(_.pick(signin.toJSON(), 
        'result', 
        'error'
      ));

    });

  
  });

};



