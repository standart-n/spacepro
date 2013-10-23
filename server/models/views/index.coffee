
Globals = require(process.env.APP_DIR + '/lib/models/views/globals')

Index = Globals.extend

	initialize: () ->
		this.globals()
		this.addStyle()




exports = module.exports = Index
