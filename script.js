//14/11/2025//
// Function to manage the Game state variables
let lives = 3;
let score = { wins: 0, losses: 0, draws: 0 };
let currentStreak = 0;

let difficulty = localStorage.getItem("difficulty") || "easy";
// Load difficulty-specific high score + leaderboard
let highScore = parseInt(localStorage.getItem(`highScore_${difficulty}`)) || 0;
let leaderboard = JSON.parse(localStorage.getItem(`leaderboard_${difficulty}`)) || [];
//for storing player name
let playerName = localStorage.getItem(`lastName_${difficulty}`) || "";

// Function defining the winning conditions for each choice
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
    cockroach: ["wolf","spock","paper","moon","air","bowl","lizard","alien","dragon","devil","lightning","nuke"],
};

//function to capitalize first letter
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

//function to update score display
function updateScoreDisplay() {
    const display = document.getElementById("score-display");
    display.innerHTML = `
        Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}<br>
        Current Streak: ${currentStreak} | High Score: ${highScore}
    `;
}
//function to get options based on difficulty
function getOptionsForDifficulty(difficulty) {
    const options = {
        easy: ["rock","paper","scissors"],
        medium: ["rock","paper","scissors","lizard","spock"],
        hard: ["rock","fire","scissors","snake","man","tree","wolf","lizard","paper","air","spock","dragon","devil","lightning","gun"],
        impossible: ["rock","fire","scissors","snake","man","woman","tree","wolf","lizard","paper","air","spock","dragon","devil","lightning","gun","dynamite","nuke","alien","bowl","moon","cockroach","monkey","axe","sun"]
    };
    return options[difficulty];
}

//function to set difficulty and update buttons
function setDifficulty() {
    difficulty = document.getElementById("difficulty").value;
    localStorage.setItem("difficulty", difficulty);
// Load difficulty-specific data
    highScore = parseInt(localStorage.getItem(`highScore_${difficulty}`)) || 0;
    leaderboard = JSON.parse(localStorage.getItem(`leaderboard_${difficulty}`)) || [];
    playerName = localStorage.getItem(`lastName_${difficulty}`) || "";

    updateScoreDisplay();
    showLeaderboard();
// Build buttons again
    const buttonsContainer = document.querySelector(".buttons");
    buttonsContainer.innerHTML = "";

// Create buttons based on selected difficulty
    getOptionsForDifficulty(difficulty).forEach(option => {
        const button = document.createElement("button");
        button.textContent = capitalize(option);
        button.onclick = () => playGame(option);
        buttonsContainer.appendChild(button);
    });
// Update high score display
    document.getElementById("high-score").textContent = `High Score: ${highScore}`;
}

// function to show How to Play screen
function showHowToPlay() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("how-to-play").classList.remove("hidden");
}
//function to start the game from How to Play screen
function startGame() {
    document.getElementById("how-to-play").classList.add("hidden");
    document.getElementById("game-interface").classList.remove("hidden");
    setDifficulty();
}

//function to play the game and calculate the result and show the result including lives remaining
function playGame(playerChoice) {
    if (lives <= 0) return;

    const choices = getOptionsForDifficulty(difficulty);
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let result;

    if (playerChoice === computerChoice) {
        result = "It's a draw!";
        score.draws++;
        currentStreak = 0;
    } else if (winningConditions[playerChoice]?.includes(computerChoice)) {
        result = "You win!";
        score.wins++;
        currentStreak++;

        if (currentStreak > highScore) {
            highScore = currentStreak;
            localStorage.setItem(`highScore_${difficulty}`, highScore);
        }
    } else {
        result = "You lose!";
        score.losses++;
        lives--;
        currentStreak = 0;
    }
// update UI
    document.getElementById("player-choice").textContent = `Player Choice: ${capitalize(playerChoice)}`;
    document.getElementById("computer-choice").textContent = `Computer Choice: ${capitalize(computerChoice)}`;
    document.getElementById("game-result").textContent = `Result: ${result}`;
    document.getElementById("lives").textContent = `Lives Remaining: ${lives}`;
    document.getElementById("current-streak").textContent = `Current Winning Streak: ${currentStreak}`;
    document.getElementById("high-score").textContent = `High Score: ${highScore}`;
    updateScoreDisplay();

    if (lives <= 0) gameOver();
}

