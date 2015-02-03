
var gulp = require('gulp');
var po2json = require('gulp-po2json');

gulp.task('default', function() {
  gulp.task('po2json');
});

gulp.task('po2json', function() {
	return gulp.src(['public/locale/**/messages.po'])
	  .pipe(po2json())
	  .pipe(gulp.dest('public/i18n/'));
})