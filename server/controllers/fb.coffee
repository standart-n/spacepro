
Backbone = 		require('backbone')
fb = 			require('node-firebird')


exports = module.exports = Backbone.Model.extend

	defaults:
		host:			process.env.FIREBIRD_HOST
		database: 		process.env.FIREBIRD_PATH
		user: 			process.env.FIREBIRD_USER
		password:		process.env.FIREBIRD_PASSWORD

	
	initialize: () ->

	connection: (fn) ->

		fb.attach
			host:			this.get('host')
			database: 		this.get('database')
			user: 			this.get('user')
			password:		this.get('password')
		, (err, db) =>			
			throw err if err
			
			if err
				fn err if typeof fn is 'function'
			
			else
				fn null, db if typeof fn is 'function'


