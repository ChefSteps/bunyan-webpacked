var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var vinylStream = require('vinyl-source-stream');
var del = require('del');
var util = require('util');
var rename = require('gulp-rename');
var insert = require('gulp-insert');
var concat = require('gulp-concat');

var sourceFile = './node_modules/bunyan/lib/bunyan.js';

gulp.task('clean', function() {
  return del(['./dist/**/*.*', './build/**/*.*']);
});

gulp.task('browserify', ['clean'], function() {
  return browserify({
    entries: sourceFile,
    standalone: 'bunyan',
  })
    .bundle()
    .pipe(vinylStream('bunyan.js'))
    .pipe(gulp.dest('./build'));
});

//package with browserify
gulp.task('package', ['clean', 'browserify'], function() {
  return gulp.src([ './lib/windowShim.js', './build/bunyan.js'])
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./dest'));
});

gulp.task('minify', ['package'], function() {
  return gulp
    .src('./index.js')
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['minify']);
