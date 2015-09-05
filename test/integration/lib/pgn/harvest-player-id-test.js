"use strict";

const expect = require("chai").expect;
const harvestPlayerId = require("../../../../lib/pgn/harvest-player-id");
const PlayerIdStream = harvestPlayerId.PlayerIdStream;
const playerIdStream = new PlayerIdStream("Magnus Carlsen");

describe("harvest player id", function () {
    it("should return expeced id on player name", function (done) {
        playerIdStream.on("readable", function () {
            let chunk;

            while ((chunk = playerIdStream.read()) !== null) {
                console.log("chunk: " + chunk);
                expect(chunk).to.contain("52948");
            }            
        });

        playerIdStream.on("end", function () {
            done();            
        })
    });
});