/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    nodemon = require('gulp-nodemon');

// create a default task and just log a message
gulp.task('message', function() {
return gutil.log('Gulp is running!!')
 });

gulp.task('start', function(){
    nodemon({
        script: 'bin/www'
    });
});


//configure the jshint task   
gulp.task('jshint', function(){
	return gulp.src('routes/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('watch', function(){
	gulp.watch('routes/*.js',['jshint']);
});


gulp.task('default', ['message', 'watch', 'start' ]);
