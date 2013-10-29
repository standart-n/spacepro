
Backbone = 		require('backbone')

exports = module.exports = Backbone.Model.extend

	defaults:

		d$uuid:			''
		username:		''
		userlogin:		''
		userpsw:		''
		post:			''


	initialize: () ->

		this.set 'd$uuid', 	this.get('d$uuid').toString().trim()
		this.set 'id', 		this.get('d$uuid')

		
		

