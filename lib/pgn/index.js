"use strict";

const HarvestPgnGames = require("./lib/pgn/harvest-pgn-games");
const PgnLinkHarvester = require("./lib/pgn/harvest-pgn-links");

let pgnList = [];

function create(playerId, callback) {

    function addPgnToList(pgn) {
        pgnList.push(pgn);
    }

    function linktToPgn(link) {
        harvestPgnGames.getPgn(link, addPgnToList);
    }

    function addPgns(links) {
        links.forEach(linktToPgn);
    }

    function executeCallback() {
        callback(pgnList);
    }

    const playerId = "82276";

    const harvestPgnGames = HarvestPgnGames.create(playerId);
    const pgnLinkHarvester = PgnLinkHarvester.create(playerId, addPgns);

    const pgnLinkEmitter = pgnLinkHarvester.pgnLinkEmitter;

    return {
        start: pgnLinkHarvester.start()
    };
}

exports.create = create;
