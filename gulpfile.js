/*
 * This file is part of the fabschurt/cv package.
 *
 * (c) 2016 Fabien Schurter <fabien@fabschurt.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

// Get current environment
var isDev = (process.env.ENVIRONMENT === 'dev');

// Common imports
var gulp = require('gulp');
var util = require('gulp-util');
if (isDev) {
  var sourcemaps = require('gulp-sourcemaps');
  var livereload = require('gulp-livereload');
}

// Paths
var basePaths = {
  src:    'app',
  build:  'web',
  vendor: 'web/vendor',
};
var paths = {
  src: {
    jekyll: {
      path: basePaths.src + '/jekyll',
      glob: basePaths.src + '/jekyll/**/*',
    },
    scss: basePaths.src + '/view/theme/scss/**/*.scss',
    js: {
      modules: {
        loader: [
          basePaths.vendor + '/mobile-detect/mobile-detect.js',
          basePaths.src    + '/view/theme/js/loader/*.js',
        ],
        main: [
          basePaths.vendor + '/jquery/dist/jquery.js',
          basePaths.vendor + '/jquery-fittext/jquery.fittext.js',
          basePaths.vendor + '/masonry/dist/masonry.pkgd.js',
          basePaths.vendor + '/wow/dist/wow.js',
          basePaths.vendor + '/smooth-scroll/dist/js/smooth-scroll.js',
          basePaths.vendor + '/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
          basePaths.src    + '/view/theme/js/main/*.js',
        ],
        desktop: [
          basePaths.src + '/view/theme/js/desktop/*.js',
        ]
      },
      glob: basePaths.src + '/view/theme/js/**/*.js',
    },
    img: basePaths.src + '/view/theme/img/**/*.{jpg,png,gif,ico,svg}',
  },
  build: {
    jekyll: basePaths.build,
    scss:   basePaths.build + '/assets/css',
    js:     basePaths.build + '/assets/js',
    img:    basePaths.build + '/assets/img',
  },
};

// Jekyll
gulp.task('jekyll', function (cb) {
  var jekyllEnv = Object.assign({}, process.env);
  jekyllEnv.JEKYLL_ENV = jekyllEnv.ENVIRONMENT;
  require('child_process').spawnSync(
    'bundle',
    [
      'exec',
      'jekyll',
      'build',
      '--source',
      paths.src.jekyll.path,
      '--destination',
      paths.build.jekyll,
      '--incremental',
    ],
    {
      stdio: 'inherit',
      env:   jekyllEnv,
    }
  );
  gulp
    .src(paths.src.jekyll.glob)
    .pipe(isDev ? livereload() : util.noop())
  ;
  cb();
});

// Sass
gulp.task('sass', function (cb) {
  var sass = require('gulp-sass');
  gulp
    .src(paths.src.scss)
    .pipe(isDev ? sourcemaps.init() : util.noop())
    .pipe(sass({
      precision: 9,
      outputStyle: isDev ? null : 'compressed',
      includePaths: [
        basePaths.vendor,
        basePaths.vendor + '/bootstrap-sass/assets/stylesheets',
      ],
    }).on('error', sass.logError))
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
      .pipe(isDev ? util.noop() : require('gulp-uglify')())
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

// Watch
gulp.task('watch', function (cb) {
  if (isDev) {
    livereload.listen({host: '127.0.0.1', port: 44100});
    gulp.watch(paths.src.jekyll.glob, ['jekyll'], cb);
    gulp.watch(paths.src.scss,        ['sass'],   cb);
    gulp.watch(paths.src.js.glob,     ['js'],     cb);
    gulp.watch(paths.src.img,         ['img'],    cb);
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
  require('run-sequence')('clean', 'jekyll', ['sass', 'js', 'img'], cb);
});

// Default task (build and watch)
gulp.task('default', ['build', 'watch']);
