"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
const concat = require("gulp-concat");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const { src, dest } = require("gulp");
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

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./public/",
        },
        files: [
            "src/**/*"
        ],
        port: 3000,
    });
    done();
}

function browserSyncReload(done) {
    browsersync.reload();
    done();
}

function clean() {
    return del(["./public/src/"]);
}

function imagesSyncOptimize () {
    del(["./public/src/img/"]);

    return (
        gulp
            .src("./src/img/**/*")
            .pipe(newer("./public/src/img"))
            .pipe(gulp.dest("./public/src/img"))
    );
}

// Optimize Images
function images() {
    del(["./public/src/img/"]);

    return (
        gulp
            .src("./src/img/**/*")
            .pipe(newer("./public/src/img"))
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

function scriptsLint() {
    return gulp.src(["./src/js/**/*", "./gulpfile.js"]);
}

// Transpile, concatenate and minify scripts
function scripts() {
    return (
        gulp
            .src([
                "./node_modules/jquery/dist/jquery.js",
                "./node_modules/jquery-validation/dist/jquery.validate.js",
                "./node_modules/jquery-validation/dist/additional-methods.js",
                "./node_modules/slick-slider/slick/slick.js",
                "./node_modules/readmore-js/dist/readmore.js",
                "./node_modules/intl-tel-input/build/js/intlTelInput-jquery.js",
                "./node_modules/intl-tel-input/build/js/utils.js",
                "./node_modules/select2/dist/js/select2.full.js",
                "./node_modules/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.js",
                "./node_modules/filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.js",
                "./node_modules/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.js",
                "./node_modules/filepond-plugin-file-encode/dist/filepond-plugin-file-encode.js",
                "./node_modules/filepond/dist/filepond.js",
                "./node_modules/jquery-filepond/filepond.jquery.js",
                "./src/js/app.js"
            ])
            .pipe(
                babel({
                    presets: [["@babel/env"]],
                })
            )
            // .pipe(concat('app.js'))
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
const build = gulp.series(clean, css, imagesSyncOptimize, fonts, scripts);
const watch = gulp.series(clean, css, images, fonts, scripts, gulp.parallel(watchFiles, browserSync));
const serve = browserSync;

exports.build = build;
exports.watch = watch;
exports.serve = serve;
exports.default = build;
