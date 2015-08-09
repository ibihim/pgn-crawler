"use strict";

const baseUrl = require("./url").baseUrl;
const zombie = require("./zombie").zombie;

const startTime = Date.now();

let allLinksFound = [];

function addToAllLinksFound(link) {
    allLinksFound.push(link);
}

function chessGameLinkFilter(link) {
    return link.indexOf("chessgame?gid=") !== -1;
}

function gameLinkToPgnLink(link) {
    return link.replace("chessgame?", "nph-chesspgn?text=1&");
}

function getHref(node) {
    return node.href;
}

function isFilledArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
}

function printRuntime() {
    const runTime = (Date.now() - startTime)/1000;
    console.log(`links search had a runtime of ${runTime}s`);
}

function create(playerId, callback) {

    const getUrl = urlGenerator(playerId);

    function urlGenerator(playerId) {
        let page = 0;
    
        return function () {
            page += 1;

            const returnUrl = `${baseUrl}/perl/chess.pl?page=${page}&pid=${playerId}`;            

            return returnUrl;
        };
    }

    function harvestNextPage() {

        zombie(getUrl(), function (err, browser) {

            if (err) {
                console.log(err);
                return;
            }

            const allGameLinks = browser.queryAll("a")
                                        .map(getHref)
                                        .filter(chessGameLinkFilter);

            if (!isFilledArray(allGameLinks)) {                
                printRuntime();
                callback(allLinksFound);

                return;
            }

            const foundPgnLinks = allGameLinks.map(gameLinkToPgnLink);

            foundPgnLinks.forEach(addToAllLinksFound);            
            
            harvestNextPage();
        });
    }        

    return {
        start: harvestNextPage
    };
}

exports.create = create;
