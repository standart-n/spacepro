
Backbone = 	require('backbone')

module.exports = Backbone.View.extend

	el:	"[data-view=\"signin\"]"

	events:
		"submit [data-type=\"form\"]" : 'submit'

	initialize: () ->

		this.model = window.user

		this.$form = 		this.$el.find("[data-type=\"form\"]")
		this.$login = 		this.$form.find("[data-type=\"login\"]")
		this.$password = 	this.$form.find("[data-type=\"password\"]")
		this.$button = 		this.$form.find("[data-type=\"submit\"]")

		this.$alertError = 	this.$el.find("[data-type=\"error\"]")

		this.$login.focus()


	submit: (e) ->

		e.preventDefault()

		this.$button.button('loading')

		this.model.reset()

		this.model.save
			login:		this.$login.val()
			password:	this.$password.val()	
		,
			url:		'/api/signin'
			timeout: 	10000
			complete: (xhr, textStatus) =>
				this.checkResponse(xhr, textStatus)

	checkResponse: (xhr, textStatus) ->

		this.$button.button('reset')

		if textStatus is 'success'
			res = JSON.parse xhr.responseText
			if res.result is 'error'
				this.error res.error
				this.$password.val('')
				this.$password.focus()
			else
				if res.session_success is 1
					alert 'success'
				# else


		if textStatus is 'error'
			this.error "#{xhr.status}: #{gettext('Server not found')}!"


	error: (text = '') ->

		aid = window.aid()

		this.$alertError.removeClass('hide').html(text).data('aid',aid)

		setTimeout () =>
			if this.$alertError.data('aid') is aid
				this.$alertError.addClass('hide')
		, 3000


