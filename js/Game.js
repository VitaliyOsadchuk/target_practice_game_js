import { CONFIG } from './Config.js';
import { Target } from './Target.js';

class Game {
    constructor() {
        const params = new URLSearchParams(window.location.search);
        this.mode = params.get('mode') || 'classic';
        this.settings = CONFIG.MODES[this.mode];

        this.score = 0;
        this.lives = this.settings.initialLives;
        this.isGameOver = false;
        this.activeTargets = [];
        this.gameStartTime = Date.now();

        this.canvas = document.getElementById('game-canvas');
        this.scoreEl = document.getElementById('current-score');
        this.livesEl = document.getElementById('lives-count');
        this.timerEl = document.getElementById('game-timer');

        this.init();
    }

    init() {
        this.updateUI();
        this.startTimers();
        this.spawnBatch();
        
        // Додаємо слухач для клавіші Esc
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    // Обробка натискання клавіш
    handleKeyDown(e) {
        if (e.key === 'Escape' && !this.isGameOver) {
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

    getCurrentSpawnCount() {
        const extraCircles = Math.floor(this.score / 300);
        const count = this.settings.circlesPerSpawn + extraCircles;
        return Math.min(count, 10);
    }

    spawnBatch() {
        const count = this.getCurrentSpawnCount();
        for (let i = 0; i < count; i++) {
            this.createValidTarget();
        }
    }

    getCurrentTargetSize() {
        const reduction = Math.floor(this.score / CONFIG.circle.pointsPerStep) * CONFIG.circle.sizeStep;
        const newSize = CONFIG.circle.initialSize - reduction;
        return Math.max(newSize, CONFIG.circle.minSize);
    }

    createValidTarget() {
        const type = this.getRandomType();
        const currentSize = this.getCurrentTargetSize();
        let coords = this.getRandomCoords(currentSize);
        let attempts = 0;

        while (this.checkOverlap(coords.x, coords.y, currentSize) && attempts < 10) {
            coords = this.getRandomCoords(currentSize);
            attempts++;
        }

        const target = new Target(
            type, 
            coords.x, 
            coords.y, 
            currentSize, 
            (t) => this.handleHit(t), 
            (t) => this.handleExpire(t)
        );

        this.activeTargets.push(target);
        this.canvas.appendChild(target.element);
    }

    getRandomType() {
        const rand = Math.random();
        let cumulativeProbability = 0;
        for (const key in CONFIG.targetTypes) {
            cumulativeProbability += CONFIG.targetTypes[key].chance;
            if (rand < cumulativeProbability) return CONFIG.targetTypes[key];
        }
    }

    getRandomCoords(size) {
        const width = this.canvas.offsetWidth || window.innerWidth;
        const height = this.canvas.offsetHeight || (window.innerHeight - 80);

        return {
            x: Math.random() * (width - size),
            y: Math.random() * (height - size)
        };
    }

    checkOverlap(x, y, size) {
        return this.activeTargets.some(target => {
            const centerX1 = target.x + target.size / 2;
            const centerY1 = target.y + target.size / 2;
            const centerX2 = x + size / 2;
            const centerY2 = y + size / 2;

            const dx = centerX1 - centerX2;
            const dy = centerY1 - centerY2;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            return distance < (target.size / 2 + size / 2);
        });
    }

    handleHit(target) {
        if (this.isGameOver) return;
        this.score += target.type.hitScore;
        
        if (target.type.id === 'green') {
            this.lives -= 1; 
        }
        
        this.activeTargets = this.activeTargets.filter(t => t !== target);
        this.updateUI();
        this.checkGameState();
    }

    handleExpire(target) {
        if (this.isGameOver) return;
        if (target.type.id === 'red' || target.type.id === 'yellow') {
            this.lives -= 1;
        } else {
            this.score += target.type.missBonusScore; // Бонуси за сині та зелені
        }

        this.activeTargets = this.activeTargets.filter(t => t !== target);
        this.updateUI();
        this.checkGameState();
    }

    updateUI() {
        this.scoreEl.textContent = this.score;
        const displayLives = Math.max(0, this.lives);
        this.livesEl.textContent = this.lives !== Infinity ? `${displayLives}x` : '∞';
    }

    updateClock() {
        const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const secs = (elapsed % 60).toString().padStart(2, '0');
        this.timerEl.textContent = `${mins}:${secs}`;
    }

    checkGameState() {
        if (this.lives <= 0 && !this.isGameOver) {
            this.endGame();
        }
    }

    endGame() {
        this.isGameOver = true;
        clearInterval(this.spawnInterval);
        clearInterval(this.gameTimer);
        
        this.activeTargets.forEach(target => {
            if (target.element && target.element.parentNode) {
                target.element.remove();
            }
        });
        this.activeTargets = [];

        document.getElementById('res-score').textContent = this.score;
        document.getElementById('res-mode').textContent = this.settings.name;
        document.getElementById('res-time').textContent = this.timerEl.textContent;
        document.getElementById('game-over-screen').classList.remove('hidden');
        
        const key = `bestScore_${this.mode}`;
        const currentBest = localStorage.getItem(key) || 0;
        if (this.score > currentBest) localStorage.setItem(key, this.score);
    }
}

new Game();