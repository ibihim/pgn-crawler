"use strict";

const baseUrl = require("../url").baseUrl;
const zombie = require("../zombie");

const chessGameIdentifier = "chessgame?gid=";
const chessGameToken      = "chessgame?";
const pgnPageToken        = "nph-chesspgn?text=1&";

let callback;
let getUrl;
let allLinksFound = [];

function addToAllLinksFound(link) {
    console.log(`[DEBUG] pushing link ${link}`);

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

        console.log(`[DEBUG] Opening ${returnUrl}`);      

        return returnUrl;
    };
}

function harvestLinks(givenPlayerId, givenCallback) {

    if (givenPlayerId) {
        getUrl = urlGenerator(givenPlayerId);
    }

    if (givenCallback) {
        callback = givenCallback;
    }

    zombie.browser(getUrl(), function (err, browser) {

        if (err) {
            console.log(`[ERROR] ${err}`);
            return;
        }

        const allGameLinks = browser.queryAll("a")
                                    .map(zombie.getHref)
                                    .filter(chessGameLinkFilter);

        if (!isFilledArray(allGameLinks)) {    
            console.log(`[INFO] No more links. Found ${allLinksFound.length} links.`);

            callback(allLinksFound);

            return;
        }

        const foundPgnLinks = allGameLinks.map(gameLinkToPgnLink);

        console.log(`[INFO] Found ${foundPgnLinks.length} links.`);

        foundPgnLinks.forEach(addToAllLinksFound);            
            
        harvestLinks();
    });
}   

exports.harvestLinks = harvestLinks;
