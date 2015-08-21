"use strict";

const expect = require("chai").expect;
const harvestPlayerId = require("../../../../lib/pgn/harvest-player-id");

describe("harvest player id", function () {
    it("should return expeced id on player name", function (done) {
        harvestPlayerId.getPlayerId("Magnus Carlsen", function (err, playerId) {
            if (err) {
                done(err);
            }
            
            expect(playerId).to.equal("52948");
            done();
        });
    });
});