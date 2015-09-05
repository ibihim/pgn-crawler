"use strict";

const zombie = require("../zombie");
const baseUrl = require("../url").baseUrl;
const winston = require("winston");
const Readable = require("stream").Readable;

const playerIdRegex  = /\d{5}/g;

function playerIdFilter(link) {
    return link.indexOf("/perl/chessplayer?pid=") !== -1;
}

function playerIdLinkToId(link) {
    return link.match(playerIdRegex)[0];
}

function getPlayerId(browser) {
    return browser.queryAll("a")
                  .map(zombie.getHref)
                  .filter(playerIdFilter)
                  .map(playerIdLinkToId)
                  .shift();
}

function getUrl(playerName) {
    return `${baseUrl}/perl/ezsearch.pl?search=${playerName}`;
}

class PlayerIdStream extends Readable {
    constructor(_playerName, options) {
        super(options);
        const searchableName = _playerName.replace(" ", "+");

        this.playerName = _playerName;    
        this.playerIdSearchUrl = getUrl(_playerName);
        this.isPlayerIdPushed = false;
    }

    _read (size) {    
        function streamPlayerId(err, browser) {
            if (err) {
                winston.error(err);
                that.push(err);
                that.push(null);
                return;
            }

            const playerId = getPlayerId(browser);

            winston.info(`Player ${that.playerName} has the playerId ${playerId}`);

            that.push(playerId);            
        }

        const that = this;

        if (!this.isPlayerIdPushed) {            
            this.isPlayerIdPushed = true;
            zombie.browser(this.playerIdSearchUrl, streamPlayerId);
            return;
        }

        this.push(null);
    }
}

exports.PlayerIdStream = PlayerIdStream;
