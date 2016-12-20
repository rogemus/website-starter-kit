"use strick";

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jade = require('gulp-jade');

var config = {
    port: 3001,
    devBaseUrl: 'http:localhost',
    paths: {
        html: './src/*.html',
        js: './src/scripts/**/*.js',
        jade: './src/jade/**/*.jade',
        jadePage: './src/jade/2-pages/**/*.jade',
        css: './src/css/**/*.css',
        mainSass: './src/main.scss',
        sass: './src/sass/**/*.scss',
        buildCss: './build/css',
        build: './build'
    }
};

gulp.task('connect', function() {
    connect.server({
        root: ['build'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function() {
    gulp.src('build/index.html').pipe(open({
        uri: config.devBaseUrl + ':' + config.port + '/'
    }));
});

gulp.task('html', function() {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.build))
        .pipe(connect.reload());
});

gulp.task('sass', function() {
    gulp.src(config.paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(config.paths.buildCss))
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src(config.paths.js)
        .pipe(gulp.dest(config.paths.build))
        .pipe(connect.reload());
});

gulp.task('jade', function() {
    var YOUR_LOCALS = {};

    gulp.src(config.paths.jadePage)
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        }).on('error', function(err) {
            console.log(err)
        }))
        .pipe(gulp.dest(config.paths.build))
        .pipe(connect.reload());
});

gulp.task('concat', function() {
    gulp.src(config.paths.js)
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(config.paths.build))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.sass, ['sass']);
    gulp.watch(config.paths.jade, ['jade']);
    gulp.watch(config.paths.js, ['concat']);
});

gulp.task('default', ['open', 'watch', 'concat', 'html', 'sass', 'jade']);
