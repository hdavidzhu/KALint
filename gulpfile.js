var gulp = require('gulp');
var mocha = require('gulp-mocha');
var srcGlob = 'src/**/*.js';
var testGlob = 'spec/**/*.js';

gulp.task('test', function() {
  return gulp
    .src([srcGlob, testGlob], {read: false})
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('test:tdd', function() {
  gulp.watch([srcGlob, testGlob], ['test']);
});

// Run all unit tests in debug mode
gulp.task('test:debug', function () {
  var spawn = require('child_process').spawn;
  spawn('node', [
    '--debug',
    'node_modules/gulp/bin/gulp.js',
    'test:tdd'
  ], { stdio: 'inherit' });
});
