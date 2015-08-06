"use strict";

const baseUrl = require("./lib/url").baseUrl;
const Browser = require("zombie");
const _ = require("lodash");

const startTime = Date.now();
const playerId = "82276";
const getUrl = urlGenerator(playerId);

const config = {
    runScripts: false,
    loadCSS: false,
    silent: true
};

let allPgnLinks = [];

function chessGameLinkFilter(link) {
    return link.indexOf("chessgame?gid=") !== -1;
}

function gameLinkToPgnLink(link) {
    return link.replace("chessgame?", "nph-chesspgn?text=1&");
}

function getHref(node) {
    return node.href;
}

function pushLinkToAllPgnLinks(link) {
    allPgnLinks.push(link);
}

function isFilledArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
}

function printRuntime() {
    const runTime = (Date.now() - startTime)/1000;
    console.log(`runtime: ${runTime}s`);
}

function harvestPgnLinks(playerId, callback) {

    function finalizePgnArray() {
        const finalPgnLink = allPgnLinks.sort();
        const checkValue = _.union([], finalPgnLink);
        console.log(`array length ${finalPgnLink.length}`);
        console.log(`array length ${checkValue.length}`);

        printRuntime();

        callback(checkValue);
    }

    function urlGenerator(playerId) {
        let page = 0;
    
        return function () {
            page += 1;
            const returnUrl = `${baseUrl}/perl/chess.pl?page=${page}&pid=${playerId}`;

            console.log(`page: ${page} \t url: ${returnUrl}`);

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
                console.log("No games found on that page. Crawl ends");
                return finalizePgnArray();
            }

            const pgnLinks = allGameLinks.map(gameLinkToPgnLink);
            pgnLinks.forEach(pushLinkToAllPgnLinks);

            harvestNextPage();
        });
    }    

    harvestNextPage();
}

exports.harvestPgnLinks = harvestPgnLinks;
