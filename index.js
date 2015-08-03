"use strict";

const url = require("./lib/url").url;
const Browser = require("zombie");

const playerId = "82276";
const getUrl = urlGenerator(playerId);

function chessGameLinkFilter(link) {
    return link.indexOf("chessgame?gid=") !== -1;
}

function gameLinkToPgnLink(link) {
    return link.replace("chessgame?", "nph-chesspgn?text=1&");
}

function getHref(node) {
    return node.href;
}

function urlGenerator(playerId) {
    let page = 0;
    
    return function () {
        page += 1;
        //const returnUrl = `${url}/perl/chess.pl?page=${page}&pid=${playerId}`;
        const returnUrl = `${url}`;
        console.log(`${page}:\t${returnUrl}`);
    };
}

Browser.visit(getUrl(), function (err, browser) {
    const allLinks     = browser.queryAll("a").map(getHref);
    const allGameLinks = allLinks.filter(chessGameLinkFilter);

    console.log(allGameLinks);
});