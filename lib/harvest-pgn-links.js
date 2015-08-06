"use strict";

/**
 * harvestPgnLinks(Number, Function)
 */

const baseUrl = require("./url").baseUrl;
const Browser = require("zombie");
const _ = require("lodash");
const pgnLinkEmitter = require("./PgnLinkEmitter");

const startTime = Date.now();
const config = {
    runScripts: false,
    loadCSS: false,
    silent: true
};

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

function create(playerId) {
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
        Browser.visit(getUrl(), config, function (err, browser) {

            if (err) {
                console.log(err);
                return;
            }

            const allLinks     = browser.queryAll("a").map(getHref);
            const allGameLinks = allLinks.filter(chessGameLinkFilter);

            if (!isFilledArray(allGameLinks)) {
                pgnLinkEmitter.emit("linksComplete");
                printRuntime();

                return;
            }

            const foundPgnLinks = allGameLinks.map(gameLinkToPgnLink);

            pgnLinkEmitter.emit("linksFound", foundPgnLinks);
            harvestNextPage();
        });
    }        

    return {
        start: harvestNextPage,
        pgnLinkEmitter: pgnLinkEmitter  
    };
}

exports.create = create;
