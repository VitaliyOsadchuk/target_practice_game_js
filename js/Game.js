import { CONFIG } from "./Config.js";
import { Target } from "./Target.js";

class Game {
  constructor() {
    const params = new URLSearchParams(window.location.search);
    this.mode = params.get("mode") || "classic";
    this.settings = CONFIG.MODES[this.mode];

    this.score = 0;
    this.lives = this.settings.initialLives;
    this.isGameOver = false;
    this.activeTargets = [];
    this.gameStartTime = Date.now();
    this.lastLoggedSpeed = 0;

    this.canvas = document.getElementById("game-canvas");
    this.scoreEl = document.getElementById("current-score");
    this.livesEl = document.getElementById("lives-count");
    this.timerEl = document.getElementById("game-timer");

    this.init();
  }

  init() {
    this.updateUI();
    this.updateClock(); 
    this.startTimers();
    this.spawnBatch();

    if (this.settings.isMoving) {
      this.animate();
    }
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    if (e.key === "Escape" && !this.isGameOver) {
      this.endGame();
    }
  }

  startTimers() {
    this.spawnInterval = setInterval(() => {
      if (!this.isGameOver) this.spawnBatch();
    }, this.settings.spawnInterval);

    this.gameTimer = setInterval(() => {
      if (!this.isGameOver) this.updateClock();
    }, 1000);
  }

  // +1 ціль за кожні x очок (макс. 10 цілей на полі)
  getCurrentSpawnCount() {
    const extraCircles = Math.floor(this.score / 300);
    return Math.min(this.settings.circlesPerSpawn + extraCircles, 10);
  }

  spawnBatch() {
    const count = this.getCurrentSpawnCount();
    for (let i = 0; i < count; i++) {
      this.createValidTarget();
    }
  }

  // -10px за кожні x очок (мін. 50px)
  getCurrentTargetSize() {
    const reduction =
      Math.floor(this.score / CONFIG.circle.pointsPerStep) *
      CONFIG.circle.sizeStep;
    return Math.max(
      CONFIG.circle.initialSize - reduction,
      CONFIG.circle.minSize
    );
  }

  createValidTarget() {
    const type = this.getRandomType();
    const currentSize = this.getCurrentTargetSize();
    const moveSpeed = this.getCurrentMoveSpeed();
    let coords = this.getRandomCoords(currentSize);
    let attempts = 0;

    while (
      this.checkOverlap(coords.x, coords.y, currentSize) &&
      attempts < 10
    ) {
      coords = this.getRandomCoords(currentSize);
      attempts++;
    }

    const target = new Target(
      type,
      coords.x,
      coords.y,
      currentSize,
      (t) => this.handleHit(t),
      (t) => this.handleExpire(t),
      moveSpeed
    );

    this.activeTargets.push(target);
    this.canvas.appendChild(target.element);
  }

  getRandomCoords(size) {
    const width = this.canvas.offsetWidth || window.innerWidth;
    const height = this.canvas.offsetHeight || window.innerHeight - 80;
    return {
      x: Math.random() * (width - size),
      y: Math.random() * (height - size),
    };
  }

  checkOverlap(x, y, size) {
    return this.activeTargets.some((target) => {
      const centerX1 = target.x + target.size / 2;
      const centerY1 = target.y + target.size / 2;
      const centerX2 = x + size / 2;
      const centerY2 = y + size / 2;
      const dx = centerX1 - centerX2;
      const dy = centerY1 - centerY2;
      return Math.sqrt(dx * dx + dy * dy) < target.size / 2 + size / 2;
    });
  }

  handleHit(target) {
    if (this.isGameOver) return;

    // заборона на відємний рахунок
    this.score = Math.max(0, this.score + target.type.hitScore);

    if (target.type.id === "green") {
      if (this.mode === "timer") {
        this.score = Math.max(0, this.score - 50);
      } else {
        this.lives -= 1;
      }
    }

    this.activeTargets = this.activeTargets.filter((t) => t !== target);
    this.updateUI();
    this.checkGameState();
  }

  handleExpire(target) {
    if (this.isGameOver) return;

    if (target.type.id === "red" || target.type.id === "yellow") {
      this.lives -= 1;
    } else {
      this.score = Math.max(0, this.score + target.type.missBonusScore);
    }

    this.activeTargets = this.activeTargets.filter((t) => t !== target);
    this.updateUI();
    this.checkGameState();
  }

  updateUI() {
    this.scoreEl.textContent = this.score;
    if (this.lives === Infinity) {
      this.livesEl.textContent = "∞";
    } else {
      this.livesEl.textContent = `${Math.max(0, this.lives)}x`;
    }
  }

  updateClock() {
    const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
    let displaySeconds = elapsed;

    if (this.settings.timerDirection === "down") {
      displaySeconds = Math.max(0, this.settings.gameDuration - elapsed);
    }

    const mins = Math.floor(displaySeconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (displaySeconds % 60).toString().padStart(2, "0");
    this.timerEl.textContent = `${mins}:${secs}`;

    if (
      this.settings.timerDirection === "down" &&
      displaySeconds === 0 &&
      !this.isGameOver
    ) {
      this.endGame();
    }
  }

  checkGameState() {
    if (
      this.settings.winCondition === "lives" &&
      this.lives <= 0 &&
      !this.isGameOver
    ) {
      this.endGame();
    }
  }

  endGame() {
    this.isGameOver = true;
    clearInterval(this.spawnInterval);
    clearInterval(this.gameTimer);

    this.activeTargets.forEach((target) => {
      if (target.element?.parentNode) target.element.remove();
    });
    this.activeTargets = [];

    document.getElementById("res-score").textContent = this.score;
    document.getElementById("res-mode").textContent = this.settings.name;
    document.getElementById("res-time").textContent = this.timerEl.textContent;
    document.getElementById("game-over-screen").classList.remove("hidden");

    const key = `bestScore_${this.mode}`;
    if (this.score > (localStorage.getItem(key) || 0)) {
      localStorage.setItem(key, this.score);
    }
  }

  getRandomType() {
    const rand = Math.random();
    let cumulativeProbability = 0;
    for (const key in CONFIG.targetTypes) {
      cumulativeProbability += CONFIG.targetTypes[key].chance;
      if (rand < cumulativeProbability) return CONFIG.targetTypes[key];
    }
  }

  // для рухомих цілей
  getCurrentMoveSpeed() {
    if (!this.settings.isMoving) return 0;

    const extraSpeed = Math.floor(
      this.score / this.settings.pointsPerSpeedStep
    );

    // Поточна швидкість
    const newSpeed = Math.min(
      this.settings.initialMoveSpeed + extraSpeed,
      this.settings.maxMoveSpeed
    );

    // Вивід в консоль швидкості при зміні
    if (newSpeed !== this.lastLoggedSpeed) {
      console.log(`Поточна швидкість змінена на: ${newSpeed}`);
      this.lastLoggedSpeed = newSpeed;
    }

    return newSpeed;
  }

  animate() {
    if (this.isGameOver) return;

    const width = this.canvas.offsetWidth;
    const height = this.canvas.offsetHeight;

    this.activeTargets.forEach((target) => {
      target.update(width, height);
    });

    requestAnimationFrame(() => this.animate());
  }
}

new Game();
