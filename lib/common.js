"use strict";

exports.logNoNewLine = function (message) {
    process.stdout.write(message);
};

exports.isFilledArray = function (arr) {
    return Array.isArray(arr) && arr.length > 0;
};
