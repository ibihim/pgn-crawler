"use strict";

const expect = require("chai").expect;
const winston = require("winston");
const from = require("from2");
const Writable = require('stream').Writable;
const pgnLinkStream = require("../../../../lib/pgn/get-pgn-links");
const chessGameLink = "http://www.chessgames.com/perl/nph-chesspgn?text=1&gid=";
 
function playerIdInput(string) {
    return from(function(size, next) {
        if (string.length <= 0) return next(null, null);
        
        var chunk = string.slice(0, size);
        string = string.slice(size);
 
        next(null, chunk);
    });
}

describe("harvest pgn links", function () {
    it("should return an expected number of pgns for a given player", function (done) {

        function writable() {
            const ws = Writable();

            ws._write = function (chunk, enc, next) {
                winston.debug(`received chunk: ${chunk}`);

                if (!chunk) {
                    done();
                }
                if (typeof chunk !== "string") {
                    chunk = chunk.toString();
                }
                
                expect(expectedResults).to.include(chunk);
                next();
            };

            return ws;
        }
        
        const expectedResults = [
            "/perl/nph-chesspgn?text=1&gid=1601470",
            "/perl/nph-chesspgn?text=1&gid=1601469",
            "/perl/nph-chesspgn?text=1&gid=1601474",
            "/perl/nph-chesspgn?text=1&gid=1580159",
            "/perl/nph-chesspgn?text=1&gid=1601473",
            "/perl/nph-chesspgn?text=1&gid=1601465",
            "/perl/nph-chesspgn?text=1&gid=1228621",
            "/perl/nph-chesspgn?text=1&gid=1280436",
            "/perl/nph-chesspgn?text=1&gid=1280459",
            "/perl/nph-chesspgn?text=1&gid=1280431",
            "/perl/nph-chesspgn?text=1&gid=1280453",
            "/perl/nph-chesspgn?text=1&gid=1280426",
            "/perl/nph-chesspgn?text=1&gid=1280447",
            "/perl/nph-chesspgn?text=1&gid=1280417",
            "/perl/nph-chesspgn?text=1&gid=1280471",
            "/perl/nph-chesspgn?text=1&gid=1280438",
            "/perl/nph-chesspgn?text=1&gid=1280469",
            "/perl/nph-chesspgn?text=1&gid=1601478",
            "/perl/nph-chesspgn?text=1&gid=1601482",
            "/perl/nph-chesspgn?text=1&gid=1580118",
            "/perl/nph-chesspgn?text=1&gid=1601477",
            "/perl/nph-chesspgn?text=1&gid=1601481",
            "/perl/nph-chesspgn?text=1&gid=1326948",
            "/perl/nph-chesspgn?text=1&gid=1601476",
            "/perl/nph-chesspgn?text=1&gid=1601480",
            "/perl/nph-chesspgn?text=1&gid=1601475",
            "/perl/nph-chesspgn?text=1&gid=1601479"
        ];

        pgnLinkStream.on("end", function () {
            done();
        });

        playerIdInput("62399").pipe(pgnLinkStream)
                              .pipe(writable());
    });
});