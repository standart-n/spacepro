
Backbone = 	require('backbone')
User = 		require(process.env.APP_DIR + '/lib/models/user')

exports = module.exports = Backbone.Collection.extend

	model: User

	initialize: () ->


