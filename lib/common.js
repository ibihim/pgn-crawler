"use strict";

const _ = require("lodash");
const http = require("http");

const headers = require("./web-data/header");
const host = require("./web-data/url");
const hostname = host.replace("http://", "");
const port = "80";
const method = "GET";

const OPTIONS = {
    hostname,
    port,
    method,
    headers
};

function createOptions(path) {
    let opts = _.clone(OPTIONS, true);
    opts.path = path;
    return opts;
}

function createRequest(options, callback) {

    let allData = [];

    return http.request(options, function (response) {
        response.setEncoding("utf8");
        response.on("data", data => allData.push(data));
        response.on("end",  data => {
            allData.push(data); 
            callback(allData.join(""));
        });
    });
}

function sendRequest(path, cb) {
    const options = createOptions(path);
    const request = createRequest(options, cb);
        
    request.end("");
}

function logNoNewLine(message) {
    process.stdout.write(message);
}

function isFilledArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
}

function oneTimeTrue() {
    let value = true;

    return () => {
        if (value) {
            value = false;
            return true;    
        } 

        return false;         
    };
}

module.exports = {
    sendRequest,
    logNoNewLine,
    isFilledArray,
    oneTimeTrue
};
