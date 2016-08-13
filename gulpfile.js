/*
 * This file is part of the fabschurt/portfolio package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

// Get current environment
var isDev = (process.env.ENVIRONMENT === 'dev');

// Imports
var marked       = require('marked');
var del          = require('del');
var gulp         = require('gulp');
var util         = require('gulp-util');
var runsequence  = require('run-sequence');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var fileinclude  = require('gulp-file-include');
if (isDev) {
  var sourcemaps = require('gulp-sourcemaps');
}

// Paths
var basePaths = {
  src:    'app/view/theme',
  build:  'web/assets',
  vendor: 'web/vendor',
};
var paths = {
  src: {
    scss: basePaths.src + '/scss/**/*.scss',
    js: {
      modules: {
        main: [
          basePaths.vendor + '/material-design-lite/material.js',
          basePaths.src    + '/js/modules/**/*.js',
        ],
      },
    },
    img:  basePaths.src + '/img/**/*.{jpg,png,gif,ico}',
    html: basePaths.src + '/html/**/*.html',
    md:   'app/content/**/*.md',
  },
  build: {
    scss: basePaths.build + '/css',
    js:   basePaths.build + '/js',
    img:  basePaths.build + '/img',
    html: 'web',
  },
};

// Sass
gulp.task('sass', function (cb) {
  gulp
    .src(paths.src.scss)
    .pipe(isDev ? sourcemaps.init() : util.noop())
    .pipe(sass({
      outputStyle: isDev ? null : 'compressed',
      includePaths: [
        basePaths.vendor
      ],
    }).on('error', sass.logError))
    .pipe(autoprefixer({
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
      .pipe(concat(module + '.js'))
      .pipe(isDev ? util.noop() : uglify())
      .pipe(isDev ? sourcemaps.write('maps') : util.noop())
      .pipe(gulp.dest(paths.build.js))
    ;
  }
  cb();
});

// Images
gulp.task('img', function (cb) {
  gulp
    .src(paths.src.img)
    .pipe(gulp.dest(paths.build.img))
  ;
  cb();
});

// HTML + Markdown
gulp.task('html', function (cb) {
  gulp
    .src(paths.src.html)
    .pipe(fileinclude({
      basepath: 'app/content',
      filters: {
        markdown: marked,
      },
    }))
    .pipe(gulp.dest(paths.build.html))
  ;
  cb();
});

// Watch
gulp.task('watch', function (cb) {
  if (isDev) {
    gulp.watch(paths.src.scss,                ['sass'], cb);
    gulp.watch(basePaths.src + '/js/**/*.js', ['js'],   cb);
    gulp.watch(paths.src.img,                 ['img'],  cb);
    gulp.watch(paths.src.html,                ['html'], cb);
    gulp.watch(paths.src.md,                  ['html'], cb);
  } else {
    cb();
  }
});

// Clean
gulp.task('clean', function (cb) {
  del.sync(basePaths.build);
  cb();
});

// Build
gulp.task('build', function (cb) {
  runsequence('clean', ['sass', 'js', 'img', 'html'], cb);
});

// Default task (build and watch)
gulp.task('default', ['build', 'watch']);
