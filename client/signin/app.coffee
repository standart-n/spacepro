
window.JSON = require('json2')

require('jquery')

Backbone = require('Backbone')

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


	# Backbone.history.start()
