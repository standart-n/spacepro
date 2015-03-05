
var colors =    require('colors');
var cluster =   require('cluster');
var moment =    require('moment');
var mkpath =    require('mkpath');
var numCPUs =   require('os').cpus();
var store =     require(process.env.APP_DIR + '/lib/controllers/storage');
var server =    require(process.env.APP_DIR + '/lib/controllers/server');
var fbEvent =   require(process.env.APP_DIR + '/lib/controllers/fbevent');

module.exports = function(program) {
  if (program == null) {
    throw 'program is not exists';
  }
  if (server == null) {
    throw 'server is not exists';
  }

  mkpath.sync(process.env.APP_CONF);
  mkpath.sync(process.env.APP_DIR + '/docs');
  mkpath.sync(process.env.APP_DIR + '/grids');
  mkpath.sync(process.env.APP_DIR + '/dicts');
  store.store(process.env.APP_STORE);

  program
    .option('-p, --port <port>', "port for server", parseInt)
    .option('-P, --profile <name>', "profile of settings in " + process.env.APP_USR)
    .option('-t, --theme <name>', "theme of design");

  program.on('port', function() {
    if (program.port != null) {
      process.env.PORT = program.port;
    }
  });

  program.on('theme', function() {
    if (program.theme != null) {
      process.env.THEME = program.theme;
    }
  });

  program.on('profile', function() {
    if (program.profile != null) {
      process.env.PROFILE = program.profile;
    }
    process.env.APP_CONF = "" + process.env.APP_USR + "/" + process.env.PROFILE;
    process.env.APP_STORE = "" + process.env.APP_CONF + "/store.json";
    mkpath.sync(process.env.APP_CONF);
    store.store(process.env.APP_STORE);
  });

  program
    .command('run')
    .description('start spacepro server')
    .action(function() {
      process.env.COMMAND = 'run';

      if (cluster.isMaster) {
        server.configure(function() {
          var workers = numCPUs.length;
          workers = 1;

          console.log("server work at ".grey + ("http://localhost:" + (process.env.PORT.toString())).blue);

          cluster.setupMaster({
            exec: process.env.APP_EXEC,
            silent: false,
            args: [
              "run", 
              "--port", 
              process.env.PORT, 
              "--profile", 
              process.env.PROFILE
            ]
          });

          for (var i = 0; i < workers; i++) {
            cluster.fork();
          }
          // cluster.fork();

          fbEvent.start();

          cluster.on('exit', function(worker, code, signal) {
            console.log("worker " + worker.process.pid + " died");
          });

        });
      }

      if (cluster.isWorker) {

        // process.on('uncaughtException', function(err) {
        //   var 
        //     tm =      moment().format('HH:mm:ss.SSS').red + " " + moment().format('DD/MM/YYYY').magenta,
        //     caption = 'Error:'.red;
        //   console.error(tm, caption, err);
        // });

        server.run(function(service) {
          service.listen(process.env.PORT);
        });
      }

  });

  program
    .command('update <key>')
    .description('update data of <all|dicts|grids|users>')
    .action(function(key) {
      process.env.COMMAND = 'update';
      server.update(key);
    });

  program
    .command('upgrade <type> <key>')
    .description('upgrade <dict> by <sid>')
    .action(function(type, key) {
      process.env.COMMAND = 'upgrade';
      server.upgrade(type, key);
    });

  program
    .command('view <type> <key>')
    .description('view <grid> by <name>')
    .action(function(type, key) {
      process.env.COMMAND = 'view';
      server.view(type, key);
    });    

  program
    .command('clear <key>')
    .description('update data of <all|dicts|grids|users>')
    .action(function(key) {
      process.env.COMMAND = 'clear';
      server.clear(key);
    });

  program
    .command('set <key> <value>')
    .description('set settings')
    .action(function(key, value) {
      console.log(store.set(key, value));
      process.exit();
    });

  program
    .command('get <key>')
    .description('get settings')
    .action(function(key) {
      console.log(store.get(key));
      process.exit();
    });

  program
    .command('remove <key>')
    .description('remove settings')
    .action(function(key) {
      console.log(store.remove(key));
      process.exit();
    });

  program
    .command('import <data>')
    .description('import data into settings')
    .action(function(data) {
      console.log(store["import"](data));
      process.exit();
    });

  program
    .command('export')
    .description('export data from settings')
    .action(function() {
      console.log(store["export"]());
      process.exit();
    });

  program.on('--help', function() {
    console.log("  Examples:");
    console.log("");
    console.log("    $ " + process.env.APP_NAME + " run");
    console.log("");
  });

};
