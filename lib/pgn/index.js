"use strict";

const winston = require("winston");
const harvestPgnLinks = require("./harvest-pgn-links");
const harvestPgnGames = require("./harvest-pgn-games");
const harvestPlayerId = require("./harvest-player-id");

function getPgnsForPlayer(playerName, callback) {

    function harvestPgnGamesCurried(err, links) {
        if (err) {
            callback(err);
            return;
        }

        harvestPgnGames.harvestPgnGames(links, callback);
    }

    function harvestPgnLinksCurried(err, playerId) {
        if (err) {
            callback(err);
            return;
        }

        harvestPgnLinks.harvestLinks(playerId, harvestPgnGamesCurried);    
    }

    harvestPlayerId.getPlayerId(playerName, harvestPgnLinksCurried);    
}

exports.getPgnsForPlayer = getPgnsForPlayer;
