
Users = 	require(process.env.APP_DIR + '/lib/models/users')

module.exports = (app) ->

	app.get '/api/users', (req, res) ->
		users = new Users()
		users.getList () ->
			res.json users.toJSON()


