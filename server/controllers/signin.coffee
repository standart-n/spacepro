
Backbone = 		require('backbone')
async = 		require('async')
colors = 		require('colors')
md5 = 			require('MD5')
Validate = 		require(process.env.APP_DIR + '/lib/controllers/validate')
Session = 		require(process.env.APP_DIR + '/lib/controllers/session')
Firebird = 		require(process.env.APP_DIR + '/lib/controllers/firebird')


Signin = Firebird.extend

	defaults: 
		id:					null
		login:				null
		password:			null

		session_id:			null
		session_success:	null
		session_startdt:	null
		workstation_id:		null
		workstation_name:	null

		web_group_id:		-20
		
		error:				null
		fb_connection:		null
		fb_transaction:		null
		
		result:				'error'


	initialize: () ->

	check: (fn = () ->) ->

		req = if this.get('req') then this.get('req') else { gettext: (s) -> s }

		this.set 'login', 		if this.get('login')? 		then this.get('login').toString().trim() 		else ''
		this.set 'password', 	if this.get('password')? 	then this.get('password').toString().trim()		else ''

		valid = new Validate
			schema:			'signin'
			data:
				login:		this.get('login')
				password: 	this.get('password')

		if !valid.check()
			this.set 'error', req.gettext(valid.get('errors')[0])

		async.series
			
			openConnection: (fn) =>
				this.fbConnectionOpen(fn)

			startTransaction: (fn) =>
				this.fbTransactionStart(fn)

			userExist: (fn) =>
				if this.get('fb_transaction')
					tr = this.get('fb_transaction')
					tr.query this.sqlUserExist(), (err, result) =>

						if result?.length?

							if result.length < 1
								this.fbCheckError('User not found', fn)

							else
								if result[0].status isnt 0
									this.fbCheckError('Account is not active', fn)

								else 
									if result[0].userpsw.toString().length < 1
										this.fbCheckError('The user has no password', fn)

									else
										this.set 
											id: 	result[0].id
											name: 	result[0].username
											hash: 	result[0].userpsw

										fn(null, 'success')

						else
							this.fbCheckError(err, fn)

				
				else
					this.fbCheckError('Transaction not found', fn)


			userGroupAllow: (fn) =>
				if this.get('fb_transaction')
					tr = this.get('fb_transaction')
					tr.query this.sqlUserGroupAllow(), (err, result) =>

						if result?.length?
							if result.length < 1
								this.fbCheckError('You are not allowed to login', fn)
							else
								this.fbTransactionCommit(tr, fn)
						else
							this.fbCheckError(err, fn)

				else
					this.fbCheckError('Transaction not found', fn)


		, (err, results) =>

			this.fbConnectionClose()
			this.checkPassword()

			if !this.get('error')
				this.startSession () =>
					if !this.get('error')
						this.set 'result', 'success'
					fn()
			else
				fn()

	
	startSession: (fn = () ->) ->

		session = new Session
			req: 		this.get('req')
			user_id:	this.get('id')

		session.start (err, result) =>

			# console.log result

			if err or !result?.success?
				this.set 'error', req.gettext("Create a session failed")
			else
				this.set 'session_id', 			result.session_id
				this.set 'session_success', 	result.success
				this.set 'session_startdt', 	result.startdt
				this.set 'workstation_id', 		result.workstation_id
				this.set 'workstation_name', 	result.ws_name
			
			fn()



	checkPassword: () ->
		if !this.get('error')
			req = if this.get('req') then this.get('req') else { gettext: (s) -> s }
			hash = md5 this.get('password')
			if !this.get('hash') 
				this.set 'hash', '0000' 
			if this.get('hash').toString().toUpperCase() isnt hash.toString().toUpperCase()
				this.set 'error', req.gettext('Incorrect login or password')


	
	sqlUserExist: () ->
		"""
		select
		id, status, username, userpsw
		from sp$users 
		where 
		(userlogin = '#{this.get('login')}')
		"""

	sqlUserGroupAllow: () ->
		"""
		select
		id
		from sp$group_detail
		where
		(group_id = #{this.get('web_group_id')}) and (grouptable_id = #{this.get('id')})
		"""

exports = module.exports = Signin


