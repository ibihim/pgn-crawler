"use strict";

const common = require("../../../lib/common");
const expect = require("chai").expect;

describe("common", function () {
    it("one time true", function () {
        let oneTimeTrue = common.oneTimeTrue();

        expect(oneTimeTrue()).to.be.true;
        expect(oneTimeTrue()).to.be.false;
        expect(oneTimeTrue()).to.be.false;
    });

    it("is filled array", function () {
        let arr0 = undefined;
        let arr1 = [];
        let arr2 = [1, 2, 3];

        expect(common.isFilledArray(arr0)).to.be.false;
        expect(common.isFilledArray(arr1)).to.be.false;
        expect(common.isFilledArray(arr2)).to.be.true;
    });

    it("send request", function (done) {
        common.sendRequest("/perl/nph-chesspgn?text=1&gid=1011478", function (source) {
            expect(source).to.contain("Garry Kasparov");
            expect(source).to.contain("Veselin Topalov");
            done();
        });
    }); 
});
