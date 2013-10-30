
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

		this.addLocaleString 'Server not found'


	# getAllUsers: (fn) ->	

	# 	users = new Users()
	# 	users.getAllUsers () =>
	# 		this.set 				'users', users.toJSON()
	# 		this.exportGlobalObject 'users', this.get('users')
	# 		fn null, 'done' if typeof fn is 'function'


exports = module.exports = Signin

