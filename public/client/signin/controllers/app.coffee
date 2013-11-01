
Backbone = 		require('backbone')
Signin = 		require('signin')
Resolve = 		require('resolve')

module.exports = Backbone.Router.extend

	# routes:
	# 	':id': 	'changeUser'

	initialize: () ->

		this.signin = new Signin()
		this.resolve = new Resolve()


	# changeUser: (id) ->
	# 	this.listOfUsers.trigger 'change', id


		
		

