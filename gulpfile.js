"use strick";

var gulp = require('gulp');
//Local dev server
var connect = require('gulp-connect');
//Open url in browser
var open = require('gulp-open');
//Concatenates files
var concat = require('gulp-concat');
//Transform SASS
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
//Transform JADE
var jade = require('gulp-jade');


var config = {
    port: 3001,
    devBaseUrl: 'http:localhost',
    paths: {
        html: './src/*.html',
        js: './src/scripts/**/*.js',
        css: [
            './src/css/**/*.css'
        ],
        buildCss: './build/css',
        mainSass: './src/main.sass',
        sass: [
            './src/**/*.sass'
        ],
        jade: [
            './src/jade/2-pages/**/*.jade'
        ],
        build: './build'
    }
};

gulp.task('connect', function () {
    connect.server({
        root: ['build'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});


gulp.task('open', ['connect'], function () {
    gulp.src('build/index.html')
        .pipe(open({
            uri: config.devBaseUrl + ':' + config.port + '/'
        }));
});

gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.build))
        .pipe(connect.reload());
});

gulp.task('sass', function () {
    sass('src/sass/main.sass', {sourcemap: true, style: 'compact'})
        .pipe(prefix("last 5 version", "> 1%", "ie 8", "ie 7"))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.paths.buildCss));
});

gulp.task('jade', function () {
    var YOUR_LOCALS = {};

    gulp.src(config.paths.jade)
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest(config.paths.build));
});


gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.sass, ['sass']);
    gulp.watch(config.paths.jade, ['jade']);
});

gulp.task('default', ['html', 'sass', 'jade', 'open', 'watch']);
