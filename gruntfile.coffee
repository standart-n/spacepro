
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
						cwd:			'./public/client/'
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
			]
			i18n: [
				'public/i18n'
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
						cwd:		'./public/templates'
						src:		'**/*.jade'
						dest:		'./public/js/templates'
						ext:		'.jade'
					}
				]

		po2json:
			en:
				src: ['./public/locale/en/*.po']
				dest: './public/i18n/en'
			ru:
				src: ['./public/locale/ru/*.po']
				dest: './public/i18n/ru'


	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-copy'
	grunt.loadNpmTasks 'grunt-po2json'
	grunt.loadNpmTasks 'grunt-jade'
	grunt.loadNpmTasks 'grunt-recess'
	grunt.loadNpmTasks 'grunt-lmd'
	
	grunt.registerTask 'default', ['clean:build', 'client', 'server']
	grunt.registerTask 'all', ['default']
	grunt.registerTask 'i18n', ['clean:i18n', 'po2json']
	grunt.registerTask 'server', ['coffee:main', 'coffee:server']
	grunt.registerTask 'client', ['recess:style', 'jade:client', 'coffee:client', 'lmd']

