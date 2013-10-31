
_ = 			require('lodash')
Backbone = 		require('backbone')
fb = 			require('node-firebird')


Firebird = Backbone.Model.extend

	defaults: () ->
		fb_host:			process.env.FIREBIRD_HOST
		fb_database: 		process.env.FIREBIRD_PATH
		fb_user: 			process.env.FIREBIRD_USER
		fb_password:		process.env.FIREBIRD_PASSWORD

		fb_connection:		null
		fb_transaction:		null

		error:				null
	
	initialize: () ->

	fbConnectionCreate: (fn = () ->) ->

		if !this.get('fb_host') 		then this.set 'fb_host', 		process.env.FIREBIRD_HOST
		if !this.get('fb_database') 	then this.set 'fb_database', 	process.env.FIREBIRD_PATH
		if !this.get('fb_user') 		then this.set 'fb_user', 		process.env.FIREBIRD_USER
		if !this.get('fb_password') 	then this.set 'fb_password', 	process.env.FIREBIRD_PASSWORD

		fb.attach
			host:			this.get('fb_host')
			database: 		this.get('fb_database')
			user: 			this.get('fb_user')
			password:		this.get('fb_password')
		, (err, connect) =>
			fn(err, connect)


	fbConnectionOpen: (fn = () ->) ->
		
		if !this.get('error')
			if !this.get('fb_connection')
				this.fbConnectionCreate (err, connect) =>
					if connect?
						this.set 'fb_connection', connect
						fn null, connect
					else
						this.fbCheckError(err, fn)
			else
				fn null, this.get('fb_connection')
		else
			fn()


	fbConnectionClose: () ->
		if this.get('fb_connection')
			connect = this.get('fb_connection')
			connect.detach()
			this.unset 'fb_connection'


	fbTransactionStart: (fn = () ->) ->

		if this.get('fb_connection')
			connect = this.get('fb_connection')
			connect.startTransaction (err, tr) =>
				if tr?
					this.set 'fb_transaction', tr
					fn null, tr
				else
					this.fbCheckError(err, fn)
		else
			this.fbCheckError('Connection not found', fn)


	fbTransactionCommit: (tr, fn = () ->) ->
		if tr?
			tr.commit (err) =>
				this.unset 'fb_transaction'
				if !this.fbCheckError(err, fn)
					fn null, 'commit'


	fbTransactionRollback: () ->
		if this.get('fb_transaction')
			tr = this.get('fb_transaction')
			tr.rollback()
			this.unset 'fb_transaction'


	fbCheckError: (err, fn = () ->) ->
		if err?
			req = if this.get('req') then this.get('req') else { gettext: (s) -> s }
			if typeof err is 'object' 	then err = JSON.stringify(err)
			if typeof err is 'function' then err = err()
			err = req.gettext(err)
			# throw err
			if !this.get('error')
				this.set 'error', err 
				console.error err.red
			this.fbTransactionRollback()
			fn(err)
			return true
		else
			return false


exports = module.exports = Firebird
