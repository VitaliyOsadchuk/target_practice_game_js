export const CONFIG = {
  circle: {
    initialSize: 100, // Початковий розмір 100px
    minSize: 50, // Мінімальний розмір 50px
    sizeStep: 10, // Зменшення на 10px
    pointsPerStep: 200, // Кожні 200 очок
    staticTime: 3000,
    shrinkTime: 3000,
    postHitDisplayTime: 1000,
  },
  targetTypes: {
    RED: {
      id: "red",
      chance: 0.5,
      hitScore: 5,
      missPenaltyLife: 1,
      missBonusScore: 0,
      image: "target_red.svg",
    },
    BLUE: {
      id: "blue",
      chance: 0.2,
      hitScore: -5,
      missPenaltyLife: 0,
      missBonusScore: 5,
      image: "target_blue.svg",
    },
    YELLOW: {
      id: "yellow",
      chance: 0.15,
      hitScore: 20,
      missPenaltyLife: 1,
      missBonusScore: 0,
      image: "target_yellow.svg",
    },
    GREEN: {
      id: "green",
      chance: 0.15,
      hitScore: 0,
      missPenaltyLife: 1,
      missBonusScore: 20,
      image: "target_green.svg",
      isTrap: true,
    },
  },
  MODES: {
    classic: {
      name: "Класика",
      initialLives: 5,
      spawnInterval: 5000,
      circlesPerSpawn: 3,
      timerDirection: "up",
      winCondition: "lives",
    },
    timer: {
      name: "Таймер",
      initialLives: Infinity,
      gameDuration: 120, // 2 хвилини
      spawnInterval: 3000,
      circlesPerSpawn: 4,
      timerDirection: "down",
      winCondition: "time",
    },
    storm: {
      name: "На ходу",
      initialLives: 3,
      spawnInterval: 4000,
      circlesPerSpawn: 2,
      timerDirection: "up",
      isMoving: true,
      moveSpeed: 2,
      winCondition: "lives",
    },
  },
};
