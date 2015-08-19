"use strict";

const pgn = require("./lib/pgn");
const winston = require("winston");

winston.level = "info";

const playerName = "Kurt Richter";
const startTime = Date.now();

function printPgns(pgns) {
    const runTime = getRuntime();

    winston.log(pgns);

    printRuntime(runTime);
}

function getRuntime() {
    return (Date.now() - startTime)/1000;
}

function printRuntime(runTime) {
    winston.info(`links search had a runtime of ${runTime}s`);
}

pgn.getPgnsForPlayer(playerName, printPgns);

//module.exports = function (playerName, callback) {
//    pgn.getPgnsForPlayer(playerName, callback);    
//}
