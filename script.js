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
    } else if (difficulty === "hard") {
        // Add all options for hard difficulty
        const hardOptions = [
            "fire", "snake", "human", "tree", "wolf", "lizard", "air", "spock",
            "dragon", "devil", "lightning", "gun"
        ];
        hardOptions.forEach(option => {
            buttonsContainer.innerHTML += `<button onclick="playGame('${option}')">${capitalize(option)}</button>`;
        });
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
    } else if (difficulty === "hard") {
        choices = [
            "rock", "fire", "scissors", "snake", "human", "tree", "wolf", "lizard",
            "paper", "air", "spock", "dragon", "devil", "lightning", "gun"
        ]; // Add all options for hard
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
        rock: ["fire", "scissors", "snake", "human", "wolf", "lizard", "tree"],
        fire: ["scissors", "paper", "snake", "human", "tree", "wolf", "lizard"],
        scissors: ["air", "tree", "paper", "snake", "human", "wolf", "lizard"],
        snake: ["human", "wolf", "lizard", "tree", "paper", "air", "spock"],
        human: ["tree", "wolf", "lizard", "paper", "air", "spock", "dragon"],
        tree: ["wolf", "dragon", "lizard", "paper", "air", "spock", "devil"],
        wolf: ["lizard", "paper", "air", "spock", "dragon", "lightning", "devil"],
        lizard: ["paper", "air", "spock", "devil", "dragon", "gun", "lightning"],
        paper: ["air", "rock", "spock", "devil", "dragon", "gun", "lightning"],
        air: ["fire", "rock", "spock", "devil", "gun", "dragon", "lightning"],
        spock: ["devil", "dragon", "rock", "fire", "scissors", "gun", "lightning"],
        dragon: ["devil", "lightning", "fire", "rock", "scissors", "gun", "snake"],
        devil: ["rock", "fire", "scissors", "gun", "snake", "human"],
        lightning: ["gun", "scissors", "rock", "tree", "fire", "snake", "human"],
        gun: ["rock", "tree", "scissors", "snake", "human", "wolf"]
    };

    return winningConditions[playerChoice]?.includes(computerChoice);
}

// Utility function to capitalize the first letter of a string
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
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