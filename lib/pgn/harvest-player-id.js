"use strict";

const zombie = require("../zombie");
const baseUrl = require("../url").baseUrl;
const winston = require("winston");

const playerIdRegex  = /\d{5}/g;

function playerIdFilter(link) {
    return link.indexOf("/perl/chessplayer?pid=") !== -1;
}

function playerIdLinkToId(link) {
    return link.match(playerIdRegex)[0];
}

function getPlayerId(playerName, callback) {
    const searchableName = playerName.replace(" ", "+");
    const playerIdSearch = `${baseUrl}/perl/ezsearch.pl?search=${searchableName}`

    zombie.browser(playerIdSearch, function (err, browser) {

        if (err) {
            callback(err);
        }

        const playerIds = browser.queryAll("a")
                                 .map(zombie.getHref)
                                 .filter(playerIdFilter)
                                 .map(playerIdLinkToId);

        if (playerIds.length !== 1) {
            // This is only theoretical, couldn't find any behavior like that
            winston.debug(playerIds);

            callback(Error(`${playerIds.length} Player found with ${playerName}!`));
        } 

        winston.info(`Player ${playerName} has the playerId ${playerIds[0]}`);

        callback(playerIds[0]);
    });
}

exports.getPlayerId = getPlayerId;
