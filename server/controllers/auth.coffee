
Token = 								require('token')
mongoose = 								require('mongoose')

User = 									mongoose.model('User', require(global.home + '/lib/models/db/user'))

class Auth

	constructor: (@req, @res) ->


	user: (callback) ->

		User.findOne 
				id: 				if @req.session.user.id? 	then @req.session.user.id 	else ''
				key:				if @req.session.user.key? 	then @req.session.user.key	else ''
				disabled:			false
		, (err, user) =>

			throw err if err

			error = 				null
			error = 				'Пользователь не найден'	if !user?
			error = 				'Cессия не активна'			if !@req.session.user.id? or !@req.session.user.key?

			user ?= 				{}

			callback(error, user) 	if callback


	verifyToken: () ->
		if @req.session.user? and @req.query.token?
			if @req.session.user.id? and @req.session.user.key?
				Token.verify "#{@req.session.id}|{@req.session.user.id}|#{@req.session.user.key}", @req.query.token
			else false
		else false



exports = module.exports = (req, res) ->
	new Auth(req, res)

exports.Auth = Auth


