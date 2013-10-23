
Backbone = require('backbone')

Common = Backbone.Model.extend

	addStyle: (style = 'theme') ->
		version = 	this.get 'version'
		css = 		this.get 'css'
		if !style.match /\//
			style = style.replace /^\_/, ''
			style = style.replace /.css$/, ''
			style = style.replace /.less$/, ''
			style = style.replace version, ''
			style = style.replace /\.\./, '.'
			style = "#{this.get('theme')}/_#{style}.#{version}.css"
		css.push style
		this.set 'css', css


exports = module.exports = Common
