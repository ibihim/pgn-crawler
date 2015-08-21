"use strict";

const expect = require("chai").expect;
const harvestPgns = require("../../../../lib/pgn");

describe("pgn index", function () {
    it("should ...", function (done) {
        harvestPgns.getPgnsForPlayer("Kipke", function (err, pgns) {
            if (err) {
                done(err);
            }

            expect(pgns).to.have.length(3);
            done();
        });
    });
});