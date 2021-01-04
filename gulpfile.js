'use strict';

var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require ('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');


gulp.task('styles', function() {
  return gulp.src('./src/sass/*.scss')
  .pipe(sass())
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest('./dist/css'))
});

gulp.task('scripts', function () {
  return gulp.src('./src/js/**/*.js')
  .pipe(terser())
  .pipe(gulp.dest('./dist/js'))
});

gulp.task('views', function buildHTML() {
  return gulp.src('./src/views/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('./dist/html'))
});

gulp.task('watch', function watch() {
  gulp.watch('./src/views/**/*.pug', gulp.series('views'))

  gulp.watch('./src/sass/**/*.scss', gulp.series('styles'))
  gulp.watch('./src/js/**/*.js', gulp.series('scripts'))
});

  // Gulp task to minify JavaScript files
gulp.task('images', function() {
return gulp.src('./src/img/*')
  // Minify the file
  .pipe(imagemin())
  // Output
  .pipe(gulp.dest('./dist/img'))
});

gulp.task('default', gulp.series('views', 'styles', 'scripts', 'images', 'watch'));