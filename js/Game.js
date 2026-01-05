import { CONFIG } from './Config.js';
import { Target } from './Target.js';

class Game {
    constructor() {
        // Визначаємо режим
        const params = new URLSearchParams(window.location.search);
        this.mode = params.get('mode') || 'classic';
        this.settings = CONFIG.MODES[this.mode];

        // Стан гри
        this.score = 0;
        this.lives = this.settings.initialLives;
        this.isGameOver = false;
        this.activeTargets = [];
        this.gameStartTime = Date.now();

        // DOM елементи
        this.canvas = document.getElementById('game-canvas');
        this.scoreEl = document.getElementById('current-score');
        this.livesEl = document.getElementById('lives-count');
        this.timerEl = document.getElementById('game-timer');

        this.init();
    }

    init() {
        this.updateUI();
        this.startTimers();
        this.spawnBatch(); // Перша хвиля
    }

    startTimers() {
        // Інтервал появи мішеней
        this.spawnInterval = setInterval(() => {
            if (!this.isGameOver) this.spawnBatch();
        }, this.settings.spawnInterval);

        // Ігровий таймер (секундомір)
        this.gameTimer = setInterval(() => {
            if (!this.isGameOver) this.updateClock();
        }, 1000);
    }

    spawnBatch() {
        for (let i = 0; i < this.settings.circlesPerSpawn; i++) {
            this.createValidTarget();
        }
    }

    createValidTarget() {
        const type = this.getRandomType();
        let coords = this.getRandomCoords();
        let attempts = 0;

        // Перевірка на накладання (максимум 10 спроб знайти місце)
        while (this.checkOverlap(coords.x, coords.y) && attempts < 10) {
            coords = this.getRandomCoords();
            attempts++;
        }

        const target = new Target(
            type, 
            coords.x, 
            coords.y, 
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

    getRandomCoords() {
        return {
            x: Math.random() * (this.canvas.clientWidth - CONFIG.circle.size),
            y: Math.random() * (this.canvas.clientHeight - CONFIG.circle.size)
        };
    }

    checkOverlap(x, y) {
        return this.activeTargets.some(target => {
            const dx = target.x - x;
            const dy = target.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < CONFIG.circle.size;
        });
    }

    handleHit(target) {
        this.score += target.type.hitScore;
        if (target.type.id === 'green') this.lives -= 1; // Зелений — пастка
        
        this.activeTargets = this.activeTargets.filter(t => t !== target);
        this.updateUI();
        this.checkGameState();
    }

    handleExpire(target) {
        // Логіка зникнення за правилами
        if (target.type.id === 'red' || target.type.id === 'yellow') {
            this.lives -= 1;
        } else {
            this.score += target.type.missBonusScore;
        }

        this.activeTargets = this.activeTargets.filter(t => t !== target);
        this.updateUI();
        this.checkGameState();
    }

    updateUI() {
        this.scoreEl.textContent = this.score;
        this.livesEl.textContent = this.lives;
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
        
        document.getElementById('res-score').textContent = this.score;
        document.getElementById('res-mode').textContent = this.settings.name;
        document.getElementById('game-over-screen').classList.remove('hidden');
        
        // Збереження рекорду
        const key = `bestScore_${this.mode}`;
        const currentBest = localStorage.getItem(key) || 0;
        if (this.score > currentBest) localStorage.setItem(key, this.score);
    }
}

new Game();