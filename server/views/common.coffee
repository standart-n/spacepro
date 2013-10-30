
_ = 		require('lodash')
Backbone = 	require('backbone')

Common = Backbone.Model.extend

	common: () ->
		this.set 'pretty',  on

		this.set 'css', 				[]
		this.set 'js', 					[]
		this.set 'scripts',				[]
		this.set 'globalObjects', 		[]
		this.set 'json_locale_data',
			messages: {}


	addLocalCssFile: (file = 'theme') ->
		ms = 	this.get 'css'
		file = 	this.editLocalFileName(file, 'css')
		ms.push file
		this.set 'css', ms


	addLocalJsFile: (file = 'sn') ->
		ms = 	this.get 'js'
		file = 	this.editLocalFileName(file, 'js')
		ms.push file
		this.set 'js', ms


	addScript: (script = '') ->
		ms = this.get 'scripts'
		ms.push script
		this.set 'scripts', ms


	exportGlobalObject: (name = 'val', obj = {}) ->
		ms = this.get 'globalObjects'
		# data = json.replace '/\&quot\;/g', '"'
		ms.push
			name: 	name
			data: 	obj
		this.set 'globalObjects', ms
	

	editLocalFileName: (file = '', ext = 'css') ->
		version = this.get 'version'

		if !file.match /\//
			file = file.replace /^\_/, 		''
			file = file.replace /.css$/, 	''
			file = file.replace /.less$/, 	''
			file = file.replace /.js$/, 	''
			file = file.replace /.lmd$/, 	''
			file = file.replace version, 	''
			file = file.replace /\.\./, 	'.'
			if ext is 'css'
				file = "#{this.get('theme')}/_#{file}.#{version}.#{ext}"
			if ext is 'js'
				file = "#{file}.lmd.#{version}.#{ext}"
		file


	addLocaleString: (keys) ->
		keys = _.toArray(arguments) if typeof keys is 'string'
		req = 	this.get 'req'
		ms = 	this.get 'json_locale_data'
		for key in keys
			ms['messages'][key] = [
				null
				req.gettext(key)
			]
		this.set 'json_locale_data', ms
		

exports = module.exports = Common
