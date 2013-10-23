
Backbone = require('backbone')

Globals = Backbone.Model.extend

	globals: () ->
		this.set 'pretty',  on

		this.set 'name', 			process.env.APP_NAME
		this.set 'author', 			process.env.APP_AUTHOR
		this.set 'description', 	process.env.APP_DESCRIPTION
		this.set 'keywords', 		process.env.APP_KEYWORDS
		this.set 'version', 		process.env.APP_VERSION


exports = module.exports = Globals

