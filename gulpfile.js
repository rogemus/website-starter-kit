"use strick";

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var pug = require('gulp-pug');

var config = {
    port: 3001,
    devBaseUrl: 'http:localhost',
    paths: {
        html: './src/*.html',
        img: ['./src/img/**/*.png', './src/img/**/*.jpg', './src/img/**/*.gif', './src/img/**/*.jpeg'],
        js: './src/scripts/**/*.js',
        pug: './src/pug/**/*.pug',
        pugPath: './src/pug/3-pages/**/*.pug',
        css: './src/css/**/*.css',
        mainSass: './src/main.scss',
        sass: './src/sass/**/*.scss',
        fonts: './src/fonts/**/*',
        buildCss: './build/css',
        buildImg: './build/img',
        buildFonts: './build/fonts',
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


gulp.task('images', function() {
    gulp.src(config.paths.img)
        .pipe(gulp.dest(config.paths.buildImg))
});

gulp.task('fonts', function() {
    return gulp.src(config.paths.fonts)
        .pipe(gulp.dest(config.paths.buildFonts));
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


gulp.task('pug', function buildHTML() {
    return gulp.src(config.paths.pugPath)
        .pipe(pug()).on('error', function(err) {
            console.log(err)
        })
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
    gulp.watch(config.paths.pug, ['pug']);
    gulp.watch(config.paths.js, ['concat']);
    gulp.watch(config.paths.img, ['images']);
});

gulp.task('build', ['concat', 'html', 'sass', 'pug', 'fonts', 'images']);

gulp.task('default', ['open', 'watch', 'build']);
