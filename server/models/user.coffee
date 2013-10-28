
Backbone = 		require('backbone')

module.exports = Backbone.Model.extend

	defaults:

		d$uuid:			''
		status:			0
		username:		''
		userlogin:		''
		userpsw:		''
		usergroup_id:	0
		post:			''


	initialize: () ->

		this.set 'd$uuid', 	this.get('d$uuid').toString().trim()
		this.set 'id', 		this.get('d$uuid')

		
		

