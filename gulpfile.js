var gulp = require('gulp');
var mocha = require('gulp-mocha');
var srcGlob = 'src/**/*.js';
var testGlob = 'spec/**/*.js';

gulp.task('test', function() {
  return gulp
    .src('spec/**/*.js', {read: false})
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('test:tdd', function() {
  gulp.watch([srcGlob, testGlob], ['test']);
});
