let lives = 3; // Fixed lives for all difficulties
let difficulty = localStorage.getItem("difficulty") || "easy"; // Retrieve saved difficulty or default to "easy"

// Function to set difficulty
function setDifficulty() {
    difficulty = document.getElementById("difficulty").value;

    // Save the selected difficulty to localStorage
    localStorage.setItem("difficulty", difficulty);

    // Update the lives display (lives remain constant)
    document.getElementById("lives").textContent = "Lives Remaining: " + lives;

    // Update the available buttons based on difficulty
    const buttonsContainer = document.querySelector(".buttons");
    buttonsContainer.innerHTML = `
        <button onclick="playGame('rock')">Rock</button>
        <button onclick="playGame('paper')">Paper</button>
        <button onclick="playGame('scissors')">Scissors</button>
    `;

    if (difficulty === "medium") {
        // Add Lizard and Spock buttons for medium difficulty
        buttonsContainer.innerHTML += `
            <button onclick="playGame('lizard')">Lizard</button>
            <button onclick="playGame('spock')">Spock</button>
        `;
    }
}

// Function to play the game
function playGame(playerChoice) {
    if (lives <= 0) {
        return; // Prevent further gameplay if lives are 0
    }

    let choices = ["rock", "paper", "scissors"]; // Default choices
    if (difficulty === "medium") {
        choices = ["rock", "paper", "scissors", "lizard", "spock"]; // Add lizard and spock for medium
    }

    const computerChoice = choices[Math.floor(Math.random() * choices.length)]; // Random choice

    let result;
    if (playerChoice === computerChoice) {
        result = "It's a draw!";
    } else if (isPlayerWinner(playerChoice, computerChoice)) {
        result = "You win!";
    } else {
        result = "You lose!";
        lives--; // Decrease lives if the player loses
    }

    // Update the results and lives display
    document.getElementById("player-choice").textContent = "Player Choice: " + playerChoice;
    document.getElementById("computer-choice").textContent = "Computer Choice: " + computerChoice;
    document.getElementById("game-result").textContent = "Result: " + result;
    document.getElementById("lives").textContent = "Lives Remaining: " + lives;

    // Check if lives are 0
    if (lives === 0) {
        showGameOverScreen(); // Trigger the Game Over screen
    }
}

// Function to determine if the player wins
function isPlayerWinner(playerChoice, computerChoice) {
    const winningConditions = {
        rock: ["scissors", "lizard"],
        paper: ["rock", "spock"],
        scissors: ["paper", "lizard"],
        lizard: ["spock", "paper"],
        spock: ["scissors", "rock"]
    };

    return winningConditions[playerChoice].includes(computerChoice);
}

function showGameOverScreen() {
    // Add the "game-over" class to the body
    document.body.classList.add("game-over");

    // Replace the game interface with a "Game Over" screen
    const gameContainer = document.body;
    gameContainer.innerHTML = `
        <h1>Game Over</h1>
        <p>You have no lives left!</p>
        <button onclick="restartGame()">Restart Game</button>
    `;
}

function restartGame() {
    // Reset lives and reload the page to restart the game
    lives = 3;
    location.reload();
}

// Set the initial difficulty and buttons when the page loads
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("difficulty").value = difficulty; // Set the dropdown to the saved difficulty
    setDifficulty(); // Update the buttons based on the saved difficulty
});