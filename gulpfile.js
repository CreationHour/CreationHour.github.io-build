'use strict';

/*
 * Directory structure
 *
 * |-- src/ |-- *.html
 *          |-- styles/
 *          |-- scripts/
 *          |-- assets/ |-- fonts/
 *                      |-- images/
 */

const gulp = require('gulp');

const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const del = require('del');
const sass = require('gulp-sass');
const sourceMap = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
//const csslint = require('gulp-csslint');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const wiredep = require('wiredep').stream;

gulp.task('clean:srv', function(done) {
	del(['.tmp/**/*']);
	done();
});

gulp.task('clean:dist', function(done) {
	del(['dist/**/*']);
	done();
});

gulp.task('html:srv', function() {
	return gulp.src('src/*.html')
		.pipe(plumber())
		.pipe(gulp.dest('.tmp/'));
});

gulp.task('html:dist', function() {
	return gulp.src('src/*.html')
		.pipe(plumber())
		.pipe(gulp.dest('dist/'));
});

gulp.task('sass:srv', function() {
	return gulp.src('src/styles/**/*.sass')
		.pipe(plumber())
		.pipe(sourceMap.init())
		.pipe(sass({
			indentedSyntax: true,
			indentType: 'tab',
			sourceComments: true
		}))
		/*
		 *.pipe(csslint())
		 *.pipe(csslint.reporter())
		 */
		.pipe(autoprefixer())
		.pipe(gulp.dest('.tmp/styles/'))
		.pipe(sourceMap.write('.tmp/styles/'))
		.pipe(browserSync.stream());
});

gulp.task('sass:dist', function() {
	return gulp.src('src/styles/**/*.sass')
		.pipe(plumber())
		.pipe(sass({
			indentedSyntax: true,
			indentType: 'tab',
			outputStyle: 'compressed'
		}))
		.pipe(autoprefixer())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/styles/'));
});

gulp.task('js:srv', function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(plumber())
		.pipe(jshint({
			esversion: 6
		}))
		.pipe(jshint.reporter(stylish))
		.pipe(gulp.dest('.tmp/scripts/'));
});

gulp.task('js:dist', function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(plumber())
		.pipe(jshint({
			esversion: 6
		}))
		.pipe(jshint.reporter(stylish))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist/scripts/'));
});

// TODO minify images
gulp.task('images:srv', function() {
	return gulp.src('src/assets/images/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('.tmp/assets/images/'));
});

gulp.task('images:dist', function() {
	return gulp.src('src/assets/images/**/*')
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest('dist/assets/images/'))
});

gulp.task('fonts:srv', function() {
	return gulp.src('src/assets/fonts/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('.tmp/assets/fonts/'));
});

gulp.task('fonts:dist', function() {
	return gulp.src('src/assets/fonts/**/*')
		.pipe(plumber())
		.pipe(gulp.dest('dist/assets/fonts/'));
});

gulp.task('wiredep:srv', function () {
	return gulp.src('./src/*.html')
		.pipe(wiredep())
		.pipe(gulp.dest('.tmp/'));
});

gulp.task('wiredep:dist', function () {
	return gulp.src('./src/*.html')
		.pipe(wiredep())
		.pipe(gulp.dest('dist/'));
});

gulp.task('default', ['clean:srv', 'wiredep:srv', 'sass:srv', 'js:srv', 'images:srv', 'fonts:srv'], function() {
	browserSync.init({
		// FIXME: fix serving
		server: './',
		notify: false
	});

	gulp.watch('src/*.html', ['wiredep:srv', browserSync.reload]);
	gulp.watch('src/styles/**/*.sass', ['sass:srv']);
	gulp.watch('src/scripts/**/*.js', ['js:srv', browserSync.reload]);
	gulp.watch('src/assets/images/**/*', ['images:srv', browserSync.reload]);
	gulp.watch('src/assets/fonts/**/*', ['fonts:srv', browserSync.reload]);
});

gulp.task('dist', ['clean:dist', 'wiredep:dist', 'sass:dist', 'js:dist', 'images:dist', 'fonts:dist']);

