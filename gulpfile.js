/*
 * This file is part of the fabschurt/website package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

// Get environment config
var isDev           = (process.env.ENVIRONMENT === 'dev');
var isWatchDisabled = (Number(process.env.DISABLE_WATCH) === 1);

// Common imports
var gulp = require('gulp');
var util = require('gulp-util');
if (isDev) {
  var sourcemaps = require('gulp-sourcemaps');
  var livereload = require('gulp-livereload');
}

// Paths
var basePaths = {
  src:    'app/assets',
  build:  'web/assets',
  vendor: 'web/vendor',
};
var paths = {
  src: {
    scss: basePaths.src + '/scss/**/*.scss',
    js: {
      modules: {
        main: [
          basePaths.vendor + '/wow.js/dist/wow.js',
          basePaths.vendor + '/smooth-scroll.js/dist/js/smooth-scroll.js',
          basePaths.vendor + '/bootstrap.native/lib/utils.js',
          basePaths.vendor + '/bootstrap.native/lib/button-native.js',
          basePaths.vendor + '/bootstrap.native/lib/alert-native.js',
          basePaths.vendor + '/mustache/mustache.js',
          basePaths.src    + '/js/lib.js',
          basePaths.src    + '/js/app.js',
          basePaths.src    + '/js/form.js',
        ],
      },
      glob: basePaths.src + '/js/**/*.js',
    },
    img: basePaths.src + '/img/**/*.{jpg,png,gif,ico,svg}',
  },
  build: {
    scss: basePaths.build + '/css',
    js:   basePaths.build + '/js',
    img:  basePaths.build + '/img',
  },
};

// Sass
gulp.task('sass', function (cb) {
  var sass = require('gulp-sass');
  gulp
    .src(paths.src.scss)
    .pipe(isDev ? sourcemaps.init() : util.noop())
    .pipe(
      sass({
        precision: 9,
        outputStyle: isDev ? null : 'compressed',
        includePaths: [
          basePaths.vendor,
          basePaths.vendor + '/bootstrap-sass/assets/stylesheets',
        ],
      }).on('error', function (e) {
        sass.logError.call(this, e);
        !isDev && process.exit(e.status);
      })
    )
    .pipe(require('gulp-autoprefixer')({
      browsers: [
        'last 5 versions',
        'last 20 firefox versions',
        'last 20 chrome versions',
        'last 20 opera versions',
        'ie >= 9',
      ],
      remove: false,
    }))
    .pipe(isDev ? sourcemaps.write('maps') : util.noop())
    .pipe(gulp.dest(paths.build.scss))
    .pipe(isDev ? livereload() : util.noop())
  ;
  cb();
});

// JavaScript
gulp.task('js', function (cb) {
  var modules = paths.src.js.modules;
  for (var module in modules) {
    gulp
      .src(modules[module])
      .pipe(isDev ? sourcemaps.init() : util.noop())
      .pipe(require('gulp-concat')(module + '.js'))
      .pipe(isDev ? util.noop() : require('gulp-uglify/minifier')({}, require('uglify-js')))
      .pipe(isDev ? sourcemaps.write('maps') : util.noop())
      .pipe(gulp.dest(paths.build.js))
    ;
  }
  gulp
    .src(paths.src.js.glob)
    .pipe(isDev ? livereload() : util.noop())
  ;
  cb();
});

// Images
gulp.task('img', function (cb) {
  gulp
    .src(paths.src.img)
    .pipe(gulp.dest(paths.build.img))
    .pipe(isDev ? livereload() : util.noop())
  ;
  cb();
});

// Watch and livereload
gulp.task('watch', function (cb) {
  if (isDev && !isWatchDisabled) {
    livereload.listen({host: '0.0.0.0', port: 35729});
    gulp.watch(paths.src.scss,    ['sass'], cb);
    gulp.watch(paths.src.js.glob, ['js'],   cb);
    gulp.watch(paths.src.img,     ['img'],  cb);
  } else {
    cb();
  }
});

// Clean
gulp.task('clean', function (cb) {
  require('del').sync([
    paths.build.scss,
    paths.build.js,
    paths.build.img,
  ]);
  cb();
});

// Build
gulp.task('build', function (cb) {
  require('run-sequence')('clean', ['sass', 'js', 'img'], cb);
});

// Default task (build and watch)
gulp.task('default', ['build', 'watch']);
