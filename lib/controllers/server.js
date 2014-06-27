var _, async, cluster, colors, express, http, mkpath, mongoose, memcached, readline, 
  Server, store, user, bar, grid;

async =      require('async');
http =       require('http');
_ =          require('lodash');
colors =     require('colors');
mkpath =     require('mkpath');
express =    require('express');
cluster =    require('cluster');
readline =   require('readline');
mongoose =   require('mongoose');
Memcached =  require('memcached');

store =      require(process.env.APP_DIR + '/lib/controllers/storage');
grid =       require(process.env.APP_DIR + '/lib/controllers/grid').grid;
bar =        require(process.env.APP_DIR + '/lib/controllers/bar').bar;
user =       require(process.env.APP_DIR + '/lib/controllers/user').user;

Server = (function() {
  function Server() {}

  Server.prototype.configure = function(special, handler) {
    var defaults,
      _this = this;

    if (typeof special !== 'object') {
      if (typeof special === 'function') {
        handler = special;
      }
      special = {};
    }

    defaults = {
      port:                   3000,
      theme:                  'default',
      mongodb_connection:     'mongodb://127.0.0.1:27017/spacepro',
      memcached_connection:   '127.0.0.1:11212'
    };

    this.options = _.extend({}, defaults, special);

    mkpath.sync(process.env.APP_CONF);
    store.store(process.env.APP_STORE);

    if (cluster.isMaster) {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }
    
    async.series([
      function(fn) {
        _this.answer(store, 'port', fn);
      }, function(fn) {
        _this.answer(store, 'theme', fn);
      }, function(fn) {
        _this.answer(store, 'firebird_host', fn);
      }, function(fn) {
        _this.answer(store, 'firebird_path', fn);
      }, function(fn) {
        _this.answer(store, 'firebird_user', fn);
      }, function(fn) {
        _this.answer(store, 'firebird_password', fn);
      }, function(fn) {
        _this.answer(store, 'mongodb_connection', fn);
      }, function(fn) {
        _this.answer(store, 'memcached_connection', fn);
      }
    ], function(err, results) {
      if (cluster.isMaster) {
        _this.rl.close();
      }
      _this.init(results);
      if (typeof handler === 'function') {
        handler();
      }
    });
  };

  Server.prototype.answer = function(store, key, fn) {
    var proc;
    if (fn == null) {
      fn = function() {};
    }
    proc = function(key) {
      return process.env["" + (key.toString().toUpperCase())];
    };
    if ((this.options[key] == null) && !store.get(key) && !proc(key)) {
      if (this.rl == null) {
        throw 'rl not defined';
      }
      store.question(this.rl, key, function(value) {
        fn(null, value);
      });
    } else {
      if (!proc(key)) {
        if (!store.get(key)) {
          fn(null, this.options[key]);
        } else {
          fn(null, store.get(key));
        }
      } else {
        fn(null, proc(key));
      }
    }
  };

  Server.prototype.init = function(results) {
    process.env.PORT =                   results[0];
    process.env.THEME =                  results[1];
    process.env.FIREBIRD_HOST =          results[2];
    process.env.FIREBIRD_PATH =          results[3];
    process.env.FIREBIRD_USER =          results[4];
    process.env.FIREBIRD_PASSWORD =      results[5];
    process.env.MONGODB_CONNECTION =     results[6];
    process.env.MEMCACHED_CONNECTION =   results[7];
  };

  Server.prototype.mongodb_connect = function() {
    if (process.env.MONGODB_CONNECTION == null) {
      throw 'undefined mongodb_connection';
    }
    mongoose.connect(process.env.MONGODB_CONNECTION);
    mongoose.connection.on('error', function(err) {
      if (err) {
        throw err;
      }
    });
  };

  Server.prototype.memcached_connect = function() {
    if (process.env.MEMCACHED_CONNECTION == null) {
      throw 'undefined memcached_connection';
    }
    Memcached.config.poolsize = 10;
    global.memcached = new Memcached(process.env.MEMCACHED_CONNECTION);
  };

  Server.prototype.express = function() {
    var app = express();

    require(process.env.APP_DIR + '/lib/config/express/server')(app);
    require(process.env.APP_DIR + '/lib/routes/route')(app);
    require(process.env.APP_DIR + '/lib/routes/auth')(app);
    require(process.env.APP_DIR + '/lib/routes/dict')(app);      
    require(process.env.APP_DIR + '/lib/plugins/addDeviceValue/route')(app);

    return app;
  };

  Server.prototype.update = function(key) {
    var _this = this;

    this.configure(function() {

      _this.mongodb_connect();
      _this.memcached_connect();

      switch (key) {
        case 'all':
          async.series([
            function(fn) {
              bar.updateAllDicts(function() {
                fn();
              });
            },
            function(fn) {
              grid.updateGridByUserId(function() {
                fn();
              });
            },
            function(fn) {
              user.updateAllUsers(function() {
                fn();
              });
            }
          ], function() {
            process.exit();
          });
          break;
        case 'dicts':
          bar.updateAllDicts(function() {
            process.exit();
          });
          break;
        case 'grids':
          grid.updateGridByUserId(function() {
            process.exit();
          });
          break;
        case 'users':
          user.updateAllUsers(function() {
            process.exit();
          });
          break;
        default:
          process.exit();
      }
    });
  };

  Server.prototype.run = function(special, handler) {
    var _this = this;

    if (typeof special !== 'object') {
      if (typeof special === 'function') {
        handler = special;
      }
      special = {};
    }

    this.configure(special, function() {
      var app, server;

      _this.mongodb_connect();
      _this.memcached_connect();

      app = _this.express();

      server = http.createServer(app);
      if (typeof handler === 'function') {
        handler(server);
      }
      
    });
  };

  return Server;

})();

exports = module.exports = new Server();

exports.Server = Server;
