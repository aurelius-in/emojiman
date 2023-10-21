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

function spawnEnemy() {
  if (spawnedEnemies >= 6) return;  // Stop spawning after 6 enemies

  const spawnX = 7 * cellSize + cellSize / 2;
  const spawnY = spawnToggle ? 5 * cellSize + cellSize / 2 : 19 * cellSize + cellSize / 2;
  const initialDirection = spawnToggle ? 'up' : 'down'; // Set initial direction based on womb room

  let emojiIndex;
  if (spawnToggle) {
    emojiIndex = [0, 1, 5][spawnedEnemies % 3];
  } else {
    emojiIndex = [2, 3, 4][spawnedEnemies % 3];
  }
  const enemy = {
  x: spawnX,
  y: spawnY,
  speed: 1 + Math.random(),
  emoji: enemyEmojis[emojiIndex],
  maxSpeed: 2 + Math.random(),
  state: 'center',
  lastMove: Date.now(),
  direction: initialDirection, // Use the initial direction
  hasLeftSpawn: false,  // Missing comma added here
  spawnX: spawnX,
  spawnY: spawnY,
  isInSpawn: true  // New flag
};


  enemies.push(enemy);
  spawnedEnemies++;
  spawnToggle = !spawnToggle;
}

function enemyBehavior(enemy) {
  const currentTime = Date.now();

  if (!enemy.smarterTime) {
    const emojiIndex = enemyEmojis.indexOf(enemy.emoji);
    enemy.smarterTime = currentTime + (emojiIndex + 1 + 3) * 1000; // 1-based index + 3 seconds, converted to milliseconds
  }

  if (currentTime - enemy.lastMove < 500) return;

  if (enemy.lastX === enemy.x && enemy.lastY === enemy.y && currentTime - enemy.lastMove > 1000) {
    const possibleDirections = ['left', 'right'].filter(dir => {
      let testX = enemy.x, testY = enemy.y;
      if (dir === 'left') testX -= cellSize;
      if (dir === 'right') testX += cellSize;
      const testGridX = Math.floor(testX / cellSize);
      const testGridY = Math.floor(testY / cellSize);
      return maze[testGridY][testGridX] !== '1';
    });
    enemy.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  }

  let nextX = enemy.x;
  let nextY = enemy.y;

  if (enemy.direction === 'up') nextY -= cellSize;
  if (enemy.direction === 'down') nextY += cellSize;
  if (enemy.direction === 'left') nextX -= cellSize;
  if (enemy.direction === 'right') nextX += cellSize;

  const nextGridX = Math.floor(nextX / cellSize);
  const nextGridY = Math.floor(nextY / cellSize);

  if (!enemy.hasLeftSpawn && maze[nextGridY][nextGridX] === '2') {
    enemy.direction = enemy.y < canvas.height / 2 ? 'up' : 'down';
  }

  if (enemy.hasLeftSpawn && maze[nextGridY][nextGridX] === '2') {
    return;
  }

  if (maze[nextGridY][nextGridX] !== '1' || currentTime > enemy.smarterTime) {
    enemy.x = nextX;
    enemy.y = nextY;
    enemy.lastMove = currentTime;
    enemy.hasLeftSpawn = true;
  }

  let dx = pacmanX - enemy.x;
  let dy = pacmanY - enemy.y;
  let randomFactor = currentTime < enemy.smarterTime ? Math.random() < 0.2 : Math.random() < 0.1;

  const possibleDirections = ['up', 'down', 'left', 'right'].filter(dir => {
    let testX = enemy.x, testY = enemy.y;
    if (dir === 'up') testY -= cellSize;
    if (dir === 'down') testY += cellSize;
    if (dir === 'left') testX -= cellSize;
    if (dir === 'right') testX += cellSize;
    const testGridX = Math.floor(testX / cellSize);
    const testGridY = Math.floor(testY / cellSize);
    return maze[testGridY][testGridX] !== '1';
  });

  if (currentTime > enemy.smarterTime || randomFactor || possibleDirections.length === 0) {
    if (Math.abs(dx) > Math.abs(dy)) {
      enemy.direction = dx > 0 ? 'right' : 'left';
    } else {
      enemy.direction = dy > 0 ? 'down' : 'up';
    }
    if (!possibleDirections.includes(enemy.direction)) {
      enemy.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    }
  }

  enemy.lastX = enemy.x;
  enemy.lastY = enemy.y;
}

