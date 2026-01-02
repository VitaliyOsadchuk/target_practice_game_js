// import { Storage } from './Storage.js';

document.addEventListener("DOMContentLoaded", () => {
    const modeItems = document.querySelectorAll(".mode-item");

    modeItems.forEach((item) => {
        // дістаємо mode з onclick="location.href='game.html?mode=classic'"
        const onclickAttr = item.getAttribute("onclick");

        if (!onclickAttr) return;

        const match = onclickAttr.match(/mode=([a-z]+)/);
        if (!match) return;

        const mode = match[1];

        // беремо рекорд
        const bestScore = localStorage.getItem(`bestScore_${mode}`) ?? 9999;

        // оновлюємо span
        const scoreSpan = item.querySelector(".best-score-value");
        if (scoreSpan) {
            scoreSpan.textContent = bestScore;
        }
    });
});
