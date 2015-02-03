var Auth, _;

_ = require('lodash');

Auth = require(process.env.APP_DIR + '/lib/controllers/auth');

module.exports = function(app) {
  
  app.post('/api/auth/login', function(req, res) {
    var model, body, auth;

    body =   req.body     != null    ? req.body                 : {};
    model =  body.model   != null    ? JSON.parse(body.model)   : {};

    auth = new Auth({
      req:             req,
      res:             res,
      user_login:      model.login     || '',
      user_password:   model.password  || '',
      force:           model.force     || 0
    });

    auth.login(function() {

      if (auth.get('session_success') === 1) {
        req.session.user = {
          id: auth.get('user_id').toString()
        };
        req.session.workstation = {
          id: auth.get('workstation_id').toString()
        };
        req.session.fbsession = {
          id: auth.get('session_id').toString()
        };
      }

      res.json({
        'result':             auth.get('result'),
        'error':              auth.get('error'),
        'id':                 auth.get('user_id'),
        'name':               auth.get('user_name'),
        'session_id':         auth.get('session_id'),
        'session_success':    auth.get('session_success'),
        'session_startdt':    auth.get('session_startdt'),
        'workstation_id':     auth.get('workstation_id'),
        'workstation_name':   auth.get('workstation_name')
      });

    });

  });



  app.get('/api/auth/logout', function(req, res) {
    var auth;

    auth = new Auth({
      req:             req,
      res:             res,
      user_id:         req.session.user.id      || '',
      workstation_id:  req.session.workstation.id || '',
      fbsession_id:    req.session.fbsession.id   || ''
    });

    auth.logout(function() {

      if (auth.get('result') === 'success') {
        req.session.user =       {};
        req.session.workstation =  {};
        req.session.fbsession =    {};
      }

      res.json(_.pick(auth.toJSON(), 
        'result', 
        'error'
      ));

    });
  
  });

};



