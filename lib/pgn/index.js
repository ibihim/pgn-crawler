"use strict";

const winston = require("winston");

const PlayerId = require("./get-player-id");

const getLinks = require("./get-pgn-links");
const getGames = require("./get-pgn-games");

function streamPgnObjs(playerName, streamFunc, next) {    

    if (next) {
        getGames.on("end", function () {
            next();
        });
    }

    let getPlayerId = new PlayerId(playerName);

    getPlayerId.pipe(getLinks)
               .pipe(getGames)
               .pipe(streamFunc);
}

function callbackPgnObjs(playerName, callback) {

    function createWritable() {
        const ws = Writable();        

        ws._write = function (chunk, enc, next) {
            winston.debug(`received chunk: ${chunk}`);

            if (typeof chunk !== "string") {
                chunk = chunk.toString();
            }
                
            const pgnObj = JSON.parse(chunk);
            pgns.push(pgnObj);
            next();
        };

        return ws;
    }

    getGames.on("end", function () {
        callback(null, pgns);
    });

    getGames.on("error", function (err) {
        callback(err);
    });

    const writable = createWritable();
    var pgns = [];
    let getPlayerId = new PlayerId(playerName);

    getPlayerId.pipe(getLinks)
               .pipe(getGames)
               .pipe(streamFunc);
}

exports.stream = streamPgnObjs;
exports.getPgnsForPlayer = callbackPgnObjs;
