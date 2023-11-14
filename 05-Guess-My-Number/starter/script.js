'use strict';

const input = document.querySelector(".guess");
const checkBtn = document.querySelector(".check");
const againBtn = document.querySelector(".again");
const message = document.querySelector(".message");
const correctNumber = document.querySelector(".number");
const scoreScreen = document.querySelector(".score");
const highScore = document.querySelector(".highscore");

const makeNumber = () => {
    return Math.round(Math.random() * (20 - 1) + 1);
}

let secretNumber = makeNumber();
let score = 20;

const checkNumber = () => {
    const inputNumber = +input.value;

    if (score <= 0) {
        message.textContent = "You lost the game!";
        return checkBtn.removeEventListener("click", checkNumber);
    }

    if (!inputNumber) {
        message.textContent = "No number!";
    } else if (inputNumber < 1 || inputNumber > 20) {
        message.textContent = "You can choose only between 1 and 20";
    } else if (inputNumber > secretNumber || inputNumber < secretNumber) {
        message.textContent = inputNumber > secretNumber ? "High!" : "Low!";
        score--;
        scoreScreen.textContent = score;
    } else if (inputNumber === secretNumber) {
        correctNumber.textContent = secretNumber;
        message.textContent = "Correct number!";
        document.body.style.backgroundColor = "#60b347";
        highScore.textContent = +highScore.textContent < score ? score : highScore.textContent;
        checkBtn.removeEventListener("click", checkNumber);
    }
}
checkBtn.addEventListener("click", checkNumber);

const playAgain = () => {
    input.value = "";
    correctNumber.textContent = "?";
    message.textContent = "Start guessing...";
    scoreScreen.textContent = "20";
    score = 20;
    document.body.style.backgroundColor = "#222";
    secretNumber = makeNumber();
    checkBtn.addEventListener("click", checkNumber);
}
againBtn.addEventListener("click", playAgain);