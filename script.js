//21/11/2025//
// Game State
let lives = 3;
let score = { wins: 0, losses: 0, draws: 0 };
let currentStreak = 0;


// Difficulty
let difficulty = localStorage.getItem("difficulty") || "easy";

// Storage
let highScore = getHighScore();
let leaderboard = getLeaderboard();
let playerName = getLastPlayerName();
let saveScoreButtonClicked = false;

// Winning Conditions
const winningConditions = { 
    rock: ["fire","scissors","snake","man","woman","wolf","lizard","tree","sun","axe","monkey","cockroach"],
    fire: ["scissors","paper","snake","man","woman","tree","wolf","lizard","axe","monkey","cockroach","moon"],
    scissors: ["air","tree","paper","snake","man","woman","wolf","lizard","axe","monkey","cockroach","moon"],
    snake: ["man","woman","wolf","lizard","tree","paper","air","spock","monkey","cockroach","moon","bowl"],
    man: ["tree","wolf","lizard","paper","air","spock","dragon","cockroach","moon","bowl","alien","devil"],
    woman: ["man","tree","cockroach","wolf","spock","lizard","paper","moon","air","bowl","alien","dragon"],
    tree: ["wolf","dragon","lizard","paper","air","spock","devil","cockroach","moon","bowl","alien","lightning"],
    wolf: ["lizard","paper","air","spock","dragon","lightning","devil","moon","bowl","alien","nuke","dynamite"],
    lizard: ["paper","moon","air","bowl","spock","alien","devil","dragon","gun","lightning","nuke","dynamite"],
    paper: ["air","moon","rock","bowl","spock","alien","devil","dragon","gun","lightning","nuke","dynamite"],
    air: ["fire","bowl","rock","alien","spock","sun","devil","gun","dragon","lightning","nuke","dynamite"],
    spock: ["devil","alien","dragon","sun","axe","rock","fire","scissors","gun","lightning","nuke","dynamite"],
    dragon: ["devil","lightning","fire","rock","scissors","gun","snake","sun","axe","monkey","nuke","dynamite"],
    devil: ["rock","fire","scissors","gun","lightning","snake","woman","sun","axe","monkey","nuke","dynamite"],
    lightning: ["gun","scissors","rock","sun","axe","monkey","fire","snake","man","woman","nuke","dynamite"],
    gun: ["rock","tree","fire","sun","axe","monkey","scissors","snake","man","woman","cockroach","wolf"],
    dynamite: ["gun","rock","sun","fire","scissors","axe","snake","monkey","woman","man","tree","cockroach"],
    nuke: ["dynamite","gun","rock","sun","fire","scissors","snake","axe","monkey","woman","man","tree"],
    alien: ["dragon","devil","lightning","nuke","dynamite","gun","rock","sun","fire","scissors","axe","snake"],
    bowl: ["spock","alien","dragon","devil","lightning","nuke","dynamite","gun","rock","sun","fire","scissors"],
    moon: ["air","bowl","spock","alien","dragon","devil","lightning","nuke","dynamite","gun","rock","sun"],
    sun: ["fire","scissors","axe","snake","monkey","woman","man","tree","cockroach","wolf","lizard","paper"],
    axe: ["snake","monkey","woman","man","tree","cockroach","wolf","lizard","paper","moon","air","bowl"],
    monkey: ["woman","man","tree","cockroach","wolf","lizard","spock","paper","moon","air","bowl","alien"],
    cockroach: ["wolf","spock","paper","moon","air","bowl","lizard","alien","dragon","devil","lightning","nuke"]
};

// Utility
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Options By Difficulty
function getOptionsForDifficulty(diff) {
    const options = {
        easy: ["rock","paper","scissors"],
        medium: ["rock","paper","scissors","lizard","spock"],
        hard: ["rock","fire","scissors","snake","man","tree","wolf","lizard","paper","air","spock","dragon","devil","lightning","gun"],
        impossible: ["rock","fire","scissors","snake","man","woman","tree","wolf","lizard","paper","air","spock","dragon","devil","lightning","gun","dynamite","nuke","alien","bowl","moon","cockroach","monkey","axe","sun"]
    };
    return options[diff];
}

