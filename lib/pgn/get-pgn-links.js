"use strict";

const winston = require("winston");
const common = require("../common");
const through = require("through2");

/**
 *  Returns a url generator for a given playerId
 */ 
function urlGenerator(playerId) {
    let page = 0;
    
    return function () {
        page += 1;        

        const urlPath   = "/perl/chess.pl";
        const urlQuery  = `?page=${page}&pid=${playerId}`;
        const urlFinal  = `${urlPath}${urlQuery}`;

        winston.debug(`Opening ${urlFinal}`);

        return urlFinal;
    };
}

function transformPlayerIdToGameLinks(chunk, encoding, next) {
    const that   = this;
    const getUrl = urlGenerator(chunk);

    winston.debug(`LinkStream received: ${chunk}`);

    function handleGameLinkPage(source) {            
        const gameToken = "gid=";
        const gameRegex = /gid=\d{1,8}/g;
        const pgnUrl    = "/perl/nph-chesspgn?text=1&gid="
        const match     = source.match(gameRegex);
        
        if (match) {
            const links = match.map(match => match.replace(gameToken, ""))
                               .map(id    => `${pgnUrl}${id}`);
            
            winston.debug(`Found ${links.length}`);
            links.forEach(link  => that.push(link));

            sendRequest();
        } else {
            winston.debug("link stream ends");
            that.end();
            that.push(null);
        }
    }

    function sendRequest() {
        common.sendRequest(getUrl(), handleGameLinkPage);     
    }

    sendRequest();
}

module.exports = through(transformPlayerIdToGameLinks);
