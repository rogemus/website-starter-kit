const { series, watch, src, dest, parallel } = require('gulp');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');
const connect = require('gulp-connect');
const atImport = require('postcss-import');
const del = require('del');

const config = {
	devserver: {
		port: 3001,
	},
	paths: {
		src: {
			css: './src/css/**/main.css',
			js: './src/js/**/*.js',
			fonts: './src/fonts/**/*',
			pug: './src/pug/3-pages/**/*.pug',
			assets: './src/assets/**/*'
		},
		build: {
			css: './build/css',
			js: './build/js',
			assets: './build/assets',
			fonts: './build/fonts',
			main: './build'
		}
	}
};

const assets = () => (
	src(config.paths.src.assets)
		.pipe(dest(config.paths.build.assets))
		.pipe(connect.reload())
);

const fonts = () => (
	src(config.paths.src.fonts)
		.pipe(dest(config.paths.build.fonts))
		.pipe(connect.reload())
);

const js = () => (
	src(config.paths.src.js)
		.pipe(dest(config.paths.build.js))
		.pipe(connect.reload())
);

const css = () => (
	src(config.paths.src.css)
		.pipe(postcss([
			atImport()
		]))
		.pipe(dest(config.paths.build.css))
		.pipe(connect.reload())
);

const html = () => (
	src(config.paths.src.pug)
		.pipe(pug()).on('error', (err) => {
			console.log(err)
		})
		.pipe(dest(config.paths.build.main))
		.pipe(connect.reload())
);

const clean = () => (
	del(config.paths.build.main)
);

const devserver = () => (
	connect.server({
		root: config.paths.build.main,
		port: config.devserver.port,
		livereload: true
	})
);

const watchFiles = () => {
	watch(config.paths.src.js, { ignoreInitial: false }, js);
	watch(config.paths.src.pug, { ignoreInitial: false }, html);
	watch(config.paths.src.css, { ignoreInitial: false }, css);
};

exports.build = series(clean, fonts, assets, css, js, html)
exports.default = series(clean, fonts, assets, parallel(devserver, watchFiles));
