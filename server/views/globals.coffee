
Common = require(process.env.APP_DIR + '/lib/views/common')

Globals = Common.extend

	globals: () ->
		this.common()

		this.set 'theme', 			process.env.THEME
		this.set 'name', 			this.toUpperCaseFirstLetter(process.env.APP_NAME)
		this.set 'author', 			process.env.APP_AUTHOR
		this.set 'description', 	process.env.APP_DESCRIPTION
		this.set 'keywords', 		process.env.APP_KEYWORDS
		this.set 'version', 		process.env.APP_VERSION

		this.set 'title', "#{this.get('name')} v#{this.get('version')}"

		# this.set 'css', [
		# 	"bootstrap/_bootstrap.#{this.get('version')}.css"
		# ]

	toUpperCaseFirstLetter: (letter) ->
		"#{letter[0].toUpperCase()}#{letter.slice(1)}"



exports = module.exports = Globals

