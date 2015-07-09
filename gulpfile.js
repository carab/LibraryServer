var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');


gulp.task('develop', function () {
  nodemon({
    script: 'app.js',
    ext: 'js coffee ejs',
  }).on('restart', function () {

  });
});

gulp.task('default', [
  'develop'
]);
