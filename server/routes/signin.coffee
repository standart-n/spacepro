
async = 	require('async')
Signin = 	require(process.env.APP_DIR + '/lib/views/signin')

module.exports = (app) ->

	app.get '/', (req, res) ->
		signin = new Signin()

		async.series [		
			(fn) -> signin.getUsers(fn)
		], (err, results) ->
			res.render 'layout/signin', signin.toJSON()


