"use strict";

const expect = require("chai").expect;
const harvestPgnGames = require("../../../../lib/pgn/harvest-pgn-games");
const baseUrl = require("../../../../lib/url").baseUrl;

describe("harvest pgn games", function () {
    it("should return pgns of given links", function (done) {
        const links = [
            `${baseUrl}/perl/nph-chesspgn?text=1&gid=1228607`,
            `${baseUrl}/perl/nph-chesspgn?text=1&gid=1538494`,
            `${baseUrl}/perl/nph-chesspgn?text=1&gid=1250709`
        ];
        const pgnObjects = [{
            id        : "1228607",
            event     : "Berlin",
            site      : "Berlin",
            date      : "1918.??.??",
            eventdate : "?",
            round     : "?",
            result    : "0-1",
            white     : "Kipke",
            black     : "Kurt Paul Otto Joseph Richter",
            eco       : "C26",
            whiteelo  : "?",
            blackelo  : "?",
            plycount  : "46",
            moves     : "1.e4 e5 2.Nc3 Nf6 3.g3 Nc6 4.Bg2 Bc5 5.Nge2 b6 6.d3 Ng4 7.O-O " +
                        "Qf6 8.Nd5 Bxf2+ 9.Kh1 Qd6 10.Nec3 h5 11.Nb5 Qg6 12.Nbxc7+ Kd8 " +
                        "13.Nxa8 h4 14.Bh3 hxg3 15.Kg2 d6 16.hxg3 Rxh3 17.Rxf2 Nxf2 " +
                        "18.Qf3 Nh1 19.Bg5+ Qxg5 20.Rxh1 Qd2+ 21.Kf1 Nd4 22.Qg2 Rxh1+ " +
                        "23.Qxh1 Qe2+ 0-1"
        },
        {
            id        : "1538494",
            event     : "casual",
            site      : "Berlin",
            date      : "1934.??.??",
            eventdate : "?",
            round     : "?",
            result    : "1-0",
            white     : "Kurt Paul Otto Joseph Richter",
            black     : "Kipke",
            eco       : "C13",
            whiteelo  : "?",
            blackelo  : "?",
            plycount  : "55",
            moves     : "1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. Bxf6 Bxf6 6. e5 Be7 " +
                        "7. Qg4 O-O 8. Bd3 f5 9. Qh3 c5 10. dxc5 Nc6 11. f4 Bxc5 " +
                        "12. Nge2 a6 13. O-O-O b5 14. g4 b4 15. gxf5 exf5 16. Na4 Qa5 " +
                        "17. Nxc5 Qxc5 18. Rhg1 Kh8 19. Ng3 Nd4 20. Kb1 a5 21. Nh5 Ra7 " +
                        "22. Rg6 a4 23. Rdg1 b3 24. Rxg7 bxc2+ 25. Kc1 Nb3+ 26. axb3 " +
                        "axb3 27. Ba6 Bxa6 28. Qg3 1-0"
        },
        {
            id        : "1250709",
            event     : "Berlin op",
            site      : "Berlin op",
            date      : "1933.??.??",
            eventdate : "?",
            round     : "?",
            result    : "0-1",
            white     : "Roessner",
            black     : "Kipke",
            eco       : "A51",
            whiteelo  : "?",
            blackelo  : "?",
            plycount  : "22",
            moves     : "1. d4 Nf6 2. c4 e5 3. dxe5 Ne4 4. Qc2 d5 5. exd6 Bf5 6. dxc7 " +
                        "Qxc7 7. Qb3 Nc6 8. Nf3 O-O-O 9. e3 Nc5 10. Qa3 Nb4 11. Qxa7 " +
                        "Nc2+ 0-1"
        }];

        harvestPgnGames.harvestPgnGames(links, function (err, pgns) {
            if (err) {
                done(err);
            }

            expect(pgns).to.deep.equal(pgnObjects);
            done();
        });
    }); 
});