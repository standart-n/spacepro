
Backbone = 		require('backbone')
Signin = 		require('signin')

module.exports = Backbone.Router.extend

	# routes:
	# 	':id': 	'changeUser'

	initialize: () ->

		this.signin = new Signin()


	# changeUser: (id) ->
	# 	this.listOfUsers.trigger 'change', id


		
		