//function to show game over screen
function gameOver() {
    document.getElementById("game-interface").classList.add("hidden");
    document.getElementById("game-over-screen").classList.remove("hidden");

    // function to show name entry if qualified for leaderboard
    const leaderboardData =
        JSON.parse(localStorage.getItem(`leaderboard_${difficulty}`)) || [];

    const lowestScore =
        leaderboardData.length < 5 ? 0 : leaderboardData[leaderboardData.length - 1].score;

    
    if (highScore > lowestScore) {
        document.getElementById("name-entry").classList.remove("hidden");
        document.getElementById("no-leaderboard-msg").classList.add("hidden");
        document.getElementById("player-name-input").value = playerName;
    } else {
        document.getElementById("name-entry").classList.add("hidden");
        document.getElementById("no-leaderboard-msg").classList.remove("hidden");
    }
}

// Event listener for saving score and name
// Combined DOMContentLoaded for Save Score + Rules overlay + Leaderboard
document.addEventListener("DOMContentLoaded", () => {

    // --- Leaderboard Toggle ---
    const toggleLeaderboardBtn = document.getElementById("toggle-leaderboard");
const leaderboardContainer = document.getElementById("leaderboard");

toggleLeaderboardBtn.addEventListener("click", () => {
    leaderboardContainer.classList.toggle("hidden");
});

    // --- Save Score Button ---
    document.getElementById("save-score-btn").addEventListener("click", () => {
        let name = document.getElementById("player-name-input").value.trim();
        if (!name) return alert("Please enter a name.");

        localStorage.setItem(`lastName_${difficulty}`, name);
        playerName = name;

        updateLeaderboard(playerName, highScore);
        showLeaderboard();

        document.getElementById("name-entry").style.display = "none";
        alert("Score saved!");
    });

    //function to handle Rules Overlay
    const showRulesButton = document.getElementById("show-rules");
    const rulesOverlay = document.getElementById("rules-overlay");
    const closeRulesButton = document.getElementById("close-rules");
    const rulesDifficultySelect = document.getElementById("rules-difficulty");
   
   
    // Function to show rules image based on selected difficulty
    function showRules(difficulty) {
        const rulesList = document.getElementById("rules-list");
        rulesList.innerHTML = "";

        const img = document.createElement("img");
        img.src = `images/${difficulty}.png`;
        img.alt = `${difficulty} rules`;
        img.style.width = "150px";
        img.style.display = "block";
        img.style.margin = "10px auto";

        rulesList.appendChild(img);
    }
    // Event listeners for Rules Overlay
    showRulesButton.onclick = () => {
        rulesOverlay.classList.add("show");
        showRules(rulesDifficultySelect.value);
    };
    
    closeRulesButton.onclick = () => {
        rulesOverlay.classList.remove("show");
    };

    

    rulesDifficultySelect.addEventListener("change", () =>
        showRules(rulesDifficultySelect.value)
    );

    // Show leaderboard on page load
    showLeaderboard();
});

// Function to restart the game 
function restartGame() {
    // Reset game state
    lives = 3;
    score = { wins: 0, losses: 0, draws: 0 };
    currentStreak = 0;

    // Hide Game Over, show Game Interface
    document.getElementById("game-over-screen").classList.add("hidden");
    document.getElementById("game-interface").classList.remove("hidden");

    // Hide name entry and no-leaderboard message
    document.getElementById("name-entry").classList.add("hidden");
    document.getElementById("no-leaderboard-msg").classList.add("hidden");

    // Rebuild buttons for current difficulty
    setDifficulty();

    // Update score display
    updateScoreDisplay();

    // Reset results display
    document.getElementById("player-choice").textContent = "Player Choice: ";
    document.getElementById("computer-choice").textContent = "Computer Choice: ";
    document.getElementById("game-result").textContent = "Result: ";
    document.getElementById("lives").textContent = `Lives Remaining: ${lives}`;
    document.getElementById("current-streak").textContent = `Current Winning Streak: ${currentStreak}`;
    document.getElementById("high-score").textContent = `High Score: ${highScore}`;
}

// Function to update leaderboard
function updateLeaderboard(name, scoreValue) {
     // Load current difficulty leaderboard again to be safe
    leaderboard = JSON.parse(localStorage.getItem(`leaderboard_${difficulty}`)) || [];

    leaderboard.push({ name: name, score: scoreValue });
     // Sort descending by score
    leaderboard.sort((a, b) => b.score - a.score);
      // Keep top 5 only
    leaderboard = leaderboard.slice(0, 5);
      // Save difficulty-specific leaderboard
    localStorage.setItem(`leaderboard_${difficulty}`, JSON.stringify(leaderboard));
}
//Function to show leaderboard
function showLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";
    // Load correct leaderboard
    leaderboard = JSON.parse(localStorage.getItem(`leaderboard_${difficulty}`)) || [];

    if (leaderboard.length === 0) {
        list.innerHTML = "<li>No scores yet!</li>";
        return;
    }

    leaderboard.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.name} - ${entry.score}`;
        list.appendChild(li);
    });
}