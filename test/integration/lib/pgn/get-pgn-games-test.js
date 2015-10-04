"use strict";

const expect = require("chai").expect;
const Writable = require("stream").Writable;
const winston = require("winston");
const from = require("from2");
const harvestPgnGames = require("../../../../lib/pgn/get-pgn-games");

function gameUrlInput(string) {
    return from(function(size, next) {
        if (string.length <= 0) return next(null, null);
        
        var chunk = string.slice(0, size);
        string = string.slice(size);
 
        next(null, chunk);
    });
}

function createWritable(done) {
    const ws = Writable();

    ws._write = function (chunk, enc, next) {
        const that = this;
        const pgnObj = JSON.parse(chunk);

        winston.debug("writable received pgnObj:");
        winston.debug(pgnObj);

        next();
    };

    return ws;
}

describe("harvest pgn games", function () {
    it("should return pgns of given links", function (done) {
        const pgnObjects = {
            id        : "1228607",
            event     : "Berlin",
            site      : "Berlin",
            date      : "1918.??.??",
            eventdate : "?",
            round     : "?",
            result    : "0-1",
            white     : "Kipke",
            black     : "Kurt Paul Otto Joseph Richter",
            eco       : "C26",
            whiteelo  : "?",
            blackelo  : "?",
            plycount  : "46",
            moves     : "1.e4 e5 2.Nc3 Nf6 3.g3 Nc6 4.Bg2 Bc5 5.Nge2 b6 6.d3 Ng4 7.O-O " +
                        "Qf6 8.Nd5 Bxf2+ 9.Kh1 Qd6 10.Nec3 h5 11.Nb5 Qg6 12.Nbxc7+ Kd8 " +
                        "13.Nxa8 h4 14.Bh3 hxg3 15.Kg2 d6 16.hxg3 Rxh3 17.Rxf2 Nxf2 " +
                        "18.Qf3 Nh1 19.Bg5+ Qxg5 20.Rxh1 Qd2+ 21.Kf1 Nd4 22.Qg2 Rxh1+ " +
                        "23.Qxh1 Qe2+ 0-1"
        };

        const gameUrl = "/perl/nph-chesspgn?text=1&gid=1228607";

        harvestPgnGames.on("end", function () {
            done();
        });

        gameUrlInput(gameUrl).pipe(harvestPgnGames)
                             .pipe(createWritable(done));
    }); 
});