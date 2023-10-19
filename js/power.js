let powerModeInterval;
let colorIndex = 0;
export const colors = ['red', 'yellow', 'blue', 'white'];
export const emojiPoints = {'\ud83d\udc80': 100, '\ud83d\udc79': 200, '\ud83d\udc7b': 300, '\ud83d\udc7d': 150, '\ud83e\uddd4\u200d\u2640\ufe0f': 250, '\ud83d\udca9': 100};

export function pacmanPower() {
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
} // Missing closing brace added here

export function drawEmojiPower(ctx, enemy) {
  if (isPowerMode) {
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 500);
  }
  drawEnemy(ctx, enemy);
  ctx.globalAlpha = 1;
}

export function emojiPowerBehavior(enemy) {
  if (isPowerMode) {
    enemy.speed /= 2;
    let dx = pacmanX - enemy.x;
    let dy = pacmanY - enemy.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      enemy.direction = dx > 0 ? 'left' : 'right';
    } else {
      enemy.direction = dy > 0 ? 'up' : 'down';
    }
  } else {
    enemy.speed *= 2;
  }
}

export function checkEnemyCollision() {
  if (isPowerMode) {
    enemies.forEach((enemy, index) => {
      const dx = pacmanX - enemy.x;
      const dy = pacmanY - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < pacmanRadius * 2) {
        score += emojiPoints[enemy.emoji];
        enemies.splice(index, 1);
      }
    });
  }
}
