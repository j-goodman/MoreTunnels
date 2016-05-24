var Block = require("./objects/block.js");
var metaBlock = require("./objects/metaBlock.js");
var Player = require("./objects/player.js");
var Skeleton = require("./objects/skeleton.js");
var Madbomber = require("./objects/madbomber.js");
var Burningman = require("./objects/burningman.js");
var Shoggoth = require("./objects/shoggoth.js");
var Boneheap = require("./objects/boneheap.js");
var Pigeon = require("./objects/pigeon.js");
var Wizard = require("./objects/wizard.js");

var Zone = function (name, blueprint, metaBlueprint) {
  this.name = name;
  this.blueprint = blueprint;
  this.metaBlueprint = metaBlueprint;
};

// X Top of a platform
// Y Middle of a platform

Zone.prototype.build = function (blocks, movers, players, metaBlocks, callback) {
  this.blueprint.forEach(function (yLine, yIndex) {
    yLine.split("").forEach(function (square, xIndex) {
      if (square === "X") {
        blocks.push( new Block (xIndex*48, yIndex*48) );
      } else if (square === "Y") {
        blocks.push( new Block (xIndex*48, yIndex*48, "middle") );
      } else if (square === "F") {
        blocks.push( new Block (xIndex*48, yIndex*48, "bolted_hang") );
      } else if (square === "T") {
        blocks.push( new Block (xIndex*48, yIndex*48, "hanging") );
      } else if (square === "H") {
        movers.push( new Boneheap (movers.length, {x: xIndex*48, y: yIndex*48}) );
      } else if (square === "!") {
        movers.push( new Skeleton (movers.length, xIndex*48, yIndex*48) );
      } else if (square === "¡") {
        movers.push( new Burningman (movers.length, xIndex*48, yIndex*48) );
      } else if (square === "$") {
        movers.push( new Shoggoth (movers.length, xIndex*48, yIndex*48) );
      } else if (square === "*") {
        movers.push( new Pigeon (movers.length, xIndex*48, yIndex*48) );
      } else if (square === "%") {
        movers.push( new Madbomber (movers.length, xIndex*48, yIndex*48) );
      } else if (square === "1") {
        if (!players[0]) {
          players.push( new Player (movers.length, xIndex*48, yIndex*48) );
        } else {
          players[0].pos = {
            x: xIndex*48,
            y: yIndex*48
          };
        }
      }
    });
  });

  if (this.metaBlueprint) {
    this.metaBlueprint.forEach(function (yLine, yIndex) {
      yLine.split("").forEach(function (square, xIndex) {
        if (square === ">") {
          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["jumpRight"]) );
        } else if (square === "<") {
          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["jumpLeft"]) );
        } else if (square === "{") {
          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["switchJumpLeft"]) );
        } else if (square === "}") {
          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["switchJumpRight"]) );
        } else if (square === "]") {
          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["goRight"]) );
        } else if (square === "[") {
          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["goLeft"]) );
        } else if (square === "#") {
          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["horseGate"]) );
        } else if (square === "^") {
          metaBlocks.push( new metaBlock (metaBlocks.length, xIndex*48, yIndex*48, ["jumpRight", "jumpLeft"]));
        }
      });
    });
  }
  callback();
};
module.exports = Zone;
