const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const mocha = require('gulp-mocha');
const browserify = require('gulp-browserify');


const BABEL_CONFIG = {
	presets: ['es2015', 'react'],
	plugins: ['transform-object-rest-spread']
};

gulp.task('build:test', ['build:src'], () => {
	return gulp.src('test/index.es6.js')
		.pipe(babel(BABEL_CONFIG))
		.pipe(rename('index.js'))
		.pipe(gulp.dest('test/'));
});

gulp.task('build:example', ['build:src'], () => {
	return gulp.src('examples/index.es6.js')
		.pipe(babel(BABEL_CONFIG))
		.pipe(browserify())
		.pipe(rename('index.js'))
		.pipe(gulp.dest('examples/'));
});

gulp.task('build:src', () => {
	return gulp.src('index.es6.js')
		.pipe(babel(BABEL_CONFIG))
		.pipe(rename('index.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('test', ['build:test'], () => {
	return gulp.src('test/index.js')
		.pipe(mocha());
});

gulp.task('build', ['build:src', 'build:test', 'build:example']);

gulp.task('default', ['test']);
