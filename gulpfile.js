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
const debug        = (process.env.ENVIRONMENT === 'dev');
const watchEnabled = typeof process.env.ENABLE_WATCH === 'undefined' ? debug : (Number(process.env.ENABLE_WATCH) === 1);

// Common imports
const gulp       = require('gulp');
const util       = require('gulp-util');
const sequence   = require('run-sequence');
const sourcemaps = debug ? require('gulp-sourcemaps') : {};
const livereload = watchEnabled ? require('gulp-livereload') : {};

// Paths
const basePaths = {
  src:    'app/assets',
  build:  'web/assets',
  vendor: 'web/vendor',
};
const paths = {
  src: {
    scss: basePaths.src + '/scss/**/*.scss',
    js: {
      targets: {
        'main.js': [
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
      glob: [
        basePaths.vendor + '/**/*.js',
        basePaths.src    + '/js/**/*.js',
      ],
    },
    img: basePaths.src + '/img/**/*.{jpg,png,gif,ico,svg}',
  },
  build: {
    scss: basePaths.build + '/css',
    js:   basePaths.build + '/js',
    img:  basePaths.build + '/img',
  },
};

// Get initial reference before overriding
const gulpSrc = gulp.src;

/**
 * Makes `gulp#src` return an enhanced pipe by default (no exit on fail when
 * watching, and better error reporting).
 *
 * @override
 */
gulp.src = function (...args) {
  return gulpSrc.apply(gulp, args).pipe(
    require('gulp-plumber')(error => {
      const message = new util.PluginError(error.plugin, error.messageFormatted || error.message);
      util.log(message.toString());
      debug && console.log(error);
      watchEnabled ? this.emit('end') : process.exit(error.status || 1);
    })
  );
};

// Sass
gulp.task('sass', () => {
  return gulp
    .src(paths.src.scss)
    .pipe(debug ? sourcemaps.init() : util.noop())
    .pipe(require('gulp-sass')({
      precision: 9,
      outputStyle: debug ? null : 'compressed',
      includePaths: [
        basePaths.vendor,
        basePaths.vendor + '/bootstrap-sass/assets/stylesheets',
      ],
    }))
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
    .pipe(debug ? sourcemaps.write('maps') : util.noop())
    .pipe(gulp.dest(paths.build.scss))
    .pipe(watchEnabled ? livereload() : util.noop())
  ;
});

// JavaScript
gulp.task('js', () => {
  return gulp
    .src(paths.src.js.glob)
    .pipe(debug ? sourcemaps.init() : util.noop())
    .pipe(require('gulp-group-concat')(paths.src.js.targets))
    .pipe(debug ? util.noop() : require('gulp-uglify/minifier')(null, require('uglify-js')))
    .pipe(debug ? sourcemaps.write('maps') : util.noop())
    .pipe(gulp.dest(paths.build.js))
    .pipe(watchEnabled ? livereload() : util.noop())
  ;
});

// Images
gulp.task('img', () => {
  return gulp
    .src(paths.src.img)
    .pipe(gulp.dest(paths.build.img))
    .pipe(watchEnabled ? livereload() : util.noop())
  ;
});

// Clean
gulp.task('clean', () => {
  return require('del')([
    paths.build.scss,
    paths.build.js,
    paths.build.img,
  ]);
});

// Watch + LiveReload
gulp.task('watch', cb => {
  if (watchEnabled) {
    livereload.listen();
    gulp.watch(paths.src.scss,    ['sass']);
    gulp.watch(paths.src.js.glob, ['js']);
    gulp.watch(paths.src.img,     ['img']);
  } else {
    cb();
  }
});

// Build
gulp.task('build', cb => {
  sequence('clean', ['sass', 'js', 'img'], cb);
});

// Default task
gulp.task('default', cb => {
  sequence('build', 'watch', cb);
});
