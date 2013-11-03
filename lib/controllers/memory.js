var Session, mongoose,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

mongoose = require('mongoose');

Session = mongoose.model('Session', require(process.env.APP_DIR + '/lib/schemas/session'));

module.exports = function(connect) {
  var Memory, Store;
  Store = connect.session.Store;
  Memory = (function(_super) {
    __extends(Memory, _super);

    function Memory(options) {
      this.options = options != null ? options : {};
    }

    Memory.prototype.set = function(sid, sess, fn) {
      var _this = this;
      return Session.findOne({
        sid: sid
      }, function(err, session) {
        var expires, _ref;
        if (err) {
          if (fn) {
            return fn && fn(err);
          }
        } else {
          sess.lastAccess = new Date();
          if (sess.cookie == null) {
            sess.cookie = expires = 2 * 24 * 60 * 60 * 1000;
          }
          if (session != null) {
            session.sess = sess;
            return session.save(function() {
              if (fn) {
                return fn && fn(null, session.toJSON());
              }
            });
          } else {
            if (((_ref = sess.user) != null ? _ref.id : void 0) != null) {
              session = new Session({
                sid: sid,
                sess: sess
              });
              return session.save(function() {
                if (fn) {
                  return fn && fn(null, session.toJSON());
                }
              });
            } else {
              if (fn) {
                return fn && fn(null, {});
              }
            }
          }
        }
      });
    };

    Memory.prototype.get = function(sid, fn) {
      return Session.findOne({
        sid: sid
      }, function(err, session) {
        var data, res;
        if (err) {
          if (fn) {
            return fn(err);
          }
        } else {
          if (session != null) {
            data = session.toJSON();
            if (data.sess != null) {
              res = data.sess;
            } else {
              res = {};
            }
            if (fn) {
              return fn && fn(null, res);
            }
          } else {
            if (fn) {
              return fn && fn(null, null);
            }
          }
        }
      });
    };

    Memory.prototype.destroy = function(sid, fn) {
      return Session.findOne({
        sid: sid
      }, function(err, session) {
        if (err) {
          if (fn) {
            return fn && fn(err);
          }
        } else {
          return session.remove(function() {
            if (fn) {
              return fn();
            }
          });
        }
      });
    };

    return Memory;

  })(Store);
  return Memory;
};
