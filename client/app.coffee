
window.JSON = require('json2')

require('jquery')
require('bootstrap')
require('moment')
require('moment-ru')

Backbone = require('Backbone')

$ () ->

	if !window.console?
		window.console = 
			info: () ->
			log: () ->
			error: () ->
			warn: () ->

	window.isSocketReady = false

	window.jalert = (s) ->
		alert JSON.stringify(s)

	window.aid = () ->
		Math.floor(Math.random() * Math.pow(10,10))

	$.fn.isNone = () -> 
		$(this).css('display') is 'none'

	$.fn.shown = () -> 
		if $(this).hasClass('hide')
			$(this).removeClass('hide')
		else
			$(this).show()

	Backbone.emulateHTTP = on
	Backbone.emulateJSON = on

	moment.lang('ru')

	# Backbone.history.start()
