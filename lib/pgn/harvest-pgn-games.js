"use strict";

const zombie = require("../zombie");

const gameIdRegex  = /\d{7}/g;
const pgnHtmlStart = '<html xmlns="http://www.w3.org/1999/xhtml">' +
                   '<head></head><body><pre style="' + 
                   'word-wrap: break-word; white-space: pre-wrap;">';
const pgnHtmlEnd   = "</pre></body></html>";

function extractPgn(source, link) {
    const gameId  = link.match(gameIdRegex)[0];
    const pgnData = source.replace(pgnHtmlStart, "")
                          .replace(pgnHtmlEnd, "");

    return {
        pgnId   : gameId,
        pgnData : pgn
    };
}

function getPgn(link, callback) {
    zombie.browser(link, function (err, browser) {
        if (err) {
            console.log(err);
            return;
        }

        const source = browser.html();

        console.log(`[INFO] analyzing data... \n${source}`);

        const pgn    = extractPgn(source, link);

        console.log(`[INFO] pgn data... \n${pgn}`);

        callback(pgn);
    });
}

exports.getPgn = getPgn;

