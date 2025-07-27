const gameListEl = document.getElementById("gamesList");

// Replace with your actual Replit backend URL
const BACKEND_URL = "https://your-replit-app-name.replit.app/games";

fetch(BACKEND_URL)
  .then(res => res.json())
  .then(games => {
    games.forEach(game => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <img src="${game.thumbnail}" alt="${game.title}" />
        <h3>${game.title}</h3>
        <button onclick="window.open('${game.url}', '_blank')">Play</button>
      `;
      gameListEl.appendChild(card);
    });
  })
  .catch(err => {
    gameListEl.innerHTML = "<p>⚠️ Failed to load games</p>";
    console.error("Error loading games:", err);
  });
