
express = 			require('express')
session = 			require(process.env.APP_DIR + '/lib/config/express/session')
logger = 			require(process.env.APP_DIR + '/lib/config/express/logger')

module.exports = (app) ->

	maxAge = 365 * 24* 60 * 60 * 1000

	app.configure ->

		app.set 'port', process.env.PORT

		app.use express.logger logger
		
		app.use express.json()

		app.use express.urlencoded()

		app.use express.methodOverride()
		
		# app.use session

		app.use app.router

		app.use express.static process.env.APP_DIR + '/public'

		app.configure () ->
			app.set 'views', process.env.APP_DIR + '/lib/templates'
			app.set 'view engine', 'jade'

		app.configure 'development', () ->
			app.use express.errorHandler()


		app.all '*', (req, res, next) ->
			if req.query?
				req.method = req.query._method 		if req.query._method?
			next()

		app.all '*', (req, res, next) ->
			if req.session?
				req.session.user = {} 				if !req.session.user?
			next()
