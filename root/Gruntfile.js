'use strict';
var awsCfg = require('./cfg/aws.json');
var s3Cfg = require('./cfg/s3.json');

module.exports = function(grunt) {
    grunt.option('force', true);
    
    grunt.initConfig({

    connect: {
      server: {
        options: {
          useAvailablePort: true,
          hostname: '*',
          base: './build/',
          middleware: function (connect, options, middlewares) {
            middlewares.unshift(function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                return next();
            });
            return middlewares;
          }
        }
      }
    },
    
    browserify: {
      dist: {
        files: {
          'build/app/main.js': ['src/app/js/main.js'],
        },
        options: {
          browserifyOptions: {
            debug: true,
            fullPaths: false
          },
          watch: true,
          transform: ['partialify']
        }
      }
    },
    
    uglify: {
      main: {
        options: {
          screwIE8: true,
          mangleProperties: false,
          compress: {
            dead_code: true,
            drop_debugger: true
          }
        },
        files: [{
          expand: true, cwd: 'build/', src: '**/*.js', dest: 'build/'
        }]
      }
    },
    
    cssmin: {
      main: {
        files: [{
          expand: true, cwd: 'build/app', src: '**/*.css', dest: 'build/app'
        }]
      }
    },

    sass: {
      options: {
        sourceMap: true,
        sourceMapEmbed: true,
        sourceMapContents: true, 
        sourceComments: true
        },
        build: {
            files: { 'build/app/main.css': 'src/app/css/main.scss' }
        }
    },
    
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer-core')({browsers: 'last 3 version'}),
          require('csswring')
        ]
      },
      dist: {
        src: 'build/app/main.css'
      }
    },

    clean: ['build/'],

    jshint: {
      options: {
          jshintrc: true,
          force: true
      },
        files: [ 'Gruntfile.js', 'src/**/*.js' ]
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },
      html: { files: 'src/index.html', tasks: 'copy' },
      css: {
        files: 'src/app/css/**/*.*',
        tasks: ['sass', 'postcss']
      },
      imgs: {
        options: { event: ['changed', 'added', 'deleted'] },
        files: 'src/app/imgs/**/*.*',
        tasks: ['copy']
      }
    },
    
    copy: {
      main: {
        expand: true,
        cwd: 'src/',
        src: ['index.html', 'boot.js', 'app/imgs/*'],
        dest: 'build/'
      }
    },
    
    cacheBust: {
      options: {
        baseDir: './build/',
        enableUrlFragmentHint: true,
        removeUrlFragmentHint: true,
        deleteOriginals: true
      },
      boot: { files: { src: 'build/boot.js' } },
      js:   { files: { src: 'build/app/*.js' } },
      css:  { files: { src: 'build/app/*.css' } }
    },
    
    replace: {
      cdn: {
        src: ['build/boot.js', 'build/app/*.js', 'build/app/*.css'],
        overwrite: true,
        replacements: [{
          from: /(["|']?)([..\/]*app\/)/g,
          to:  '$1' + s3Cfg.domain + s3Cfg.path + 'app/'
        }]
      }
    },

    s3: {
        options: {
            access: 'public-read',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || awsCfg.AWSAccessKeyID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || awsCfg.AWSSecretKey,
            bucket: s3Cfg.bucket,
            gzip: true,
            gzipExclude: ['.jpg', '.gif', '.jpeg', '.png']
        },
        base: {
          options: { headers: { CacheControl: 180 } },
          files: [{ cwd: 'build', src: ['*.*'], dest: s3Cfg.path }]
        },
        assets: {
          options: { headers: { CacheControl: 604800 } },
            files: [{ cwd: 'build', src: 'app/**/*', dest: s3Cfg.path }]
        }
    }

  });

  require('jit-grunt')(grunt, { s3: 'grunt-aws', replace: 'grunt-text-replace' });

  // Tasks
  grunt.registerTask('build', [
    'jshint',
    'clean',
    'sass',
    'postcss',
    'browserify',
    'copy'
  ]);
  
  grunt.registerTask('default', [
      'build',
      'connect',
      'watch'
  ]);
  
  grunt.registerTask('deploy', [
      'build',
      'cacheBust',
      'replace',
      'uglify',
      'cssmin',
      's3'
  ]);
};
