
Globals = 	require(process.env.APP_DIR + '/lib/views/globals')
Users = 	require(process.env.APP_DIR + '/lib/models/users')

Signin = Globals.extend

	defaults:
		users:	[]

	initialize: () ->
		req = this.get('req')

		this.globals()

		this.set 'title', "#{this.get('title')} | #{req.gettext('Signin')}"

		this.addLocalCssFile 	'signin'
		this.addLocalJsFile 	'signin'

		this.addLocaleString [
			'Server not found'
		]


exports = module.exports = Signin

