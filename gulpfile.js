var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var vinylStream = require('vinyl-source-stream');
var del = require('del');
var util = require('util');
var rename = require('gulp-rename');
var insert = require('gulp-insert');

var sourceFile = './node_modules/bunyan/lib/bunyan.js'

gulp.task('clean', function () {
    return del('./dist/**/*.*');
});

//package with browserify
gulp.task('package', [ 'clean' ], function() {
    return browserify({
        entries: sourceFile,
        standalone: 'bunyan'
    })
        .bundle()
        .pipe(vinylStream('browser-bunyan.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minify', [ 'package' ], function() {

    var packageMessageTempalte =
        '/**\n' +
        ' * %s - %s\n' +
        ' * %s\n' +
        ' * %s\n' +
        ' */\n';

    var meta = require('./package.json');
    var packageMessage = util.format(packageMessageTempalte, meta.name, meta.version, meta.description, meta.licenses[0].type);

    return gulp.src('./dist/browser-bunyan.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(insert.prepend(packageMessage))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['minify']);
