
# Signin = 			require(global.home + '/lib/controllers/signin').Signin

Signin = 			require(process.env.APP_DIR + '/lib/models/views/signin')


module.exports = (app) ->

	app.get '/', (req, res) ->
		signin = new Signin()
		res.render 'layout/signin', signin.toJSON()

	app.get '/signin', (req, res) ->

		signin = new Signin(req, res)
		signin.emit('check')


	app.get '/signin/:id/:key', (req, res) ->

		signin = new Signin(req, res)
		signin.emit('fetch')
