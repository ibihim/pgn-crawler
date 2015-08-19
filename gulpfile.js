"use strict";

const gulp = require("gulp");
const mocha = require("gulp-mocha");
const jshint = require("gulp-jshint");
const stylish = require("jshint-stylish");

gulp.task("test", function () {
    const mochaConfig = { read: false, timeout: 20000 };
    return gulp.src(["test/**/*-test.js"], mochaConfig)
               .pipe(mocha({ reporter: "spec" }));
});

gulp.task("jshint", function() {
  return gulp.src("./lib/*.js")
             .pipe(jshint())
             .pipe(jshint.reporter(stylish));
});
