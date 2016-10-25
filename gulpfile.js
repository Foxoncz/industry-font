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

gulp.task('font', function(){
  return gulp.src(['src/svg/*.svg'])
    .pipe(iconfont({
      fontName: 'industry-font',
      prependUnicode: true,
      normalize: true,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
    }))
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('png', function () {
    gulp.src('src/svg/*.svg')
        .pipe(raster())
		.pipe(rename({extname: '.png'}))
        .pipe(gulp.dest('dist/png/'));
});

gulp.task('scss', function(){
  return gulp.src(['src/scss/industry-font.scss'])
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

gulp.task('build', ['font', 'scss', 'png'], function(){
  return gulp.src(['src/html/index.html', 'dist/**/*'])
    .pipe(gulp.dest('doc/'));
});

gulp.task('doc', ['build'], function(){
  return gulp.src(['src/html/index.html', 'dist/**/*'])
    .pipe(gulp.dest('doc/'));
});

gulp.task('deploy',['doc'], function() {
  return gulp.src('./doc/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['build', 'doc'], function(){});
