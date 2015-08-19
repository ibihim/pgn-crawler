"use strict";

const zombie = require("../zombie");
const winston = require('winston');

const gameIdRegex  = /\d{7}/g;

// TODO this is too hardcoded, need regex!
const htmlElement = /<[^<]+>/g;

function extractPgn(source, link) {
    const gameId  = link.match(gameIdRegex)[0];
    const pgnData = source.replace(htmlElement, "");

    return {
        pgnId   : gameId,
        pgnData : pgnData
    };
}

function getPgn(link, callback) {
    zombie.browser(link, function (err, browser) {
        if (err) {
            winston.error(err);
            return;
        }

        const source = browser.html();

        winston.debug(`analyzing data... \n${source}`);

        const pgn    = extractPgn(source, link);

        winston.debug(`pgn data... \n${pgn}`);

        callback(pgn);
    });
}

function harvestPgnGames(links, callback) {

    let linksLength = links.length;
    let pgns = [];
    let index = 0;

    (function recursive() {
        getPgn(links[index], function (pgn) {
            pgns.push[pgn];
            index += 1; 

            if (index < linksLength) {
                recursive();   
            } else {
                callback(pgns);
            }            
        });
    })();
}

exports.harvestPgnGames = harvestPgnGames;
