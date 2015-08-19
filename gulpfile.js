"use strict";

const gulp = require("gulp");
const mocha = require("gulp-mocha");
const jshint = require("gulp-jshint");
const stylish = require("jshint-stylish");

gulp.task("test", function () {
    return gulp.src(["test/**/*-test.js"], { read: false })
               .pipe(mocha({ reporter: "spec" }));
});

gulp.task("jshint", function() {
  return gulp.src("./lib/*.js")
             .pipe(jshint())
             .pipe(jshint.reporter(stylish));
});
