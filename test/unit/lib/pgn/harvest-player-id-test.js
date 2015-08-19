"use strict";

const expect = require("chai").expect;
const harvestPlayerId = require("../../../../lib/pgn/harvest-player-id");

describe("harvest player id", function () {
    it("should return expeced id on player name", function () {
        harvestPlayerId.getPlayerId("Magnus Carlsen", function (playerId) {
            expect(playerId).to.be(52948);
        });
    });
});