// Storage Helpers
function getHighScore() { return parseInt(localStorage.getItem(`highScore_${difficulty}`)) || 0; }
function getLeaderboard() { return JSON.parse(localStorage.getItem(`leaderboard_${difficulty}`)) || []; }
function getLastPlayerName() { return localStorage.getItem(`lastName_${difficulty}`) || ""; }
function saveHighScore() { localStorage.setItem(`highScore_${difficulty}`, highScore); }
function saveLeaderboard() { localStorage.setItem(`leaderboard_${difficulty}`, JSON.stringify(leaderboard)); }
function saveLastPlayerName() { localStorage.setItem(`lastName_${difficulty}`, playerName); }

// UI Display
function updateScoreDisplay() {
    document.getElementById("wins").textContent = score.wins;
    document.getElementById("losses").textContent = score.losses;
    document.getElementById("draws").textContent = score.draws;
    document.getElementById("current-streak").textContent = currentStreak;
    document.getElementById("high-score").textContent = highScore;
}

// Leaderboard Display
function showLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    leaderboard = getLeaderboard();

    // 🔥 Make sure leaderboard always stays sorted correctly
    leaderboard.sort((a, b) => b.score - a.score);

    if (!leaderboard.length) {
        list.innerHTML = "<li>No scores yet!</li>";
        return;
    }

    leaderboard.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.name} - ${entry.score}`;
        list.appendChild(li);
    });
}

// Rebuild Buttons Based on Difficulty
function rebuildButtons() {
    const container = document.querySelector(".buttons");
    container.innerHTML = "";

    getOptionsForDifficulty(difficulty).forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = capitalize(option);
        btn.onclick = () => playGame(option);
        container.appendChild(btn);
    });
}

// Difficulty Change Handling
function setDifficulty() {
    difficulty = document.getElementById("difficulty").value;

    localStorage.setItem("difficulty", difficulty);

    highScore = getHighScore();
    leaderboard = getLeaderboard();
    playerName = getLastPlayerName();

    rebuildButtons();
    updateScoreDisplay();
    showLeaderboard();
    showRules(difficulty);
}

// Game Start
function showHowToPlay() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("how-to-play").classList.remove("hidden");
}

function startGame() {
    document.getElementById("how-to-play").classList.add("hidden");
    document.getElementById("game-interface").classList.remove("hidden");

    rebuildButtons();
    updateScoreDisplay();
    showLeaderboard();
}

// Main Game Logic
function playGame(playerChoice) {
    if (lives <= 0) return;

    document.getElementById("difficulty").disabled = true;

    const choices = getOptionsForDifficulty(difficulty);
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let result;

    if (playerChoice === computerChoice) {
        result = "It's a draw!";
        score.draws++;
        

    } else if (winningConditions[playerChoice].includes(computerChoice)) {
        result = "You win!";
        score.wins++;
        currentStreak++;

        
    } else {
        result = "You lose!";
        score.losses++;
        lives--;
        currentStreak = 0;
    }

    document.getElementById("player-choice").textContent = `Player Choice: ${capitalize(playerChoice)}`;
    document.getElementById("computer-choice").textContent = `Computer Choice: ${capitalize(computerChoice)}`;
    document.getElementById("game-result").textContent = `Result: ${result}`;
    document.getElementById("lives").textContent = `Lives Remaining: ${lives}`;

    updateScoreDisplay();
    if (lives <= 0) gameOver();
}

// Game Over Handling
function gameOver() {
    document.getElementById("game-interface").classList.add("hidden");
    document.getElementById("game-over-screen").classList.remove("hidden");

    const restartBtn = document.getElementById("restart-button");
    restartBtn.disabled = false; // Always allow restart!//

    const finalScore = currentStreak;
    leaderboard = getLeaderboard();
    // Always sort first so we compare correctly//
     leaderboard.sort((a, b) => b.score - a.score);

     let qualifies = false;

     if (leaderboard.length < 5) {
         qualifies = finalScore > 0;
     } else {
         const lowestScore = leaderboard.at(-1).score;
         qualifies = finalScore > lowestScore;
     }

    document.getElementById("name-entry").classList.add("hidden");
    document.getElementById("no-leaderboard-msg").classList.add("hidden");


    if (qualifies) {
        saveScoreButtonClicked = false;
        document.getElementById("name-entry").classList.remove("hidden");
        document.getElementById("player-name-input").value = playerName;

        document.getElementById("save-score-btn").onclick = () => {
            const name = document.getElementById("player-name-input").value.trim();
            if (!name) return alert("Please enter a name.");

            playerName = name;
            saveLastPlayerName();

            updateLeaderboard(playerName, finalScore);

            if (finalScore > highScore) {
                highScore = finalScore;
                saveHighScore();
            }

            saveScoreButtonClicked = true;
            restartBtn.disabled = false;

            showLeaderboard();
            updateScoreDisplay();
            document.getElementById("name-entry").classList.add("hidden");

            const prompt = document.getElementById("score-saved-prompt");
            prompt.classList.add("show");
            setTimeout(() => prompt.classList.remove("show"), 2000);
        };

    } else {
        saveScoreButtonClicked = true;
        document.getElementById("no-leaderboard-msg").classList.remove("hidden");
    }
}

// Leaderboard Update
function updateLeaderboard(name, scoreValue) {
    leaderboard = getLeaderboard();

    leaderboard.push({
        name,
        score: Number(scoreValue)
    });

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    saveLeaderboard();
}

// Restart Game
function restartGame() {
    lives = 3;
    score = { wins: 0, losses: 0, draws: 0 };
    currentStreak = 0;
    saveScoreButtonClicked = false;

    // UI reset
    document.getElementById("difficulty").disabled = false;
    document.getElementById("game-over-screen").classList.add("hidden");
    document.getElementById("game-interface").classList.remove("hidden");
    
    rebuildButtons();
    updateScoreDisplay();
    showLeaderboard();

    document.getElementById("player-choice").textContent = "Player Choice: ";
    document.getElementById("computer-choice").textContent = "Computer Choice: ";
    document.getElementById("game-result").textContent = "Result: ";
    document.getElementById("lives").textContent = "Lives Remaining: 3";

    // Make sure buttons work again
    document.querySelectorAll(".buttons button").forEach(btn => btn.disabled = false);
}

// DOM Loaded Setup
document.addEventListener("DOMContentLoaded", () => {
    const difficultyDropdown = document.getElementById("difficulty");
    difficultyDropdown.value = difficulty;

    const rulesDropdown = document.getElementById("rules-difficulty");
    rulesDropdown.value = difficulty;

    const toggleLeaderboardBtn = document.getElementById("toggle-leaderboard");
    const leaderboardDiv = document.getElementById("leaderboard");

    toggleLeaderboardBtn.onclick = () => {
        const hidden = leaderboardDiv.classList.contains("hidden");
        if (hidden) {
            leaderboardDiv.classList.remove("hidden");
            leaderboardDiv.classList.add("show");
            showLeaderboard();
            toggleLeaderboardBtn.textContent = "Hide Leaderboard";
        } else {
            leaderboardDiv.classList.add("hidden");
            leaderboardDiv.classList.remove("show");
            toggleLeaderboardBtn.textContent = "Show Leaderboard";
        }
    };

    toggleLeaderboardBtn.textContent =
        leaderboardDiv.classList.contains("hidden") ?
        "Show Leaderboard" :
        "Hide Leaderboard";

    document.getElementById("restart-button").onclick = restartGame;

    const rulesOverlay = document.getElementById('rules-overlay');
    const showRulesBtn = document.getElementById('show-rules');
    const closeRulesBtn = document.getElementById('close-rules');

    showRulesBtn.addEventListener('click', () => {
        rulesOverlay.classList.add('show');
    });

    closeRulesBtn.addEventListener('click', () => {
        rulesOverlay.classList.remove('show');
    });

    rulesDropdown.onchange = () => {
        showRules(rulesDropdown.value);
    };
});

// Rules display
function showRules(diff) {
    const rulesList = document.getElementById("rules-list");
    rulesList.innerHTML = "";
    const img = document.createElement("img");

    img.src = `images/${diff}.png`;
    img.alt = `${capitalize(diff)} rules`;
    img.style.width = "150px";
    img.style.display = "block";
    img.style.margin = "10px auto";

    rulesList.appendChild(img);
}