"use strict";

const expect = require("chai").expect;
const harvestPgnLinks = require("../../../../lib/pgn/harvest-pgn-links");

describe("harvest pgn links", function () {
    it("should return an expected number of pgns for a given player", function (done) {
        harvestPgnLinks.harvestLinks(62383, function (err, links) {
            if (err) {
                done(err);
            }
            
            expect(links).to.have.length(3);
            done();
        });
    });
});