"use strict";

const through = require("through2");
const winston = require("winston");
const common = require("../common");
const sanitize = require("./sanitize-pgn-data");

const gameIdRegex  = /\d{7}/g;
const htmlElement = /<[^<]+>/g;

function extractPgn(source, link) {
    const gameId  = link.match(gameIdRegex)[0];
    const pgnData = source.replace(htmlElement, "");

    return {
        pgnId   : gameId,
        pgnData : pgnData
    };
}

/**
 *  Tranforms the url to the pgn into a pgn object.
 *
 *  @param {string} urlPath - link as path to pgn
 *  @param {string} encoding - not used
 *  @param {function} next - will be executed upon finish
 */
function transformLinksToPgns (urlPath, encoding, next) {  
    const that = this;

    function handleSource(source) {
        winston.debug(`analyzing data... \n${source}\n`);
        // object with pgnId and a string with pgn data in it
        const rawPgn = extractPgn(source, urlPath);
        // creates a pgn object out of the raw pgn
        const pgn = sanitize.convertPgnStringToPgnObj(rawPgn.pgnData);
        // add id info
        pgn.id = rawPgn.pgnId;
        // publish as String. Object-Mode is not bug free for through2
        that.push(JSON.stringify(pgn));

        next();
    }

    if (typeof urlPath !== "string") {
        urlPath = urlPath.toString();
    }

    // sends a request to GET pgn 
    common.sendRequest(urlPath, handleSource);
}

module.exports = through(transformLinksToPgns);
