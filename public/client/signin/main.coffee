
window.JSON = 				require('json2')
window.jade = 				require('jade')
window.jade.templates = 	{}


require('jquery')
require('bootstrap')
require('moment')

require('resolve.tpl')

Backbone = 		require('backbone')
App = 			require('app')
User = 			require('user')

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
		if window.json_locale_data?.messages[msgid]?
			if window.json_locale_data.messages[msgid].length > 1
				msgstr = window.json_locale_data.messages[msgid][1]
		msgstr ?= msgid
		return msgstr

	window.aid = () ->
		Math.floor(Math.random() * Math.pow(10,10))

	window.lang = $('html').attr('lang')

	if window.lang isnt 'en'
		require("moment-#{window.lang}")
		moment.lang(window.lang)

	Backbone.emulateHTTP = on
	Backbone.emulateJSON = on

	window.user = new User()
	window.app = new App()

	Backbone.history.start()
