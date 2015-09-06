"use strict";

const expect = require("chai").expect;
const PgnLinkStream = require("../../../../lib/pgn/harvest-pgn-links").PgnLinkStream;
const pgnLinkStream = new PgnLinkStream("62383");
const chessGameLink = "http://www.chessgames.com/perl/nph-chesspgn?text=1&gid=";

describe("harvest pgn links", function () {
    it("should return an expected number of pgns for a given player", function (done) {
        pgnLinkStream.on("readable", function () {            
            var read = pgnLinkStream.read();
            console.log("readable");
            if (read && read.toString) {
                console.log(`chunk: ${read.toString()}`)
            } else {
                console.log("null");
            }           
        });

        pgnLinkStream.on("end", function () {
            done();            
        })
    });
});