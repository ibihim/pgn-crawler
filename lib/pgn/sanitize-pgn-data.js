"use strict";

const _ = require("lodash");
const newLineRegex = /\n/g;
const bracketRegex = /\[(.+)\]/g;
const bracketsAndSlashesRegex = /\[|\]|\"/g;
const attributeTagsConst = {
    EVENT: "Event",
    SITE: "Site",
    DATE: "Date",
    EVENT_DATE: "EventDate",
    ROUND: "Round",
    RESULT: "Result",
    WHITE: "White",
    BLACK: "Black",
    ECO: "ECO",
    WHITE_ELO: "WhiteElo",
    BLACK_ELO: "BlackElo",
    PLY_COUNT: "PlyCount",
    MOVES: "Moves"
};

function getValueFor(attributeTag) {
    return function (value) {
        return value.indexOf(attributeTag) !== -1;
    };
}

function convertPgnStringToPgnObj(pgnString) {

    function findPgnAttributeByTagAndGetValue(attributeTag) {
        let pgnAttribute = _.find(pgnAttributes, getValueFor(attributeTag));

        if (pgnAttribute) {
            pgnString = pgnString.replace(pgnAttribute, "");
            
            const cleanedAttributeValue = pgnAttribute.replace(attributeTag, "")
                                                      .replace(bracketsAndSlashesRegex, "")
                                                      .trim();
            pgn[attributeTag.toLowerCase()] = cleanedAttributeValue;

            return;
        }

        pgn.moves = pgnString.trim()
                             .replace(newLineRegex, " ");
    }

    let pgn = {};        

    const pgnAttributes = pgnString.match(bracketRegex);

    Object.keys(attributeTagsConst).forEach(function (attributeTagKey) {
        const attributeTag = attributeTagsConst[attributeTagKey];

        findPgnAttributeByTagAndGetValue(attributeTag);
    });

    return pgn;
}

exports.convertPgnStringToPgnObj = convertPgnStringToPgnObj;
