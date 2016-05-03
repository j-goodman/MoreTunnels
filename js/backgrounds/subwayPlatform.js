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
  "--------------------------------------------------------",
  "========================================================",
  "========================================================"
],
{
  "I": {sprite: new Sprite (48, 48, 0, ["tile/pillar_middle.gif"]),
        depth: 3},
  "F": {sprite: new Sprite (48, 48, 0, ["tile/girder_top.gif"]),
        depth: 3},
  "L": {sprite: new Sprite (144, 48, 0, ["tile/pillar_head.gif"]),
        depth: 3},
  "-": {sprite: new Sprite (48, 48, 0, ["tile/brick_light.gif"]),
        depth: 3},
  "=": {sprite: new Sprite (48, 48, 0, ["tile/brick_dark.gif"]),
        depth: 3}
});

module.exports = subwayPlatform;
