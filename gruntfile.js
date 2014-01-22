'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    recess: {
      default: {
        options: {
          compress: true
        },
        files: {
          "./public/themes/default/css/index.<%= pkg.version %>.css": [
            './public/themes/default/less/index.less'
          ],
          "./public/themes/default/css/signin.<%= pkg.version %>.css": [
            './public/themes/default/less/signin.less'
          ]
        }
      },
      style: {
        options: {
          compress: true
        },
        files: [
          {
            expand:  true,
            cwd:     './public/style/',
            src:     './**/_*.less',
            dest:    './public/css/',
            ext:     ".<%= pkg.version %>.css"
          }
        ]
      }
    },

    clean: {
      build: ['public/js/'],
      i18n: ['public/i18n'],
      themeDefault: ['./public/themes/default/css/*.css'],
      themeSimpliq: ['./public/themes/simpliq/css/*.css']
    },

    lmd: {
      app: {
        options: {
          output: './public/js/app.lmd.<%= pkg.version %>.js',
          warn: false
        },
        build: 'app'
      },
      signin: {
        options: {
          output: './public/js/signin.lmd.<%= pkg.version %>.js',
          warn: false
        },
        build: 'signin'
      }
    },

    jade: {
      client: {
        options: {
          runtime: false,
          warn:    true,
          err:     true
        },
        files: [
          {
            expand:  true,
            cwd:     './public/templates',
            src:     '**/*.jade',
            dest:    './public/js/templates',
            ext:     '.jade'
          }
        ]
      }
    },

    jshint: {
      server: {
        options: {
          eqnull: true,
          proto:  true
        },
        directives: {
          predef: [
            'node'
          ]
        },
        files: {
          src: [
            './lib/**/*.js',
          ]
        }
      },
      client: {
        options: {
          eqnull: true
        },
        files: {
          src: [
            './public/client/**/*.js',
          ]
        }
      },
      test: {
        options: {
          eqnull: true
        },
        files: {
          src: [
            './test/spec/**/*.js',
          ]
        }
      }
    },

    po2json: {
      en: {
        src: ['./public/locale/en/*.po'],
        dest: './public/i18n/en'
      },
      ru: {
        src: ['./public/locale/ru/*.po'],
        dest: './public/i18n/ru'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/spec/*.js']
      }
    }

  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-po2json');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-lmd');
  
  grunt.registerTask('default',  ['clean:build', 'client', 'server']);
  grunt.registerTask('all',      ['default']);
  grunt.registerTask('test',     ['jshint:test', 'mochaTest']);
  grunt.registerTask('i18n',     ['clean:i18n', 'po2json']);
  grunt.registerTask('client',   ['jshint:client', 'jade:client', 'lmd']);
  grunt.registerTask('server',   ['jshint:server']);

  grunt.registerTask('themeDefault', ['clean:themeDefault', 'recess:default']);

};