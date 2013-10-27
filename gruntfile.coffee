
'use strict'

module.exports = (grunt) ->

	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')


		recess:
			style:
				options:
					compress: on
				files: [
					{
						expand:			true
						cwd:			'./public/style/'
						src:			'./**/_*.less'
						dest:			'./public/css/'
						ext:			".<%= pkg.version %>.css"
					}
				]


		coffee:
			client:
				options:
					bare: on
				files: [
					{
						expand:			true
						cwd:			'./client/'
						src:			'./**/*.coffee'
						dest:			'./public/js/'
						ext:			'.js'
					}
				]

			server:
				options:
					bare: on
				files: [
					{
						expand:		true
						cwd:		'./server/'
						src:		'**/*.coffee'
						dest:		'./lib/'
						ext:		'.js'
					}
				]

			main:
				options:
					bare: on
				files:
					"./<%= pkg.name %>": 'server/app.coffee'

		clean:
			build: [
				'lib/'
				'public/js/'
				'public/css/'
				'public/templates/'
			]

		copy:
			templates:
				files: [
					{
						expand:		true
						cwd:		'./server/templates'
						src:		'**/*.jade'
						dest:		'./lib/templates'
						ext:		'.jade'
					}
				]
		
		lmd:
			app:
				options:
					output:		'./public/js/app.<%= pkg.version %>.js'
				build: 			'app'

			signin:
				options:
					output:		'./public/js/signin.lmd.<%= pkg.version %>.js'
				build: 			'signin'

		
		jade:
			client:
				options:
					runtime: off
				files: [
					{
						expand:		true
						cwd:		'./server/templates'
						src:		'**/*.jade'
						dest:		'./public/templates'
						ext:		'.jade'
					}
				]


	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-copy'
	grunt.loadNpmTasks 'grunt-jade'
	grunt.loadNpmTasks 'grunt-recess'
	grunt.loadNpmTasks 'grunt-lmd'
	
	grunt.registerTask 'default', ['clean:build', 'client', 'server']
	grunt.registerTask 'all', ['default']
	grunt.registerTask 'server', ['coffee:main', 'coffee:server', 'copy:templates']
	grunt.registerTask 'client', ['recess:style', 'jade:client', 'coffee:client', 'lmd']

