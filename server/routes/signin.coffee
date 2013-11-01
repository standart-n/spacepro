
_ = 		require('lodash')
Signin = 	require(process.env.APP_DIR + '/lib/controllers/signin')

module.exports = (app) ->

	app.post '/api/signin', (req, res) ->		

		model = 	if req.body?.model? then req.body.model else '{}'
		data = 		JSON.parse model

		signin = new Signin
			req:		req 
			res:		res
			login:		data.login
			password:	data.password
			
		signin.check () ->
			res.json _.pick signin.toJSON(), 
				'result', 
				'error',
				'id',
				'name',
				'session_id',
				'session_success',
				'session_startdt',
				'workstation_id',
				'workstation_name'


