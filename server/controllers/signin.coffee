
Backbone = 		require('backbone')
async = 		require('async')
md5 = 			require('MD5')
Validate = 		require(process.env.APP_DIR + '/lib/controllers/validate')
FB = 			require(process.env.APP_DIR + '/lib/controllers/fb')


exports = module.exports = Backbone.Model.extend

	defaults:

		id:				null
		login:			null
		password:		null
		error:			null
		transaction:	null
		connect:		null
		result:			'error'


	initialize: () ->

	check: (fn) ->
		req = this.get('req')

		valid = new Validate
			schema:			'signin'
			data:
				login:		this.get('login')
				password: 	this.get('password')

		if !valid.check()
			this.set 'error', req.gettext(valid.get('errors')[0])

		async.series
			
			connection: (fn) =>
				if !this.get('error')
					fb = new FB()
					fb.connection (err, connect) =>
						throw err if err 

						if err
							this.set 'error', req.gettext('No connection to the database')
							fn(err)
						else
							this.set 'connect', connect
							fn(null, 'success')
				else
					fn()

			startTransaction: (fn) =>
				if !this.get('error')
					connect = this.get('connect')
					connect.startTransaction (err, tr) =>
						throw err if err

						if err
							this.set 'error', req.gettext('Failed to create transaction')
							fn(err)

						else
							this.set 'transaction', tr
							fn(null, 'success')
				else
					fn()



			userExist: (fn) =>
				if !this.get('error')
					tr = this.get('transaction')
					tr.query this.sqlUserExist(), (err, result) =>
						throw err if err

						if err
							this.set 'error', req.gettext('Error for user search')
							tr.rollback()
							this.unset 'transaction'
							fn(err)
						
						else
							if result.length < 1
								this.set 'error', req.gettext('User not found')

							else
								if result[0].status isnt 0
									this.set 'error', req.gettext('Account is not active')

								if result[0].userpsw.toString().length < 1
									this.set 'error', req.gettext('The user has no password')

								if !this.get('error')
									this.set 
										'id': 		result[0].id
										'name': 	result[0].username
										'hash': 	result[0].userpsw


							fn(null, result.length)					
				
				else
					fn()


			userGroupAllow: (fn) =>
				if !this.get('error')
					tr = this.get('transaction')
					tr.query this.sqlUserGroupAllow(), (err, result) =>
						throw err if err 

						if err 
							this.set 'error', req.gettext('Error in database operations')
							tr.rollback()
							fn(err)

						else
							tr.commit()
							if result.length < 1
								this.set 'error', req.gettext('You are not allowed to login')
							fn()

				else
					fn()


		, (err, results) =>
			this.checkPassword()
			this.closeConnection()
			if !this.get('error')
				this.set 'result', 'success'

			fn() if typeof fn is 'function'


	checkPassword: () ->
		req = this.get('req')
		if !this.get('error')
			hash = md5 this.get('password')
			if this.get('hash').toUpperCase() isnt hash.toUpperCase()
				this.set 'error', req.gettext('Incorrect login or password')

	
	closeConnection: () ->
		if this.get('connect')
			connect = this.get('connect')
			connect.detach()

	
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
		(group_id = -20) and (grouptable_id = #{this.get('id')})
		"""



