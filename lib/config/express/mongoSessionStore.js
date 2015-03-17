
var mongoose =  require('mongoose');
var util =      require('util');
var Schema =    mongoose.Schema;

var schema = new Schema({
  sid: {
    type:  String,
    index: true
  },
  sess: {
    type: Object
  },
  post_dt: {
    type:      Date,
    "default": Date.now
  }
});

exports = module.exports = function(connect) {
  
  var Session =  mongoose.model('Session', schema);
  var Store =    connect.session.Store;

  var Memory = (function(options) {
    this.options = options != null ? options : {};
  });

  Memory.prototype.__proto__ = Store.prototype;

  Memory.prototype.set = function(sid, sess, fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    Session.findOne({
      sid: sid
    }, function(err, session) {
      var expires;
      if (err) {
        return fn && fn(err);
      } else {
        sess.lastAccess = new Date();
        if (sess.cookie == null) {
          sess.cookie = expires = 2 * 24 * 60 * 60 * 1000;
        }
        if (session != null) {
          session.sess = sess;
          session.save(function() {
            return fn && fn(null, session.toJSON());
          });
        } else {
          session = new Session({
            sid: sid,
            sess: sess
          });
          session.save(function() {
            return fn && fn(null, session.toJSON());
          });
        }
      }
    });
  };

  Memory.prototype.get = function(sid, fn) {

    if (fn == null) {
      fn = function() {};
    }

    Session.findOne({
      sid: sid
    }, function(err, session) {
      var data, res;
      if (err) {
        return fn(err);
      } else {
        if (session != null) {
          data = session.toJSON();
          if (data.sess != null) {
            res = data.sess;
          } else {
            res = {};
          }
          return fn && fn(null, res);
        } else {
          return fn && fn(null, null);
        }
      }
    });
  };

  Memory.prototype.destroy = function(sid, fn) {

    if (fn == null) {
      fn = function() {};
    }

    Session.findOne({
      sid: sid
    }, function(err, session) {
      if (err) {
        return fn && fn(err);
      } else {
        if (session) {
          session.remove();
          session.save(function() {
            return fn();
          });
        } else {
          return fn();
        }
      }
    });
  };

  return Memory;

};

exports.schema = schema;
