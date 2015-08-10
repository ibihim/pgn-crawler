"use strict";

/**
 * DUMP COPY PASTE FROM ANOTHER PROJECT OF MINE. NEED REWORK
 */

const _ = require("lodash");

function create(playerId) {

    function getValueFor(property) {
        return function (value) {
            return _.includes(value, property);
        };
    }

    function convertPgnStringToPgnObj(pgnString) {

        function findMatchingValueFor(property) {
            return _.find(regexResult, getValueFor(property));
        }

        function findCleanMatchinValueFor(property) {
            var result = findMatchingValueFor(property);

            if (result) {
                pgnString = pgnString.replace(result, "");

                return result
                    .replace(property, "")
                    .replace(/\[|\]|\"/g, "")
                    .trim();
            }
        }

        var pgn          = {};
        var bracketRegex = /\[(.+)\]/g;
        var regexResult  = pgnString.match(bracketRegex);

        pgn.pgnId     = findCleanMatchinValueFor("Id");
        pgn.event     = findCleanMatchinValueFor("Event");
        pgn.site      = findCleanMatchinValueFor("Site");
        pgn.date      = findCleanMatchinValueFor("Date");
        pgn.eventDate = findCleanMatchinValueFor("EventDate");
        pgn.round     = findCleanMatchinValueFor("Round");
        pgn.result    = findCleanMatchinValueFor("Result");
        pgn.white     = findCleanMatchinValueFor("White");
        pgn.black     = findCleanMatchinValueFor("Black");
        pgn.eco       = findCleanMatchinValueFor("ECO");
        pgn.whiteElo  = findCleanMatchinValueFor("WhiteElo");
        pgn.blackElo  = findCleanMatchinValueFor("BlackElo");
        pgn.plyCount  = findCleanMatchinValueFor("PlyCount");
        pgn.moves     = pgnString
            .trim()
            .replace(/\n/g, "");

        return pgn;
    }


    pgnData.forEach(function (pdnDataElement) {
        var idForPgnStrig = '[Id "' + pdnDataElement.pgnId + '"]\n';
        var pgn = convertPgnStringToPgnObj(idForPgnStrig + pdnDataElement.pgnData);
        storePgn(pgn);
    });
}
