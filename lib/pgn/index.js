"use strict";

const harvestPgnLinks = require("./harvest-pgn-links");
const harvestPgnGames = require("./harvest-pgn-games");
const harvestPlayerId = require("./harvest-player-id");

let pgnList = [];

function logNoNewLine(message) {
    process.stdout.write(message);
}

function getPgnsForPlayer(playerName, callback) {

    function addPgns(links) {

        function addPgnToList(pgn) {
            pgnList.push(pgn);

            logNoNewLine(".");
            addPgns(links);
        }

        if (links.length === 0) {
            console.log(`[INFO] no more games to crawl. Crawled ${pgnList.length} pgns`);

            callback(pgnList);

            return;
        }

        const link = links.shift();

        harvestPgnGames.getPgn(link, addPgnToList);
    }

    function harvestPgnLinksCurried(playerId) {
        harvestPgnLinks.harvestLinks(playerId, addPgns);    
    }

    harvestPlayerId.getPlayerId(playerName, harvestPgnLinksCurried);    
}

exports.getPgnsForPlayer = getPgnsForPlayer;
