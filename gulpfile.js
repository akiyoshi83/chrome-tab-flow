var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build', ['copy'], function() {
  return browserify('src/popup.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log("ERROR : " + err.message); })
    .pipe(source('popup.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy', function() {
  return gulp.src([
    'manifest.json',
    '_locales/**',
    '*.html',
    '*.css',
    'icon*.png',
  ], {
    base: '.'
  })
  .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
  return gulp.watch(['src/**/*.js', '*.html', '*.css'], ['build']);
});

gulp.task('default', ['build']);

