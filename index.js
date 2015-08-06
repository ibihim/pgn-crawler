"use strict";

const HarvestPgnGames = require("./lib/harvest-pgn-games");
const PgnLinkHarvester = require("./lib/harvest-pgn-links");

const playerId = "82276";
const harvestPgnGames = HarvestPgnGames.create(playerId);
const pgnLinkHarvester = PgnLinkHarvester.create(playerId);

const pgnLinkEmitter = pgnLinkHarvester.pgnLinkEmitter;

pgnLinkEmitter.on("linksFound", function (links) {
    console.log(`adding ${links.length} links`);

    harvestPgnGames.getPgn(links[0], function (pgn) {
        console.log(pgn);
    })    
});

pgnLinkEmitter.on("linksComplete", function () {
    console.log("no more links to go for");
})

pgnLinkHarvester.start()
