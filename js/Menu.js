document.addEventListener("DOMContentLoaded", () => {
  const modeItems = document.querySelectorAll(".mode-item");

  modeItems.forEach((item) => {
    const onclickAttr = item.getAttribute("onclick");
    if (!onclickAttr) return;

    const match = onclickAttr.match(/mode=([a-z]+)/);
    if (!match) return;

    const mode = match[1];
    const bestScore = localStorage.getItem(`bestScore_${mode}`) ?? 0;

    const scoreSpan = item.querySelector(".best-score-value");
    if (scoreSpan) {
      scoreSpan.textContent = bestScore;
    }
  });

  const resetBtn = document.getElementById("reset-all-scores");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const isConfirmed = confirm("Видалити всі рекорди?");

      if (isConfirmed) {
        const modes = ["classic", "timer", "storm"];
        modes.forEach((mode) => {
          localStorage.removeItem(`bestScore_${mode}`);
        });
        location.reload();
      }
    });
  }
});
