"use strict";

const expect = require("chai").expect;
const winston = require("winston");
const Writable = require("stream").Writable;
const PlayerIdStream = require("../../../../lib/pgn/get-player-id")
const playerIdStream = new PlayerIdStream("Magnus Carlsen");

function writable() {
    const ws = Writable();

    ws._write = function (chunk, enc, next) {
        winston.debug(`received chunk: ${chunk}`);
        
        if (typeof chunk !== "string") {
            chunk = chunk.toString();
        }
                
        expect(chunk).to.contain("52948");
        next();
    };

    return ws;
}

describe("harvest player id", function () {
    it("should return expeced id on player name", function (done) {        
        playerIdStream.on("end", function () {
            done();            
        });

        playerIdStream.pipe(writable());
    });
});