function drawEnemy(enemy) {
    ctx.font = `${pacmanRadius * 2.3}px Arial`;
    ctx.fillText(enemy.emoji, enemy.x - pacmanRadius, enemy.y + pacmanRadius);
  }

  setInterval(spawnEnemy, 3000);

  canvas.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? 'right' : 'left';
    } else {
      direction = dy > 0 ? 'down' : 'up';
    }
  });

function checkCollision(x, y, radius, isEnemy = false) {
    const corners = [
      { x: x - radius, y: y - radius },
      { x: x + radius, y: y - radius },
      { x: x - radius, y: y + radius },
      { x: x + radius, y: y + radius }
    ];

    return corners.some(corner => {
      const gridX = Math.floor(corner.x / cellSize);
      const gridY = Math.floor(corner.y / cellSize);
      return maze[gridY][gridX] === '1' || (maze[gridY][gridX] === '2' && !isEnemy);
    });
  }

  function drawMaze() {
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        const cell = maze[y][x];
        const xPos = x * cellSize;
        const yPos = y * cellSize;
        if (cell === '1') {
          ctx.fillStyle = '#0000FF';
          ctx.fillRect(xPos, yPos, cellSize, cellSize);
        } else if (cell === '2') {
          ctx.fillStyle = '#808080';
          ctx.fillRect(xPos, yPos, cellSize, cellSize);
        } else if (cell === '3') {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(xPos + cellSize / 2, yPos + cellSize / 2, 5.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (cell === '4') {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(xPos + cellSize / 2, yPos + cellSize / 2, 11, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Center Pac-Man when turning
  function centerPacmanOnGrid() {
    const gridX = Math.floor(pacmanX / cellSize);
    const gridY = Math.floor(pacmanY / cellSize);

    pacmanX = (gridX * cellSize) + cellSize / 2;
    pacmanY = (gridY * cellSize) + cellSize / 2;
  }

function checkCherryCollision() {
  if (cherry) {
    const dx = pacmanX - cherry.x;
    const dy = pacmanY - cherry.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < pacmanRadius * 2) {
      score += 1000;
      scoreElement.textContent = 'Score: ' + score;
      cherry = null;
    }
  }
}

function drawCherry() {
  if (cherry) {
    ctx.font = `${pacmanRadius * 2.3}px Arial`;
    ctx.fillText('🍒', cherry.x - pacmanRadius, cherry.y + pacmanRadius);
  }
}
  
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMaze();

if (isPowerMode) {
    ctx.fillStyle = colors[colorIndex];
    enemies.forEach((enemy, index) => {
      drawEmojiPower(ctx, enemy, index);
      emojiPowerBehavior(enemy);
    });
    checkEnemyCollision();
  } else {
    ctx.fillStyle = '#FFFF00';
    enemies.forEach(enemy => {
      drawEnemy(enemy);
      enemyBehavior(enemy);
    });
  }

  if (direction === 'up') angle = -Math.PI / 2;
  if (direction === 'down') angle = Math.PI / 2;
  if (direction === 'left') angle = Math.PI;
  if (direction === 'right') angle = 0;

  ctx.fillStyle = '#FFFF00';
  ctx.beginPath();
  ctx.moveTo(pacmanX, pacmanY);
  ctx.arc(pacmanX, pacmanY, pacmanRadius, angle + mouthAngle, angle + Math.PI * 2 - mouthAngle);
  ctx.lineTo(pacmanX, pacmanY);
  ctx.fill();

  let nextX = pacmanX;
  let nextY = pacmanY;

  if (direction === 'up') nextY -= pacmanSpeed;
  if (direction === 'down') nextY += pacmanSpeed;
  if (direction === 'left') nextX -= pacmanSpeed;
  if (direction === 'right') nextX += pacmanSpeed;

  // Logic to make Pac-Man reappear on the opposite side
  const middleRowY = 12 * cellSize + (cellSize / 2); // Middle row Y-coordinate
  if (Math.abs(pacmanY - middleRowY) < 1) {
    if (nextX < 0) {
      nextX = canvas.width;
    } else if (nextX > canvas.width) {
      nextX = 0;
    }
  }

  if (!checkCollision(nextX, nextY, pacmanRadius)) {
    pacmanX = nextX;
    pacmanY = nextY;
  } else {
    centerPacmanOnGrid();
  }

  mouthAngle += mouthSpeed;
  if (mouthAngle > Math.PI / 4 || mouthAngle < 0) {
    mouthSpeed = -mouthSpeed;
  }
  
  checkPelletCollision();
  requestAnimationFrame(gameLoop);
  drawCherry();
  checkCherryCollision();
}
