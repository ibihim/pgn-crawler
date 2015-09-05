"use strict";

const PgnEmitter = require("../lib/PgnEmitter");

const pgnEmitter = new PgnEmitter("Magnus Carlsen");

pgnEmitter.onPlayerId(function (value) {
    console.log(value);
});

pgnEmitter.emitPlayerId("123");