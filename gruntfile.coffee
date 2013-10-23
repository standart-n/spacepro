
'use strict'

module.exports = (grunt) ->

	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')


		recess:
			css:
				options:
					compile: on
				files:
					'./public/css/theme.<%= pkg.version %>.css': './public/less/bootstrap.less'
			min:
				options:
					compress: on
				files:
					'./public/css/theme.<%= pkg.version %>.min.css': './public/less/bootstrap.less'


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
				'public/js/'
				'public/css/'
			]


		lmd:
			sn:
				options:
					output:		'./public/js/sn.lmd.<%= pkg.version %>.js'
				build: 			'sn'


	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-jade'
	grunt.loadNpmTasks 'grunt-recess'
	grunt.loadNpmTasks 'grunt-lmd'
	
	grunt.registerTask 'default', ['clean:build', 'client', 'server']
	grunt.registerTask 'all', ['default']
	grunt.registerTask 'server', ['coffee:main', 'coffee:server']
	grunt.registerTask 'client', ['recess:min', 'coffee:client', 'lmd:sn']

