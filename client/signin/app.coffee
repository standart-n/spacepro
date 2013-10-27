
window.JSON = 				require('json2')
window.jade = 				require('jade')
window.jade.templates = 	{}

require('user.tpl')

require('jquery')

Backbone = 		require('backbone')
Signin = 		require('signin')

$ () ->

	if !window.console?
		window.console = 
			info: () ->
			log: () ->
			error: () ->
			warn: () ->

	window.jalert = (s) ->
		alert JSON.stringify(s)

	window.aid = () ->
		Math.floor(Math.random() * Math.pow(10,10))

	Backbone.emulateHTTP = on
	Backbone.emulateJSON = on

	window.signin = new Signin()

	Backbone.history.start()
