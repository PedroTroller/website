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
var markdown     = require('markdown-it');
var del          = require('del');
var gulp         = require('gulp');
var util         = require('gulp-util');
var runsequence  = require('run-sequence');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var twig         = require('gulp-twig');
var fileinclude  = require('gulp-file-include');
var extreplace   = require('gulp-ext-replace');
if (isDev) {
  var sourcemaps = require('gulp-sourcemaps');
  var livereload = require('gulp-livereload');
}

// Paths
var basePaths = {
  src:     'app/view/theme',
  build:   'web/assets',
  vendor:  'web/vendor',
  content: 'app/content',
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
    img:  basePaths.src     + '/img/**/*.{jpg,png,gif,ico}',
    twig: [
      basePaths.src + '/twig/**/*.twig',
      '!' + basePaths.src + '/twig/**/_*.twig',
    ],
    md: basePaths.content + '/**/*.md',
  },
  build: {
    scss: basePaths.build + '/css',
    js:   basePaths.build + '/js',
    img:  basePaths.build + '/img',
    twig: 'web',
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
      .pipe(concat(module + '.js'))
      .pipe(isDev ? util.noop() : uglify())
      .pipe(isDev ? sourcemaps.write('maps') : util.noop())
      .pipe(gulp.dest(paths.build.js))
      .pipe(isDev ? livereload() : util.noop())
    ;
  }
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

// Twig + Markdown
gulp.task('twig', function (cb) {
  var md = new markdown('commonmark');
  gulp
    .src(paths.src.twig)
    .pipe(twig({
      data: {
        is_dev: isDev,
      },
      base: basePaths.src + '/twig',
    }))
    .pipe(fileinclude({
      basepath: basePaths.content,
      filters: {
        markdown: md.render.bind(md),
      },
    }))
    .pipe(extreplace(''))
    .pipe(gulp.dest(paths.build.twig))
    .pipe(isDev ? livereload() : util.noop())
  ;
  cb();
});

// Watch
gulp.task('watch', function (cb) {
  if (isDev) {
    livereload.listen({host: '127.0.0.1', port: 44100});
    gulp.watch(paths.src.scss,                ['sass'], cb);
    gulp.watch(basePaths.src + '/js/**/*.js', ['js'],   cb);
    gulp.watch(paths.src.img,                 ['img'],  cb);
    gulp.watch(paths.src.twig,                ['twig'], cb);
    gulp.watch(paths.src.md,                  ['twig'], cb);
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
  runsequence('clean', ['sass', 'js', 'img', 'twig'], cb);
});

// Default task (build and watch)
gulp.task('default', ['build', 'watch']);
