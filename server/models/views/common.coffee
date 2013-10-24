
Backbone = require('backbone')

Common = Backbone.Model.extend

	addLocalCssFile: (file = 'theme') ->
		css = 	this.get 'css'
		file = 	this.editLocalFileName(file, 'css')
		css.push file
		this.set 'css', css


	addLocalJsFile: (file = 'sn') ->
		js = 	this.get 'js'
		file = 	this.editLocalFileName(file, 'js')
		js.push file
		this.set 'js', js

	
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
