var

  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  cached = require('gulp-cached'),
  cleanCSS = require('gulp-clean-css'),
  del = require('del'),
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  paths,
  rename = require('gulp-rename'),
  run = require('gulp-run'),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  sassLint = require('gulp-sass-lint'),
  sourceMaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify');

// paths
paths = new (function paths() {
  this.src = './src';
  this.dist = './dist';
  this.distAssets = this.dist + '/content/';
  this.modulesSrc = 'node_modules';

  this.stylesSrc = this.src + '/styles';
  this.stylesDist = this.dist + '/content/css';

  this.scriptsSrc = this.src + '/scripts';
  this.scriptsDist = this.dist + '/content/js';

  this.imagesSrc = this.src + '/images';
  this.imagesDist = this.dist + '/content/img';

  this.assets = '/assets';
  this.views = this.src + '/views';
})();


/**
 * browserSync
 */

gulp.task('icon-sync', function sync() {
  var fonts = '/icons/*/fonts/*',
    src = paths.stylesSrc + fonts,
    dist = paths.stylesDist + '/icons';
  return gulp.src(src)
    .pipe(newer(dist))
    .pipe(gulp.dest(dist));
});

gulp.task('server',['icon-sync','sass:main','js:main'], function bs() {

  browserSync.init(null, {
    proxy: 'http://localhost:8080',
    reloadDelay: 800
  });

  gulp.watch([
    paths.stylesSrc + '/main.scss',
    paths.stylesSrc + '/*/*.scss',

  ], ['sass:main']).on('change', browserSync.reload);;

  gulp.watch(
    paths.views + '/**/*.ejs').on('change', browserSync.reload);

  gulp.watch(
    paths.imagesSrc + '/**/*', ['images'] ).on('change', browserSync.reload);

  gulp.watch(
    [paths.scriptsSrc + '/**/*.js'],['js:main']).on('change', browserSync.reload);

});

/**
 * sass:main
 */
gulp.task( 'sass:main', function sassMain() {
  return gulp
    .src( paths.stylesSrc + '/main.scss' )
   //   .pipe( sourceMaps.init() )
    .pipe( sass({ outputStyle: 'compressed' }) )
    //.pipe( cleanCSS() )
    //.pipe(autoprefixer({
    //  browsers: ['last 2 versions'],
    //  cascade: false
    //}))
    //.pipe( sourceMaps.write('.') )
    .pipe( rename({ suffix: '.min' }) )
    .pipe( gulp.dest( paths.stylesDist ) );
});

/**
 * sass:vendor
 */
gulp.task( 'sass:vendor', function sassVendor() {
  return gulp
    .src( paths.stylesSrc + '/vendor.scss' )
    .pipe( sass({ outputStyle: 'compressed' }) )
    //.pipe( cleanCSS() )
    .pipe( rename({ suffix: '.min' }) )
    .pipe( gulp.dest( paths.stylesDist ) );
});

/**
 * js
 */
gulp.task( 'js:main', function js() {
  return gulp.src(paths.scriptsSrc + '/index.js')
    //.pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(paths.scriptsDist));
});

/**
 * images
 */
gulp.task( 'images', function images() {
  return gulp
    .src( paths.imagesSrc + '/**/*' )
    .pipe( cached() )
    .pipe( gulp.dest( paths.imagesDist ) );
});


/**
 * dist
 */
gulp.task( 'dist', [] ,function dist() {
  gulp
    .src( paths.stylesSrc + '/vendor.scss' )
    .pipe( sass({
      //includePaths: ['./node_modules'],
      outputStyle: 'expanded'
    }) )
    .pipe( cleanCSS() )
    .pipe( rename({ suffix: '.min' }) )
    .pipe( gulp.dest( paths.stylesDist ) );

  gulp
    .src( paths.stylesSrc + '/main.scss' )
    .pipe( sass({
      //includePaths: ['./node_modules'],
      outputStyle: 'expanded'
    }) )
    .pipe( cleanCSS() )
    .pipe( rename({ suffix: '.min' }) )
    .pipe( gulp.dest( paths.stylesDist ) );

  gulp
    .src( paths.imagesSrc + '/**/*' )
    .pipe( cached() )
    .pipe( gulp.dest( paths.imagesDist ) );
});

/**
 * watch
 */
gulp.task( 'watch', function watch() {
  gulp.watch( paths.stylesSrc + '/vendor.scss', ['sass:vendor'] );

  gulp.watch([
    paths.stylesSrc + '/main.scss',
    paths.stylesSrc + '/*/*.scss',

  ], ['sass:main'] );

  gulp.watch( paths.scriptsSrc + '/**/*.js', ['js:main'] );

  gulp.watch( paths.imagesSrc + '/**/*', ['images'] );
});

/**
 * default
 */
gulp.task( 'default', ['watch'] );
