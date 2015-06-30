'use strict';
var webpack = require('webpack');
try {
  var awsCfg = require('./cfg/aws.json');
} catch (err) {
  console.error('!!ERROR: Missing cfg/aws.json\n');
}
var s3Cfg = require('./cfg/s3.json');
s3Cfg.path = s3Cfg.path.trim();
if (s3Cfg.path.charAt(s3Cfg.path.length - 1) !== '/') {
  s3Cfg.path += '/';
}

module.exports = function (grunt) {
  grunt.option('force', true);

  grunt.initConfig({

    connect: {
      server: {
        options: {
          livereload: true,
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

    webpack: {
      options: {
        entry: './src/main.js',
        output: {
          path: './build/js/',
          filename: 'main.js',
          library: 'gv',
          libraryTarget: 'umd'
        },
        module: {
          loaders: [
            { test: /\.(html|txt|css)$/, loader: 'raw-loader' },
            { test: /\.json$/, loader: "json-loader" }
          ]
        }
      },
      dist: {
        debug: false,
        plugins: [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              drop_console: true,
              dead_code: true,
              drop_debugger: true
            }
          })
        ]
      },
      dev: {
        debug: true,
        devtool: 'cheap-source-map'
      }
    },

    sass: {
      options: {
        sourceMap: true,
        sourceMapContents: true,
        sourceComments: true
      },
      build: {
        files: { 'build/css/main.css': 'src/css/main.scss' }
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer-core')(),
          require('csswring')
        ]
      },
      dist: {
        src: 'build/css/main.css'
      }
    },

    clean: ['build/'],

    jshint: {
      options: {
        jshintrc: true,
        force: true
      },
      files: ['Gruntfile.js', 'src/**/*.js']
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },
      html: {
        files: ['boot/index.html', 'boot/boot.js'],
        tasks: ['copy:boot', 'replace:local'],
        options: { livereload: true }
      },
      css: {
        files: 'src/css/**/*.*',
        tasks: ['sass', 'postcss', 'replace:local'],
        options: { livereload: true }
      },
      js: {
        files: ['src/main.js', 'src/js/**/*.js', 'src/html/**/*.html'] ,
        tasks: ['webpack:dev', 'replace:local'],
        options: { livereload: true }
      },
      imgs: {
        options: { event: ['changed', 'added', 'deleted'], livereload: true },
        files: 'src/imgs/**/*.*',
        tasks: ['copy:imgs']
      }
    },

    copy: {
      boot: {
        expand: true,
        cwd: 'boot/',
        src: ['index.html', 'boot.js'],
        dest: 'build/'
      },
      imgs: {
        expand: true, cwd: 'src/', src: 'imgs/*', dest: 'build/'
      },
      data: {
        expand: true, cwd: 'src/', src: 'data/*', dest: 'build/'
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
      js: { files: { src: 'build/app/*.js' } },
      css: { files: { src: 'build/app/*.css' } }
    },

    replace: {
      cdn: {
        src: ['build/boot.js', 'build/js/*.js', 'build/css/*.css'],
        overwrite: true,
        replacements: [{
          from: /(['"(])\s*\/+((imgs|css|js|videos|data)+[^\s"')]+)/gi,
          to: '$1' + s3Cfg.domain + s3Cfg.path + '$2'
        }]
      },

      local: {
        src: ['build/boot.js', 'build/js/*.js', 'build/css/*.css'],
        overwrite: true,
        replacements: [{
          from: /(['"(])\s*\/+((imgs|css|js|videos|data)+[^\s"')]+)/gi,
          to: '$1' + 'http://localhost:<%= connect.server.options.port %>/' + '$2'
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
        options: { headers: { CacheControl: 300 } },
        files: [{
          cwd: 'build',
          src: ['js/**/*', 'css/**/*', 'imgs/**/*', 'data/**/*'],
          dest: s3Cfg.path
        }]
      }
    }

  });

  require('jit-grunt')(grunt, { s3: 'grunt-aws', replace: 'grunt-text-replace' });

  // Tasks
  grunt.registerTask('build', [
    'jshint',
    'clean',
    'copy',
    'sass',
    'postcss',
  ]);

  grunt.registerTask('default', [
    'connect',
    'build',
    'webpack:dev',
    'replace:local',
    'watch'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'webpack:dist',
    'cacheBust',
    'replace:cdn',
    's3'
  ]);
};
