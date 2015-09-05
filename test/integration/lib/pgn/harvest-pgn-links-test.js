"use strict";

const expect = require("chai").expect;
const PgnLinkStream = require("../../../../lib/pgn/harvest-pgn-links").PgnLinkStream;
const pgnLinkStream = new PgnLinkStream("62383");
const chessGameLink = "http://www.chessgames.com/perl/nph-chesspgn?text=1&gid=";

//const winston = require("winston");
//winston.level = "debug";

describe("harvest pgn links", function () {
    it("should return an expected number of pgns for a given player", function (done) {

        let links = [];
        pgnLinkStream.on("readable", function () {
            let chunk;

            while ((chunk = pgnLinkStream.read()) !== null) {
                links.push(chunk);
                expect(chunk).to.contain(chessGameLink);
            }            
        });

        pgnLinkStream.on("end", function () {
            expect(links).to.have.length(3);
            done();            
        })
    });
});