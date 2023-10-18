let powerModeInterval;
let colorIndex = 0;
const colors = ['red', 'yellow', 'blue', 'white'];

function pacmanPower() {
  isPowerMode = true;
  clearInterval(powerModeInterval);
  powerModeInterval = setInterval(() => {
    colorIndex = (colorIndex + 1) % colors.length;
  }, 500);

  setTimeout(() => {
    isPowerMode = false;
    clearInterval(powerModeInterval);
  }, 10000); // Power mode lasts for 10 seconds
}

function drawEmojiPower(ctx, enemy) {
  if (isPowerMode) {
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 500);
  }
  drawEnemy(ctx, enemy);
  ctx.globalAlpha = 1;
}

function emojiPowerBehavior(enemy) {
  if (isPowerMode) {
    enemy.speed /= 2;
    // Logic to move enemy towards spawn point and through the grey square
  } else {
    enemy.speed *= 2;
  }
}
