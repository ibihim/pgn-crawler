"use strict";

const Browser = require("zombie");

const config = {
    runScripts: false,
    loadCSS: false,
    silent: true
};

exports.zombie = function (url, callback) {
    Browser.visit(url, config, callback);
};