"use strict";

const gulp = require("gulp");
const mocha = require("gulp-mocha");
const jshint = require("gulp-jshint");
const stylish = require("jshint-stylish");

require("winston").level = "debug";

gulp.task("test", function () {
    const mochaConfig = { read: false };
    return gulp.src([   
                        "test/integration/**/index-test.js"                      
                        //"test/integration/**/*-test.js",                                                            
                        //"test/unit/**/*-test.js"
                     ], mochaConfig)
               .pipe(mocha({ reporter: "spec", timeout: 20000 }));
});

gulp.task("jshint", function() {
  return gulp.src("./lib/*.js")
             .pipe(jshint())
             .pipe(jshint.reporter(stylish));
});
