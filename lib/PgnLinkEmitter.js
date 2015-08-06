"use strict";

const EventEmitter = require("events").EventEmitter;

class PgnLinkEmitter extends EventEmitter {
    constructor() {
        super();
    }
}

module.exports = new PgnLinkEmitter();