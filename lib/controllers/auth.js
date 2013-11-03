var Auth, Token, User, exports, mongoose;

Token = require('token');

mongoose = require('mongoose');

User = mongoose.model('User', require(global.home + '/lib/models/db/user'));

Auth = (function() {
  function Auth(req, res) {
    this.req = req;
    this.res = res;
  }

  Auth.prototype.user = function(callback) {
    var _this = this;
    return User.findOne({
      id: this.req.session.user.id != null ? this.req.session.user.id : '',
      key: this.req.session.user.key != null ? this.req.session.user.key : '',
      disabled: false
    }, function(err, user) {
      var error;
      if (err) {
        throw err;
      }
      error = null;
      if (user == null) {
        error = 'Пользователь не найден';
      }
      if ((_this.req.session.user.id == null) || (_this.req.session.user.key == null)) {
        error = 'Cессия не активна';
      }
      if (user == null) {
        user = {};
      }
      if (callback) {
        return callback(error, user);
      }
    });
  };

  Auth.prototype.verifyToken = function() {
    if ((this.req.session.user != null) && (this.req.query.token != null)) {
      if ((this.req.session.user.id != null) && (this.req.session.user.key != null)) {
        return Token.verify("" + this.req.session.id + "|{@req.session.user.id}|" + this.req.session.user.key, this.req.query.token);
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  return Auth;

})();

exports = module.exports = function(req, res) {
  return new Auth(req, res);
};

exports.Auth = Auth;
