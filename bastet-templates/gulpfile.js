var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jade = require('gulp-jade');
var sass = require('gulp-ruby-sass');

// Set build dir
var dest = 'www/';

// Bundle JavaScript
gulp.task('scripts', function() {
	// Single entry point to browserify
	gulp.src('src/js/main.js')
		.pipe(browserify({
			debug: !gulp.env.production,
			insertGlobals: false
		}))
		.pipe(gulp.dest(dest+'js'));
});


// Compile templates to html
gulp.task('pages', function () {
	gulp.src('src/pages/**/*.jade')
		.pipe(jade())
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(gulp.dest(dest));
});

// Compile styles to css
gulp.task('styles', function () {
	return sass('src/styles/main.scss', {
		loadPath: 'src/styles',
		require: [
			'sass-globbing'
		]
	})
	.on('error', function (err) {
		console.error('Error!', err.message);
	})
	.pipe(gulp.dest(dest+'css'));

});

// Default wrapper task
gulp.task('default', [
	'pages',
	'styles',
	'scripts'
]);

// Watch task
gulp.task('watch', function () {
	gulp.watch('src/**/*.jade', ['pages']);
	gulp.watch('src/**/*.scss', ['styles']);
	gulp.watch('src/**/*.js', ['scripts']);
});