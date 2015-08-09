"use strict";

const zombie = require("../zombie").zombie;
const baseUrl = require("../url").baseUrl;

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

    zombie(playerIdSearch, function (err, browser) {

        if (err) {
            console.log(err);
            return;
        }

        const playerIds = browser.queryAll("a")
                                 .map(zombie.getHref)
                                 .filter(playerIdFilter)
                                 .map(playerIdLinkToId);

        if (playerLinks.length !== 1) {
            console.log(`[ERROR] ${playerLinks.length} Player found with ${playerName}`!);
            console.log(playerIds);

            return;
        }

        callback(playerIds[0]);
    });
}

exports.getPlayerId = getPlayerId;
