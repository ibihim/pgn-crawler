"use strict";

const common = require("../common");
const winston = require("winston");
const Readable = require("stream").Readable;

const playerNameSearchPath = "/perl/ezsearch.pl?search=";
const regex = /chessplayer\?pid=(\d{1,6})/g;

function getUrl(playerName_) {
    const playerName = playerName_.replace(" ", "+");

    return `${playerNameSearchPath}${playerName}`;
}

// use from2
class PlayerIdStream extends Readable {
    constructor(_playerName, options) {
        super(options);

        this.playerName = _playerName;    
        this.playerIdSearchUrl = getUrl(_playerName);
        this.isPlayerIdPushed = common.oneTimeTrue();
    }

    _read (size) {   
        const that = this;

        if (that.isPlayerIdPushed()) {
            common.sendRequest(that.playerIdSearchUrl, (source) => {
                let result = regex.exec(source);

                if (!result) {
                    winston.error(`No player ID found for ${that.playerName}`);     
                    return;
                } 

                that.push(result[1]);
            });

            return;
        }         

        that.push(null);
    }
}

module.exports = PlayerIdStream;
