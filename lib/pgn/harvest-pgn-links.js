"use strict";

const baseUrl = require("../url").baseUrl;
const zombie = require("../zombie");
const winston = require("winston");
const common = require("../common");
const Readable = require("stream").Readable;

const chessGameIdentifier = "chessgame?gid=";
const chessGameToken      = "chessgame?";
const pgnPageToken        = "nph-chesspgn?text=1&";

function chessGameLinkFilter(link) {
    return link.indexOf(chessGameIdentifier) !== -1;
}

function getGameLinks(browser) {
    return browser.queryAll("a")
                  .map(zombie.getHref)
                  .filter(chessGameLinkFilter);
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

class PgnLinkStream extends Readable {
    constructor(playerId, options) {
        super(options);

        this.getUrl = urlGenerator(playerId);
    }    

    _read (size) {    
        function streamLink(link) {
            winston.debug(`pushing link ${link}`);
            that.push(link, "utf8");
        }

        function streamPgnLinks(allGameLinks) {
            const foundPgnLinks = allGameLinks.map(gameLinkToPgnLink);
            winston.debug(`Found ${foundPgnLinks.length} links.`);
            foundPgnLinks.forEach(streamLink);            
        }

        function endStreaming() {
            winston.info("No more links.");
            that.push(null);
        }

        function collect(err, browser) {
            if (err) {
                that.push(err);
                that.push(null);
                return;
            }

            const allGameLinks = getGameLinks(browser);

            if (common.isFilledArray(allGameLinks)) {    
                streamPgnLinks(allGameLinks);
                recursive();
                return;
            }

            endStreaming();
        }

        function recursive() { 
            const url_ = that.getUrl();
            console.log("url used: " + url_);
            zombie.browser(url_, collect); 
        };

        console.log("read triggered");
        const that = this;
        recursive();
    }
}   

exports.PgnLinkStream = PgnLinkStream;
