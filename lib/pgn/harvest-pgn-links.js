"use strict";

const baseUrl = require("../url").baseUrl;
const zombie = require("../zombie").zombie;

const callback;
const getUrl;

const chessGameIdentifier = "chessgame?gid=";
const chessGameToken      = "chessgame?";
const pgnPageToken        = "nph-chesspgn?text=1&";

let allLinksFound = [];

function addToAllLinksFound(link) {
    allLinksFound.push(link);
}

function chessGameLinkFilter(link) {
    return link.indexOf(chessGameIdentifier) !== -1;
}

function gameLinkToPgnLink(link) {
    return link.replace(chessGameToken, pgnPageToken);
}

function isFilledArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
}

function urlGenerator(playerId) {
    let page = 0;
    
    return function () {
        page += 1;

        const returnUrl = `${baseUrl}/perl/chess.pl?page=${page}&pid=${playerId}`;            

        return returnUrl;
    };
}

function harvestLinks(givenPlayerId, givenCallback) {

    if (givenPlayerId && callback) {
        callback = givenCallback;
        getUrl = urlGenerator(givenPlayerId);
    }

    zombie(getUrl(), function (err, browser) {

        if (err) {
            console.log(err);
            return;
        }

        const allGameLinks = browser.queryAll("a")
                                    .map(zombie.getHref)
                                    .filter(chessGameLinkFilter);

        if (!isFilledArray(allGameLinks)) {                
            callback(allLinksFound);

            return;
        }

        const foundPgnLinks = allGameLinks.map(gameLinkToPgnLink);

        foundPgnLinks.forEach(addToAllLinksFound);            
            
        harvestLinks();
    });
}   

exports.harvestLinks = harvestLinks;
