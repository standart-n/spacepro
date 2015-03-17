'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    recess: {
      style: {
        options: {
          compress: true
        },
        files: [
          {
            expand:  true,
            cwd:     './public/style/main',
            src:     './*.less',
            dest:    './public/css/',
            ext:     ".<%= pkg.version %>.css"
          }
        ]
      }
    },

    clean: {
      build: ['public/js/', 'public/css/'],
      i18n: ['public/i18n']
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
          runtime:        false,
          warn:           true,
          err:            true,
          compileDebug:   false,
          wrap: {
            wrap:         true,
            amd:          false,
            node:         true,
            dependencies: null
          }
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
            './lib/**/*.js'
          ]
        }
      },
      client: {
        options: {
          eqnull: true
        },
        files: {
          src: [
            './public/client/app/**/*.js',
            './public/client/signin/**/*.js',
            './public/client/plugins/**/*.js'
          ]
        }
      },
      test: {
        options: {
          eqnull: true
        },
        files: {
          src: [
            './test/spec/**/*.js'
          ]
        }
      }
    },

/*    po2json: {
      en: {
        src: './public/locale/en/*.po',
        dest: './public/i18n/en'
      },
      ru: {
        src: './public/locale/ru/*.po',
        dest: './public/i18n/ru'
      }
    },
*/

    po2json: {
      en1: {
        options: {
          original: 'en',
          filename: 'locale.json',
          format:   'json'
        },
        files: {
          'public/i18n/en': 'public/locale/**/messages.po'
        }
      },
      ru1: {
        options: {
          original: 'en',
          filename: 'locale.json',
          format:   'json'
        },
        files: {
          'public/i18n/ru': ['public/locale/ru/**/messages.po']
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/spec/*.js']
      }
    },

    dox: {
      files: {
        src: [
          './lib/controllers/auth.js',
          './lib/controllers/firebird.js',
          './lib/controllers/bar.js',
          './lib/controllers/dict.js',
          './lib/controllers/grid.js'
        ],
        dest: './docs'
      }
    }

  });
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-po2json-simple');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-lmd');
  grunt.loadNpmTasks('grunt-dox');
  
  grunt.registerTask('default',  ['clean:build', 'client', 'server']);
  grunt.registerTask('all',      ['default']);
  grunt.registerTask('docs',     ['dox']);
  grunt.registerTask('test',     ['jshint:test', 'mochaTest']);
  grunt.registerTask('i18n',     ['clean:i18n', 'po2json']);
  grunt.registerTask('client',   ['jshint:client', 'recess:style', 'jade:client', 'lmd']);
  grunt.registerTask('server',   ['jshint:server']);

};