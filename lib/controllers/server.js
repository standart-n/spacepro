
var _ =          require('lodash');
var fs =         require('fs');
var async =      require('async');
var http =       require('http');
var colors =     require('colors');
var mkpath =     require('mkpath');
var express =    require('express');
var readline =   require('readline');
var mongoose =   require('mongoose');
var rm =         require('remove');
var debug =      require('debug')('server');
// var memwatch =   require('memwatch');
// var cluster =    require('cluster');

var store =      require(process.env.APP_DIR + '/lib/controllers/storage');
var grid =       require(process.env.APP_DIR + '/lib/controllers/grid').grid;
var bar =        require(process.env.APP_DIR + '/lib/controllers/bar').bar;
var user =       require(process.env.APP_DIR + '/lib/controllers/user').user;
var group =      require(process.env.APP_DIR + '/lib/controllers/group').group;
var filter =     require(process.env.APP_DIR + '/lib/controllers/filter').filter;
var jsome =      require(process.env.APP_DIR + '/lib/controllers/jsome');

var config =     require(process.env.APP_DIR + '/lib/config/express/server');
var routeMain =  require(process.env.APP_DIR + '/lib/routes/route');
var routeAuth =  require(process.env.APP_DIR + '/lib/routes/auth');
var routeDict =  require(process.env.APP_DIR + '/lib/routes/dict');      


var Server = function() {

};

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
    memcached_connection:   '127.0.0.1:11211'
  };

  this.options = _.extend({}, defaults, special);

  mkpath.sync(process.env.APP_CONF);
  store.store(process.env.APP_STORE);

  // if (cluster.isMaster) {
    this.rl = readline.createInterface({
      input:  process.stdin,
      output: process.stdout
    });
  // }
  
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
    // if (cluster.isMaster) {
      _this.rl.close();
    // }
    _this.init(results);
    if (typeof handler === 'function') {
      handler();
    }
  });
};

Server.prototype.answer = function(store, key, fn) {

  if (fn == null) {
    fn = function() {};
  }
  var proc = function(key) {
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
      // throw err;
      console.log('Server.prototype.mongodb_connect', 'mongoose.connection.on(error)', err);
    }
  });
};

Server.prototype.memcached_connect = function() {
  // require(process.env.APP_DIR + '/lib/controllers/memcached');
};

Server.prototype.express = function() {
  var app = express();

  config(app);
  routeMain(app);
  routeAuth(app);
  routeDict(app);

  return app;
};

Server.prototype.updatePasswordByUserLogin = function(userlogin, userpassword) {
  this.configure(function() {
    user.updatePasswordByLogin(userlogin, userpassword, function() {
      process.exit();
    });
  });
};

Server.prototype.copyGridByUserLogin = function(userlogin) {
  this.configure(function() {
    grid.copyGridByUserLogin(userlogin, function() {
      process.exit();
    });
  });
};

