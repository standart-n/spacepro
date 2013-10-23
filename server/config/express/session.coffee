
express = 		require('express')
session = 		require('connect-session').session
Memory = 		require(process.env.APP_DIR + '/lib/controllers/memory')(express)


body = (options = {}) ->
	paramName = if options.param? then options.param else 'sessid'
	(req) ->
		if req.body?
			req.body[paramName]

query = (options = {}) ->
	paramName = if options.param? then options.param else 'sessid'
	(req) ->
		if req.query?
			req.query[paramName]


loaders = [
	query()
	body()
]

options = 
	store: new Memory()


module.exports = session loaders, options

