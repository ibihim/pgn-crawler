"use strict";

const baseUrl = require("../url").baseUrl;
const zombie = require("../zombie");
const winston = require("winston");
const common = require("../common");
const Readable = require("stream").Readable;

const chessGameIdentifier = "chessgame?gid=";
const chessGameToken      = "chessgame?";
const pgnPageToken        = "nph-chesspgn?text=1&";

/**
 *  Determine if chess game by identifier 
 */
function isChessGameLink(link) {
    return link.indexOf(chessGameIdentifier) !== -1;
}

/**
 *  Get all links and filter them by game identifier
 */
function getGameLinks(browser) {
    return browser.queryAll("a")
                  .map(zombie.getHref)
                  .filter(isChessGameLink);
}

/**
 *  Replaces chessGameToken with pgnPageToken
 */
function gameLinkToPgnLink(link) {
    return link.replace(chessGameToken, pgnPageToken);
}

/**
 *  Returns a url generator for a given playerId
 */ 
function urlGenerator(playerId) {
    let page = 0;
    
    return function () {
        page += 1;        
        const returnUrl = `${baseUrl}/perl/chess.pl?page=${page}&pid=${playerId}`;
        winston.debug(`Opening ${returnUrl}`);      

        return returnUrl;
    };
}

/**
 *  Readable Stream class for links. Will be transitioned into Transform stream
 */
class PgnLinkStream extends Readable {
    constructor(playerId, options) {
        super(options);

        this.getUrl = urlGenerator(playerId);
        this.moreLinks = true;
        this.stack = [];
    }    

    _read (size) {    
        /**
         *  Push a link to object stack
         */
        function pushPgnLinkToStack(link) {
            winston.debug(`pushing link ${link}`);
            that.stack.push(link);
        }

        /**
         *  Transform game links to pgn and push them to object stack
         */
        function pushPgnLinksToStack(allGameLinks) {
            const foundPgnLinks = allGameLinks.map(gameLinkToPgnLink);
            winston.debug(`Found ${foundPgnLinks.length} links.`);
            foundPgnLinks.forEach(pushPgnLinkToStack);            
        }

        /**
         *  Shifts an element out of stack into stream
         */
        function streamFromStack() {
            const pushable = that.stack.shift() || null;
            that.push(pushable);
        }

        /**
         *  Set moreLinks flag to false and push null to stack
         */
        function endStreaming() {
            that.moreLinks = false;
            winston.info("No more links.");
            that.stack.push(null);
        }

        /**
         *  Collect links on next page, if there are such and stream them
         *  or end streaming
         */
        function collect(err, browser) {
            // error case
            if (err) {
                winston.error(err);
                that.stack.push(err);
                that.stack.push(null);
                return;
            }

            // getting all game links
            const allGameLinks = getGameLinks(browser);

            // if there game links found, push to stack and stream some
            if (common.isFilledArray(allGameLinks)) {    
                pushPgnLinksToStack(allGameLinks);                
            } else { // stop if there are no game links
                endStreaming();    
            }

            streamFromStack();            
        }

        const that = this;

        // if there might be more links and the stack is empty, get new ones
        if (that.moreLinks && that.stack.length === 0) {
            zombie.browser(that.getUrl(), collect);
            return;
        }

        streamFromStack();
    }
}   

exports.PgnLinkStream = PgnLinkStream;
