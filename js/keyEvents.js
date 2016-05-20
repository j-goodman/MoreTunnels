var keyEvents = function (document, player) {
  document.onkeydown = function (e) {
    switch(e.keyCode) {
    case 68: // d
    case 39: //right
      if (player.checkUnderFeet() && !player.dead) {
        player.speed.x = player.stats.runSpeed;
      }
      player.facing = "right";
      break;
    case 65: // a
    case 37: //left
      if (player.checkUnderFeet() && !player.dead) {
        player.speed.x = 0-player.stats.runSpeed;
      }
      player.facing = "left";
      break;
    case 87: // w
    case 38: //up
      if (player.checkUnderFeet() && !player.dead) {
        player.upKey();
      }
      break;
    case 32: //spacebar
      player.throwHammer();
      break;
    }
  };

  document.onkeyup = function (e) {
    switch(e.keyCode) {
    case 68: // d
    case 39: //right
      if (player.speed.x > 0) { player.xRightStop(); }
      break;
    case 65: // a
    case 37: //left
      if (player.speed.x < 0) { player.xLeftStop(); }
      break;
    }
  };
};

module.exports = keyEvents;
