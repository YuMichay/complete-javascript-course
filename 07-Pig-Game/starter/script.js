'use strict';

const newGameBtn = document.querySelector(".btn--new");
const rollBtn = document.querySelector(".btn--roll");
const holdBtn = document.querySelector(".btn--hold");
const dice = document.querySelector(".dice");
const player1Score = document.getElementById("score--0");
const player2Score = document.getElementById("score--1");
const player1CurrentScore = document.getElementById("current--0");
const player2CurrentScore = document.getElementById("current--1");
const player1Section = document.querySelector(".player--0");
const player2Section = document.querySelector(".player--1");
const playersSections = [player1Section, player2Section];
const playersScore = [player1Score, player2Score];
const playersCurrentScore = [player1CurrentScore, player2CurrentScore];

let currentNumber;
let currentPlayer = 1;
let currentScore = 0;

const makeUpNumber = () => {
    return Math.round(Math.random() * (6 - 1) + 1);
}

const changePlayer = () => {
    playersSections[currentPlayer - 1].classList.remove("player--active");
    currentPlayer === 1 ? currentPlayer = 2 : currentPlayer = 1;
    playersSections[currentPlayer - 1].classList.add("player--active");
}

const startNewGame = () => {
    playersSections[currentPlayer - 1].classList.remove("player--winner");
    currentScore = 0;
    playersScore.forEach((score) => score.textContent = 0);
    playersCurrentScore.forEach((score) => score.textContent = 0);
    dice.classList.add("hidden");
    changePlayer();
}
newGameBtn.addEventListener("click", startNewGame);

const checkNumber = (number) => {
    if (number === 1) {
        playersCurrentScore[currentPlayer - 1].textContent = 0;
        currentScore = 0;
        changePlayer();
    } else {
        currentScore += number;
        playersCurrentScore[currentPlayer - 1].textContent = currentScore;
    }
}

const checkWinner = () => {
    if (+playersScore[currentPlayer - 1].textContent < 100) {
        changePlayer();
    } else {
        playersSections[currentPlayer - 1].classList.add("player--winner");
    }
}

const rollDice = () => {
    let number = makeUpNumber();

    if (number === currentNumber) {
        rollDice();
    } else {
        currentNumber = number;
        checkNumber(currentNumber);
        dice.src = `dice-${number}.png`;
        if (dice.classList.contains("hidden")) dice.classList.remove("hidden");
    }
}
rollBtn.addEventListener("click", rollDice);

const holdNumber = () => {
    if (currentNumber !== 1) {
        playersScore[currentPlayer - 1].textContent = +playersScore[currentPlayer - 1].textContent + currentScore;
        playersCurrentScore[currentPlayer - 1].textContent = 0;
        currentScore = 0;
        checkWinner();
    }
}
holdBtn.addEventListener("click", holdNumber);