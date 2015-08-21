"use strict";

const baseUrl = require("../url").baseUrl;
const zombie = require("../zombie");
const winston = require("winston");
const common = require("../common");

const chessGameIdentifier = "chessgame?gid=";
const chessGameToken      = "chessgame?";
const pgnPageToken        = "nph-chesspgn?text=1&";

function chessGameLinkFilter(link) {
    return link.indexOf(chessGameIdentifier) !== -1;
}

function gameLinkToPgnLink(link) {
    return link.replace(chessGameToken, pgnPageToken);
}

function urlGenerator(playerId) {
    let page = 0;
    
    return function () {
        page += 1;

        const returnUrl = `${baseUrl}/perl/chess.pl?page=${page}&pid=${playerId}`;

        winston.debug(`Opening ${returnUrl}`);      

        return returnUrl;
    };
}

function harvestLinks(givenPlayerId, callback) {    

    const getUrl = urlGenerator(givenPlayerId);

    let allLinksFound = [];

    function addToAllLinksFound(link) {
        winston.debug(`pushing link ${link}`);

        allLinksFound.push(link);
    }

    function harvest(err, browser) {
        if (err) {
            callback(err);
            return;
        }

        const allGameLinks = browser.queryAll("a")
                                    .map(zombie.getHref)
                                    .filter(chessGameLinkFilter);

        if (common.isFilledArray(allGameLinks)) {    
            const foundPgnLinks = allGameLinks.map(gameLinkToPgnLink);

            winston.debug(`Found ${foundPgnLinks.length} links.`);

            foundPgnLinks.forEach(addToAllLinksFound);            
            recursive();

            return;
        }

        if (!common.isFilledArray(allLinksFound)) {
            callback(Error(`no links found for ${givenPlayerId}`));
        }

        winston.info(`No more links. Found ${allLinksFound.length} links.`);

        callback(null, allLinksFound);
    }

    function recursive() { 
        zombie.browser(getUrl(), harvest); 
    };

    recursive();
}   

exports.harvestLinks = harvestLinks;
