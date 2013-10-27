
mongoose = 			require('mongoose')

Session = 			mongoose.model('Session', require(process.env.APP_DIR + '/lib/schemas/session'))

module.exports = (connect) ->

	Store = 		connect.session.Store

	class Memory extends Store

		constructor: (@options = {}) ->


		set: (sid, sess, fn) ->

			Session.findOne
				sid:	sid
			, (err, session) =>
				if err 
					fn and fn(err) if fn
				else
					sess.lastAccess = 	new Date()

					if !sess.cookie?
						sess.cookie =
							expires = 2 * 24 * 60 * 60 * 1000
	
					if session?
						session.sess = 		sess
						
						session.save () ->
							fn and fn(null, session.toJSON()) if fn
					
					else
						if sess.user?.id?
							session = new Session
								sid:	sid
								sess:	sess
							
							session.save () ->
								fn and fn(null, session.toJSON()) if fn
					
						else
							fn and fn(null, {}) if fn



		get: (sid, fn) ->

			Session.findOne
				sid:	sid
			, (err, session) ->
				if err 
					fn(err) if fn
				else
					if session?
						data = session.toJSON()
						if data.sess?
							res = data.sess
						else
							res = {}

						fn and fn(null, res) if fn

					else 
						fn and fn(null, null) if fn



		destroy: (sid, fn) ->

			Session.findOne
				sid:	sid
			, (err, session) ->
				if err 
					fn and fn(err) if fn
				else
					session.remove () ->
						fn() if fn

	Memory



