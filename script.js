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


function pacmanDeath() {
  // Move Pac-Man to the center
  pacmanX = 7 * cellSize + (cellSize / 2);
  pacmanY = 12 * cellSize + (cellSize / 2);

  // Reset enemies to their spawn points
  enemies.forEach(enemy => {
    enemy.x = enemy.spawnX;
    enemy.y = enemy.spawnY;
  });

  // Decrease lives by 1
  const livesElement = document.getElementById('lives');
  const currentLives = Array.from(livesElement.textContent).filter(char => char === '😃').length;
  livesElement.textContent = '😃'.repeat(currentLives - 1);

  // Check if game is over
  if (currentLives - 1 === 0) {
    // End the game and show a game over message
    alert("Game Over!");
    location.reload(); // Reload the page to restart the game
  }
}
  
function checkEnemyCollision() {
  enemies.forEach((enemy, index) => {
    const dx = pacmanX - enemy.x;
    const dy = pacmanY - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < pacmanRadius * 2) {
      if (isPowerMode) {
        score += emojiPoints[enemy.emoji];
        enemies.splice(index, 1);
      } else {
        pacmanDeath(); // Call the pacmanDeath function here
      }
    }
  });
}
  
  let isPowerMode = false;
    const scoreElement = document.getElementById('score');
  let score = 0;

function updateScore(isPowerPellet = false) {
  score += isPowerPellet ? 100 : 1;
  scoreElement.textContent = 'Score: ' + score;
  if (isPowerPellet) {
    pacmanPower();
  }
}

function checkPelletCollision() {
  const gridX = Math.floor(pacmanX / cellSize);
  const gridY = Math.floor(pacmanY / cellSize);

  if (maze[gridY][gridX] === '4') {
    maze[gridY] = maze[gridY].substr(0, gridX) + '0' + maze[gridY].substr(gridX + 1);
    updateScore(true);
    pacmanPower();
  }
  if (maze[gridY][gridX] === '3') {
    maze[gridY] = maze[gridY].substr(0, gridX) + '0' + maze[gridY].substr(gridX + 1);
    updateScore(false);
  }
}

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const cellSize = 57.75;
  const mazeRows = 25;
  let pacmanRadius = 23.1;
  canvas.height = (mazeRows * cellSize) + 2 * pacmanRadius;
  let pacmanX = 7 * cellSize + (cellSize / 2);
  let pacmanY = 12 * cellSize + (cellSize / 2);
  let pacmanSpeed = 3.465;
  let angle = 0;
  let direction = 'right';
  let touchStartX = 0;
  let touchStartY = 0;
  let mouthSpeed = 0.055;
  let mouthAngle = 0;
  let enemySpeedIncrement = 0.001;

const maze = [
    '111111111111111',
    '143333333333341',
    '131113111311131',
    '131433333334131',
    '111311121113111',
    '133310000013331',
    '131311111113131',
    '131333333333131',
    '131113111311131',
    '133333333333331',
    '111311131113111',
    '133333333333331',
    '031111000111130',
    '133333333333331',
    '111311131113111',
    '133333333333331',
    '131113111311131',
    '131333333333131',
    '131311111113131',
    '133310000013331',
    '111311121113111',
    '131433333334131',
    '131113111311131',
    '143333333333341',
    '111111111111111'
  ];

  const enemyEmojis = ['💀', '👹', '👻', '👽', '🤖', '💩'];
  const powerEmojis = ['☠️', '🥺', '😱', '🤢', '🥶', '😵‍💫'];

  const enemies = [];
  let spawnToggle = true;

 let spawnedEnemies = 0;
