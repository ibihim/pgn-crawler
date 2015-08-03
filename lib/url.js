"use strict";

var urlEncoded = "aHR0cDovL3d3dy5jaGVzc2dhbWVzLmNvbQ==";
var url = new Buffer(urlEncoded, "base64").toString("utf8");

exports.url = url;
