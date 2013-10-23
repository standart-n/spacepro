
_ = 			require('lodash')
program = 		require('commander')
pkg = 			require(__dirname + '/package.json')

defaults = 
	name: 			'app'
	author:			''
	description:	''
	keywords:		[]
	version:		'0.0.0'

pkg = _.extend {}, defaults, pkg


process.env.PROFILE = 			"default" 		if !process.env.PROFILE
process.env.COMMAND = 			"help"

process.env.APP_DIR = 			__dirname

process.env.APP_NAME = 			pkg.name
process.env.APP_AUTHOR = 		pkg.author
process.env.APP_DESCRIPTION = 	pkg.description
process.env.APP_KEYWORDS = 		pkg.keywords.join(', ')
process.env.APP_VERSION = 		pkg.version

process.env.APP_USR = 			"/usr/lib/#{process.env.APP_NAME}"
process.env.APP_EXEC = 			"#{process.env.APP_DIR}/#{process.env.APP_NAME}"
process.env.APP_CONF = 			"#{process.env.APP_USR}/#{process.env.PROFILE}"
process.env.APP_STORE = 		"#{process.env.APP_CONF}/store.json"

program.version(process.env.APP_VERSION)

require(process.env.APP_DIR + '/lib/config/program/server')(program)

program.parse(process.argv)

program.help() if process.env.COMMAND is 'help'
