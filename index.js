"use strict";

const pgn = require("./lib/pgn");

const playerName = "Magnus Carlsen";
const startTime = Date.now();

function printPgns(pgns) {
    const runTime = getRuntime();

    console.log(pgns);

    printRuntime(runTime);
}

function getRuntime() {
    return (Date.now() - startTime)/1000;
}

function printRuntime(runTime) {
    console.log(`links search had a runtime of ${runTime}s`);
}

pgn.getPgnsForPlayer(playerName, printPgns);

//module.exports = function (playerName, callback) {
//    pgn.getPgnsForPlayer(playerName, callback);    
//}
