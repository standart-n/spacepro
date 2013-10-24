
Common = require(process.env.APP_DIR + '/lib/models/views/common')

Globals = Common.extend

	globals: () ->
		this.set 'pretty',  on

		this.set 'theme', 			process.env.THEME
		this.set 'name', 			process.env.APP_NAME
		this.set 'author', 			process.env.APP_AUTHOR
		this.set 'description', 	process.env.APP_DESCRIPTION
		this.set 'keywords', 		process.env.APP_KEYWORDS
		this.set 'version', 		process.env.APP_VERSION

		this.set 'title', "#{this.get('name')} v#{this.get('version')}"

		this.set 'css', []
		this.set 'js', 	[]

		# this.set 'css', [
		# 	"bootstrap/_bootstrap.#{this.get('version')}.css"
		# ]


exports = module.exports = Globals

