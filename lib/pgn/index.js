"use strict";

const harvestPgnLinks = require("./harvest-pgn-links");
const harvestPgnGames = require("./harvest-pgn-games");
const harvestPlayerId = require("./harvest-player-id");

let pgnList = [];

function addPgnToList(pgn) {
    pgnList.push(pgn);
}

function logNoNewLine(message) {
    process.stdout.write(message);
}

function getPgnsForPlayer(playerName, callback) {

    function linkToPgn(link) {
        logNoNewLine(".");

        harvestPgnGames.getPgn(link, addPgnToList);
    }

    function addPgns(links) {
        logNoNewLine(`[INFO] Will crawl ${links.length} links`);

        links.forEach(linkToPgn);

        console.log(`\n[INFO] Crawled ${pgnList.length} pgn games`);

        callback(pgnList);
    }

    function harvestPgnLinksCurried(playerId) {
        harvestPgnLinks.harvestLinks(playerId, addPgns);    
    }

    harvestPlayerId.getPlayerId(playerName, harvestPgnLinksCurried);    
}

exports.getPgnsForPlayer = getPgnsForPlayer;
