
_ = 			require('lodash')
Backbone = 		require('backbone')
async = 		require('async')
os = 			require('os')
Firebird = 		require(process.env.APP_DIR + '/lib/controllers/firebird')


Session = Firebird.extend

	defaults: () ->
		user_id:			null
		compname:			"web: #{os.hostname()}"
		compip:				if process.env.PORT? then process.env.PORT.toString() else '2527'
		mac:				"#{os.type()}, #{os.arch()}, #{os.release()}"
		force:				0
		prog:				'SPACEPRO'
		regdata:			''

		session_id:			null
		workstation_id:		null
		success:			0
		startdt:			null
		ws_name:			''

		error:				null
		fb_connection:		null
		fb_transaction:		null

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

		this.set 'user_id', user_id
		this.set 'force',	force

		fn 			?= () ->
		user_id 	?= 0

		async.series

			openConnection: (fn) =>
				this.fbConnectionOpen(fn)

			startTransaction: (fn) =>
				this.fbTransactionStart(fn)
			
			newSession: (fn) =>

				if this.get('fb_transaction')
					tr = this.get('fb_transaction')
					tr.query this.sqlNewSession(), (err, result) =>
						if result?.length? and result[0]?.success?

							this.set
								session_id:			result[0].session_id
								workstation_id:		result[0].workstation_id
								success:			result[0].success
								ws_name:			result[0].ws_name

							if this.get('success') is 0
								tr.query this.sqlStartdtForSession(), (err, result) =>
									if result?.length? and result[0]?.startdt?

										this.set 'startdt', result[0].startdt
										this.fbTransactionCommit(tr, fn)

									else
										this.fbCheckError(err, fn)

							else
								this.fbTransactionCommit(tr, fn)
						
						else
							this.fbCheckError(err, fn)

				else
					this.fbCheckError('Transaction not found', fn)


		, (err, results) =>

			this.fbConnectionClose()

			fn this.get('error'), 
				session_id: 		this.get('session_id')
				workstation_id: 	this.get('workstation_id')
				success: 			this.get('success')
				ws_name: 			this.get('ws_name')
				startdt: 			this.get('startdt')


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

	sqlStartdtForSession: () ->
		"""
		select
		startdt
		from sp$sessions
		where
		(id = '#{this.get('session_id').toString()}')
		"""

exports = module.exports = Session

