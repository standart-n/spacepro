
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

		valid = new Validate
			schema:			'signin'
			data:
				login:		this.get('login')
				password: 	this.get('password')

		if !valid.check()
			this.set 'error', valid.get('errors')[0]

		async.series
			
			connection: (fn) =>
				if !this.get('error')
					fb = new FB()
					fb.connection (err, connect) =>
						throw err if err 

						if err
							this.set 'error', 'Нет подключения к базе данных'
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
							this.set 'error', 'Ошибка при открытии транзакции'
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
							this.set 'error', 'Ошибка при поиске пользователя'
							tr.rollback()
							this.unset 'transaction'
							fn(err)
						
						else
							if result.length < 1
								this.set 'error', 'Пользователь не найден'

							else
								if result[0].status isnt 0
									this.set 'error', 'Учетная запись не активна'

								if result[0].userpsw.toString().length < 1
									this.set 'error', 'Пароль у пользователя не установлен'

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
							this.set 'error', 'Ошибка при работе с базой данных'
							tr.rollback()
							fn(err)

						else
							tr.commit()
							if result.length < 1
								this.set 'error', 'У вас нет прав для входа в систему'
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
		if !this.get('error')
			hash = md5 this.get('password')
			if this.get('hash').toUpperCase() isnt hash.toUpperCase()
				this.set 'error', 'Вы неправильно ввели логин или пароль'

	
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



