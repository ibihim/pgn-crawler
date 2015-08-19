"use strict";

const winston = require("winston");
const harvestPgnLinks = require("./harvest-pgn-links");
const harvestPgnGames = require("./harvest-pgn-games");
const harvestPlayerId = require("./harvest-player-id");

function getPgnsForPlayer(playerName, callback) {

    function harvestPgnGamesCurried(links) {
        harvestPgnGames.harvestPgnGames(links, callback);
    }

    function harvestPgnLinksCurried(playerId) {
        harvestPgnLinks.harvestLinks(playerId, harvestPgnGamesCurried);    
    }

    harvestPlayerId.getPlayerId(playerName, harvestPgnLinksCurried);    
}

exports.getPgnsForPlayer = getPgnsForPlayer;
