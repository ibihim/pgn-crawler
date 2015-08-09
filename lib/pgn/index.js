"use strict";

const harvestPgnLinks = require("./harvest-pgn-links");
const harvestPgnGames = require("./harvest-pgn-games");
const harvestPlayerId = require("./harvest-player-id");

let pgnList = [];

function addPgnToList(pgn) {
    pgnList.push(pgn);
}

function getPgnsForPlayer(playerName, callback) {

    function linkToPgn(link) {
        harvestPgnGames.getPgn(link, addPgnToList);
    }

    function addPgns(links) {
        links.forEach(linkToPgn);

        callback(pgnList);
    }

    function pgnLinkHarvesterCurried(playerId) {
        pgnLinkHarvester.harvestLinks(playerId, addPgns);    
    }

    harvestPlayerId.getPlayerId(playerName, pgnLinkHarvesterCurried);    
}

exports.getPgnsForPlayer = getPgnsForPlayer;
