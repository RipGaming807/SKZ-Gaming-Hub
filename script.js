// ========== DOM Elements ==========
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const cardGrid = document.getElementById("cardGrid");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const finalScoreDisplay = document.getElementById("finalScore");
const finalBestScoreDisplay = document.getElementById("finalBestScore");

const popSound = document.getElementById("popSound");
const bgMusic = document.getElementById("bgMusic");

// ========== Global Variables ==========
let animalEmojis = ["🐶", "🐱", "🐰", "🐵", "🐸", "🐮", "🐯", "🐢"];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let timer = 150;
let countdown;
let currentDifficulty = "easy";
let totalPairs = 0;

// ========== Difficulty Settings ==========
const difficultySettings = {
  easy: 8,    // 4x2
  medium: 10, // 4x5
  hard: 14    // 4x7
};

// ========== Start Game ==========
function startGame(difficulty) {
  currentDifficulty = difficulty;
  totalPairs = difficultySettings[difficulty];
  score = 0;
  timer = 150;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  scoreDisplay.textContent = score;
  bestScoreDisplay.textContent = getBestScore();

  menuScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  createCards();
  startTimer();
  bgMusic.volume = 0.3;
  bgMusic.play();
}

// ========== Create Card Grid ==========
function createCards() {
  cardGrid.innerHTML = "";

  let emojis = [...animalEmojis];
  while (emojis.length < totalPairs) {
    emojis = emojis.concat(animalEmojis); // repeat emojis if needed
  }

  const selected = shuffle(emojis).slice(0, totalPairs);
  const cardValues = shuffle([...selected, ...selected]); // duplicate & shuffle

  // Set grid template
  if (currentDifficulty === "easy") {
    cardGrid.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else if (currentDifficulty === "medium") {
    cardGrid.style.gridTemplateColumns = "repeat(5, 1fr)";
  } else {
    cardGrid.style.gridTemplateColumns = "repeat(7, 1fr)";
  }

  cardValues.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.textContent = "";
    card.addEventListener("click", flipCard);
    cardGrid.appendChild(card);
  });
}

// ========== Flip Card ==========
function flipCard() {
  if (lockBoard || this.classList.contains("matched") || this === firstCard) return;

  this.classList.add("flipped");
  this.textContent = this.dataset.emoji;

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    lockBoard = true;

    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
      matchFound();
    } else {
      setTimeout(unflipCards, 500);
    }
  }
}

// ========== Match Found ==========
function matchFound() {
  popSound.play();
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  score += 10;
  scoreDisplay.textContent = score;

  firstCard = null;
  secondCard = null;
  lockBoard = false;

  // Check win
  if (document.querySelectorAll(".card:not(.matched)").length === 0) {
    clearInterval(countdown);
    setTimeout(() => endGame(true), 800);
  }
}

// ========== Unflip Cards ==========
function unflipCards() {
  firstCard.classList.remove("flipped");
  secondCard.classList.remove("flipped");
  firstCard.textContent = "";
  secondCard.textContent = "";
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// ========== Timer ==========
function startTimer() {
  timerDisplay.textContent = timer;
  countdown = setInterval(() => {
    timer--;
    timerDisplay.textContent = timer;
    if (timer <= 0) {
      clearInterval(countdown);
      endGame(false);
    }
  }, 1000);
}

// ========== End Game ==========
function endGame(won) {
  bgMusic.pause();
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");

  finalScoreDisplay.textContent = score;

  const best = getBestScore();
  if (score > best) {
    localStorage.setItem(`best_${currentDifficulty}`, score);
    finalBestScoreDisplay.textContent = `${score} 🎉 New High Score!`;
  } else {
    finalBestScoreDisplay.textContent = best;
  }
}

// ========== Restart ==========
function restartGame() {
  startGame(currentDifficulty);
}

// ========== Back to Menu ==========
function goToMenu() {
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
  bgMusic.pause();
}

// ========== Get Best Score ==========
function getBestScore() {
  return localStorage.getItem(`best_${currentDifficulty}`) || 0;
}

// ========== Shuffle Helper ==========
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex--);
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]
    ];
  }
  return array;
}
