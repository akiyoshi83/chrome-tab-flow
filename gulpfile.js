var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
  return browserify('src/popup.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on('error', function(err) { console.log("ERROR : " + err.message); })
    .pipe(source('popup.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
  return gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['build']);

