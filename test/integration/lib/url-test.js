"use strict";

const expect = require("chai").expect;
const baseUrl = require("../../../lib/url").baseUrl;

describe("url", function () {
    it("should contain chess, game and com", function () {
        const tokens = ["chess", "game", "com"];

        tokens.forEach(function (token) {
            expect(baseUrl).to.contain(token);
        });
    });
});