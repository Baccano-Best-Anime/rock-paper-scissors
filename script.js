let lives = 3;
let difficulty = localStorage.getItem("difficulty") || "easy";

const winningConditions = {  

 

    rock: ["fire", "scissors", "snake", "man", "woman", "wolf", "lizard", "tree", "sun", "axe", "monkey", "cockroach"],  

 

    fire: ["scissors", "paper", "snake", "man", "woman", "tree", "wolf", "lizard", "axe", "monkey", "cockroach"],  

 

    scissors: ["air", "tree", "paper", "snake", "man", "woman", "wolf", "lizard", "axe", "monkey", "cockroach", "moon"],  

 

    snake: ["man", "woman", "wolf", "lizard", "tree", "paper", "air", "spock", "monkey", "cockroach", "moon", "bowl"],  

 

    man: ["tree", "wolf", "lizard", "paper", "air", "spock", "dragon", "cockroach", "moon", "bowl", "alien", "devil"],  

 

    woman: ["man", "tree", "cockroach", "wolf", "spock", "lizard", "paper", "moon", "air", "bowl", "alien", "dragon"],  

 

    tree: ["wolf", "dragon", "lizard", "paper", "air", "spock", "devil", "cockroach", "moon", "bowl", "alien", "lightning"],  

 

    wolf: ["lizard", "paper", "air", "spock", "dragon", "lightning", "devil", "moon", "bowl", "alien", "nuke", "dynamite"],  

 

    lizard: ["paper", "moon", "air", "bowl", "spock", "alien", "devil", "dragon", "gun", "lightning", "nuke", "dynamite"],  

 

    paper: ["air", "moon", "rock", "bowl", "spock", "alien", "devil", "dragon", "gun", "lightning", "nuke", "dynamite"],  

 

    air: ["fire", "bowl", "rock", "alien", "spock", "sun", "devil", "gun", "dragon", "lightning", "nuke", "dynamite"],  

 

    spock: ["devil", "alien", "dragon", "sun", "axe", "rock", "fire", "scissors", "gun", "lightning", "nuke", "dynamite"],  

 

    dragon: ["devil", "lightning", "fire", "rock", "scissors", "gun", "snake", "sun", "axe", "monkey", "nuke", "dynamite"],  

 

    devil: ["rock", "fire", "scissors", "gun", "lightning", "snake", "woman", "sun", "axe", "monkey", "nuke", "dynamite"],  

 

    lightning: ["gun", "scissors", "rock", "sun", "axe", "monkey", "fire", "snake", "man", "woman", "nuke", "dynamite"],  

 

    gun: ["rock", "tree", "fire", "sun", "axe", "monkey", "scissors", "snake", "man", "woman", "cockroach", "wolf"],  

 

    dynam: ["gun", "rock", "sun", "fire", "scissors", "axe", "snake", "monkey", "woman", "man", "tree", "cockroach"],  

 

    nuk: ["dynamite", "gun", "rock", "sun", "fire", "scissors", "snake", "axe", "monkey", "woman", "man", "tree"],  

 

    alien: ["dragon", "devil", "lightning", "nuke", "dynamite", "gun", "rock", "sun", "fire", "scissors", "axe", "snake"],  

 

    bowl: ["water", "alien", "dragon", "devil", "lightning", "nuke", "dynamite", "gun", "rock", "sun", "fire", "scissors"],  

 

    moon: ["air", "bowl", "water", "alien", "dragon", "devil", "lightning", "nuke", "dynamite", "gun", "rock", "sun"],  

 

    sun: ["fire", "scissors", "axe", "snake", "monkey", "woman", "man", "tree", "cockroach", "wolf", "lizard", "paper"]  

}; 

// Function to start the game
function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-interface").style.display = "block";
    setDifficulty(); // Initialize the game with the selected difficulty
}

function setDifficulty() {
    difficulty = document.getElementById("difficulty").value;
    localStorage.setItem("difficulty", difficulty);
    document.getElementById("lives").textContent = `Lives Remaining: ${lives}`;
    const buttonsContainer = document.querySelector(".buttons");
    buttonsContainer.innerHTML = "";

    const options = getOptionsForDifficulty(difficulty);
    options.forEach(option => {
        buttonsContainer.innerHTML += `<button onclick="playGame('${option}')">${capitalize(option)}</button>`;
    });
}

function getOptionsForDifficulty(difficulty) {
    const options = {
        easy: ["rock", "paper", "scissors"],
        medium: ["rock", "paper", "scissors", "lizard", "spock"],
        hard: ["rock", "fire", "scissors", "snake", "man", "woman", "tree", "wolf", "lizard", "paper", "air", "spock", "dragon", "devil", "lightning", "gun"],
        impossible: ["rock", "fire", "scissors", "snake", "man", "woman", "tree", "wolf", "lizard", "paper", "air", "spock", "dragon", "devil", "lightning", "gun", "dynamite", "nuke", "alien", "bowl", "moon", "cockroach", "monkey", "axe", "sun"]
    };
    return options[difficulty];
}

function playGame(playerChoice) {
    if (lives <= 0) return;

    const choices = getOptionsForDifficulty(difficulty);
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let result;

    if (playerChoice === computerChoice) {
        result = "It's a draw!";
    } else if (winningConditions[playerChoice]?.includes(computerChoice)) {
        result = "You win!";
    } else {
        result = "You lose!";
        lives--;
    }

    document.getElementById("player-choice").textContent = `Player Choice: ${playerChoice}`;
    document.getElementById("computer-choice").textContent = `Computer Choice: ${computerChoice}`;
    document.getElementById("game-result").textContent = `Result: ${result}`;
    document.getElementById("lives").textContent = `Lives Remaining: ${lives}`;

    if (lives === 0) showGameOverScreen();
}

function showGameOverScreen() {
    document.body.classList.add("game-over");
    document.body.innerHTML = `
        <h1>Game Over</h1>
        <p>You have no lives left!</p>
        <button onclick="restartGame()">Restart Game</button>
    `;
}

function restartGame() {
    lives = 3;
    location.reload();
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("difficulty").value = difficulty;
});

