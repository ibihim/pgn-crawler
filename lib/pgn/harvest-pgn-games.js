"use strict";

const zombie = require("../zombie");
const winston = require("winston");
const common = require("../common");

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
            callback(err);
            return;
        }

        const source = browser.html();

        winston.debug(`analyzing data... \n${source}\n`);

        const pgn = extractPgn(source, link);

        winston.debug(`pgn data...\n${pgn}\n`);

        callback(null, pgn);
    });
}

function harvestPgnGames(links, callback) {

    let pgns = [];
    let linksLength = links.length;    
    let index = 0;

    (function recursive() {
        getPgn(links[index], function (err, pgn) {

            if (err) {
                callback(err);
                return;
            }

            pgns.push(pgn);
            index += 1; 

            winston.debug(`\npgn pushed:`);
            winston.debug(pgn);
            winston.debug(`\nnow having ${pgns.length} pgns`);

            if (index < linksLength) {
                recursive();   
                return;
            } 

            if (!common.isFilledArray(pgns)) {
                callback(Error("no pgns found"));
                return;
            }
            
            winston.debug(`Found ${pgns.length} pgn data`);

            callback(null, pgns);            
        });
    })();
}

exports.harvestPgnGames = harvestPgnGames;
