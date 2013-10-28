
Backbone = 		require('backbone')
ListOfUsers = 	require('listOfUsers')

module.exports = Backbone.Router.extend

	routes:
		':id': 	'changeUser'

	initialize: () ->

		this.listOfUsers = new ListOfUsers()


	changeUser: (id) ->

		this.listOfUsers.trigger 'change', id


		
		

