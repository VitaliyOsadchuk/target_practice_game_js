export const CONFIG = {
    // цілі
    circle: {
        size: 50,
        staticTime: 3000,
        shrinkTime: 3000,
        postHitDisplayTime: 1000 // 1 с
    },

    // типи цілей
    targetTypes: {
        RED:    { id: 'red',    chance: 0.50, hitScore: 5,  missPenaltyLife: 1, missBonusScore: 0,  image: 'target_red.svg' },
        BLUE:   { id: 'blue',   chance: 0.20, hitScore: -5, missPenaltyLife: 0, missBonusScore: 5,  image: 'target_blue.svg' },
        YELLOW: { id: 'yellow', chance: 0.15, hitScore: 20, missPenaltyLife: 1, missBonusScore: 0,  image: 'target_yellow.svg' },
        GREEN:  { id: 'green',  chance: 0.15, hitScore: 0,  missPenaltyLife: 1, missBonusScore: 50, image: 'target_green.svg', isTrap: true }
    },

    // режими
    MODES: {
        classic: {
            name: "Класика",
            initialLives: 5,
            hasTimer: true,
            timerDirection: 'up', // таймер
            spawnInterval: 5000,
            circlesPerSpawn: 3,
            isMoving: false,
            winCondition: 'lives' // з життями
        },
        timer: {
            name: "Таймер",
            initialLives: Infinity,
            hasTimer: true,
            timerDirection: 'down', // відлік
            gameDuration: 120, // 2 хвилини
            spawnInterval: 3000,
            circlesPerSpawn: 4,
            isMoving: false,
            winCondition: 'time' // за часом
        },
        storm: {
            name: "На ходу",
            initialLives: 3,
            hasTimer: true,
            timerDirection: 'up',
            spawnInterval: 4000,
            circlesPerSpawn: 2,
            isMoving: true, // рух цілей
            moveSpeed: 2,
            winCondition: 'lives'
        }
    }
};