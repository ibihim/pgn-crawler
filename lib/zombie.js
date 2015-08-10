"use strict";

const Browser = require("zombie");

const config = {
    runScripts: false,
    loadCSS: false,
    silent: true
};

exports.getHref = function (node) {
    return node.href;
}

exports.browser = function (url, callback) {
    Browser.visit(url, config, callback);
};