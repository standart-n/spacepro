
var _ =    require('lodash');

var Auth = require(process.env.APP_DIR + '/lib/controllers/auth');

module.exports = function(app) {
  
  app.post('/api/auth/login', function(req, res) {

    var body =   req.body     != null    ? req.body                 : {};
    var model =  body.model   != null    ? JSON.parse(body.model)   : {};

    var auth = new Auth({
      user_login:      model.login     || '',
      user_password:   model.password  || '',
      force:           model.force     || 0
    });

    auth.login(function(err) {

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
        'error':              err,
        'result':             auth.get('result'),
        'user_id':            auth.get('user_id'),
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

    var auth = new Auth({
      user_id:         req.session.user.id        || '',
      workstation_id:  req.session.workstation.id || '',
      fbsession_id:    req.session.fbsession.id   || ''
    });

    auth.logout(function(err) {

      if (!err) {

        req.session.user =         {};
        req.session.workstation =  {};
        req.session.fbsession =    {};

        res.json({
          'result': 'success'
        });

      } else {
        res.json({
          'error':  err
        });
      }

    });
  
  });

};



