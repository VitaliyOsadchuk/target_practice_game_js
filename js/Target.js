import { CONFIG } from './Config.js';

export class Target {
    constructor(type, x, y, onHit, onExpire) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.onHit = onHit;
        this.onExpire = onExpire;
        this.isHit = false;

        this.element = this.createDOM();
        this.startTimers();
    }

    createDOM() {
        const div = document.createElement('div');
        div.className = `circle target-${this.type.id}`;
        div.style.left = `${this.x}px`;
        div.style.top = `${this.y}px`;
        div.style.backgroundImage = `url('assets/images/${this.type.image}')`;
        
        div.addEventListener('mousedown', (e) => this.handleInteract(e));
        return div;
    }

    startTimers() {
        // 3 секунди спокою, потім 3 секунди звуження
        this.expireTimeout = setTimeout(() => {
            this.element.style.transition = `transform ${CONFIG.circle.shrinkTime}ms linear`;
            this.element.style.transform = 'scale(0)';

            this.element.addEventListener('transitionend', () => {
                if (!this.isHit) this.onExpire(this);
                this.element.remove();
            }, { once: true });

        }, CONFIG.circle.staticTime);
    }

    handleInteract(e) {
        if (this.isHit) return;
        this.isHit = true;
        clearTimeout(this.expireTimeout);

        // Малюємо дірку
        this.createBulletHole(e);
        
        this.onHit(this);

        // Залишаємо на екрані на 1 секунду за правилами
        setTimeout(() => {
            this.element.style.opacity = '0';
            setTimeout(() => this.element.remove(), 300);
        }, CONFIG.circle.postHitDisplayTime);
    }

    createBulletHole(e) {
        const hole = document.createElement('div');
        hole.className = 'bullet-hole';
        
        // Позиція відносно центру мішені
        const rect = this.element.getBoundingClientRect();
        hole.style.left = `${e.clientX - rect.left}px`;
        hole.style.top = `${e.clientY - rect.top}px`;
        
        this.element.appendChild(hole);
    }
}