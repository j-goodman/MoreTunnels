var Background = require("../background.js");
var Sprite = require("../sprite.js");

var subwayPlatform = new Background ([
  "========================================================",
  "========================================================",
  "========================================================",
  "FFFL FFFFL FFFFL FFFFL FFFFFFL FFFFL FFFFL FFFFL FFFFFFF",
  "----I-----I-----I-----I-------I-----I-----I-----I-------",
  "====I=====I=====I=====I=======I=====I=====I=====I=======",
  "----I-----I-----I-----I-------I-----I-----I-----I-------",
  "----I-----I-----I-----I-------I-----I-----I-----I-------",
  "                         ----                           ",
  "                         ====                           ",
  "                         ====                           "
],
{
  "I": new Sprite (48, 48, 0, ["tile/pillar_middle.gif"]),
  "F": [new Sprite (48, 48, 0, ["tile/brick_light.gif"]), new Sprite (48, 48, 0, ["tile/girder_top.gif"])],
  "L": [new Sprite (48, 48, 0, ["tile/brick_light.gif"]), new Sprite (144, 48, 0, ["tile/pillar_head.gif"])],
  "-": new Sprite (48, 48, 0, ["tile/brick_light.gif"]),
  "=": new Sprite (48, 48, 0, ["tile/brick_dark.gif"])
});

module.exports = subwayPlatform;
