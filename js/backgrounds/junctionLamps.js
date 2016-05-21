var Background = require("../background.js");
var Sprite = require("../sprite.js");
var Util = require("../util/util.js");

var junctionLamps = new Background ([
  "                                              ",
  "                                              ",
  "                                              ",
  "  *         *         *         *         *   ",
  "   O         O         O         O         O  ",
  "   I         I         I         I         I  ",
  "   I         I        BI         I         I  ",
  "tttAtttttttttAtttttttttAtttttttttAtttttttttAtt",
  "                                              ",
  "                                              ",
  "                                              "
],
{
  "I": {sprite: new Sprite (48, 48, 0, ["tile/lamppost_stalk.gif"]),
        depth: 2},
  "A": {sprite: new Sprite (48, 48, 0, ["tile/lamppost_base.gif"]),
        depth: 2},
  "O": {sprite: new Sprite (48, 48, 0, ["tile/lamppost_head.gif"]),
        depth: 2},
  "t": {sprite: new Sprite (48, 48, 0, ["tile/blue_railing.gif"]),
        depth: 2},
  "*": {sprite: new Sprite (144, 144, 0, ["tile/lamppost_halo.gif"]),
        depth: 2},
  "B": {sprite: new Sprite (192, 96, 0, ["tile/sign_bjunction.gif"]),
        depth: 4}
});

module.exports = junctionLamps;
