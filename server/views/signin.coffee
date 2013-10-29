
Globals = 	require(process.env.APP_DIR + '/lib/views/globals')
Users = 	require(process.env.APP_DIR + '/lib/models/users')

Signin = Globals.extend

	defaults:
		users:	[]

	initialize: () ->

		this.globals()

		this.set 'title', "#{this.get('title')} | Авторизация"

		this.addLocalCssFile 	'signin'
		this.addLocalJsFile 	'signin'


	# getAllUsers: (fn) ->	

	# 	users = new Users()
	# 	users.getAllUsers () =>
	# 		this.set 				'users', users.toJSON()
	# 		this.exportGlobalObject 'users', this.get('users')
	# 		fn null, 'done' if typeof fn is 'function'


exports = module.exports = Signin
