"use strict";

const expect = require("chai").expect;
const zombie = require("../../../lib/zombie");
const baseUrl = "https://www.google.com";

describe("zombie", function () {
    it("should have google links", function (done) {
        zombie.browser(baseUrl, function (err, browser) {

            if (err) {
                done(err);
            }

            const links = browser.queryAll("a")
                                 .map(zombie.getHref);

            expect(links).to.have.length.above(0);
            links.forEach(function (link) {
                expect(link).to.contain("http");
                expect(link).to.contain("google");
            });

            done();
        });
    });

    it("should have google source code", function (done) {
        zombie.browser(baseUrl, function (err, browser) {

            if (err) {
                done(err);
            }
            
            const googleTitle = "<title>Google</title>"
            const buttonName = 'name="q"'
            const sourceCode = browser.html();

            expect(sourceCode).to.contain(googleTitle);
            expect(sourceCode).to.contain(buttonName);

            done();
        });
    });
});