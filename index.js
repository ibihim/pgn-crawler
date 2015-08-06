"use strict";

const playerId = "82276";
const PgnLinkHarvester = require("./lib/harvest-pgn-links");
const pgnLinkHarvester = PgnLinkHarvester.create(playerId);
const pgnLinkEmitter = pgnLinkHarvester.pgnLinkEmitter;

var foundLinks = [];

pgnLinkEmitter.on("linksFound", function (links) {
    console.log(`adding ${links.length} links`);
    foundLinks.push(links);
});

pgnLinkEmitter.on("linksComplete", function () {
    console.log(`found ${foundLinks.length} links`);
    console.log(foundLinks);
})

pgnLinkHarvester.start()
