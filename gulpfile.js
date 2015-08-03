var gulp = require('gulp');

// Import dependencies
var jshint = require('gulp-jshint'), 
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    recess = require('gulp-recess'),
    minifyCSS = require('gulp-minify-css'),
    path = require('path');

var source = 'public/';
// Define tasks

// Lint Task
gulp.task('lint', function () {
    gulp.src(source + 'scripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Lint notre Less le compile et le place dans le dossier public
gulp.task('less', function () {
    return gulp.src('less/**/*.less')
    .pipe(less({
        paths: [path.join(__dirname, 'less')]
    }))
    .pipe(gulp.dest('public/css'))
    .on('error', gutil.log);
});

// Lint notre Less le compile et le place dans le dossier public
gulp.task('watch', function () {
    gulp.watch('less/**/*', ['less']);
});