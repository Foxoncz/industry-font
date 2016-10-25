'use strict';
// util
var gulp = require('gulp');
var rename = require('gulp-rename');

// font
var iconfont = require('gulp-iconfont');
var raster = require('gulp-raster');

// css
var sass = require('gulp-sass');
var comstrip = require('gulp-strip-css-comments');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');

//deploy
var ghPages = require('gulp-gh-pages');

gulp.task('build:font', function(){
  return gulp.src('src/svg/**/*')
    .pipe(iconfont({
      fontName: 'industry-font',
      prependUnicode: true,
      normalize: true,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
    }))
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('build:scss', function(){
  return gulp.src('src/scss/industry-font.scss')
    .pipe(sass())
	.pipe(rename('industry-font.css'))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('dist/css/'))
    .pipe(comstrip({
        preserve: false
    }))
    .pipe(rename('industry-font.min.css'))
    .pipe(csso())
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('build:all', ['build:font', 'build:scss'], function(){});

gulp.task('doc:dist', ['build:all'], function(){
  return gulp.src('dist/**/*')
    .pipe(gulp.dest('doc/'));
});

gulp.task('doc:html', function(){
  return gulp.src('src/html/**/*')
    .pipe(gulp.dest('doc/'));
});

gulp.task('doc:svg', function(){
  return gulp.src('src/svg/**/*')
    .pipe(gulp.dest('doc/svg'));
});

gulp.task('doc:png', function () {
    return gulp.src('src/svg/**/*')
        .pipe(raster())
		.pipe(rename({extname: '.png'}))
        .pipe(gulp.dest('doc/png/'));
});

gulp.task('doc:all', ['doc:dist', 'doc:html', 'doc:svg', 'doc:png'], function(){});

gulp.task('deploy',['doc'], function() {
  return gulp.src('./doc/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['build:all', 'doc:all'], function(){});
