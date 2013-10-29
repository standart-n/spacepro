
Backbone = 	require('backbone')
User = 		require(process.env.APP_DIR + '/lib/models/user')
fb = 		require(process.env.APP_DIR + '/lib/controllers/fb')

exports = module.exports = Backbone.Collection.extend

	model: User

	initialize: () ->


