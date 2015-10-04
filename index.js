"use strict";

const pgn = require("./lib/pgn");
const winston = require("winston");
const startTime = Date.now();

function getRuntime() {
    return (Date.now() - startTime)/1000;
}

function printRuntime(runTime) {
    winston.info(`links search had a runtime of ${runTime}s`);
}

exports.demo = function () {
    const playerName = "Kurt Richter";

    winston.level = "info";

    function printPgns(err, pgns) {
        if (err) {
            winston.error(err);
        }

        const runTime = getRuntime();

        winston.log(pgns);

        printRuntime(runTime);
    }

    pgn.getPgnsForPlayer(playerName, printPgns);
};

exports.getPgnsForPlayer = pgn.getPgnsForPlayer;
exports.stream = pgn.stream;
