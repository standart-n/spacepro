
colors = 		require('colors')
cluster = 		require('cluster')
mkpath = 		require('mkpath')
numCPUs = 		require('os').cpus()
store = 		require(process.env.APP_DIR + '/lib/controllers/storage')
server = 		require(process.env.APP_DIR + '/lib/controllers/server')

module.exports = (program) ->	

	throw 'program is not exists' 		if !program?
	throw 'server is not exists' 		if !server?

	mkpath.sync(process.env.APP_CONF)
	store.store(process.env.APP_STORE)

	program
		.option('-p, --port <port>', "port for server", parseInt)
		.option('-P, --profile <name>', "profile for settings in #{process.env.APP_LIB}")
		.option('-t, --theme <name>', "theme of design")


	program.on 'port', () ->
		process.env.PORT = 			program.port 		if program.port?

	program.on 'theme', () ->
		process.env.THEME = 		program.theme 		if program.theme?

	program.on 'profile', () ->
		process.env.PROFILE = 		program.profile 	if program.profile?
		process.env.APP_CONF = 		"#{process.env.APP_USR}/#{process.env.PROFILE}"
		process.env.APP_STORE = 	"#{process.env.APP_CONF}/store.json"
		mkpath.sync(process.env.APP_CONF)
		store.store(process.env.APP_STORE)

	program
		.command('run')
		.description('run server')
		.action () ->

			process.env.COMMAND = 'run'

			if cluster.isMaster

				server.configure () ->

					console.log "server work at ".grey + "http://localhost:#{process.env.PORT.toString()}".blue

					cluster.setupMaster
						exec: 	process.env.APP_EXEC
						silent: false
						args: [
							"run"
							"--port"
							process.env.PORT
							"--profile"
							process.env.PROFILE
						]			

					# for i in numCPUs
					cluster.fork()
						
					cluster.on 'exit', (worker, code, signal) ->
						console.log "worker #{worker.process.pid} died"


			if cluster.isWorker

				process.on 'uncaughtException', (err) ->
					# console.log arguments
					console.error 'Caught exception:'.red, JSON.stringify(err).blue

				server.run (service) ->
					service.listen process.env.PORT


	program
		.command('set <key> <value>')
		.description('set settings')
		.action (key,value) ->
			console.log store.set(key, value)
			process.exit()

	program
		.command('get <key>')
		.description('get settings')
		.action (key) ->
			console.log store.get(key)
			process.exit()

	program
		.command('remove <key>')
		.description('remove settings')
		.action (key) ->
			console.log store.remove(key)
			process.exit()

	program
		.command('import <data>')
		.description('import data into settings')
		.action (data) ->
			console.log store.import(data)
			process.exit()

	program
		.command('export')
		.description('export data from settings')
		.action () ->
			console.log store.export()
			process.exit()


	program.on '--help', () ->
		console.log "  Examples:"
		console.log ""
		console.log "    $ #{process.env.APP_NAME} run"
		console.log ""
