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
<<<<<<< HEAD
  "   I         I         I         I         I  ",
  "   I         I        BI         I         I  ",
  "   A         A         A         A         A  ",
=======
  "   I         I        BI         I         I  ",
  "tttAtttttttttAtttttttttAtttttttttAtttttttttAtt",
>>>>>>> 723de827a7d569ff15a740896b3eef0db329b25f
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
<<<<<<< HEAD
        depth: 1.5}
=======
        depth: 4}
>>>>>>> 723de827a7d569ff15a740896b3eef0db329b25f
});

module.exports = junctionLamps;
