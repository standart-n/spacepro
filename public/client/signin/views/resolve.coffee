
Backbone = 	require('backbone')

module.exports = Backbone.View.extend

	el:	"[data-view=\"resolve\"]"

	initialize: () ->

		this.model = window.user

		this.model.on 'change:session_success', () =>

			if this.model.get('session_success') is 0

				this.$el.html jade.templates['resolve'] this.model.toJSON()
				this.$modal = this.$el.find("[data-type=\"modal\"]")
				this.$modal.modal('show')


		# this.$form = 		this.$el.find("[data-type=\"form\"]")
