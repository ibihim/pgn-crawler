# pgn-crawler

Crawls a major chess games page for games of a chess player by name.

```bash
$ npm install pgn-crawler
```

## Prerequisite

This module needs nodejs 4.* in order to run.

## Update Info
* Droped Zombiejs, as it was way to slow to handle streams.
* **Performance gain through stream are at least at 25%. Performance on Players with plenty of games like Magnus Carlsen have a performance gain of 38%.**

## Using pgn-crawler

### stream(playerName, writableStream, callback)
* `playerName {String}` - Expects a String that contains a chess player name. E.g. `Magnus Carlsen`
* `writableStream {Object}` - an Object that belongs to a class which inherits from stream.Writable. The chunks of data are Strings. You should use JSON.parse(chunk) upon it to use it as an object. (Will be fixed sometime soon ;-) Through2 was buggy in pushing objects).
* `callback {Function}` - Is executed on end event of the last streamed pgn game.

### getPgnsForPlayer(playerName, callback)
* `playerName {String}` - Expects a String that contains a chess player name. E.g. `Magnus Carlsen`
* `callback(err, pgns) {Function(Error, Array<Objects>)}` - Expects a callback that handles the error case and an array of PGN objects `function (err, arr) { arr.forEach(pgn -> console.log(pgn); }` (in case the arrow feature works in io.js finally).

### PGN object

A pgn object follows the pgn standard, except for the id. Which should be unique for every game.

```javascript
{
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
}
```

### Example Usage:
Example streams into terminal.

```javascript
const pgnCrawler = require("pgn-crawler");

pgnCrawler.stream("Magnus Carlsen", process.stdout);
```

Example using a writable.

```javascript
const pgnCrawler = require("pgn-crawler");

var pgns = [];

function onEnd() {
	console.log(pgns);
}

function createWritable() {
    const ws = Writable();        

    ws._write = function (chunk, enc, next) {
        winston.debug(`received chunk: ${chunk}`);

        if (typeof chunk !== "string") {
            chunk = chunk.toString();
        }
                
        const pgnObj = JSON.parse(chunk);
        pgns.push(pgnObj);
        next();
    };

    return ws;
}

pgnCrawler.stream("Magnus Carlsen", createWritable(), onEnd);
```
Callback behavior like in Version 1.0.

```javascript
const pgnCrawler = require("pgn-crawler");

pgnCrawler.getPgnsForPlayer("Magnus Carlsen", function (err, pgns) {
    if (err) { console.log("wtf"); }

    console.log(pgns);
});
```
The Array would look like that... more or **less**. Some players have thousands of games.

```javascript
[
	{
		event: "Anand-Carlsen World Championship",
		site: "Chennai IND",
		date: "2013.11.21",
		eventdate: "2013.11.07",
		round: "9",
		result: "0-1",
		white: "Viswanathan Anand",
		black: "Magnus Carlsen",
		eco: "E25",
		whitelo: "?",
		blackelo: "?",
		plycount: "56",
		moves: "1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.f3 d5 5.a3 Bxc3+ 6.bxc3 c5 7.cxd5 exd5 8.e3 c4 9.Ne2 Nc6 10.g4 O-O 11.Bg2 Na5 12.O-O Nb3 13.Ra2 b5 14.Ng3 a5 15.g5 Ne8 16.e4 Nxc1 17.Qxc1 Ra6 18.e5 Nc7 19.f4 b4 20.axb4 axb4 21.Rxa6 Nxa6 22.f5 b3 23.Qf4 Nc7 24.f6 g6 25.Qh4 Ne8 26.Qh6 b2 27.Rf4 b1=Q+ 28.Nf1 Qe1 0-1"
	},
	{
		...
	},
	...
]
```
