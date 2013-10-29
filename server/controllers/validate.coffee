
Backbone = 		require('backbone')
validate = 		require('validate')

exports = module.exports = Backbone.Model.extend

	defaults:

		schema: 	''
		data:		{}
		errors:		[]
		result:		false


	initialize: () ->

		this.checkout()

	checkout: () ->

		schema = require(process.env.APP_DIR + '/lib/validates/' + this.get('schema'))

		result = validate schema, this.get('data')

		if Array.isArray(result)
			errors = []
			for error in result
				errors.push error.toString().replace('Error: ','')

			this.set 'errors', errors
			this.set 'result', false

		else
			this.set 'result', true

	
	check: () -> 	return this.get('result')
	result: () -> 	return this.get('result')
	errors: () -> 	return this.get('errors')







