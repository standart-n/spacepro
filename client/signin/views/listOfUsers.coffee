
Backbone = 	require('backbone')
Users = 	require('users')

module.exports = Backbone.View.extend

	el:	"[data-view=\"listOfUsers\"]"

	initialize: () ->

		this.users = new Users()

		this.users.reset window.users

		# this.users.on 'add', (user) =>
		# 	this.$el.append jade.templates.user 
		# 		user:	user.toJSON()

		this.on 'change', (id) =>

			this.changeItem(id)


	changeItem: (id) ->

		user = 			this.users.get(id)

		if user.get('userpsw')

			alert 'нужен пароль'

			$users = 		this.$el.find("[data-type=\"user-line\"]")
			$user = 		this.$el.find("[data-id=\"#{id}\"]")
			$subLines = 	this.$el.find("[data-type=\"user-subline\"]")
			$subLine = 		$user.find("[data-type=\"user-subline\"]")
			$form = 		$user.find("form")
			$password = 	$user.find("[type=\"password\"]")

			$form.off 'submit'

			$form.on 'submit', (e) ->
				alert $password.val()

			$subLines.addClass('hide')
			$subLine.removeClass('hide')
			$password.focus()

		else 

			alert 'вход без пароля'



		
		

