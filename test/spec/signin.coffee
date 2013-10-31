
process.env.APP_DIR = '../..'

fb_test_data = 		require(process.env.APP_DIR + '/test/conf/fb.json')
user_test_data = 	require(process.env.APP_DIR + '/test/conf/user.json')

process.env.FIREBIRD_HOST = 		fb_test_data.host
process.env.FIREBIRD_PATH = 		fb_test_data.path
process.env.FIREBIRD_USER = 		fb_test_data.user
process.env.FIREBIRD_PASSWORD = 	fb_test_data.password

assert = 	require('chai').assert
Signin = 	require(process.env.APP_DIR + '/lib/controllers/signin')


describe 'Signin:', () ->

	describe 'Signin whithout login and password:', () ->

		signin = new Signin
			login:			''
			password:		''
			hide_errors: 	true

		it 'Should return "Please enter your login"', (done) ->

			
			signin.check () ->

				assert.equal('Please enter your login', signin.get('error'))
				assert.equal(null, signin.get('fb_connection'))
				assert.equal(null, signin.get('fb_transaction'))
				done()


	describe 'Signin whithout password:', () ->

		signin = new Signin
			login:		'username'
			password:	''
			hide_errors: 	true

		it 'Should return "Please enter your password"', (done) ->
	
			signin.check () ->

				assert.equal('Please enter your password', signin.get('error'))
				assert.equal(null, signin.get('fb_connection'))
				assert.equal(null, signin.get('fb_transaction'))
				done()


	describe 'Signin whith wrong login:', () ->

		signin = new Signin
			login:		'username'
			password:	'password'
			hide_errors: 	true

		it 'Should return "User not found"', (done) ->
	
			signin.check () ->

				assert.equal('User not found', signin.get('error'))
				assert.equal(null, signin.get('fb_connection'))
				assert.equal(null, signin.get('fb_transaction'))
				done()


	describe 'Signin whith wrong password:', () ->

		signin = new Signin
			login:		user_test_data.worker.login
			password:	'password'
			hide_errors: 	true

		it 'Should return "Incorrect login or password"', (done) ->
	
			signin.check () ->

				assert.equal('Incorrect login or password', signin.get('error'))
				assert.equal(null, signin.get('fb_connection'))
				assert.equal(null, signin.get('fb_transaction'))
				done()


	describe 'Signin whith permission denied:', () ->

		signin = new Signin
			login:			user_test_data.worker.login
			password:		user_test_data.worker.password
			web_group_id:	'-9999'
			hide_errors: 	true

		it 'Should return "You are not allowed to login"', (done) ->
	
			signin.check () ->

				assert.equal('You are not allowed to login', signin.get('error'))
				assert.equal(null, signin.get('fb_connection'))
				assert.equal(null, signin.get('fb_transaction'))
				done()
