
//07/11/2025//
// Function to manage the Rock-Paper-Scissors game with with 3 lives and multiple difficulty levels with easy if you havent played before and other based on the saved difficulty in local storage
let lives = 3; 
let score = { wins: 0, losses: 0, draws: 0 };
let difficulty = localStorage.getItem("difficulty") || "easy";
// Function defining the winning conditions for each choice
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

 

    dynamite: ["gun", "rock", "sun", "fire", "scissors", "axe", "snake", "monkey", "woman", "man", "tree", "cockroach"],  

 

    nuke: ["dynamite", "gun", "rock", "sun", "fire", "scissors", "snake", "axe", "monkey", "woman", "man", "tree"],  

 

    alien: ["dragon", "devil", "lightning", "nuke", "dynamite", "gun", "rock", "sun", "fire", "scissors", "axe", "snake"],  

 

    bowl: ["water", "alien", "dragon", "devil", "lightning", "nuke", "dynamite", "gun", "rock", "sun", "fire", "scissors"],  

 

    moon: ["air", "bowl", "water", "alien", "dragon", "devil", "lightning", "nuke", "dynamite", "gun", "rock", "sun"],  

 

    sun: ["fire", "scissors", "axe", "snake", "monkey", "woman", "man", "tree", "cockroach", "wolf", "lizard", "paper"],


    axe: ["snake", "monkey", "woman", "man", "tree", "cockroach", "wolf", "lizard", "paper", "moon", "air", "bowl"], 

 

    monkey: ["woman" , "man" , "tree" , "cockroach" , "wolf" , "lizard" , "spock" , "paper" , "moon" , "air" , "bowl" , "alien"],

    cockroach: ["wolf", "spock", "paper", "moon", "air", "bowl", "lizard", "alien", "dragon", "devil", "lightning", "nuke"],


}; 

// Function to start the game also hides the start screen and shows the game interface
function startGame() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-interface").style.display = "block";
    setDifficulty(); // Initialize the game with the selected difficulty
}
// Function to set the difficulty and update the game options
function setDifficulty() {
    difficulty = document.getElementById("difficulty").value;
    localStorage.setItem("difficulty", difficulty);
    document.getElementById("lives").textContent = `Lives Remaining: ${lives}`;
    updateScoreDisplay();
    const buttonsContainer = document.querySelector(".buttons");
    buttonsContainer.innerHTML = "";

    const options = getOptionsForDifficulty(difficulty);
    options.forEach(option => {
        buttonsContainer.innerHTML += `<button onclick="playGame('${option}')">${capitalize(option)}</button>`;
    });
}
// Function to get options based on difficulty
function getOptionsForDifficulty(difficulty) {
    const options = {
        easy: ["rock", "paper", "scissors"],
        medium: ["rock", "paper", "scissors", "lizard", "spock"],
        hard: ["rock", "fire", "scissors", "snake", "man", "tree", "wolf", "lizard", "paper", "air", "spock", "dragon", "devil", "lightning", "gun"],
        impossible: ["rock", "fire", "scissors", "snake", "man", "woman", "tree", "wolf", "lizard", "paper", "air", "spock", "dragon", "devil", "lightning", "gun", "dynamite", "nuke", "alien", "bowl", "moon", "cockroach", "monkey", "axe", "sun"]
    };
    return options[difficulty];
}
// Function to play the game and caculate the result and show the result inncluding lives remaining
function playGame(playerChoice) {
    if (lives <= 0) return;

    const choices = getOptionsForDifficulty(difficulty);
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let result;

    if (playerChoice === computerChoice) {
        result = "It's a draw!";
        score.draws++;
    } else if (winningConditions[playerChoice]?.includes(computerChoice)) {
        result = "You win!";
        score.wins++;
    } else {
        result = "You lose!";
        score.losses++;
        lives--;
    }

    document.getElementById("player-choice").textContent = `Player Choice: ${playerChoice}`;
    document.getElementById("computer-choice").textContent = `Computer Choice: ${computerChoice}`;
    document.getElementById("game-result").textContent = `Result: ${result}`;
    document.getElementById("lives").textContent = `Lives Remaining: ${lives}`;
    updateScoreDisplay();

    if (lives === 0) showGameOverScreen();
}
// Function to show game over screen
function showGameOverScreen() {
    document.body.classList.add("game-over");
    document.body.innerHTML = `
        <h1>Game Over</h1>
        <p>You have no lives left!</p>
        <button onclick="restartGame()">Restart Game</button>
    `;
}
// Function to update the score display
function updateScoreDisplay() {
    document.getElementById("score-display").innerHTML = `
        Wins: ${score.wins} | Losses: ${score.losses} | Draws: ${score.draws}
    `;
}
// Function to restart the game
function restartGame() {
    lives = 3;
    score = { wins: 0, losses: 0, draws: 0 };
    location.reload();
}
// Function to capitalize the first letter of a word
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
// Function to load the saved difficulty on page load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("difficulty").value = difficulty;
});