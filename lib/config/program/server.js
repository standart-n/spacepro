var cluster, colors, mkpath, numCPUs, server, store;

colors =    require('colors');
cluster =   require('cluster');
mkpath =    require('mkpath');
numCPUs =   require('os').cpus();
store =     require(process.env.APP_DIR + '/lib/controllers/storage');
server =    require(process.env.APP_DIR + '/lib/controllers/server');

module.exports = function(program) {
  if (program == null) {
    throw 'program is not exists';
  }
  if (server == null) {
    throw 'server is not exists';
  }

  mkpath.sync(process.env.APP_CONF);
  store.store(process.env.APP_STORE);

  program
    .option('-p, --port <port>', "port for server", parseInt)
    .option('-P, --profile <name>', "profile for settings in " + process.env.APP_LIB)
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

  program.command('run').description('run server').action(function() {
    process.env.COMMAND = 'run';

    if (cluster.isMaster) {
      server.configure(function() {

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

        // for (var i = 0; i < numCPUs.length; i++) {
        //   cluster.fork();
        // }
        cluster.fork();
        
        cluster.on('exit', function(worker, code, signal) {
          console.log("worker " + worker.process.pid + " died");
        });

      });
    }

    if (cluster.isWorker) {
      server.run(function(service) {
        service.listen(process.env.PORT);
      });
    }

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
