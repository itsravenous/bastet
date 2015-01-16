var gulp = require('gulp');
var browserify = require('gulp-browserify');
var jade = require('gulp-jade');
var sass = require('gulp-ruby-sass');
var connect = require('gulp-connect');
var argv = require('yargs').argv;

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
		.pipe(gulp.dest(dest+'js'))
		.pipe(connect.reload());
});

// Copy theme images
gulp.task('images', function() {
	gulp.src('src/img/**')
		.pipe(gulp.dest(dest+'img'))
		.pipe(connect.reload());
});

// Copy content assets
gulp.task('content', function() {
	gulp.src('src/content/**')
		.pipe(gulp.dest(dest+'content'))
		.pipe(connect.reload());
});

// Compile templates to html
gulp.task('pages', function () {
	gulp.src('src/pages/**/*.jade')
		.pipe(jade())
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(gulp.dest(dest))
		.pipe(connect.reload());
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
	.pipe(gulp.dest(dest+'css'))
	.pipe(connect.reload());

});

// Server
gulp.task('connect', function() {
	connect.server({
		root: 'www',
		livereload: true,
		port: 8000
	});
});

// Watch task
gulp.task('watch', function () {
	gulp.watch('src/**/*.jade', ['pages']);
	gulp.watch('src/**/*.scss', ['styles']);
	gulp.watch('src/**/*.js', ['scripts']);
	gulp.watch('src/images/**', ['images']);
	gulp.watch('src/content/**', ['content']);
});

// Default wrapper task
var defaultTask = [
	'pages',
	'styles',
	'scripts',
	'images',
	'content'
];
if (!argv.noserver) defaultTask.push('connect');
if (!argv.nowatch) defaultTask.push('watch');

gulp.task('default', defaultTask);
