"use strict";

const expect = require("chai").expect;
const harvestPgnLinks = require("../../../../lib/pgn/harvest-pgn-links");

describe("harvest pgn links", function () {
    it("should return an expected number of pgns for a given player", function (done) {
        harvestPgnLinks.harvestLinks(82276, function (links) {
            expect(links).to.have.length(10);
            done();
        });
    });
});