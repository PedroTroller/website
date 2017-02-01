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

// Paths + config
const basePaths = {
  src:    'app/assets',
  build:  'web/assets',
  vendor: 'web/vendor',
};
const paths = {
  src: {
    scss: `${basePaths.src}/scss/**/*.scss`,
    js: {
      targets: {
        'main.js': [
          `${basePaths.vendor}/wow.js/dist/wow.js`,
          `${basePaths.vendor}/smooth-scroll.js/dist/js/smooth-scroll.js`,
          `${basePaths.vendor}/bootstrap.native/dist/bootstrap-native.js`,
          `${basePaths.vendor}/mustache/mustache.js`,
          `${basePaths.src}/js/lib/*.js`,
          `${basePaths.src}/js/app.js`,
        ],
      },
    },
    img: `${basePaths.src}/img/**/*.{jpg,png,gif,ico,svg}`,
  },
  build: {
    scss: `${basePaths.build}/css`,
    js:   `${basePaths.build}/js`,
    img:  `${basePaths.build}/img`,
  },
};
paths.src.js.glob = Array.prototype.concat(...Object.values(paths.src.js.targets));

// Supported browser versions (used by Babel and Autoprefixer)
const supportedBrowsers = [
  'last 25 firefox versions',
  'last 25 and_ff versions',
  'last 25 chrome versions',
  'last 25 and_chr versions',
  'last 25 opera versions',
  'last 25 op_mob versions',
  'safari >= 5',
  'ios_saf >= 7',
  'android >= 4',
  'edge >= 12',
  'ie >= 9',
  'ie_mob >= 10',
];

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
      if (debug) {
        console.log(error);
      }
      if (watchEnabled) {
        this.emit('end');
      } else {
        process.exit(error.status || 1);
      }
    })
  );
};

// Sass
gulp.task('sass', () => (
  gulp
    .src(paths.src.scss)
    .pipe(debug ? sourcemaps.init() : util.noop())
    .pipe(
      require('gulp-sass')({
        precision: 9,
        outputStyle: debug ? null : 'compressed',
        includePaths: [
          basePaths.vendor,
          `${basePaths.vendor}/bootstrap-sass/assets/stylesheets`,
        ],
      })
    )
    .pipe(
      require('gulp-autoprefixer')({
        browsers: supportedBrowsers,
        remove: false,
      })
    )
    .pipe(debug ? sourcemaps.write('maps') : util.noop())
    .pipe(gulp.dest(paths.build.scss))
    .pipe(watchEnabled ? livereload() : util.noop())
));

// JavaScript
gulp.task('js', () => (
  gulp
    .src(paths.src.js.glob)
    .pipe(debug ? sourcemaps.init() : util.noop())
    .pipe(
      require('gulp-babel')({
        only: 'app/assets/js',
        presets: [
          ['env', {
            targets: {
              browsers: supportedBrowsers,
            },
            modules: false,
          }],
        ],
      })
    )
    .pipe(require('gulp-group-concat')(paths.src.js.targets))
    .pipe(debug ? util.noop() : require('gulp-uglify/minifier')(null, require('uglify-js')))
    .pipe(debug ? sourcemaps.write('maps') : util.noop())
    .pipe(gulp.dest(paths.build.js))
    .pipe(watchEnabled ? livereload() : util.noop())
));

// Images
gulp.task('img', () => (
  gulp
    .src(paths.src.img)
    .pipe(gulp.dest(paths.build.img))
    .pipe(watchEnabled ? livereload() : util.noop())
));

// Clean
gulp.task('clean', () => (
  require('del')([
    paths.build.scss,
    paths.build.js,
    paths.build.img,
  ])
));

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
gulp.task('build', cb => sequence('clean', ['sass', 'js', 'img'], cb));

// Default task
gulp.task('default', cb => sequence('build', 'watch', cb));
