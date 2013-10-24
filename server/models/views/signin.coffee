
Globals = require(process.env.APP_DIR + '/lib/models/views/globals')

Signin = Globals.extend

	initialize: () ->
		this.globals()

		this.set 'title', "#{this.get('title')} | Авторизация"

		this.addLocalCssFile 	'signin'
		this.addLocalJsFile 	'signin'


exports = module.exports = Signin
