
exports = module.exports = function(connect) {

  var memcached = global.memcached;
  var Store =     connect.session.Store;

  var Memory = (function(options) {
    this.options = options != null ? options : {};
  });

  Memory.prototype.__proto__ = Store.prototype;

  Memory.prototype.set = function(sid, sess, fn) {
    var _this = this;

    if (fn == null) {
      fn = function() {};
    }

    memcached.get(sid.toString(), function(err, result) {
      var session, expires;

      if (err) {
        return fn && fn(err);
      } else {
        sess.lastAccess = new Date();
        if (sess.cookie === null) {
          sess.cookie = expires = 2 * 24 * 60 * 60 * 1000;
        }
        if (result) {
          session = JSON.parse(result);
          session.sess = sess;
          memcached.set(sid.toString(), JSON.stringify(session), 3600, function() {
            return fn & fn(null, session);
          });
        } else {
          session = {
            sid: sid,
            sess: sess
          };
          memcached.set(sid.toString(), JSON.stringify(session), 3600, function() {            
            return fn & fn(null, session);
          });
        }        
      }
    });

  };

  Memory.prototype.get = function(sid, fn) {

    if (fn == null) {
      fn = function() {};
    }

    memcached.get(sid.toString(), function(err, result) {
      var session, res;

      if (err) {
        return fn && fn(err);
      } else {
        session = JSON.parse(result);
        if (session !== null) {
          if (session.sess !== null) {
            res = session.sess;
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

    memcached.get(sid, function(err, result) {

      if (err) {
        return fn && fn(err);
      } else {
        if (result) {
          memcached.del(sid, function() {
            return fn && fn();
          });
        } else {
          return fn();
        }
      }
    });
  };

  return Memory;

};