Server.prototype.update = function(key) {
  var _this = this;

  debug('update'.magenta, key.yellow);

  this.configure(function() {

    _this.mongodb_connect();
    _this.memcached_connect();

    switch (key) {
      case 'all':
        async.series([
          function(fn) {
            bar.updateAllDicts(function(err) {
              debug('bar.updateAllDicts'.magenta);
              fs.chmodSync(process.env.APP_DIR + '/dicts', 0777);
              fn(err);
            });
          },
          function(fn) {
            group.updateAllGroups(function(err) {
              debug('group.updateAllGroups'.magenta);
              fn(err);
            });
          },
          function(fn) {
            filter.updateAllFilters(function(err) {
              debug('filter.updateAllFilters'.magenta);
              fn(err);
            });
          },
          function(fn) {
            grid.updateGridByUserId(function() {
              debug('grid.updateGridByUserId'.magenta);
              fs.chmodSync(process.env.APP_DIR + '/grids', 0777);
              fn();
            });
          },
          function(fn) {
            user.updateAllUsers(function(err) {
              debug('user.updateAllUsers'.magenta);
              fn(err);
            });
          }
        ], function(err) {
          if (err) {
            debug('update'.red, key.yellow, err);
          }
          process.exit();
        });
        break;
      case 'dicts':
        bar.updateAllDicts(function() {
          debug('bar.updateAllDicts'.magenta);
          fs.chmodSync(process.env.APP_DIR + '/dicts', 0777);
          process.exit();
        });
        break;
      case 'grids':
        grid.updateGridByUserId(function() {
          debug('grid.updateGridByUserId'.magenta);
          fs.chmodSync(process.env.APP_DIR + '/grids', 0777);
          process.exit();
        });
        break;
      case 'users':
        user.updateAllUsers(function(err) {
          if (!err) {
            debug('user.updateAllUsers'.magenta);
          } else {
            debug('user.updateAllUsers'.red, err);            
          }
          process.exit();
        });
        break;
      case 'groups':
        group.updateAllGroups(function(err) {
          if (!err) {
            debug('group.updateAllGroups'.magenta);
          } else {
            debug('group.updateAllGroups'.red, err);
          }
          process.exit();
        });
        break;
      case 'filters':
        filter.updateAllFilters(function(err) {
          if (!err) {
            debug('filter.updateAllFilters'.magenta);
          } else {
            debug('filter.updateAllFilters'.red, err);
          }
          process.exit();
        });
        break;
      default:
        process.exit();
    }
  });
};

Server.prototype.clear = function(key) {
  var _this = this;

  this.configure(function() {

    _this.mongodb_connect();

    switch (key) {
      case 'all':
        async.series([
          function(fn) {
            bar.clearAllDicts(function(err) {
              rm(process.env.APP_DIR + '/dicts', function() {
                fn(err);
              });
            });
          },
          function(fn) {
            grid.clearAllGrids(function(err) {
              rm(process.env.APP_DIR + '/grids', function() {
                fn(err);
              });
            });
          },
          function(fn) {
            user.clearAllUsers(function(err) {
              fn(err);
            });
          }
        ], function(err) {
          if (err) {
            console.log('clear with errors:', err);
          }
          process.exit();
        });
        break;
      case 'dicts':
        bar.clearAllDicts(function(err) {
          if (err) {
            console.log('clearAllDicts:', err);
          }
          rm(process.env.APP_DIR + '/dicts', function() {
            process.exit();
          });
        });
        break;
      case 'grids':
        grid.clearAllGrids(function(err) {
          if (err) {
            console.log('clearAllGrids:', err);
          }
          rm(process.env.APP_DIR + '/grids', function() {
            process.exit();
          });
        });
        break;
      case 'users':
        user.clearAllUsers(function(err) {
          if (err) {
            console.log('clearAllUsers:', err);
          }
          process.exit();
        });
        break;
      default:
        process.exit();
    }
  });
};

Server.prototype.upgrade = function(type, key) {
  var _this = this;

  this.configure(function() {

    _this.mongodb_connect();
    _this.memcached_connect();

    switch (type) {
      case 'dict':
        bar.upgradeDictBySid(key, function(err, res) {
          if (!err) {
            group.updateAllGroups(function(err) {
              filter.updateAllFilters(function(err) {
                console.log(jsome(res));
                process.exit();
              });
            });
          } else {
            process.exit();
          }
        });
        break;
      default:
        process.exit();
    }
  });
};

Server.prototype.view = function(type, key) {
  var _this = this;

  this.configure(function() {

    _this.mongodb_connect();
    _this.memcached_connect();

    switch (type) {
      case 'grid':
        grid.getGridByViewAndUserId(key, function(err, res) {
          if (!err) {
            console.log(jsome(res));
            process.exit();
          } else {
            console.log(err);
            process.exit();
          }
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
    _this.mongodb_connect();
    _this.memcached_connect();

    var app = _this.express();

    // memwatch.on('leak', function(info) {
    //   console.log('leak:', info);
    // });

    // memwatch.on('stats', function(info) {
    //   console.log('stats:', info);
    // });

    var service = http.createServer(app);
    
    // servive.on('connection', function(socket) {
    //   socket.setNoDelay();
    // });

    if (typeof handler === 'function') {
      handler(service);
    }
    
  });
};

exports = module.exports = Server;
