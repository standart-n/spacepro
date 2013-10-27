
Backbone = 	require('backbone')
fb = 		require(process.env.APP_DIR + '/lib/controllers/fb')
User = 		require(process.env.APP_DIR + '/lib/models/user')

module.exports = Backbone.Collection.extend

	model: User

	initialize: () ->

	getList: (fn) ->
		fb.connection () =>
			fb.query this.selectUsers(), (result) =>
				this.reset result
				fn() if typeof fn is 'function'



	selectUsers: () ->
		"
		select
		d$uuid, username, userpsw, post, f, i, o, usergroup_id, status
		from SP$USERS
		where (status = 0)
		order by username
		"