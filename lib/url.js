"use strict";

const baseUrlEncoded = "aHR0cDovL3d3dy5jaGVzc2dhbWVzLmNvbQ==";
const baseUrl = new Buffer(baseUrlEncoded, "base64").toString("utf8");

exports.baseUrl = baseUrl;
