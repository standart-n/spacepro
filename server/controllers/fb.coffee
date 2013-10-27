
fb = 			require('node-firebird')

class Fb

	constructor: () ->

	connection: (fn) ->

		fb.attach
			host:			process.env.FIREBIRD_HOST
			database: 		process.env.FIREBIRD_PATH
			user: 			process.env.FIREBIRD_USER
			password:		process.env.FIREBIRD_PASSWORD
		, (err, db) =>
			if err
				throw err
			else
				this.db = db
				fn db if typeof fn is 'function'


	query: (query, fn) ->

		if query? and this.db?

			this.db.query query, (err, result) =>
				if err
					throw err
				else
					this.result = result
					fn result if typeof fn is 'function'



exports = module.exports = new Fb()

exports.Fb = Fb



