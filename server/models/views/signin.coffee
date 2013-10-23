
Globals = require(process.env.APP_DIR + '/lib/models/views/globals')

Signin = Globals.extend

	initialize: () ->
		this.globals()

		this.set 'title', "#{this.get('title')} | Авторизация"

		this.addStyle '_signin'


exports = module.exports = Signin
