export const CONFIG = {
  circle: {
    //налаштування цілей
    initialSize: 100, // Початковий розмір x px (потребує корегування області спавна в Game.js)
    minSize: 50, // Мінімальний розмір цілі,  X px
    sizeStep: 10, // Зменшення на X px
    pointsPerStep: 200, // Кожні x очок зменшення розміру на SizeStep
    staticTime: 3000,
    shrinkTime: 3000,
    postHitDisplayTime: 1000,
  },
  targetTypes: {
    // опис цілей
    RED: {
      id: "red",
      chance: 0.5, // ймовірність появи
      hitScore: 5, // очки за влучання
      missPenaltyLife: 1, // покарання за пропуск
      missBonusScore: 0, // бонус за пропуск
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
    //опис режимів
    classic: {
      name: "Класика",
      initialLives: 5, // початкова кількість життів
      spawnInterval: 4000, // інтервал появи цілей в мс
      circlesPerSpawn: 3, // кількість цілей за спавн
      timerDirection: "up", //відлік часу вгору
      winCondition: "lives", //умова перемоги
    },
    timer: {
      name: "Таймер",
      initialLives: Infinity,
      gameDuration: 120, // 2 хвилини
      spawnInterval: 3000,
      circlesPerSpawn: 4,
      timerDirection: "down", //відлік часу
      winCondition: "time",
    },
    storm: {
      name: "На ходу",
      initialLives: 5,
      spawnInterval: 4000,
      circlesPerSpawn: 3,
      timerDirection: "up",
      isMoving: true, //рухомі цілі
      initialMoveSpeed: 1, // Початкова швидкість
      maxMoveSpeed: 5, // Макс швидкість
      pointsPerSpeedStep: 300, // кожні x очок +1 до moveSpeed
      winCondition: "lives",
    },
  },
};
