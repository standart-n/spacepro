
Backbone = 	require('backbone')
Users = 	require('users')

module.exports = Backbone.View.extend

	el:	'#signin-users'

	initialize: () ->

		this.users = new Users()

		this.users.reset window.users

		# this.users.on 'add', (user) =>
		# 	this.$el.append jade.templates.user 
		# 		user:	user.toJSON()

		this.on 'change', (id) =>
			user = this.users.get(id)
			jalert user.toJSON()

		# this.users.fetch()


		
		

