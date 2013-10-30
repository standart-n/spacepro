
_ = 			require('lodash')
Backbone = 		require('backbone')
async = 		require('async')
os = 			require('os')
FB = 			require(process.env.APP_DIR + '/lib/controllers/fb')


exports = module.exports = Backbone.Model.extend

	defaults: () ->
		user_id:			null
		compname:			"web: #{os.hostname()}"
		compip:				process.env.PORT.toString()
		mac:				"#{os.type()}, #{os.arch()}, #{os.release()}"
		force:				0
		prog:				"#{process.env.APP_NAME} v#{process.env.APP_VERSION}"
		regdata:			''

		session_id:			null
		workstation_id:		null
		success:			0
		ws_name:			''

		err:				null
		connect:			null
		transaction:		null

	initialize: () ->
		if this.get('req')
			req = this.get('req')
			if req.headers['user-agent']?
				this.set 'regdata', req.headers['user-agent']

	start: (user_id, force, fn) ->
		args = _.toArray arguments
		switch args.length
			when 1 
				user_id = 	this.get('user_id')
				force = 	this.get('force')
				fn = 		args[0]
			when 2
				user_id = 	args[0]
				force = 	this.get('force')
				fn = 		args[1]

		force = if force is true or force is 1 then 1 else 0

		fn ?= () ->

		this.set 'user_id', user_id
		this.set 'force',	force	


		if user_id?

			async.series

				connection: (fn) =>

					fb = new FB()
					fb.connection (err, connect) =>
						if err
							throw err
							this.set 'err', err
							fn(err)
						else
							this.set 'connect', connect
							fn null, 'success'


				transaction: (fn) =>

					if this.get('connect')
						connect = this.get('connect')
						connect.startTransaction (err, tr) =>
							if err
								throw err
								this.set 'err', err
								fn(err)
							else
								this.set 'transaction', tr
								fn null, 'success'

					else
						fn()

				
				newSession: (fn) =>

					if this.get('transaction')
						tr = this.get('transaction')
						tr.query this.sqlNewSession(), (err, result) =>
							if err
								throw err
								this.set 'err', err
								tr.rollback()
								fn(err)
							else
								this.set
									session_id:			result[0].session_id
									workstation_id:		result[0].workstation_id
									success:			result[0].success
									ws_name:			result[0].ws_name

								tr.commit (err) ->									
									throw err if err									
									fn null, 'success'
					else
						fn()


			, (err, results) =>

				this.closeConnection()

				fn this.get('err'), 
					session_id: 		this.get('session_id')
					workstation_id: 	this.get('workstation_id')
					success: 			this.get('success')
					ws_name: 			this.get('ws_name')

		else
			err = 'User_id not found'
			throw err
			fn(err)


	closeConnection: () ->
		if this.get('connect')
			connect = this.get('connect')
			connect.detach()
			this.unset 'connect'



	sqlNewSession: () ->
		"""
		select
		session_id, workstation_id, success, ws_name
		from sp$pr_newsession(
		'#{this.get('user_id').toString()}',
		'#{this.get('compname')}',
		'#{this.get('compip')}',
		'#{this.get('mac')}',
		#{this.get('force')},
		'#{this.get('prog')}',
		'#{this.get('regdata')}')
		"""


