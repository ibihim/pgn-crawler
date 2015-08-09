"use strict";

const zombie = require("./zombie").zombie;

const gameIdRegex  = /\d{7}/g;
const pgnHtmlStart = '<html xmlns="http://www.w3.org/1999/xhtml">' +
                   '<head></head><body><pre style="' + 
                   'word-wrap: break-word; white-space: pre-wrap;">';
const pgnHtmlEnd   = "</pre></body></html>";

function create(playerId) {

    function extractPgn(source, link) {
        const gameId = link.match(gameIdRegex)[0];
        const pgn    = source.replace(pgnHtmlStart, "")
                             .replace(pgnHtmlEnd, "");        

        return {
            pgnId   : gameId,
            playerId: playerId,
            pgnData : pgn
        };
    }

    function getPgn(link, callback) {
        zombie(link, function (err, browser) {
            if (err) {
                console.log(err);
                return;
            }

            const source = browser.html();
            const pgn    = extractPgn(source, link);

            callback(pgn);
        });
    }

    return {
        getPgn: getPgn
    };
}

exports.create = create;

