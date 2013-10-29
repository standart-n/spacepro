
express = 		require('express')
http = 			require('http')
cluster = 		require('cluster')
mongoose = 		require('mongoose')
colors = 		require('colors')
readline = 		require('readline')
mkpath = 		require('mkpath')
async = 		require('async')
_ = 			require('lodash')
store = 		require(process.env.APP_DIR + '/lib/controllers/storage')
	
class Server

	constructor: () ->

	configure: (special, handler) ->

		if typeof special isnt 'object'
			handler = special 	if typeof special is 'function'
			special = {}

		defaults =
			port:					3000
			theme:					'default'
			mongodb_connection:		'mongodb://127.0.0.1:27017/spacepro'

		@options = _.extend {}, defaults, special

		mkpath.sync(process.env.APP_CONF)
		store.store(process.env.APP_STORE)

		if cluster.isMaster

			@rl = readline.createInterface
				input: 	process.stdin
				output:	process.stdout

		async.series [

			(callback) =>	@answer(store, 'port', 					callback)
			(callback) =>	@answer(store, 'theme', 				callback)
			(callback) =>	@answer(store, 'firebird_host', 		callback)
			(callback) =>	@answer(store, 'firebird_path', 		callback)
			(callback) =>	@answer(store, 'firebird_user', 		callback)
			(callback) =>	@answer(store, 'firebird_password', 	callback)
			(callback) =>	@answer(store, 'mongodb_connection', 	callback)

		], (err, results) =>
			@rl.close() if cluster.isMaster
			@init(results)
			handler() if typeof handler is 'function'


	answer: (store, key, callback) ->

		proc = (key) ->
			process.env["#{key.toString().toUpperCase()}"]

		if !@options[key]? and !store.get(key) and !proc(key)
			throw 'rl not defined' if !@rl?
			store.question @rl, key, (value) ->
				callback(null, value)
		else
			if !proc(key)
				if !store.get(key)
					callback null, @options[key]
				else
					callback null, store.get(key)
			else
				callback null, proc(key)


	init: (results) ->

		process.env.PORT = 					results[0]
		process.env.THEME = 				results[1]
		process.env.FIREBIRD_HOST = 		results[2]
		process.env.FIREBIRD_PATH = 		results[3]
		process.env.FIREBIRD_USER = 		results[4]
		process.env.FIREBIRD_PASSWORD = 	results[5]
		process.env.MONGODB_CONNECTION = 	results[6]


	run: (special, handler) ->

		if typeof special isnt 'object'
			handler = special 	if typeof special is 'function'
			special = {}

		@configure special, () =>

			app = express()

			if !process.env.MONGODB_CONNECTION?
				throw 'undefined mongodb_connection'

			mongoose.connect(process.env.MONGODB_CONNECTION)

			mongoose.connection.on 'error', (err) ->
				throw err if err

			require(process.env.APP_DIR + '/lib/config/express/server')(app)
	
			require(process.env.APP_DIR + '/lib/routes/route')(app)			
			require(process.env.APP_DIR + '/lib/routes/signin')(app)

			server = http.createServer(app)

			handler(server) if typeof handler is 'function'



exports = module.exports = new Server()

exports.Server = Server
