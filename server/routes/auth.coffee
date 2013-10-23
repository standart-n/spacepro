
# Signin = 			require(global.home + '/lib/controllers/signin').Signin

Index = 			require(process.env.APP_DIR + '/lib/models/views/index')


module.exports = (app) ->

	app.get '/', (req, res) ->
		index = new Index()
		# console.log index.toJSON()
		# console.log index.get('name')
		# console.log index
		res.render 'index', index.toJSON()

	app.get '/signin', (req, res) ->

		signin = new Signin(req, res)
		signin.emit('check')


	app.get '/signin/:id/:key', (req, res) ->

		signin = new Signin(req, res)
		signin.emit('fetch')
