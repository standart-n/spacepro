
window.JSON = 				require('json2')
window.jade = 				require('jade')
window.jade.templates = 	{}

require('jquery')
require('bootstrap')

Backbone = 		require('backbone')
App = 			require('app')

$ () ->

	if !window.console?
		window.console = 
			info: () ->
			log: () ->
			error: () ->
			warn: () ->

	window.jalert = (s) ->
		alert JSON.stringify(s)

	window.gettext = (msgid) ->
		if window.json_locale_data?.messages?
			if window.json_locale_data.messages[msgid].length > 1
				msgstr = window.json_locale_data.messages[msgid][1]
		msgstr ?= msgid
		return msgstr

	window.aid = () ->
		Math.floor(Math.random() * Math.pow(10,10))

	Backbone.emulateHTTP = on
	Backbone.emulateJSON = on

	window.app = new App()

	Backbone.history.start()
