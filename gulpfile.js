"use strict";

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var flexfixer = require('postcss-flexbugs-fixes');
var sass = require('gulp-sass')
var path = require('path2');
var header = require('gulp-header');
var del = require('del');
var gutil = require('gulp-util');
var rename = require('gulp-rename');

const gulp = require('gulp');

// Create an electron-connect server to enable reloading
const electron = require('electron-connect').server.create();

var
    packageFile = 'package.json',
    pkg = require('./' + packageFile),
    paths = {
        scripts: ['src/js/**/*.js'],
        sass: ['src/styles/**/*.scss'],
        bootstrap: {
            scripts: ['node_modules/bootstrap-v4-dev/dist/js/*.js'], // just copying the script as I am not changing this
            scss: ['node_modules/bootstrap-v4-dev/scss/*.scss'], // does not need to include the mixins or partials as the base bootstrap.scss does this
        }
    },
    banner = "/*\n" +
        "* <%= pkg.name %> - <%= pkg.description_short %>\n" +
        "* Version <%= pkg.version %>\n" +
        "* @requires <%= pkg.requires %>\n" +
        "*\n" +
        "* Copyright (c) <%= pkg.copyright %>\n" +
        "* <%= pkg.homepage %>\n" +
        "* Licensed under the MIT license:\n" +
        "* http://www.opensource.org/licenses/mit-license.php\n" +
        "*/\n" +
        "/*\n" +
        "* @description <%= pkg.description_long %>\n" +
        "* @name <%= pkg.name %>\n" +
        "* @author <%= pkg.authors %>\n" +
        "*/\n";

gulp.task('config', function () {
    fs = require("fs2");
    pkg = fs.readFileSync(packageFile, "utf8");
    gutil.log(pkg.toString());
});

gulp.task('build-bootstrap-css', function () {
    return gulp.src(paths.bootstrap.scss)
        .pipe(sass())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(postcss([autoprefixer]))
        .pipe(postcss([flexfixer]))
        .pipe(gulp.dest('app/css'));
});

gulp.task('build-bootstrap-js', function () { //just copy them so that if the source should change then we have the latest. Would only happen when the next release is loaded.
    return gulp.src(paths.bootstrap.scripts)
        .pipe(gulp.dest('app/js'));
});

gulp.task('restart', function () {
    electron.restart;
});

gulp.task('go', () => {
    electron.start();
    //Watch js files and restart Electron if they change
    gulp.watch(['./app/js/*.js'], electron.restart);
    gulp.watch(['./main.js'], electron.restart);
    //watch css files, but only reload (no restart necessary)
    //gulp.watch(['./app/css/*.css'], electron.reload);
    //watch bootstrap sass files, but only reload (no restart necessary)
    //gulp.watch(paths.bootstrap.scss, ['build-bootstrap-css', 'restart']);
    //watch html
    gulp.watch(['./index.html'], electron.restart);
});

gulp.task('default', [
    'build-bootstrap-js',
    'build-bootstrap-css',
    'go'
], function () {

});