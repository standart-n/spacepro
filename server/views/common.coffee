
Backbone = require('backbone')

Common = Backbone.Model.extend

	common: () ->
		this.set 'pretty',  on

		this.set 'css', 			[]
		this.set 'js', 				[]
		this.set 'scripts',			[]
		this.set 'globalObjects', 	[]


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
			data: 	JSON.stringify(obj)
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



exports = module.exports = Common
