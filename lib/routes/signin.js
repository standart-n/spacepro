var Signin, _;

_ = require('lodash');

Signin = require(process.env.APP_DIR + '/lib/controllers/signin');

module.exports = function(app) {
  return app.post('/api/signin', function(req, res) {
    var data, model, signin, _ref;
    model = ((_ref = req.body) != null ? _ref.model : void 0) != null ? req.body.model : '{}';
    data = JSON.parse(model);
    signin = new Signin({
      req: req,
      res: res,
      login: data.login,
      password: data.password
    });
    return signin.check(function() {
      return res.json(_.pick(signin.toJSON(), 'result', 'error', 'id', 'name', 'session_id', 'session_success', 'session_startdt', 'workstation_id', 'workstation_name'));
    });
  });
};
