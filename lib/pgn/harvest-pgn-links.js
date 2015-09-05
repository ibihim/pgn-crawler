"use strict";

const baseUrl = require("../url").baseUrl;
const zombie = require("../zombie");
const winston = require("winston");
const common = require("../common");
const Readable = require("stream").Readable;
const util = require("util");

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

// es6-ify it
class PgnLinkStream extends Readable {
    constructor(playerId, options) {
        super(options);

        this.getUrl = urlGenerator(playerId);
    }    

    _read (size) {    
        const that = this;

        function streamLinks(link) {
            winston.debug(`pushing link ${link}`);
            that.push(link, "utf8");
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

                foundPgnLinks.forEach(streamLinks);            
                recursive();

                return;
            }

            winston.info("No more links.");

            that.push(null);
        }

        function recursive() { 
            zombie.browser(that.getUrl(), harvest); 
        };

        recursive();
    }
}   

exports.PgnLinkStream = PgnLinkStream;
