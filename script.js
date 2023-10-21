let powerModeInterval;
let colorIndex = 0;
const colors = ['red', 'yellow', 'blue', 'white'];
const emojiPoints = {'\ud83d\udc80': 100, '\ud83d\udc79': 200, '\ud83d\udc7b': 300, '\ud83d\udc7d': 150, '\ud83e\uddd4\u200d\u2640\ufe0f': 250, '\ud83d\udca9': 100};
let cherry = null;

  // Set a timer to spawn the cherry after 45 seconds
setTimeout(() => {
  cherry = {
    x: 7 * cellSize + (cellSize / 2),
    y: 12 * cellSize + (cellSize / 2)
  };
}, 45000);
  
function pacmanPower() {
  isPowerMode = true;
  clearInterval(powerModeInterval);
  powerModeInterval = setInterval(() => {
    colorIndex = (colorIndex + 1) % colors.length;
  }, 500);

  setTimeout(() => {
    isPowerMode = false;
    clearInterval(powerModeInterval);
    enemies.forEach(enemy => {
      enemy.speed *= 2;
    });
  }, 15000);
} 

function drawEmojiPower(ctx, enemy, index) {
  if (isPowerMode) {
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 500);
    ctx.font = `${pacmanRadius * 2.3}px Arial`;
    ctx.fillText(powerEmojis[index], enemy.x - pacmanRadius, enemy.y + pacmanRadius);
  } else {
    drawEnemy(ctx, enemy);
  }
  ctx.globalAlpha = 1;
}

function emojiPowerBehavior(enemy) {
  if (isPowerMode) {
    enemy.speed /= 2;
    let dx = enemy.spawnX - enemy.x;
    let dy = enemy.spawnY - enemy.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      enemy.direction = dx > 0 ? 'right' : 'left';
    } else {
      enemy.direction = dy > 0 ? 'down' : 'up';
    }
    enemy.isInSpawn = true;
  } else {
    enemy.speed *= 2;
    if (enemy.isInSpawn) {
      // Logic to make them leave the spawn area
      let dx = pacmanX - enemy.x;
      let dy = pacmanY - enemy.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        enemy.direction = dx > 0 ? 'right' : 'left';
      } else {
        enemy.direction = dy > 0 ? 'down' : 'up';
      }
      enemy.isInSpawn = false;  // Reset the flag
    }
  }
}
