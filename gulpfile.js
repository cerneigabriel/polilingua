"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const { src, dest } = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const babel = require("gulp-babel");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const webpack = require("webpack");
const webpackconfig = require("./webpack.config.js");
const webpackstream = require("webpack-stream");
const minify = require("gulp-minify");
const merge = require("merge-stream");

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./public/",
        },
        port: 3000,
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean src
function clean() {
    return del(["./public/src/"]);
}

// Optimize Images
function images() {
    del(["./public/src/img/"]);

    return (
        gulp
            .src("./src/img/**/*")
            .pipe(newer("./public/src/img"))
            // .pipe(
            // 	imagemin([
            // 		imagemin.gifsicle({ interlaced: true }),
            // 		imagemin.jpegtran({ progressive: true }),
            // 		imagemin.optipng({ optimizationLevel: 5 }),
            // 		imagemin.svgo({
            // 			plugins: [
            // 				{
            // 					removeViewBox: false,
            // 					collapseGroups: true
            // 				}
            // 			]
            // 		})
            // 	])
            // )
            .pipe(gulp.dest("./public/src/img"))
    );
}

function fonts() {
    return gulp
        .src("./src/fonts/**/*")
        .pipe(newer("./public/src/fonts"))
        .pipe(gulp.dest("./public/src/fonts"));
}

// CSS task
function css() {
    return gulp
        .src("./src/scss/app.scss")
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(gulp.dest("./public/src/css/"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest("./public/src/css/"))
        .pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
    return gulp.src(["./src/js/**/*", "./gulpfile.js"]);
    // .pipe(plumber())
    // .pipe(eslint())
    // .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
}

function clearVendor() {
    return del(["./public/src/vendor/"]);
}

function vendor() {
    const vendor = {
        slick: gulp
            .src("./node_modules/slick-slider/**/*")
            .pipe(newer("./public/src/vendor"))
            .pipe(gulp.dest("./public/src/vendor/slick-slider")),

        jquery: gulp
            .src([
                "./node_modules/jquery/**/*",
                "!./node_modules/jquery/dist/core.js",
            ])
            .pipe(newer("./public/src/vendor"))
            .pipe(gulp.dest("./public/src/vendor/jquery")),

        jquery_validation: gulp
            .src("./node_modules/jquery-validation/**/*")
            .pipe(newer("./public/src/vendor"))
            .pipe(gulp.dest("./public/src/vendor/jquery-validation")),

        jquery_migrate: gulp
            .src("./node_modules/jquery-migrate/**/*")
            .pipe(newer("./public/src/vendor"))
            .pipe(gulp.dest("./public/src/vendor/jquery-migrate")),

        readmore_js: gulp
            .src("./node_modules/readmore-js/**/*")
            .pipe(newer("./public/src/vendor"))
            .pipe(gulp.dest("./public/src/vendor/readmore-js"))
    };

    return merge(
        vendor.slick,
        vendor.jquery,
        vendor.jquery_validation,
        vendor.readmore_js
    );
}

// Transpile, concatenate and minify scripts
function scripts() {
    return (
        gulp
            .src(["./src/js/app.js"])
            .pipe(plumber())
            .pipe(
                babel({
                    presets: [["@babel/env"]],
                })
            )
            // .pipe(webpackstream(webpackconfig, webpack))
            .pipe(
                minify({
                    ext: {
                        src: ".js",
                        min: ".min.js",
                    },
                })
            )
            .pipe(gulp.dest("./public/src/js/"))
            .pipe(browsersync.stream())
    );
}

// Watch files
function watchFiles() {
    gulp.watch("./src/img/**/*", images);
    gulp.watch("./src/scss/**/*", css);
    gulp.watch("./src/js/**/*", gulp.series(scriptsLint, scripts));
    gulp.watch(["./public/**/*", "./src/**/*"], gulp.series(browserSyncReload));
    gulp.watch("./src/fonts/**/*", fonts);
}

// define complex tasks
// const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(clean, vendor, css, images, fonts, scripts);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));
const serve = browserSync;

exports.vendor = gulp.series(clearVendor, vendor);
exports.build = build;
exports.watch = watch;
exports.serve = serve;
exports.default = build;
